import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeParameterValue,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

// import { apiRequest, FetchOptions } from './helpers/api';
import { CentumOperations, CentumFields, HttpOptions} from './CentumDescription';
import {
	IArticulos,
	IArticulosExistencias,
	IResponseCustomer,
	Cliente,
	IWoo,
	LineItem,
	IMergeArticulos,
	ShippingLine, CobroId,
	IContribuyenteBodyInput,
	IProvincias
} from './interfaces';

import {
	createChargeJson,
	createCustomerJson,
	createHash,
	createJsonProducts,
	createOrderSaleJson,
	centumGetArticleImages,
	getHttpSettings,
	apiRequest, FetchOptions,
	apiGetRequest, createContribuyenteJson
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
		properties: [...CentumOperations, ...CentumFields, ...HttpOptions],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = await this.getCredentials('centumApi');
		let centumUrl: any = centumApiCredentials.centumUrl;
		let consumerApiPublicId: any = centumApiCredentials.consumerApiPublicId;

		// const centumSuiteAccessToken = createHash(centumApiCredentials.publicAccessKey as string);

		const headers: any = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			publicAccessKey: centumApiCredentials.publicAccessKey,
		}

		const resource = this.getNodeParameter('resource', 0);

		switch (resource) {
			case 'pedidoVentaActividad':
				const pedidoID = this.getNodeParameter('id', 0)
				try {
					const dataActividad = await apiRequest<getActividad>(
						`${centumUrl}/PedidosVenta/${pedidoID}`,
						{headers},
					);
					return [this.helpers.returnJsonArray(dataActividad)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'articulo':
				const clientId = this.getNodeParameter('clienteId', 0);
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
					const response  = await apiRequest<IArticulos>(
						`${centumUrl}/Articulos/Venta`,
						{
							method: 'POST',
							body: bodyToSend,
							headers,
							queryParams: { tipoOrdenArticulos: 'Codigo'}
						},
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

									const response = await apiRequest<IArticulos>(
										`${centumUrl}/Articulos/Venta`,
										{
											method: 'POST',
											headers:requestHeaders,
											body,
											queryParams: { tipoOrdenArticulos: 'Codigo' },
										},
									);
									if (response.Articulos.Items.length > 0) {
										acc.push(...response.Articulos.Items);
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

			case 'articulosExistencia':
				const branchOfficeIds = String(this.getNodeParameter('branchOfficeIds', 0));
				try {
					const dataArticulosExistencia = await apiRequest<IArticulosExistencias>(
						`${centumUrl}/ArticulosExistencias`,
						{
							headers,
							queryParams: {
								idsSucursalesFisicas: branchOfficeIds,
							},
						},
					);

					return [this.helpers.returnJsonArray(dataArticulosExistencia.Items as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'articulosSucursalesFisicas':
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
					);
					return [this.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'precioArticulo':
				const paramsPrice: Record<string, string | number> = {
					Cantidad: this.getNodeParameter('articuloCantidad', 0) as number,
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
					);

					return [this.helpers.returnJsonArray(dataArticulosPrecios as any)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'articulosImagenes':
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

			case 'procesarImagenes':
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

			case 'clientes':
				try {
					const ajustesHTTP = getHttpSettings.call(this);
					const clientesURL = `${centumUrl}/Clientes`;
					const fetchOptions: FetchOptions = {
						method: ajustesHTTP.method,
						pagination: ajustesHTTP.pagination,
						cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
						itemsField: 'Items',
						context: this,
						headers,
					};

					let clientes: IResponseCustomer | IResponseCustomer[] = [];
					const paginated = await apiGetRequest<IResponseCustomer>(clientesURL, fetchOptions);
					clientes = paginated;

					return [this.helpers.returnJsonArray(clientes as any)];
				} catch (error) {
					console.error('Error al obtener clientes:', error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'contribuyenteNuevo': {
				const bodyJson = this.getNodeParameter('cuerpoHTTP', 0) as IContribuyenteBodyInput;
				const cuit = this.getNodeParameter('cuit', 0) as string;

				const contribuyenteJSON = createContribuyenteJson(bodyJson, cuit);

				try {
					const crearCliente = await apiRequest<any>(
						`${centumUrl}/Clientes`,
						{
							method: 'POST',
							body: contribuyenteJSON,
							headers,
						},
					);
					return [this.helpers.returnJsonArray([crearCliente])];

				} catch (error: any) {
					console.log(error);
					const obj = {
						...error.response?.data,
						IdCliente: -1,
					};
					return [this.helpers.returnJsonArray([obj])];
				}
			}

			case 'clienteNuevo':
				const datosCliente = this.getNodeParameter('cuerpoHTTP', 0);
				const clienteDNI = this.getNodeParameter('dni', 0);
				const datosJSON = createCustomerJson(datosCliente as IWoo, clienteDNI as string);

				try {
					const crearCliente = await apiRequest<any>(
						`${centumUrl}/Clientes`,
						{
							method: 'POST',
							body: datosJSON,
							headers,
						},
					);
					return [this.helpers.returnJsonArray(crearCliente)];
				} catch (error) {
					console.log(error);
					const obj = {
						...error.response.data,
						IdCliente: -1,
					};
					return [this.helpers.returnJsonArray(obj)];
				}

			case 'clientesActualizar':
				const nuevosDatos = this.getNodeParameter('cuerpoHTTP', 0);
				try {
					const updateCustomer = await apiRequest<any>(
						`${centumUrl}/Clientes/Actualizar`,
						{
							method: 'POST',
							body: nuevosDatos,
							headers,
						},
					);

					return [this.helpers.returnJsonArray(updateCustomer)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'crearPedidoVenta': {
				const customerSalesOrder = this.getNodeParameter('cliente', 0);
				const articlesSalesOrder = this.getNodeParameter('articulo', 0);
				const shippingSalesOrder = this.getNodeParameter('envio', 0);
				const idCobro = this.getNodeParameter('idCobro', 0);

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
					);
					// Create the body for the sales order
					const bodyPedidoVenta = createOrderSaleJson(
						arrArticles.Articulos.Items,
						customerSalesOrder as any,
						articlesSalesOrder as LineItem[],
						shippingSalesOrder as ShippingLine[],
						idCobro as CobroId
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
					);

					// Add charge ID to the order
					dataPedidosVenta.IdCobro = idCobro;

					return [this.helpers.returnJsonArray(dataPedidosVenta)];
				} catch (error) {
					console.log('Error creating sales order:', error);
					return [this.helpers.returnJsonArray([])];
				}
			}

			case 'cobros':
				const ordenCliente = this.getNodeParameter('cliente', 0);
				const ordenArticulo = this.getNodeParameter('articulo', 0);
				const ordenEnvio = this.getNodeParameter('envio', 0);
				const bodyCharge = createChargeJson(
					ordenCliente as Cliente,
					ordenArticulo as LineItem[],
					ordenEnvio as ShippingLine[]
				);

				try {
					const dataCobros = await apiRequest<any>(
						`${centumUrl}/Cobros`,
						{
							method: 'POST',
							body: bodyCharge,
							headers,
						},
					);

					return [this.helpers.returnJsonArray(dataCobros)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}

			case 'buscarContribuyente': {
				const cuit = this.getNodeParameter('cuit', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;


				if (!cuit && !razonSocial) {
					throw new NodeOperationError(this.getNode(), 'Debe proporcionar al menos CUIT o Razón Social para buscar contribuyentes.');
				}
				const queryParams: Record<string, string> = {};
				if (cuit) queryParams.Cuit = cuit;
				if (razonSocial) queryParams.razonSocial = razonSocial;

				const requestDetails = {
					url: `${centumUrl}/Clientes`,
					headers,
					queryParams,
				};


				try {
					console.log(`[BuscarContribuyente] Request:`, JSON.stringify(requestDetails, null, 2));

					const response = await apiRequest<IResponseCustomer>(
						requestDetails.url,
						{
							method: 'GET',
							headers: requestDetails.headers,
							queryParams: requestDetails.queryParams,
						},
					);
					console.log(`[BuscarContribuyente] Response:`, JSON.stringify(response, null, 2));
						if (response.CantidadTotalItems === 1) {
							return [this.helpers.returnJsonArray(response.Items as any)];
						}

					return [this.helpers.returnJsonArray(response as any)];

				} catch (error) {
					console.log(`[BuscarContribuyente] Error:`, error);
					return [this.helpers.returnJsonArray([])];
				}
			}

			case 'clientesBusqueda': {
					const customerEmail = this.getNodeParameter('email', 0, '') as string;
					const dni = this.getNodeParameter('dni', 0, '') as string;

					const buildQuery = (campo: 'Email' | 'Codigo', valor: string) =>
						valor ? { [campo]: valor } : {};

					let clientResponse: IResponseCustomer | null = null;

					try {
						// 1. Buscar por Email si se proporcionó
						if (customerEmail) {
							try {
								console.log('[email] Buscando cliente por email...');
								const response = await apiRequest<IResponseCustomer>(
									`${centumUrl}/Clientes`,
									{
										method: 'GET',
										headers,
										queryParams: buildQuery('Email', customerEmail),
									},
								);
								console.log('[email] Resultado:', response);

								clientResponse = response;
								if (response.CantidadTotalItems === 1) {
									return [this.helpers.returnJsonArray(response.Items as any)];
								}
							} catch (error) {
								console.log('[email] Error en búsqueda por email:', error);
							}
						}

						// 2. Buscar por Código "web-{dni}"
						if (!clientResponse && dni) {
							try {
								console.log('[dni] Buscando cliente por Código: web-{dni}...');
								const response = await apiRequest<IResponseCustomer>(
									`${centumUrl}/Clientes`,
									{
										method: 'GET',
										headers,
										queryParams: buildQuery('Codigo', `web-${dni}`),
									},
								);
								console.log('[dni] Resultado:', response);

								clientResponse = response;
								if (response.CantidadTotalItems === 1) {
									return [this.helpers.returnJsonArray(response.Items as any)];
								}
							} catch (error) {
								console.log('[dni] Error con Código web-{dni}:', error);
							}
						}

						// 3. Buscar por Código sin "web-"
						if (!clientResponse && dni) {
							try {
								console.log('[dni-alt] Buscando cliente por Código simple (dni sin "web-")...');
								const response = await apiRequest<IResponseCustomer>(
									`${centumUrl}/Clientes`,
									{
										method: 'GET',
										headers,
										queryParams: buildQuery('Codigo', dni),
									},
								);
								console.log('[dni-alt] Resultado:', response);

								clientResponse = response;
								if (response.CantidadTotalItems === 1) {
									return [this.helpers.returnJsonArray(response.Items as any)];
								}
							} catch (error) {
								console.log('[dni-alt] Error con Código sin "web-":', error);
							}
						}

						// Si llegamos hasta acá, devolver la última respuesta completa (aunque tenga Items vacíos)
						return [this.helpers.returnJsonArray(clientResponse as any)];

					} catch (error) {
						console.log('General error during customer search:', error);
						return [this.helpers.returnJsonArray([{ error: 'Búsqueda fallida', detalle: error }])];
					}
				}


			case 'sucursalesFisicas':
				try {
					const dataListBranches = await apiRequest<any>(
						`${centumUrl}/SucursalesFisicas`,
						{
							method: 'GET',
							headers,
						},
					);

					return [this.helpers.returnJsonArray(dataListBranches)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray(error.response.data)];
				}

			case 'generarProductosWoo':

				const data = this.getInputData();

				const json = createJsonProducts(data as unknown as IMergeArticulos[]);

				return [this.helpers.returnJsonArray(json as any)];

			case 'obtenerProductos':

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
					console.log(error)
					return [this.helpers.returnJsonArray([])];
				}

			case "provinciasLista": {
				const idPais = this.getNodeParameter('idPais', 0, '') as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idPais) {
						queryParams.idPais = idPais;
					}

					const provincias = await apiRequest<IProvincias[]>(
						`${centumUrl}/Provincias`,
						{
							method: 'GET',
							headers,
							queryParams,
						}
					);

					return [this.helpers.returnJsonArray(provincias.map(p => ({ ...p })))];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}
			}

			default:
				return [this.helpers.returnJsonArray([])];
		}
	}
}
