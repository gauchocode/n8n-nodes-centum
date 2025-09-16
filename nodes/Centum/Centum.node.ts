import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeParameterValue,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { CentumOperations, CentumFields, HttpOptions } from './CentumDescription';
import {
	IArticulos,
	IArticulosExistencias,
	IResponseCustomer,
	Cliente,
	IWoo,
	LineItem,
	IMergeArticulos,
	ShippingLine,
	CobroId,
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
	apiRequest,
	FetchOptions,
	apiGetRequest,
	createContribuyenteJson,
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
		};

		const resource = this.getNodeParameter('resource', 0);

		switch (resource) {
			case 'articulo': {
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
				};

				try {
					const response = await apiRequest<IArticulos>(`${centumUrl}/Articulos/Venta`, {
						method: 'POST',
						body: bodyToSend,
						headers,
						queryParams: { tipoOrdenArticulos: 'Codigo' },
					});

					if (response.Articulos.Items.length > 0) {
						const items = response.Articulos.Items;
						if (!completeMigration) {
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
								new Map(combinedArrays.map((obj) => [obj.IdArticulo, obj])).values(),
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
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articuloPorId': {
				const codigo = this.getNodeParameter('codigo', 0) as string;
				const articleId = this.getNodeParameter('articleId', 0) as string;

				if (!codigo && !articleId) {
					throw new NodeOperationError(
						this.getNode(),
						'El id o codigo del articulo es obligatorio',
					);
				}
				try {
					const articulo = await apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
						method: 'POST',
						headers,
						body: { CodigoExacto: codigo, Ids: articleId },
					});

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log('Error en solicitud de artículo por ID:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articulosDatosGenerales': {
				try {
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
					const paginated = await apiPostRequestPaginated<IArticulos>(articulosURL, fetchOptions);
					return [this.helpers.returnJsonArray(paginated as any)];
				} catch (error) {
					console.log('Error en solicitud de artículos', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articulosExistencia': {
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
					console.log('ArticulosExistencias error: ', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articulosImagenes': {
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
						{
							consumerApiPublicId,
							publicAccessKey: String(centumApiCredentials.publicAccessKey as string),
						},
						requestUrl,
					);

					if (allArticleImages instanceof Error) {
						console.error(
							`Failed to download images for article ${element.json.IdArticulo}`,
							allArticleImages,
						);
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
			}

			case 'articulosPrecioPorLista': {
				const idArticulos = this.getNodeParameter('codigo', 0) as string;
				const idLista = this.getNodeParameter('idList', 0) as string;

				if (!idLista || !idArticulos) {
					throw new NodeOperationError(
						this.getNode(),
						'El id de la lista y el artículo son obligatorios.',
					);
				}
				try {
					const articulo = await apiRequest<any>(`${centumUrl}/Articulos/FiltrosPrecios`, {
						method: 'POST',
						headers,
						body: { IdsArticulos: idArticulos, IdLista: idLista },
					});

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log('Error en solicitud de artículo por ID:', error);
					//const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					//throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articulosSucursalesFisicas': {
				const IdSucursalFisica = this.getNodeParameter('IdSucursalFisica', 0) as string;

				const queryParams: { idsSucursalesFisicas?: string } = {
					idsSucursalesFisicas: IdSucursalFisica,
				};

				if (!IdSucursalFisica) {
					throw new NodeOperationError(
						this.getNode(),
						'El id de la sucursal fisica es obligatorio',
					);
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
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'articuloSucursalFisica': {
				const IdSucursalFisica = this.getNodeParameter('idSucursalFisica', 0) as string;
				const idArticulo = this.getNodeParameter('articleId', 0) as string;
				const codigo = this.getNodeParameter('codigo', 0) as string;
				const queryParams: { IdSucursalFisica?: string, codigoExacto?: string, idsArticulos: string } = {
					IdSucursalFisica: IdSucursalFisica,
					codigoExacto: codigo,
					idsArticulos: idArticulo
				};

				if (!IdSucursalFisica || (!idArticulo && !codigo)) {
					throw new NodeOperationError( this.getNode(), 'El id de la sucursal fisica y el id del articulo o el codigo son obligatorios');
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
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'buscarContribuyente': {
				const cuit = this.getNodeParameter('cuit', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;

				if (!cuit && !razonSocial) {
					throw new NodeOperationError(
						this.getNode(),
						'Debe proporcionar al menos CUIT o Razón Social para buscar contribuyentes.',
					);
				}

				let url = `${centumUrl}/Clientes/BuscarContribuyente`;
				const queryParams: Record<string, string> = {};

				if (cuit && !razonSocial) {
					url += `/${cuit}`;
				} else {
					if (cuit) queryParams.Cuit = cuit;
					if (razonSocial) queryParams.razonSocial = razonSocial;
				}

				const requestDetails = {
					url,
					headers,
					queryParams,
				};

				try {
					console.log(`[BuscarContribuyente] Request:`, JSON.stringify(requestDetails, null, 2));

					const response = await apiRequest<IResponseCustomer>(requestDetails.url, {
						method: 'GET',
						headers: requestDetails.headers,
						queryParams: requestDetails.queryParams,
					});
					console.log(`[BuscarContribuyente] Response:`, JSON.stringify(response, null, 2));
					if (response.CantidadTotalItems === 1) {
						return [this.helpers.returnJsonArray(response.Items as any)];
					}

					return [this.helpers.returnJsonArray(response as any)];
				} catch (error) {
					console.log(`[BuscarContribuyente] Error:`, error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'clienteNuevo': {
				const datosCliente = this.getNodeParameter('cuerpoHTTP', 0);
				const clienteDNI = this.getNodeParameter('dni', 0);
				const datosJSON = createCustomerJson(datosCliente as IWoo, clienteDNI as string);

				try {
					const crearCliente = await apiRequest<any>(`${centumUrl}/Clientes`, {
						method: 'POST',
						body: datosJSON,
						headers,
					});
					return [this.helpers.returnJsonArray(crearCliente)];
				} catch (error) {
					console.log(error);
					const obj = {
						...error.response.data,
						IdCliente: -1,
					};
					return [this.helpers.returnJsonArray(obj)];
				}
			}

			case 'clientes': {
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
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'clientesActualizar': {
				const nuevosDatos = this.getNodeParameter('cuerpoHTTP', 0);
				try {
					const updateCustomer = await apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
						method: 'POST',
						body: nuevosDatos,
						headers,
					});

					return [this.helpers.returnJsonArray(updateCustomer)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}
			}

				case 'clientesBusqueda': {
				const codigo = this.getNodeParameter('codigo', 0, '') as string;
				const cuit = this.getNodeParameter('cuit', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;

				if (!codigo && !cuit && !razonSocial) {
					throw new NodeOperationError(this.getNode(), 'Debe proporcionar al menos un campo para la búsqueda (CUIT, Codigo o Razón Social).');
				}

				const queryParams: Record<string, string> = {};
				if (cuit) queryParams.Cuit = cuit;
				if (codigo) queryParams.Codigo = codigo;
				if (razonSocial) queryParams.RazonSocial = razonSocial;

				try {
					const response = await apiRequest<IResponseCustomer>(
						`${centumUrl}/Clientes`,
						{
							method: 'GET',
							headers,
							queryParams,
						},
					);

					return [this.helpers.returnJsonArray(response.Items as any)];
				} catch (error) {
					console.log(`[ClientesBusqueda] Error:`, error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'clientesBusquedaPorCuit': {
				const cuit = this.getNodeParameter('cuit', 0, '') as string;

				if (!cuit) {
					throw new NodeOperationError(
						this.getNode(),
						'Debe proporcionar CUIT para buscar clientes.',
					);
				}

				const queryParams: Record<string, string> = { Cuit: cuit };

				try {
					const response = await apiRequest<IResponseCustomer>(
						`${centumUrl}/Clientes`,
						{
							method: 'GET',
							headers,
							queryParams,
						},
					);

					return [this.helpers.returnJsonArray(response.Items as any)];
				} catch (error) {
					console.log(`[ClientesBusquedaPorCuit] Error:`, error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'cobros': {
				const ordenCliente = this.getNodeParameter('cliente', 0);
				const ordenArticulo = this.getNodeParameter('articulo', 0);
				const ordenEnvio = this.getNodeParameter('envio', 0);
				const bodyCharge = createChargeJson(
					ordenCliente as Cliente,
					ordenArticulo as LineItem[],
					ordenEnvio as ShippingLine[],
				);

				try {
					const dataCobros = await apiRequest<any>(`${centumUrl}/Cobros`, {
						method: 'POST',
						body: bodyCharge,
						headers,
					});

					return [this.helpers.returnJsonArray(dataCobros)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'composicionSaldoCliente': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('priceDateModified', 0);
				const separarFecha = String(desdeSaldoFecha).split('T')[0];

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

					const response = await apiRequest<any>(url, {
						method: 'GET',
						headers,
					});

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo composición de saldo para cliente ${clientId}: ${errorMessage}`,
					);
				}
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
					const arrArticles = await apiRequest<IArticulos>(`${centumUrl}/Articulos/Venta`, {
						method: 'POST',
						headers,
						body: {
							idCliente: 1,
							FechaDocumento: formattedDate,
							Habilitado: true,
							ActivoWeb: true,
						},
					});
					// Create the body for the sales order
					const bodyPedidoVenta = createOrderSaleJson(
						arrArticles.Articulos.Items,
						customerSalesOrder as any,
						articlesSalesOrder as LineItem[],
						shippingSalesOrder as ShippingLine[],
						idCobro as CobroId,
					);

					// New hash for sales order
					const centumSuiteAccessTokenSalesOrder = createHash(
						centumApiCredentials.publicAccessKey as string,
					);

					const headersSalesOrder = {
						CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
						CentumSuiteAccessToken: centumSuiteAccessTokenSalesOrder,
					};

					// Second request: create sales order
					const dataPedidosVenta = await apiRequest<any>(`${centumUrl}/PedidosVenta`, {
						method: 'POST',
						headers: headersSalesOrder,
						body: bodyPedidoVenta,
					});

					// Add charge ID to the order
					dataPedidosVenta.IdCobro = idCobro;

					return [this.helpers.returnJsonArray(dataPedidosVenta)];
				} catch (error) {
					console.log('Error creating sales order:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'departamentosLista': {
				const idProvincia = this.getNodeParameter('idProvincia', 0, '') as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idProvincia) {
						queryParams.idProvincia = idProvincia;
					}

					const departamentos = await apiRequest<IDepartamentos[]>(`${centumUrl}/Departamentos`, {
						method: 'GET',
						headers,
						queryParams,
					});
					return [this.helpers.returnJsonArray(departamentos.map((d) => ({ ...d })))];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'generarProductosWoo': {
				const data = this.getInputData();

				const json = createJsonProducts(data as unknown as IMergeArticulos[]);

				return [this.helpers.returnJsonArray(json as any)];
			}

			case 'generarToken': {
				try {
					const tokenGenerado = createHash(headers.publicAccessKey);

					return [this.helpers.returnJsonArray(tokenGenerado as any)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'listaPrecios': {
				try {
					const response = await apiRequest<any>(`${centumUrl}/ListasPrecios`, {
						method: 'GET',
						headers,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de promociones para el cliente:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo el listado de precios. \n ${errorMessage}`,
					);
				}
			}

			case 'nuevoContribuyente': {
				const bodyJson = this.getNodeParameter('cuerpoHTTP', 0) as IContribuyenteBodyInput;
				const cuit = this.getNodeParameter('cuit', 0);
				console.log(bodyJson);

				if (typeof cuit !== 'string' || !/^\d{11}$/.test(cuit)) {
					throw new NodeOperationError(
						this.getNode(),
						'El CUIT debe ser una cadena de 11 dígitos numéricos.',
					);
				}

				const contribuyenteJSON = createContribuyenteJson(bodyJson, cuit);

				try {
					const crearCliente = await apiRequest(`${centumUrl}/Clientes`, {
						method: 'POST',
						body: contribuyenteJSON,
						headers,
					});

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

					const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;

					throw new NodeOperationError(this.getNode(), fullMessage, {
						description:
							responseData?.Detail || 'Ocurrió un error inesperado al llamar a la API de Centum.',
					});
				}
			}

			case 'obtenerFacturasCobros': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('balanceStartDate', 0);
				const hastaSaldoFecha = this.getNodeParameter('balanceEndDate', 0);
				const separarFechaDesde = String(desdeSaldoFecha).split('T')[0];
				const separarFechaHasta = String(hastaSaldoFecha).split('T')[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(
						this.getNode(),
						'priceDateModified (fecha desde) es requerido',
					);
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(
						this.getNode(),
						'priceDateModifiedSince (fecha hasta) es requerido',
					);
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId,
					};

					const response = await apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
						method: 'POST',
						headers,
						body,
					});

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de facturas pedidos ventas:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`,
					);
				}
			}

			case 'obtenerFacturasPedidosVentas': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('balanceStartDate', 0);
				const hastaSaldoFecha = this.getNodeParameter('balanceEndDate', 0);
				const separarFechaDesde = String(desdeSaldoFecha).split('T')[0];
				const separarFechaHasta = String(hastaSaldoFecha).split('T')[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), 'clienteId debe ser un número positivo');
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(
						this.getNode(),
						'priceDateModified (fecha desde) es requerido',
					);
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(
						this.getNode(),
						'priceDateModifiedSince (fecha hasta) es requerido',
					);
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId,
					};

					const response = await apiRequest<any>(`${centumUrl}/Ventas/FiltrosVenta`, {
						method: 'POST',
						headers,
						body,
					});

					// Validación de la respuesta
					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de facturas pedidos ventas:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`,
					);
				}
			}

			case 'obtenerSaldoCliente': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const desdeSaldoFecha = this.getNodeParameter('priceDateModified', 0);
				const soloFecha = String(desdeSaldoFecha).split('T')[0];

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

					const response = await apiRequest<any>(url, {
						method: 'GET',
						headers,
					});

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo saldo para cliente ${clientId}: ${errorMessage}`,
					);
				}
			}
			
			case 'operadoresMoviles': {
				const username = this.getNodeParameter('username', 0, '') as string;
				const password = this.getNodeParameter('password', 0, '') as string;

				try{
					const operadoresActividad = await apiRequest<any>(`
						${centumUrl}/OperadoresMoviles/Credenciales?Usuario=${username}&Contrasena=${password}`, {
							method: 'GET',
							headers
						}
					);
					return [this.helpers.returnJsonArray(operadoresActividad)];
				}catch( error ){
					const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'pedidoVentaActividad': {
				const pedidoID = this.getNodeParameter('id', 0);
				try {
					const dataActividad = await apiRequest<getActividad>(
						`${centumUrl}/PedidosVenta/${pedidoID}`,
						{ ...headers },
					);
					return [this.helpers.returnJsonArray(dataActividad)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'procesarImagenes': {
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
			}

			case 'promocionesCliente': {
				const clientIdParam = this.getNodeParameter('clienteId', 0);
				const documentDate = this.getNodeParameter('documentDate', 0) as string;
				const diaSemana = this.getNodeParameter('diaSemana', 0);
				const clientId = Number(clientIdParam);

				if (!documentDate) {
					throw new NodeOperationError(this.getNode(), 'documentDate es requerido');
				}

				const formattedDocumentDate = String(documentDate).split('T')[0];

				try {
					const body = {
						FechaDocumento: formattedDocumentDate,
						IdsCliente: clientId,
						DiaSemana: diaSemana || '',
					};

					const response = await apiRequest<any>(
						`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`,
						{
							method: 'POST',
							headers,
							body,
						},
					);

					if (!response || typeof response !== 'object') {
						throw new NodeOperationError(this.getNode(), 'Respuesta inválida del servidor');
					}

					if (response.Items && Array.isArray(response.Items)) {
						return [this.helpers.returnJsonArray(response.Items)];
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log('Error en solicitud de promociones para el cliente:', error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(
						this.getNode(),
						`Error obteniendo promociones para el cliente ${clientId}: \n ${errorMessage}`,
					);
				}
			}

			case 'provinciasLista': {
				const idPais = this.getNodeParameter('idPais', 0, '') as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idPais) {
						queryParams.idPais = idPais;
					}

					const provincias = await apiRequest<IProvincias[]>(`${centumUrl}/Provincias`, {
						method: 'GET',
						headers,
						queryParams,
					});

					return [this.helpers.returnJsonArray(provincias.map((p) => ({ ...p })))];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'regimenesEspecialesLista': {
				try {
					const dataRegimenesList = await apiRequest<any>(`${centumUrl}/RegimenesEspeciales`, {
						method: 'GET',
						headers
					})
					return [this.helpers.returnJsonArray(dataRegimenesList)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}
			case 'regimenesEspecialesPorId': {
				const regimenId = this.getNodeParameter('id', 0);
				if (!regimenId) {
					throw new NodeOperationError(this.getNode(), 'El ID del regimen es requerido');
				}
				
				try {
					const regimen = await apiRequest<any>(`${centumUrl}/RegimenesEspeciales/${regimenId}`, {
						method: 'GET',
						headers
					})
					return [this.helpers.returnJsonArray(regimen)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'sucursalesFisicas': {
				try {
					const dataListBranches = await apiRequest<any>(`${centumUrl}/SucursalesFisicas`, {
						method: 'GET',
						headers,
					});

					return [this.helpers.returnJsonArray(dataListBranches)];
				} catch (error) {
					console.log(error);
					const errorMessage =
						error?.response?.data?.Message || error.message || 'Error desconocido';
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			default: {
				throw new NodeOperationError(this.getNode(), `Operación no implementada: ${resource}`);
			}
		}
	}
}
