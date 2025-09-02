import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeParameterValue,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

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
	IProvincias,
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
	apiGetRequest, createContribuyenteJson,
	apiPostRequestPaginated,

} from './helpers/functions';
import { IDepartamentos } from './interfaces/departamentos';

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
			case 'generarToken':

				try {
					const tokenGenerado = createHash(headers.publicAccessKey);

					return [this.helpers.returnJsonArray(tokenGenerado as any)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}

			case 'pedidoVentaActividad':
				const pedidoID = this.getNodeParameter('id', 0)
				try {
					const dataActividad = await apiRequest<getActividad>(
						`${centumUrl}/PedidosVenta/${pedidoID}`,
						{...headers},
					);
					return [this.helpers.returnJsonArray(dataActividad)];
				} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
				}

			case 'articulosDatosGenerales':
				try {
					// const numeroPagina = Number(this.getNodeParameter('numeroPagina', 0, 1) ?? 1);
					// const cantidadItemsPorPagina = Number(this.getNodeParameter('cantidadItemsPorPagina', 0, 100) ?? 100);
					// const pagination = (this.getNodeParameter('pagination', 0, 'all') ?? 'all') as 'all' | 'default' | 'custom';
					const ajustesHTTP = getHttpSettings.call(this);
					const articulosURL = `${centumUrl}/Articulos/DatosGenerales`;

					const fetchOptions: FetchOptions = {
						method: 'POST',
						headers,
						body: {},
						queryParams: { tipoOrdenArticulos: 'Nombre' },
						pagination: ajustesHTTP.pagination,
						cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
						intervaloPagina: ajustesHTTP.intervaloPagina,
						itemsField: 'Items', // Ajusta si la respuesta es diferente
						context: this,
					};
					//let articulos: IArticulos | IArticulos[] = [];
					const paginated = await apiPostRequestPaginated<IArticulos>(articulosURL, fetchOptions);
					//articulos = paginated;
					return [this.helpers.returnJsonArray(paginated as any)];
				} catch (error) {
					console.log('Error en solicitud de artículos', error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
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
				const numeroPagina = this.getNodeParameter('numeroPagina', 0);
				const cantidadPorPagina = this.getNodeParameter('cantidadPorPagina', 0);
				const bodyToSend = {
					idCliente: clientId,
					FechaDocumento: formattedDocumentDate,
					incluirAtributosArticulos: true,
					IdsRubro: IdsRubro ? [IdsRubro] : [],
					IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
					fechaModificacionDesde: dateModified ? dateModified : '',
					fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : '',
					fechaPrecioActualizadoDesde: priceDateModified,
					numeroPagina,
					cantidadPorPagina,
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
								if (!groupArticle) continue;

								// const centumSuiteAccessToken = createHash(
								// 	centumApiCredentials.publicAccessKey as string,
								// );
								// const requestHeaders: any = {
								// 	CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
								// 	CentumSuiteAccessToken: centumSuiteAccessToken,
								// };

								const body = {
									idCliente: clientId,
									FechaDocumento: formattedDocumentDate,
									incluirAtributosArticulos: true,
									IdsRubro: IdsRubro ? [IdsRubro] : [],
									IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
									NombreGrupoArticulo: groupArticle.Nombre,
									IdGrupoArticulo: groupArticle.IdGrupoArticulo,
								};

								try {
									const response = await apiRequest<IArticulos>(`${centumUrl}/Articulos/Venta`, {
										method: 'POST',
										headers: { ...headers }, // reusar headers de la primera request
										body,
										queryParams: { tipoOrdenArticulos: 'Codigo' },
									});

									if (response.Articulos.Items.length > 0) {
										acc.push(...response.Articulos.Items);
									}
								} catch (error) {
									console.log('Error en solicitud de grupo de artículos', { error });
									const errorMessage =
										error?.response?.data?.Message || error.message || 'Error desconocido';
									throw new NodeOperationError(this.getNode(), errorMessage);
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
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
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
						console.log('ArticulosExistencias error: ',error);
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
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
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
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
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
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
						method: 'GET',
						pagination: ajustesHTTP.pagination,
						cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
						intervaloPagina: ajustesHTTP.intervaloPagina,
						itemsField: 'Items',
						context: this,
						headers,
					};


					let clientes: IResponseCustomer | IResponseCustomer[] = [];
					const paginated = await apiGetRequest<IResponseCustomer>(clientesURL, fetchOptions);
					clientes = paginated;

					return [this.helpers.returnJsonArray(clientes as any)];
				} catch (error) {
						const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
						throw new NodeOperationError(this.getNode(), errorMessage);
				}

			case 'nuevoContribuyente': {
				const bodyJson = this.getNodeParameter('cuerpoHTTP', 0) as IContribuyenteBodyInput;
				const cuit = this.getNodeParameter('cuit', 0);
				console.log(bodyJson)

				if (typeof cuit !== 'string' || !/^\d{11}$/.test(cuit)) {
					throw new NodeOperationError(
						this.getNode(),
						'El CUIT debe ser una cadena de 11 dígitos numéricos.'
					);
				}


				const contribuyenteJSON = createContribuyenteJson(bodyJson, cuit);

				try {
					const crearCliente = await apiRequest(
						`${centumUrl}/Clientes`,
						{
							method: 'POST',
							body: contribuyenteJSON,
							headers,
						},
					);

					console.log('Contribuyente creado:', crearCliente);
					return [this.helpers.returnJsonArray([crearCliente as any])];

				} catch (error: any) {
					console.error('Error al crear contribuyente:', error);

					const statusCode = error?.response?.status;
					const responseData = error?.response?.data;
					const errorMessage =
						responseData?.Message ||
						responseData?.message ||
						error?.message ||
						'Error desconocido al crear el contribuyente.';

					const fullMessage = statusCode
						? `Error ${statusCode}: ${errorMessage}`
						: errorMessage;

					throw new NodeOperationError(this.getNode(), fullMessage, {
						description: responseData?.Detail || 'Ocurrió un error inesperado al llamar a la API de Centum.',
					});
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
				}

			case 'clientesBusqueda': {
				const customerEmail = this.getNodeParameter('email', 0, '') as string;
				const dni = this.getNodeParameter('dni', 0, '') as string;

				const buildQuery = (campo: 'Email' | 'Codigo', valor: string) =>
					valor ? { [campo]: valor } : {};

				const trySearch = async (
					campo: 'Email' | 'Codigo',
					valor: string,
					label: string
				): Promise<IResponseCustomer | null> => {
					if (!valor) return null;
					try {
						console.log(`[${label}] Buscando cliente por ${campo}: ${valor}`);
						const response = await apiRequest<IResponseCustomer>(
							`${centumUrl}/Clientes`,
							{
								method: 'GET',
								headers,
								queryParams: buildQuery(campo, valor),
							},
							this,
						);
						console.log(`[${label}] Resultado:`, response);
						return response;
					} catch (error) {
						console.error(`[${label}] Error:`, error);
						return null;
					}
				};

				try {
					let response: IResponseCustomer | null = null;

					if (customerEmail) {
						response = await trySearch('Email', customerEmail, 'email');
					}

					if (!response && dni) {
						response = await trySearch('Codigo', `web-${dni}`, 'dni-web');
					}

					if (!response && dni) {
						response = await trySearch('Codigo', `${dni}`, 'dni');
					}
					console.log('Búsqueda finalizada. Resultado:', response);

					// Siempre regresa un objeto, aunque sea vacío
					return [this.helpers.returnJsonArray(response as any)];

				} catch (error) {
					console.error('Error general durante la búsqueda de cliente:', error);
					throw new NodeOperationError(this.getNode(), `Búsqueda fallida: ${JSON.stringify(error)}`);
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
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
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
				}

			case "departamentosLista": {
				const idProvincia = this.getNodeParameter('idProvincia', 0, '') as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idProvincia) {
						queryParams.idProvincia = idProvincia;
					}

					const departamentos = await apiRequest<IDepartamentos[]>(
						`${centumUrl}/Departamentos`,
						{
							method: 'GET',
							headers,
							queryParams,
						}
					);
					return [this.helpers.returnJsonArray(departamentos.map(d => ({ ...d })))];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
				}

			case 'articuloPorId': {
				const codigo = this.getNodeParameter('codigo', 0) as string;

				try {
					const articulo = await apiRequest<any>(
						`${centumUrl}/Articulos/DatosGenerales`,
						{
							method: 'POST',
							headers,
							body: {CodigoExacto: codigo}
						}
					);

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log('Error en solicitud de artículo por ID:', error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'obtenerSaldoCliente': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('priceDateModified', 0);
				const soloFecha = String(desdeSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				try {
					let url = `${centumUrl}/SaldosCuentasCorrientes/${clientId}`;
					if (soloFecha) {
						url += `?fechaVencimientoHasta=${soloFecha}`;
					}

					const response = await apiRequest<any>(
						url,
						{
							method: 'GET',
							headers
						}
					);

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), `Error obteniendo saldo para cliente ${clientId}: ${errorMessage}`);
				}
			}
			
			case 'composicionSaldoCliente': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('priceDateModified', 0);
				const separarFecha = String(desdeSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				try {
					let url = `${centumUrl}/SaldosCuentasCorrientes/Composicion/${clientId}`;
					if (separarFecha) {
						url += `?fechaVencimientoHasta=${separarFecha}`;
					}

					const response = await apiRequest<any>(
						url,
						{
							method: 'GET',
							headers
						}
					);

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), `Error obteniendo composición de saldo para cliente ${clientId}: ${errorMessage}`);
				}
			}

			case 'obtenerFacturasPedidosVentas': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('balanceStartDate', 0);
				const hastaSaldoFecha = this.getNodeParameter('balanceEndDate', 0);
				const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
				const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(this.getNode(), 'priceDateModified (fecha desde) es requerido');
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), 'priceDateModifiedSince (fecha hasta) es requerido');
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId
					};

					const response = await apiRequest<any>(
						`${centumUrl}/Ventas/FiltrosVenta`,
						{
							method: 'POST',
							headers,
							body
						}
					);

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de facturas pedidos ventas:', error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
				}
			}
			
			case 'obtenerFacturasCobros': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('balanceStartDate', 0);
				const hastaSaldoFecha = this.getNodeParameter('balanceEndDate', 0);
				const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
				const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(this.getNode(), 'priceDateModified (fecha desde) es requerido');
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), 'priceDateModifiedSince (fecha hasta) es requerido');
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId
					};

					const response = await apiRequest<any>(
						`${centumUrl}/Cobros/FiltrosCobro`,
						{
							method: 'POST',
							headers,
							body
						}
					);

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de facturas pedidos ventas:', error);
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
				}
			}

			default:
				return [this.helpers.returnJsonArray([])];
		}
	}
}
