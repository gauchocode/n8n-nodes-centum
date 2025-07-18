import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeParameterValue,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { apiRequest } from './helpers/api';
import { CentumOperations, CentumFields } from './CentumDescription';
import {
	IArticulos,
	IArticulosExistencias,
	IResponseCustomer,
	Cliente,
	IWoo,
	LineItem,
	IMergeArticulos,
	ShippingLine, CobroId,
} from './interfaces';
import {
	createChargeJson,
	createCustomerJson,
	createHash,
	createJsonProducts,
	createOrderSaleJson,
	centumGetArticleImages,
} from './helpers/functions';

type Actividad = {
	IdActividad: number;
	Nombre: string;
};
type getActividad = {
	data: Actividad;
};

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Centum',
		name: 'centum',
		icon: 'file:centum.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consumes Centum API',
		defaults: {
			name: 'Centum',
		},
		inputs: ['main'] as [NodeConnectionType],
		outputs: ['main'] as [NodeConnectionType],
		credentials: [
			{
				name: 'centumApi',
				required: true,
			},
		],
		properties: [...CentumOperations, ...CentumFields],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = await this.getCredentials('centumApi');
		let centumUrl: any = centumApiCredentials.centumUrl;
		let consumerApiPublicId: any = centumApiCredentials.consumerApiPublicId;

		const centumSuiteAccessToken = createHash(centumApiCredentials.publicAccessKey as string);

		const headers: any = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			CentumSuiteAccessToken: centumSuiteAccessToken,
		};

		const resource = this.getNodeParameter('resource', 0);

		switch (resource) {
			case 'activity':
				try {
					const dataActividad = await apiRequest<getActividad>(
						`${centumUrl}/PedidosVenta/27231`,
						{headers},
						this,
					);
					return [this.helpers.returnJsonArray(dataActividad)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'article':
				const clientId = this.getNodeParameter('clientId', 0);
				const documentDate: any = this.getNodeParameter('documentDate', 0);
				const IdsRubro = this.getNodeParameter('idsRubros', 0);
				const completeMigration = this.getNodeParameter('migracionCompleta', 0);
				const IdsSubRubro = this.getNodeParameter('idsSubRubros', 0);
				const formattedDocumentDate = documentDate.replace(/\..+/, '');
				const dateModified = this.getNodeParameter('dateModified', 0);
				const dateModifiedImage = this.getNodeParameter('dateModifiedImage', 0);
				const priceDateModified = this.getNodeParameter('priceDateModified', 0);
				const bodyToSend = {
					idCliente: clientId,
					FechaDocumento: formattedDocumentDate,
					incluirAtributosArticulos: true,
					IdsRubro: IdsRubro ? [IdsRubro] : [],
					IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
					fechaModificacionDesde: dateModified ? dateModified : '',
					fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : '',
					fechaPrecioActualizadoDesde: priceDateModified,
				}

				try {
					const response = await apiRequest<IArticulos>(
						`${centumUrl}/Articulos/Venta`,
						{
							method: 'POST',
							body: bodyToSend,
							headers,
							queryParams: { tipoOrdenArticulos: 'Codigo'}
						},
						this,
					);

					if (response.Articulos.Items.length > 0) {
						const items = response.Articulos.Items;
						if(!completeMigration){
							const acc = [];
							for (const item of items) {

								const groupArticle = item.GrupoArticulo;
								if(!groupArticle) continue;

								const centumSuiteAccessToken = createHash(centumApiCredentials.publicAccessKey as string);
								const requestHeaders: any = {
									CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
									CentumSuiteAccessToken: centumSuiteAccessToken,
								};

								const body = {
									IdCliente: clientId,
									FechaDocumento: formattedDocumentDate,
									IncluirAtributosArticulos: true,
									IdsRubro: IdsRubro ? [IdsRubro] : [],
									IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
									NombreGrupoArticulo: groupArticle.Nombre,
									IdGrupoArticulo:groupArticle.IdGrupoArticulo
								}
								try {

									const data = await apiRequest<IArticulos>(
										`${centumUrl}/Articulos/Venta`,
										{
											method: 'POST',
											headers:requestHeaders,
											body,
											queryParams: { tipoOrdenArticulos: 'Codigo' },
										},
										this
									);

									if (data.Articulos.Items.length > 0) {
										acc.push(...data.Articulos.Items);
									}
								} catch (error) {
										console.log('Error en solicitud de grupo de artículos', { error });
								}
							}

							const combinedArrays = [...acc, ...items];
							const filteredArray = Array.from(
								new Map(combinedArrays.map(obj => [obj.IdArticulo, obj])).values()
							);

							const itemsArray = filteredArray.map((item: any) => ({
								...item,
								AtributosArticulo: item.Habilitado && item.ActivoWeb ? item.AtributosArticulo : [],
        			}));

							return [this.helpers.returnJsonArray(itemsArray as any)];
						}
						return [this.helpers.returnJsonArray(items as any)];
					} else {
						return [this.helpers.returnJsonArray({ json: {} })];
					}
				} catch (error) {
						console.log('Error en solicitud de artículos', error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'stockArticle':
				const branchOfficeIds = String(this.getNodeParameter('branchOfficeIds', 0));
				try {
					const dataArticulosExistencias = await apiRequest<IArticulosExistencias>(
						`${centumUrl}/ArticulosExistencias`,
						{
							headers,
							queryParams: {
								idsSucursalesFisicas: branchOfficeIds,
							},
						},
					);
					return [this.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'stockArticleByPhysicalBranch':
				// Important: This endpoint returns all articles in the physical branch, separated by commas.
				const IdSucursalFisica = this.getNodeParameter('IdSucursalFisica', 0) as string;

				const queryParams: { Codigo: string; idsSucursalesFisicas?: string } = {
					Codigo: 'R06SR0601P00010007',
				};

				if (IdSucursalFisica) {
					queryParams.idsSucursalesFisicas = IdSucursalFisica;
				}

				try {
					const dataArticulosExistencias = await apiRequest<any>(
						`${centumUrl}/ArticulosSucursalesFisicas`,
						{
							headers,
							queryParams,
						},
						this,
					);
					return [this.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'priceArticle':
				const paramsPrice: Record<string, string | number> = {
					Cantidad: this.getNodeParameter('quantity', 0) as number,
					FechaDocumento: this.getNodeParameter('documentDate', 0) as string,
				};

				try {
					const dataArticulosPrecios = await apiRequest<any>(
						`${centumUrl}/Articulos/PrecioArticulo`,
						{
							method: 'POST',
							headers,
							queryParams: paramsPrice,
							body: {
								IdArticulo: 1507,
								Codigo: 'R02SR0206P00070007',
								CodigoAuxiliar: '',
								CodigoPropioProveedor: '',
								Nombre: 'ADHESIVO ACRILICO KEKOL K-645 1 KG',
								NombreFantasia: '',
							},
						},
						this,
					);

					return [this.helpers.returnJsonArray(dataArticulosPrecios as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'articleImg':
				const arrResult: any[] = [];

				const inputData = this.getInputData();
				const requestUrl = `${centumUrl}/ArticulosImagenes`;

				for (let i = 0; i < inputData.length; i++) {
					const element = inputData[i];
					const dataObj: { idArticulo: number; images: any[] | null; infoImages: any[] } = {
						idArticulo: element.json.IdArticulo as number,
						images: [],
						infoImages: [],
					};

					const allArticleImages = await centumGetArticleImages(
						1,
						element.json.IdArticulo as NodeParameterValue,
						{ consumerApiPublicId, publicAccessKey: String(centumApiCredentials.publicAccessKey as string) },
						requestUrl,
					);

					if (allArticleImages instanceof Error) {
						console.error(`Failed to download images for article ${element.json.IdArticulo}`, allArticleImages);
						continue;
					}

					if (allArticleImages.length > 0) {
						for (let j = 0; j < allArticleImages.length; j++) {
							const binary: any = {};
							const dataImage = allArticleImages[j];
							const buffer = Buffer.from(dataImage.buffer);
							binary['data'] = await this.helpers.prepareBinaryData(buffer);
							binary.data.fileName = `${element.json.Codigo}_${j + 1}.${binary.data.fileExtension}`;

							dataObj.images!.push(binary);
							dataObj.infoImages!.push({
								lastModified: dataImage.lastModified,
								orderNumber: dataImage.orderNumber,
							});

							const existObj = arrResult.find((obj) => obj.idArticulo === element.json.IdArticulo);

							if (!existObj) {
								arrResult.push(dataObj);
							}
						}
					} else {
						dataObj.images = null;
						arrResult.push(dataObj);
					}
				}

				return [this.helpers.returnJsonArray(arrResult)];

			case 'processImage':
				const dataImages = this.getNodeParameter('dataImg', 0) as {
					json: {
						idArticulo: number;
						images: any[];
						infoImages: { lastModified: string; orderNumber: number }[];
					};
				}[];
				const db = this.getNodeParameter('lastModifiedImg', 0) as {
					articleId: number;
					dataImage: { orderNumber: number; lastModified: string }[];
				}[];

				const result: any[] = [];

				for (let i = 0; i < dataImages.length; i++) {
					const element = dataImages[i];

					for (let j = 0; j < element.json.images?.length; j++) {
						const currentData = element.json.images[j];
						const currentInfoImage = element.json.infoImages[j];

						const articleInDB = db.find((dbData) => dbData.articleId === element.json.idArticulo);

						if (!articleInDB) {
							result.push({ json: {}, binary: currentData });
						} else {
							const currentImageInDB = articleInDB.dataImage.find(
								(dataImageDB) => dataImageDB.orderNumber === currentInfoImage.orderNumber,
							);

							if (currentImageInDB?.lastModified !== currentInfoImage.lastModified) {
								result.push({ json: {}, binary: currentData });
							}
						}
					}
				}

				if (result.length === 0) {
					result.push([]);
				}

				return [this.helpers.returnJsonArray(result)];

			case 'customers':
				try {
					const dataClientes = await apiRequest<IResponseCustomer>(
						`${centumUrl}/Clientes`,
						{
							headers,
						},
						this,
					);

					return [this.helpers.returnJsonArray(dataClientes.Items as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'newCustomer':
				const body = this.getNodeParameter('body', 0);
				const customerDNI = this.getNodeParameter('dni', 0);
				const customerBody = createCustomerJson(body as IWoo, customerDNI as string);

				try {
					const newCustomer = await apiRequest<any>(
						`${centumUrl}/Clientes`,
						{
							method: 'POST',
							body: customerBody,
							headers,
						},
						this,
					);
					return [this.helpers.returnJsonArray(newCustomer)];
				} catch (error) {
					console.log(error);
					const obj = {
						...error.response.data,
						IdCliente: -1,
					};
					return [this.helpers.returnJsonArray(obj)];
				}

			case 'putCustomer':
				const bodyPut = this.getNodeParameter('body', 0);
				try {
					const updateCustomer = await apiRequest<any>(
						`${centumUrl}/Clientes/Actualizar`,
						{
							method: 'POST',
							body: bodyPut as any,
							headers,
						},
						this,
					);

					return [this.helpers.returnJsonArray(updateCustomer)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'salesOrder': {
				const customerSalesOrder = this.getNodeParameter('customer', 0);
				const articlesSalesOrder = this.getNodeParameter('article', 0);
				const shippingSalesOrder = this.getNodeParameter('shipping', 0);
				const cobroId = this.getNodeParameter('cobroId', 0);

				const date = new Date().toISOString();
				const formattedDate = date.replace(/\..+/, '');

				try {
					// First request: get articles for the sales order
					const arrArticles = await apiRequest<IArticulos>(
						`${centumUrl}/Articulos/Venta`,
						{
							method: 'POST',
							headers,
							body: {
								idCliente: 1,
								FechaDocumento: formattedDate,
								Habilitado: true,
								ActivoWeb: true,
							},
						},
						this,
					);

					// Create the body for the sales order
					const bodyPedidoVenta = createOrderSaleJson(
						arrArticles.Articulos.Items,
						customerSalesOrder as any,
						articlesSalesOrder as LineItem[],
						shippingSalesOrder as ShippingLine[],
						cobroId as CobroId
					);

					// New hash for sales order
					const centumSuiteAccessTokenSalesOrder = createHash(centumApiCredentials.publicAccessKey as string);

					const headersSalesOrder = {
						CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
						CentumSuiteAccessToken: centumSuiteAccessTokenSalesOrder,
					};

					// Second request: create sales order
					const dataPedidosVenta = await apiRequest<any>(
						`${centumUrl}/PedidosVenta`,
						{
							method: 'POST',
							headers: headersSalesOrder,
							body: bodyPedidoVenta,
						},
						this,
					);

					// Add charge ID to the order
					dataPedidosVenta.IdCobro = cobroId;

					return [this.helpers.returnJsonArray(dataPedidosVenta)];
				} catch (error) {
					console.log('Error creating sales order:', error);
					return [this.helpers.returnJsonArray([])];
				}
			}


			case 'charge':
				const customerCharge = this.getNodeParameter('customer', 0);
				const articlesCharge = this.getNodeParameter('article', 0);
				const shippingChargeOrder = this.getNodeParameter('shipping', 0);
				const bodyCharge = createChargeJson(
					customerCharge as Cliente,
					articlesCharge as LineItem[],
					shippingChargeOrder as ShippingLine[]
				);

				try {
					const dataCobros = await apiRequest<any>(
						`${centumUrl}/Cobros`,
						{
							body: bodyCharge,
							headers,
						},
						this,
					);

					return [this.helpers.returnJsonArray(dataCobros as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'BuscarContribuyente': {
				const cuit = this.getNodeParameter('cuit', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;

				if (!cuit && !razonSocial) {
					throw new NodeOperationError(this.getNode(), 'Debe proporcionar al menos CUIT o Razón Social para buscar contribuyentes.');
				}

				const queryParams: Record<string, string> = {};
				if (cuit) queryParams.CUIT = cuit;
				if (razonSocial) queryParams.razonSocial = razonSocial;

				const requestDetails = {
					url: `${centumUrl}/Clientes/BuscarContribuyente`,
					headers,
					queryParams,
				};

				try {
					console.log(`[BuscarContribuyente] Request:`, JSON.stringify(requestDetails, null, 2));

					const response = await apiRequest<IResponseCustomer>(
						requestDetails.url,
						{
							headers: requestDetails.headers,
							queryParams: requestDetails.queryParams,
						},
						this,
					);

					console.log(`[BuscarContribuyente] Response:`, JSON.stringify(response, null, 2));
					return [this.helpers.returnJsonArray(response.Items as any)];

				} catch (error) {
					console.log(`[BuscarContribuyente] Error:`, error);
					return [this.helpers.returnJsonArray([])];
				}
			}


			case 'searchCustomer': {
				const customerEmail = this.getNodeParameter('email', 0, '') as string;
				const dni = this.getNodeParameter('dni', 0, '') as string;
				const cuit = this.getNodeParameter('cuit', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;

				interface Search {
					queryParams: Record<string, string>;
					description: string;
				}

				const searches: Search[] = [
					{
						queryParams: customerEmail ? { Email: customerEmail } : {},
						description: 'email',
					},
					{
						queryParams: dni ? { Codigo: `web-${dni}` } : {},
						description: 'DNI',
					},
					{
						queryParams: cuit ? { Cuit: cuit } : {},
						description: 'CUIT',
					},
					{
						queryParams: razonSocial ? { razonSocial } : {},
						description: 'razón social',
					},
				];

				let user: IResponseCustomer | null = null;

				try {
					for (const { queryParams, description } of searches) {
						if (Object.keys(queryParams).length === 0) {
							console.log(`Skipping search by ${description}: no parameter provided`);
							continue;
						}

						const requestDetails = {
							url: `${centumUrl}/Clientes`,
							headers,
							queryParams,
						};

						try {
							console.log(`[${description}] Request Details:`, JSON.stringify(requestDetails, null, 2));

							const response = await apiRequest<IResponseCustomer>(
								requestDetails.url,
								{
									headers: requestDetails.headers,
									queryParams: requestDetails.queryParams,
								},
								this,
							);

							console.log(`[${description}] Response:`, JSON.stringify(response, null, 2));

							if (response.CantidadTotalItems === 1) {
								user = response;
								break;
							}
						} catch (error) {
							console.log(`[${description}] Error during API request:`, { error, requestDetails });
							continue;
						}
					}

					const result = user?.Items || [];
					return [this.helpers.returnJsonArray(result as any)];
				} catch (error) {
					console.log('General error during customer search:', error);
					return [this.helpers.returnJsonArray([])];
				}
			}

			case 'listBranches':
				try {
					const dataListBranches = await apiRequest<any>(
						`${centumUrl}/SucursalesFisicas`,
						{
							headers,
						},
						this,
					);

					return [this.helpers.returnJsonArray(dataListBranches as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray(error.response.data)];
				}

			case 'json':
				const data = this.getInputData();

				const json = createJsonProducts(data as unknown as IMergeArticulos[]);

				return [this.helpers.returnJsonArray(json as any)];

			case 'productList':

				try {
					const payload = {
						"IdCliente": 47924, // ID of the client from Mauri Dev Broobe
						"FechaDocumento": "2024-05-31", // Date from which to fetch products
						"Habilitado": true,
						"ActivoWeb": true
					};

					const dataProductos = await apiRequest<any>(
						// `${centumUrl}/Articulos/Venta?numeroPagina=1&cantidadItemsPorPagina=100`,
						`${centumUrl}/Articulos/Venta`,
						{
							method: 'POST',
							body: payload,
							headers
						},
						this,
					);


					const items = dataProductos.Articulos?.Items || [];
					const formateoObjeto = items.map((item: any) => ({
						IdArticulo: item.IdArticulo,
						Codigo: item.Codigo,
						Nombre: item.Nombre,
						NombreFantasia: item.NombreFantasia,
						Habilitado: item.Habilitado,
						ActivoWeb: item.ActivoWeb,
						Precio: item.Precio,
						FechaUltimaActualizacionPrecio: item.FechaUltimaActualizacionPrecio,
						StockDisponible: item.StockDisponible,
						Rubro: item.Rubro ? {
							IdRubro: item.Rubro.IdRubro,
							Codigo: item.Rubro.Codigo,
							Nombre: item.Rubro.Nombre
						} : null,
						SubRubro: item.SubRubro ? {
							IdSubRubro: item.SubRubro.IdSubRubro,
							Codigo: item.SubRubro.Codigo,
							Nombre: item.SubRubro.Nombre,
							IdRubro: item.SubRubro.IdRubro
						} : null,
						CategoriaArticulo: item.CategoriaArticulo ? {
							IdCategoriaArticulo: item.CategoriaArticulo.IdCategoriaArticulo,
							Codigo: item.CategoriaArticulo.Codigo,
							Nombre: item.CategoriaArticulo.Nombre,
							IdSubRubro: item.CategoriaArticulo.IdSubRubro
						} : null
					}));
					return [this.helpers.returnJsonArray(formateoObjeto)];

				} catch (error) {
					return [this.helpers.returnJsonArray([])];
				}
			default:
				return [this.helpers.returnJsonArray([])];
		}
	}
}
