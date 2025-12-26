import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeParameterValue } from "n8n-workflow";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

import { CentumOperations, CentumFields, HttpOptions } from "./CentumDescription";
import {
	IArticulos,
	IArticulosExistencias,
	IResponseCustomer,
	Cliente,
	IWoo,
	LineItem,
	IMergeArticulos,
	ShippingLine,
	// CobroId,
	IContribuyenteBodyInput,
	IProvincias
} from "./interfaces";

import {
	createChargeJson,
	createCustomerJson,
	createHash,
	createJsonProducts,
	// createOrderSaleJson,
	centumGetArticleImages,
	getHttpSettings,
	apiRequest,
	FetchOptions,
	apiGetRequest,
	createContribuyenteJson,
	apiPostRequestPaginated,
} from "./helpers/functions";
import { IDepartamentos } from "./interfaces/departamentos";

// type Actividad = {
// 	IdActividad: number;
// 	Nombre: string;
// };
// type getActividad = {
// 	data: Actividad;
// };

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Centum",
		name: "centum",
		icon: "file:centum.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Consumes Centum API",
		defaults: {
			name: "Centum",
		},
		inputs: ["main"] as [NodeConnectionType],
		outputs: ["main"] as [NodeConnectionType],
		credentials: [
			{
				name: "centumApi",
				required: true,
			},
		],
		properties: [...CentumOperations, ...CentumFields, ...HttpOptions],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = await this.getCredentials("centumApi");
		let centumUrl: any = centumApiCredentials.centumUrl;
		let consumerApiPublicId: any = centumApiCredentials.consumerApiPublicId;

		// const centumSuiteAccessToken = createHash(centumApiCredentials.publicAccessKey as string);

		const headers: any = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			publicAccessKey: centumApiCredentials.publicAccessKey,
		};

		const resource = this.getNodeParameter("resource", 0);

		switch (resource) {
			case "actualizarCliente": {
				const nuevosDatos = this.getNodeParameter("cuerpoHTTP", 0);
				try {
					const updateCustomer = await apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
						method: "POST",
						body: nuevosDatos,
						headers,
					});

					return [this.helpers.returnJsonArray(updateCustomer)];
				} catch (error) {
					console.log(error);
					return [this.helpers.returnJsonArray([])];
				}
			}

			case "buscarClientePorCuit": {
				const cuit = this.getNodeParameter("cuit", 0, "") as string;

				if (!cuit) {
					throw new NodeOperationError(this.getNode(), "Debe proporcionar CUIT para buscar clientes.");
				}

				const queryParams: Record<string, string> = { Cuit: cuit };

				try {
					const response = await apiRequest<IResponseCustomer>(`${centumUrl}/Clientes`, {
						method: "GET",
						headers,
						queryParams,
					});

					return [this.helpers.returnJsonArray(response.Items as any)];
				} catch (error) {
					console.log(`[ClientesBusquedaPorCuit] Error:`, error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "buscarClientes": {
				const codigo = this.getNodeParameter("codigoCliente", 0, "") as string;
				const cuit = this.getNodeParameter("cuit", 0, "") as string;
				const razonSocial = this.getNodeParameter("razonSocial", 0, "") as string;

				if (!codigo && !cuit && !razonSocial) {
					throw new NodeOperationError(this.getNode(), "Debe proporcionar al menos un campo para la búsqueda (CUIT, Codigo o Razón Social).");
				}

				const queryParams: Record<string, string> = {};
				if (cuit) queryParams.Cuit = cuit;
				if (codigo) queryParams.codigo = codigo;
				if (razonSocial) queryParams.RazonSocial = razonSocial;

				try {
					const response = await apiRequest<IResponseCustomer>(`${centumUrl}/Clientes`, {
						method: "GET",
						headers,
						queryParams,
					});
					console.log(response);
					return [this.helpers.returnJsonArray(response.Items as any)];
				} catch (error) {
					console.log(`[ClientesBusqueda] Error:`, error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "buscarContribuyente": {
				const cuit = this.getNodeParameter("cuit", 0, "") as string;
				const razonSocial = this.getNodeParameter("razonSocial", 0, "") as string;

				if (!cuit && !razonSocial) {
					throw new NodeOperationError(this.getNode(), "Debe proporcionar al menos CUIT o Razón Social para buscar contribuyentes.");
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
						method: "GET",
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
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "buscarProductoEnSucursal": {
				const IdSucursalFisica = this.getNodeParameter("idSucursalFisica", 0) as string;
				const idArticulo = this.getNodeParameter("articleId", 0) as string;
				const codigo = this.getNodeParameter("codigoArticulo", 0) as string;
				const nombre = this.getNodeParameter("nombreArticulo", 0) as string;
				const queryParams: {
					IdSucursalFisica?: string;
					codigoExacto?: string;
					idsArticulos: string;
					nombre: string;
				} = {
					IdSucursalFisica: IdSucursalFisica,
					codigoExacto: codigo,
					idsArticulos: idArticulo,
					nombre
				};

				if (!IdSucursalFisica || (!idArticulo && !codigo && !nombre)) {
					throw new NodeOperationError(this.getNode(), "El id de la sucursal fisica y el id del articulo o el codigo son obligatorios");
				}
				try {
					const dataArticulosExistencias = await apiRequest<any>(`${centumUrl}/ArticulosSucursalesFisicas`, {
						headers,
						queryParams,
					});
					return [this.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "buscarProductoPorCodigo": {
				const codigo = this.getNodeParameter("codigoArticulo", 0) as string;
				const articleId = this.getNodeParameter("articleId", 0) as string;
				const fechaCreacionDesde = this.getNodeParameter("startDate", 0) as string;
				const fechaCreacionHasta = this.getNodeParameter("endDate", 0) as string;

				if (!codigo && !articleId) {
					throw new NodeOperationError(this.getNode(), "El id o codigo del articulo es obligatorio");
				}
				try {
					const articulo = await apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
						method: "POST",
						headers,
						body: { CodigoExacto: codigo, Ids: articleId, FechaCreacionDesde: fechaCreacionDesde, FechaCreacionHasta: fechaCreacionHasta },
					});

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log("Error en solicitud de artículo por ID:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "buscarProductoPorNombre": {
				const nombre = this.getNodeParameter("nombre", 0) as string;

				if (!nombre) {
					throw new NodeOperationError(this.getNode(), "El nombre del artículo es obligatorio");
				}
				try {
					const articulo = await apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
						method: "POST",
						headers,
						body: {
							Nombre: nombre
						}
					});

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log("Error en solicitud de artículo por ID:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'buscarProductos': {
				const nombreArticulo = this.getNodeParameter('nombreArticulo', 0, '') as string;
				const codigoArticulo = this.getNodeParameter('codigoArticulo', 0, '') as string;


				try {
					const response = await apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
						method: 'POST',
						headers,
						body: { Nombre: nombreArticulo, Codigo: codigoArticulo },
					});

					return [this.helpers.returnJsonArray(response as any)];
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Hubo un error al buscar el articulo. Error: ${error}`);
				}
			}

			case 'buscarProveedor': {
				const proveedorId = this.getNodeParameter('proveedorId', 0);

				try {
					const response = await apiRequest<any>(`${centumUrl}/Proveedores/${proveedorId}`, {
						method: 'GET',
						headers
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "consultarPrecioProducto": {
				const idArticulos = this.getNodeParameter("codigoArticulo", 0) as string;
				const idLista = this.getNodeParameter("idList", 0) as string;

				if (!idLista || !idArticulos) {
					throw new NodeOperationError(this.getNode(), "El id de la lista y el artículo son obligatorios.");
				}
				try {
					const articulo = await apiRequest<any>(`${centumUrl}/Articulos/FiltrosPrecios`, {
						method: "POST",
						headers,
						body: { IdsArticulos: idArticulos, IdLista: idLista },
					});

					return [this.helpers.returnJsonArray(articulo)];
				} catch (error) {
					console.log("Error en solicitud de artículo por ID:", error);
					//const errorMessage = error?.response?.data?.Message || error.message || 'Error desconocido';
					//throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "consultarSaldoCliente": {
				const clientIdParam = this.getNodeParameter("clienteId", 0);
				const desdeSaldoFecha = this.getNodeParameter("priceDateModified", 0);
				const soloFecha = String(desdeSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), "clienteId debe ser un número positivo");
				}

				try {
					let url = `${centumUrl}/SaldosCuentasCorrientes/${clientId}`;
					if (soloFecha) {
						url += `?fechaVencimientoHasta=${soloFecha}`;
					}

					const response = await apiRequest<any>(url, {
						method: "GET",
						headers,
					});

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo saldo para cliente ${clientId}: ${errorMessage}`);
				}
			}

			case "consultarStock": {
				const branchOfficeIds = String(this.getNodeParameter("branchOfficeIds", 0));
				try {
					const dataArticulosExistencia = await apiRequest<IArticulosExistencias>(`${centumUrl}/ArticulosExistencias`, {
						headers,
						queryParams: {
							idsSucursalesFisicas: branchOfficeIds,
						},
					});

					return [this.helpers.returnJsonArray(dataArticulosExistencia.Items as any)];
				} catch (error) {
					console.log("ArticulosExistencias error: ", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "convertirProductosParaWooCommerce": {
				const data = this.getInputData();

				const json = createJsonProducts(data as unknown as IMergeArticulos[]);

				return [this.helpers.returnJsonArray(json as any)];
			}

			case "crearCliente": {
				const datosCliente = this.getNodeParameter("cuerpoHTTP", 0);
				const clienteDNI = this.getNodeParameter("dni", 0);
				const datosJSON = createCustomerJson(datosCliente as IWoo, clienteDNI as string);

				try {
					const crearCliente = await apiRequest<any>(`${centumUrl}/Clientes`, {
						method: "POST",
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

			case "crearCompra": {
				/* Información del comprobante */
				const nombreTipoComprobante = this.getNodeParameter("nombreTipoComprobante", 0, "") as string;
				const codigoComprobante = this.getNodeParameter("codigoComprobante", 0, "") as string;
				const idTipoComprobante = this.getNodeParameter("idTipoComprobante", 0);

				/* Información del documento */
				const numeroDocumento = this.getNodeParameter("numeroFactura", 0);
				const puntoVenta = this.getNodeParameter("puntoDeVenta", 0);
				const letraDocumento = this.getNodeParameter("letraDocumento", 0, "") as string;
				const fechaDocumento = this.getNodeParameter("fechaFactura", 0, "") as string;

				const sucursalFisica = this.getNodeParameter("idSucursalFisica", 0);

				const articulosArray = this.getNodeParameter("articlesCollection", 0) as Array<{
					ID: string;
					Cantidad: number;
				}>;

				const idCliente = this.getNodeParameter("clienteId", 0);
				const idProveedor = this.getNodeParameter("idProveedor", 0);
				const fechaProducto = this.getNodeParameter("startDate", 0);
				const separarFecha = String(fechaProducto).split("T")[0];

				// Sólo los IDs para el request a /Articulos/Venta
				const ids = articulosArray.map((a) => a.ID);
				// Mapa id -> cantidad
				const qtyById: Record<string, number> = Object.fromEntries(articulosArray.map((a) => [a.ID, a.Cantidad]));

				let bodyProveedor;
				const bodyCompraArticulos = {
					IdCliente: idCliente,
					FechaDocumento: separarFecha,
					Ids: ids,
				};

				try {
					const fetchProveedor = await apiRequest<any>(`${centumUrl}/Proveedores/${idProveedor}`, {
						method: "GET",
						headers,
					});
					bodyProveedor = fetchProveedor;
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo el proveedor.\n ${errorMessage}`);
				}

				let articulosVenta: any;
				try {
					articulosVenta = await apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
						method: "POST",
						body: bodyCompraArticulos,
						headers,
					});
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error al obtener la informacion de los articulos ${errorMessage}`);
				}

				const ventaObj = typeof articulosVenta === "string" ? JSON.parse(articulosVenta) : articulosVenta;

				const itemsRespuesta: any[] = ventaObj?.Articulos?.Items ?? ventaObj?.CompraArticulos ?? ventaObj?.Items ?? [];

				// Agrego Cantidad desde el array original
				const compraConCantidad = itemsRespuesta.map((art: any) => ({
					...art,
					Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
				}));

				const finalBody = {
					TipoComprobanteCompra: {
						IdTipoComprobanteCompra: idTipoComprobante,
						Codigo: codigoComprobante,
						Nombre: nombreTipoComprobante,
					},
					SucursalFisica: {
						IdSucursalFisica: sucursalFisica,
					},
					NumeroDocumento: {
						LetraDocumento: letraDocumento,
						PuntoVenta: puntoVenta,
						Numero: numeroDocumento,
					},
					FechaDocumento: fechaDocumento,
					Proveedor: bodyProveedor,
					CompraArticulos: compraConCantidad,
				};

				try {
					const response = await apiRequest<any>(`${centumUrl}/Compras`, {
						method: "POST",
						headers,
						body: finalBody,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error creando la compra.\n ${errorMessage}`);
				}
			}

			case "crearContribuyente": {
				const bodyJson = this.getNodeParameter("cuerpoHTTP", 0) as IContribuyenteBodyInput;
				const cuit = this.getNodeParameter("cuit", 0);
				console.log(bodyJson);

				if (typeof cuit !== "string" || !/^\d{11}$/.test(cuit)) {
					throw new NodeOperationError(this.getNode(), "El CUIT debe ser una cadena de 11 dígitos numéricos.");
				}

				const contribuyenteJSON = createContribuyenteJson(bodyJson, cuit);

				try {
					const crearCliente = await apiRequest(`${centumUrl}/Clientes`, {
						method: "POST",
						body: contribuyenteJSON,
						headers,
					});

					console.log("Contribuyente creado:", crearCliente);
					return [this.helpers.returnJsonArray([crearCliente as any])];
				} catch (error: any) {
					console.error("Error al crear contribuyente:", error);

					const statusCode = error?.response?.status;
					const responseData = error?.response?.data;
					const errorMessage = responseData?.Message || responseData?.message || error?.message || "Error desconocido al crear el contribuyente.";

					const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;

					throw new NodeOperationError(this.getNode(), fullMessage, {
						description: responseData?.Detail || "Ocurrió un error inesperado al llamar a la API de Centum.",
					});
				}
			}

			case "crearOrdenCompra": {

				try {
					const response = await apiRequest<any>(`${centumUrl}/OrdenesCompra`, {
						method: "POST",
						headers,
						body: {
							// "DivisionEmpresaGrupoEconomico": {
							// 	"IdDivisionEmpresaGrupoEconomico": 1,
							// 	"RazonSocialEmpresaGrupoEconomico": null,
							// 	"NombreDivisionEmpresa": null
							// },
							"SucursalFisica": {
								"IdSucursalFisica": 6084
							},
							"NumeroDocumento": {
								"LetraDocumento": "O",
								"PuntoVenta": 1,
								"Numero": 6
							},
							"FechaDocumento": "2025-11-07T00:00:00",
							// "FechaEmbarque": "2020-06-02T00:00:00",
							"FechaEntrega": "2026-06-02T00:00:00",
							// "FechaImputacion": "2020-06-02T00:00:00",
							// "TurnoEntrega": {
							// 	"IdTurnoEntrega": 6083,
							// 	"Nombre": "Maniana"
							// },
							"Proveedor": {
								"IdProveedor": 6283,
								"Codigo": "006283",
								"RazonSocial": "Proveedores Río 240 EIRL",
								"CUIT": "27260404100",
								"Direccion": null,
								"Localidad": "CONCEPCION ARENAL 7350",
								"CodigoPostal": "7600",
								"Provincia": {
									"IdProvincia": 4876,
									"Codigo": "BSAS",
									"Nombre": "Buenos Aires"
								},
								"Pais": {
									"IdPais": 4657,
									"Codigo": "ARG",
									"Nombre": "Argentina"
								},
								"Telefono": "541166778899",
								"TelefonoAlternativo": "541166778899",
								"Fax": null,
								"Interno": null,
								"Email": "matjul.mdq@hotmail.com",
								"OperadorCompra": {
									"IdOperadorCompra": 1,
									"Codigo": "Operador de Compras Defecto",
									"Nombre": "Operador de Compras Defecto",
									"EsSupervisor": true
								},
								"CondicionIVA": {
									"IdCondicionIVA": 1895,
									"Codigo": "RI",
									"Nombre": "Responsable Inscripto"
								},
								"CondicionIIBB": {
									"IdCondicionIIBB": 6051,
									"Codigo": "Responsable Inscript"
								},
								"NumeroIIBB": "30716828820",
								"FormaPagoProveedor": {
									"IdFormaPagoProveedor": 6091,
									"Nombre": "Efectivo"
								},
								"DiasMorosidad": null,
								"DiasIncobrables": null,
								"CondicionPago": {
									"IdCondicionPago": 4,
									"Codigo": "CC1",
									"Nombre": "7 Dias"
								},
								"CategoriaImpuestoGanancias": {
									"IdCategoriaImpuestoGanancia": 6065,
									"Nombre": "Exento"
								},
								"CategoriaRetencionIVA": null,
								"CategoriaRetencionSUSS": null,
								"ClaseProveedor": {
									"IdClaseProveedor": 8609,
									"Codigo": "02",
									"Nombre": "DISTRIBUIDOR"
								},
								"Zona": {
									"IdZona": 6095,
									"Codigo": "Zona Defecto",
									"Nombre": "Zona Defecto",
									"Activo": true,
									"EntregaLunes": false,
									"EntregaMartes": false,
									"EntregaMiercoles": false,
									"EntregaJueves": false,
									"EntregaViernes": false,
									"EntregaSabado": false,
									"EntregaDomingo": false,
									"DemoraEnHorasFechaEntrega": 24,
									"CostoEntrega": 10000
								},
								"DescuentoProveedor": null,
								"DiasEntrega": 0,
								"Activo": true
							},
							"PorcentajeDescuento": 0.000000,
							"Observaciones": "",
							"OrdenCompraArticulos": [
								{
									"IdArticulo": 2757,
									"Codigo": "00002757",
									"Nombre": "GALL MARYSOL MARINERAS 300gr",
									"Cantidad": 1.000,
									"SegundoControlStock": 0.000,
									"Precio": 7.0,
									"PorcentajeDescuento1": 0.000,
									"PorcentajeDescuento2": 0.000,
									"PorcentajeDescuento3": 0.000,
									"DescuentoCalculado": 0.000000,
									"CategoriaImpuestoIVA": {
										"IdCategoriaImpuestoIVA": 4,
										"Codigo": "5",
										"Nombre": "IVA 21.00",

										"Tasa": 21.000
									},
									"ImpuestoInterno": 0.000,
									"Observaciones": ""
								}
							],
							"FechaVencimiento": "2029-11-07T00:00:00",
							// "CondicionPago": {
							// 	"IdCondicionPago": 2,
							// 	"Codigo": "PAG1",
							// 	"Nombre": "Contado"
							// },
							// "FormaPagoProveedor": {

							// },
							"OperadorCompra": {
								"IdOperadorCompra": 1,
								"Codigo": "1",
								"Nombre": "Operador de Compras Defecto",
								"EsSupervisor": false
							},
						}
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error creando la compra.\n ${errorMessage}`);
				}
			}

			case "crearPedidoVenta": {
				type ArticuloInput = {
					ID?: number;
					Codigo?: string;
					Cantidad: number;
				};
				const razonSocial = this.getNodeParameter('razonSocial', 0) as string;
				const articulosRaw = this.getNodeParameter('articulo', 0);
				const codigoCliente = this.getNodeParameter('codigoCliente', 0) as string;
				const fechaDocumento = this.getNodeParameter('documentDate', 0) as string;
				const formattedDocumentDate = String(fechaDocumento).split("T")[0];
				const bonificacion = this.getNodeParameter('idBonificacion', 0);
				const turnoEntrega = this.getNodeParameter('turnoEntrega', 0);
				const fechaEntrega = this.getNodeParameter('deliveryDate', 0);
				const vendedor = this.getNodeParameter('vendedorID', 0);

				let articulos: ArticuloInput[];

				if (typeof articulosRaw === 'string') {
					try {
						const parsed = JSON.parse(articulosRaw);

						if (typeof parsed === 'object' && !Array.isArray(parsed)) {
							articulos = [parsed] as ArticuloInput[];
						}
						else if (Array.isArray(parsed)) {
							articulos = parsed as ArticuloInput[];
						}
						else {
							throw new NodeOperationError(this.getNode(), 'Formato Inválido');
						}
					} catch (error) {
						throw new NodeOperationError(this.getNode(), 'El formato de artículos no es válido. Ejemplos válidos: {"ID": 1271, "Cantidad": 10} o {"Codigo": "ABC123", "Cantidad": 10} o arrays de estos objetos');
					}
				} else if (Array.isArray(articulosRaw)) {
					articulos = articulosRaw as ArticuloInput[];
				} else if (typeof articulosRaw === 'object' && articulosRaw !== null) {
					articulos = [articulosRaw as ArticuloInput];
				} else {
					throw new NodeOperationError(this.getNode(), `Tipo de dato inesperado: ${typeof articulosRaw}`);
				}

				let clientId, queryParams;

				if (!razonSocial.trim() && !codigoCliente.trim()) {
					throw new NodeOperationError(this.getNode(), 'El código o la razón social del cliente es obligatorio.');
				}

				if (!Array.isArray(articulos) || articulos.length === 0) {
					throw new NodeOperationError(this.getNode(), 'Debes enviar al menos un artículo con su cantidad.');
				}

				// Validar que cada artículo tenga ID o Codigo
				for (const art of articulos) {
					if (!art.ID && !art.Codigo) {
						throw new NodeOperationError(
							this.getNode(),
							'Cada artículo debe tener al menos un ID o un Codigo'
						);
					}
				}

				if (codigoCliente) queryParams = `codigo=${codigoCliente}`;
				if (razonSocial) queryParams = `razonSocial=${razonSocial}`;

				/* 1st Request to get Client ID */
				try {
					const dataCliente = await apiRequest<any>(`${centumUrl}/Clientes?${queryParams}`, {
						method: "GET",
						headers
					})

					const cliente = dataCliente?.Items?.[0]
					if (!cliente?.IdCliente) {
						throw new NodeOperationError(this.getNode(), 'El cliente no fue encontrado');
					}
					clientId = cliente.IdCliente;
				} catch (error) {
					console.log("Error creating sales order:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error al obtener el cliente.";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}

				/* 2da Request to get articles data */
				const resultados: any[] = [];

				for (const articuloInput of articulos) {
					try {
						// Construir el body dinámicamente según si tiene ID o Codigo
						const bodyArticulo: any = {
							IdCliente: clientId,
							FechaDocumento: formattedDocumentDate,
						};

						// Usar Ids (plural) si tiene ID, o Codigo (singular) si tiene Codigo
						if (articuloInput.ID) {
							bodyArticulo.Ids = [articuloInput.ID];
						} else if (articuloInput.Codigo) {
							bodyArticulo.Codigo = articuloInput.Codigo;
						}

						const dataArticulo = await apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
							method: 'POST',
							headers,
							body: bodyArticulo,
						});

						const items = dataArticulo?.Articulos?.Items ?? [];
						if (items.length > 0) {
							const itemsConCantidad = items.map((item: any) => ({
								...item,
								Cantidad: articuloInput.Cantidad,
							}));

							resultados.push(...itemsConCantidad);
						}

						const identificador = articuloInput.ID || articuloInput.Codigo;
						console.log(`✔ Artículo ${identificador} procesado correctamente`);
					} catch (error: any) {
						const identificador = articuloInput.ID || articuloInput.Codigo;
						console.log(`❌ Error consultando artículo ${identificador}:`, error.message);
						resultados.push({
							id: articuloInput.ID,
							codigo: articuloInput.Codigo,
							error: error.message || 'Error desconocido',
						});
					}
				}

				const bodyPedidoVenta = {
					Bonificacion: {
						IdBonificacion: bonificacion
					},
					PedidoVentaArticulos: resultados,
					Cliente: {
						IdCliente: clientId
					},
					Vendedor: {
						IdVendedor: vendedor
					},
					TurnoEntrega: {
						IdTurnoEntrega: turnoEntrega
					},
					FechaEntrega: fechaEntrega
				}

				try {
					const pedidoVenta = await apiRequest<any>(`${centumUrl}/PedidosVenta`, {
						method: "POST",
						headers,
						body: bodyPedidoVenta
					})
					return [this.helpers.returnJsonArray(pedidoVenta)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error al crear el pedido de venta.";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'crearProveedor': {

				const codigo = this.getNodeParameter('codigoArticulo', 0, '') as string;
				const razonSocial = this.getNodeParameter('razonSocial', 0, '') as string;
				const cuit = this.getNodeParameter('cuit', 0);
				const provincia = this.getNodeParameter('idProvincia', 0);
				const pais = this.getNodeParameter('idPais', 0);
				const condicionIVA = this.getNodeParameter('condicionIVA', 0, '') as string;
				const formaPagoProveedor = this.getNodeParameter('formaPagoProveedor', 0);
				const condicionPago = this.getNodeParameter('condicionDePago', 0);
				const categoriaImpuestoGanancias = this.getNodeParameter('categoriaImpuestosGanancias', 0);
				const claseProveedor = this.getNodeParameter('claseProveedor', 0);
				const activo = this.getNodeParameter('active', 0);
				const idOperadorCompra = this.getNodeParameter('idOperadorCompra', 0);
				const idZona = this.getNodeParameter('idZona', 0);
				const idDescuentoProveedor = this.getNodeParameter('idDescuentoProveedor', 0);

				const body = {
					Codigo: codigo,
					RazonSocial: razonSocial,
					CUIT: cuit,
					Provincia: {
						IdProvincia: provincia
					},
					Pais: {
						IdPais: pais
					},
					CondicionIVA: {
						IdCondicionIVA: condicionIVA
					},
					FormaPagoProveedor: {
						IdFormaPagoProveedor: formaPagoProveedor
					},
					CondicionPago: {
						IdCondicionPago: condicionPago
					},
					CategoriaImpuestoGanancias: {
						IdCategoriaImpuestoGanancia: categoriaImpuestoGanancias
					},
					ClaseProveedor: {
						IdClaseProveedor: claseProveedor
					},
					OperadorCompra: {
						IdOperadorCompra: idOperadorCompra
					},
					Activo: activo,
					Zona: {
						IdZona: idZona
					},
					DescuentoProveedor: {
						IdDescuentoProveedor: idDescuentoProveedor
					}
				}


				try {
					const response = await apiRequest<any>(`${centumUrl}/Proveedores/`, {
						method: 'POST',
						headers,
						body
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "crearVenta": {
				const numeroPuntoDeVenta = this.getNodeParameter("puntoDeVenta", 0) as number;
				const bonificacion = this.getNodeParameter("bonificacion", 0, "") as string;
				const esContado = this.getNodeParameter("esContado", 0) as boolean;
				const idCliente = this.getNodeParameter("clienteId", 0) as number;
				const condicionVentaId = this.getNodeParameter("idCondicionVenta", 0) as number;
				const tipoComprobanteVenta = this.getNodeParameter("idTipoComprobante", 0) as number;
				const idVendedor = this.getNodeParameter("idVendedor", 0) as number;
				const preciosListaId = this.getNodeParameter("idList", 0) as number;

				// === articlesCollection como STRING, luego parse ===
				const articlesCollectionRaw = this.getNodeParameter("articlesCollection", 0, "") as string;
				let articulosArray: Array<{ ID: string; Cantidad: number }> = [];
				try {
					articulosArray = JSON.parse(articlesCollectionRaw);
					if (!Array.isArray(articulosArray)) {
						throw new NodeOperationError(this.getNode(), "El campo articlesCollection debe ser un array JSON válido.");
					}
				} catch (err) {
					throw new NodeOperationError(
						this.getNode(),
						`El campo articlesCollection debe ser un JSON string válido. Ejemplo:[{"ID":"1450","Cantidad":2},{"ID":"1451","Cantidad":5}] Error: ${(err as any)?.message ?? String(err)}`,
					);
				}

				const fechaDesde = this.getNodeParameter("startDate", 0, "") as string;
				const separarFechaDesde = String(fechaDesde).split("T")[0];

				// Campos condicionales (pueden no existir si esContado = false)
				const idValorEfectivo = this.getNodeParameter("idValorEfectivo", 0, null) as number | null;
				const cotizacionValorEfectivo = this.getNodeParameter("cotizacionValorEfectivo", 0, null) as number | null;
				const importeValorEfectivo = this.getNodeParameter("importeValorEfectivo", 0, null) as number | null;
				const observacionesValorEfectivo = this.getNodeParameter("observacionesValorEfectivo", 0, "") as string;
				const cantidadCuotasValorEfectivo = this.getNodeParameter("cantidadCuotasValorEfectivo", 0, null) as number | null;

				// Validaciones mínimas
				if (!numeroPuntoDeVenta) throw new NodeOperationError(this.getNode(), "El punto de venta es obligatorio.");
				if (!tipoComprobanteVenta) throw new NodeOperationError(this.getNode(), "El tipo de comprobante de venta es obligatorio.");
				if (!idCliente) throw new NodeOperationError(this.getNode(), "El IdCliente es obligatorio.");
				if (!preciosListaId) throw new NodeOperationError(this.getNode(), "El IdListaPrecio es obligatorio.");
				if (!articulosArray?.length) throw new NodeOperationError(this.getNode(), "Debes enviar al menos un artículo en articlesCollection.");

				// Si es contado, chequeo mínimos requeridos
				if (esContado === true) {
					if (idValorEfectivo == null) throw new NodeOperationError(this.getNode(), "IdValor (efectivo) es obligatorio cuando EsContado = true.");
					if (importeValorEfectivo == null) throw new NodeOperationError(this.getNode(), "Importe (efectivo) es obligatorio cuando EsContado = true.");
				}

				// === Construcción de IDs y mapa de cantidades (misma lógica que Compras) ===
				const ids = articulosArray.map((a) => a.ID);
				const qtyById: Record<string, number> = Object.fromEntries(articulosArray.map((a) => [a.ID, a.Cantidad]));

				// 1) Traer info de artículos para venta
				let ventaItemsConCantidad: any[] = [];
				try {
					const bodyArticulosVenta = {
						IdCliente: idCliente,
						FechaDocumento: separarFechaDesde,
						Ids: ids,
					};

					let articulosVenta = await apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
						headers,
						method: "POST",
						body: bodyArticulosVenta,
					});
					const ventaObj = typeof articulosVenta === "string" ? JSON.parse(articulosVenta) : articulosVenta;

					const itemsRespuesta: any[] = ventaObj?.Articulos?.Items ?? ventaObj?.VentaArticulos ?? ventaObj?.Items ?? [];

					// Agrego Cantidad desde el array original (clave: IdArticulo)
					ventaItemsConCantidad = itemsRespuesta.map((art: any) => ({
						...art,
						Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
					}));
					console.log(ventaItemsConCantidad);
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo los artículos de venta.\n${errorMessage}`);
				}

				// 2) Armar el cuerpo de la venta
				const bodyVenta: any = {
					NumeroDocumento: { PuntoVenta: Number(numeroPuntoDeVenta) },
					EsContado: Boolean(esContado),
					Cliente: { IdCliente: Number(idCliente) },
					CondicionVenta: { IdCondicionVenta: Number(condicionVentaId) },
					Observaciones: "Venta desde API",
					TipoComprobanteVenta: { IdTipoComprobanteVenta: Number(tipoComprobanteVenta) },
					Vendedor: { IdVendedor: Number(idVendedor) },
					ListaPrecio: { IdListaPrecio: Number(preciosListaId) },
					VentaArticulos: ventaItemsConCantidad,
					PorcentajeDescuento: 0,
				};

				// Bonificación opcional
				if (bonificacion) {
					bodyVenta.Bonificacion = { IdBonificacion: bonificacion };
				}

				// 3) Solo agrego VentaValoresEfectivos si corresponde y con valores válidos
				if (esContado === true) {
					const cotizacion = !cotizacionValorEfectivo || cotizacionValorEfectivo <= 0 ? 1 : Number(cotizacionValorEfectivo);
					const cuotas = !cantidadCuotasValorEfectivo || cantidadCuotasValorEfectivo <= 0 ? 1 : Number(cantidadCuotasValorEfectivo);

					bodyVenta.VentaValoresEfectivos = [
						{
							IdValor: Number(idValorEfectivo),
							Cotizacion: cotizacion,
							Importe: Number(importeValorEfectivo),
							Observaciones: observacionesValorEfectivo || "",
							CantidadCuotas: cuotas,
						},
					];
				}

				// 4) POST final
				try {
					const url = `${centumUrl}/Ventas?verificaLimiteCreditoCliente=false&verificaStockNegativo=false&verificaCuotificador=false`;

					const response = await apiRequest<any>(url, {
						method: "POST",
						headers,
						body: bodyVenta,
					});

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error creando la venta.\n${errorMessage}`);
				}
			}

			case "descargarImagenesProductos": {
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
						console.error(`Failed to download images for article ${element.json.IdArticulo}`, allArticleImages);
						continue;
					}

					if (allArticleImages.length > 0) {
						for (let j = 0; j < allArticleImages.length; j++) {
							const binary: any = {};
							const dataImage = allArticleImages[j];
							const buffer = Buffer.from(dataImage.buffer);
							binary["data"] = await this.helpers.prepareBinaryData(buffer);
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

			case "estadisticaVentaRanking": {
				const fechaDesdeString = this.getNodeParameter('startDate', 0);
				const fechaHastaString = this.getNodeParameter('endDate', 0);
				const tipoDeRanking = this.getNodeParameter('tipoDeRanking', 0);
				const orderByRanking = this.getNodeParameter('ventaRankingOrderBy', 0)
				const orderAsc = this.getNodeParameter('orderAsc', 0);
				const cantItems = this.getNodeParameter('cantidadDeItems', 0);
				const fechaDesde = String(fechaDesdeString).split("T")[0];
				const fechaHasta = String(fechaHastaString).split("T")[0];


				let url = `${centumUrl}/EstadisticaVentaRanking/${cantItems}`;

				if (fechaDesde && fechaHasta) {
					url += `?fechaDocumentoDesde=${fechaDesde}&fechaDocumentoHasta=${fechaHasta}`
				} else {
					throw new NodeOperationError(this.getNode(), 'Ambos periodos de fecha son necesarios.')
				}

				if (tipoDeRanking) {
					if (tipoDeRanking === 'esRankingClientes') {
						url += `&${tipoDeRanking}=true`
					}
					if (tipoDeRanking === 'esRankingArticulos') {
						url += `&${tipoDeRanking}=true`
					}
					if (tipoDeRanking === 'esRankingVendedores') {
						url += `&${tipoDeRanking}=true`
					}
				}

				if (orderByRanking) {
					if (orderByRanking === 'CantidadUnidadNivel0') {
						url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`
					}
					if (orderByRanking === 'CantidadUnidadNivel1') {
						url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`
					}
					if (orderByRanking === 'CantidadUnidadNivel2') {
						url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`
					}
					if (orderByRanking === 'ImporteTotalNeto') {
						url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`
					}
					if (orderByRanking === 'ImporteTotalFinal') {
						url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`
					}
				}

				if (orderAsc !== null) {
					url += `&ordenEstadisticaVentaRankingAscendente=${orderAsc}`
				}

				try {
					const response = await apiRequest<any>(`${url}`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de estadisticas de ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo las estadisticas de ranking. \n ${errorMessage}`);
				}

			}

			case "generarTokenSeguridad": {
				try {
					const tokenGenerado = createHash(headers.publicAccessKey);

					return [this.helpers.returnJsonArray(tokenGenerado as any)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'listarBonificaciones': {
				try {
					const bonificaciones = await apiRequest<any>(`${centumUrl}/Bonificaciones`, {
						method: "GET",
						headers
					})
					return [this.helpers.returnJsonArray([bonificaciones])];
				} catch (error) {
					console.error("Error al obtener las bonificaciones:", error);
					const statusCode = error?.response?.status;
					const responseData = error?.response?.data;
					const errorMessage = responseData?.Message || responseData?.message || error?.message || "Error desconocido al crear el contribuyente.";
					const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;
					throw new NodeOperationError(this.getNode(), fullMessage, {
						description: responseData?.Detail || "Ocurrió un error inesperado al llamar a la API de Centum.",
					});
				}
			}

			case "listarCategorias": {

				const subRubro = this.getNodeParameter('idsSubRubros', 0);
				let url = `${centumUrl}/CategoriasArticulo`;

				if (subRubro) {
					url = `${url}?idSubRubro=${subRubro}`
				}

				try {
					const response = await apiRequest<any>(url);

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Hubo un error al obtener el listado de categorias. Error: ${error}`);
				}
			}

			case "listarClientes": {
				try {
					const ajustesHTTP = getHttpSettings.call(this);
					const clientesURL = `${centumUrl}/Clientes`;

					const fetchOptions: FetchOptions = {
						method: "GET",
						pagination: ajustesHTTP.pagination,
						cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
						intervaloPagina: ajustesHTTP.intervaloPagina,
						itemsField: "Items",
						context: this,
						headers,
					};

					let clientes: IResponseCustomer | IResponseCustomer[] = [];
					const paginated = await apiGetRequest<IResponseCustomer>(clientesURL, fetchOptions);
					clientes = paginated;

					return [this.helpers.returnJsonArray(clientes as any)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarCobros": {
				const idCliente = this.getNodeParameter("clienteId", 0);
				const idCobro = this.getNodeParameter("idCobro", 0);
				const fechaDesde = this.getNodeParameter("startDate", 0, "") as string;
				const fechaHasta = this.getNodeParameter("endDate", 0, "") as string;
				const separarFechaDesde = String(fechaDesde).split("T")[0];
				const separarFechaHasta = String(fechaHasta).split("T")[0];
				if (!idCliente && !separarFechaDesde && !separarFechaHasta && !idCobro) {
					throw new NodeOperationError(this.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
				}

				const body = {
					idCliente,
					fechaDocumentoDesde: separarFechaDesde,
					fechaDocumentoHasta: separarFechaHasta,
					idCobro,
				};

				try {
					const response = await apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
						method: "POST",
						headers,
						body,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en obtener el listado de cobros:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error en obtener el listado de cobros para cliente ${idCliente}: ${errorMessage}`);
				}
			}

			case "listarCompras": {
				const idCliente = this.getNodeParameter("clienteId", 0);
				const idCompra = this.getNodeParameter("idCompra", 0);
				const fechaDesde = this.getNodeParameter("startDate", 0, "") as string;
				const fechaHasta = this.getNodeParameter("endDate", 0, "") as string;
				const separarFechaDesde = String(fechaDesde).split("T")[0];
				const separarFechaHasta = String(fechaHasta).split("T")[0];
				if (!idCliente && !separarFechaDesde && !separarFechaHasta && !idCompra) {
					throw new NodeOperationError(this.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
				}

				const body = {
					idCliente,
					fechaDocumentoDesde: separarFechaDesde,
					fechaDocumentoHasta: separarFechaHasta,
					idCompra,
				};

				try {
					const response = await apiRequest<any>(`${centumUrl}/Compras/FiltrosCompra`, {
						method: "POST",
						headers,
						body,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en obtener el listado de cobros:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error en obtener el listado de cobros para cliente ${idCliente}: ${errorMessage}`);
				}
			}

			case "listarConceptos": {
				let url = `${centumUrl}/Conceptos`;

				try {
					const response = await apiRequest<any>(url, {
						method: "GET",
						headers
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Hubo un error al obtener el listado de conceptos. Error: ${error}`);
				}
			}

			case "listarDepartamentos": {
				const idProvincia = this.getNodeParameter("idProvincia", 0, "") as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idProvincia) {
						queryParams.idProvincia = idProvincia;
					}

					const departamentos = await apiRequest<IDepartamentos[]>(`${centumUrl}/Departamentos`, {
						method: "GET",
						headers,
						queryParams,
					});
					return [this.helpers.returnJsonArray(departamentos.map((d) => ({ ...d })))];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarEstadosPedidosVenta": {
				try {
					const response = await apiRequest<any>(`${centumUrl}/EstadosPedidoVenta?bIncluirTodosEstados=true`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarFacturasCobros": {
				const clientIdParam = this.getNodeParameter("clienteId", 0);
				const desdeSaldoFecha = this.getNodeParameter("startDate", 0);
				const hastaSaldoFecha = this.getNodeParameter("endDate", 0);
				const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
				const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), "clienteId debe ser un número positivo");
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModified (fecha desde) es requerido");
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModifiedSince (fecha hasta) es requerido");
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId,
					};

					const response = await apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
						method: "POST",
						headers,
						body,
					});

					// Validación de la respuesta
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
				}
			}

			case "listarFacturasVenta": {
				const idCliente = this.getNodeParameter('clienteId', 0) as string;
				const idVenta = this.getNodeParameter('ventaId', 0);
				const idSucursal = this.getNodeParameter('sucursalId', 0);
				const idDivisionEmpresa = this.getNodeParameter('divisionEmpresaId', 0);
				const incluirAnulados = this.getNodeParameter('incluirAnulados', 0);
				const idUsuarioCreador = this.getNodeParameter('usuarioCreadorId', 0);
				const idTransporte = this.getNodeParameter('transporteId', 0);
				const idTipoComprobante = this.getNodeParameter('idTipoComprobante', 0);
				const idClienteCuentaCorriente = this.getNodeParameter('cuentaCorrienteId', 0);
				const idVendedor = this.getNodeParameter('idVendedor', 0);
				const idCanalVenta = this.getNodeParameter('canalVentaId', 0);
				const desdeSaldoFecha = this.getNodeParameter("startDate", 0);
				const hastaSaldoFecha = this.getNodeParameter("endDate", 0);

				if (!desdeSaldoFecha || !hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "Las fechas desde y hasta son requeridas");
				}

				const body: Record<string, any> = {
					fechaDocumentoDesde: String(desdeSaldoFecha).split("T")[0],
					fechaDocumentoHasta: String(hastaSaldoFecha).split("T")[0],
				};

				idCliente && (body.idCliente = idCliente);
				idVenta && (body.idVenta = idVenta);
				idSucursal && (body.idSucursal = idSucursal);
				idDivisionEmpresa && (body.idDivisionEmpresa = idDivisionEmpresa);
				idUsuarioCreador && (body.idUsuarioCreador = idUsuarioCreador);
				idTransporte && (body.idTransporte = idTransporte);
				idTipoComprobante && (body.idTipoComprobante = idTipoComprobante);
				idClienteCuentaCorriente && (body.idClienteCuentaCorriente = idClienteCuentaCorriente);
				idVendedor && (body.idVendedor = idVendedor);
				idCanalVenta && (body.idCanalVenta = idCanalVenta);
				incluirAnulados && (body.incluirAnulados = incluirAnulados)

				const response = await apiRequest<any>(`${centumUrl}/Ventas/FiltrosVentaConsulta`, {
					method: "POST",
					headers,
					body,
				});

				if (!response || typeof response !== "object") {
					throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
				}

				return [this.helpers.returnJsonArray(response)];

			}

			case "listarFacturasVentasPorCliente": {
				const clientIdParam = this.getNodeParameter("clienteId", 0);
				const desdeSaldoFecha = this.getNodeParameter("startDate", 0);
				const hastaSaldoFecha = this.getNodeParameter("endDate", 0);
				const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
				const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), "clienteId debe ser un número positivo");
				}

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModified (fecha desde) es requerido");
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModifiedSince (fecha hasta) es requerido");
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						IdCliente: clientId,
					};

					const response = await apiRequest<any>(`${centumUrl}/Ventas/FiltrosVenta`, {
						method: "POST",
						headers,
						body,
					});

					// Validación de la respuesta
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
				}
			}

			case "listarMarcas": {

				try {

					const response = await apiRequest<any>(`${centumUrl}/MarcasArticulo`, {
						method: 'GET',
						headers
					})

					return [this.helpers.returnJsonArray(response)];

				} catch (error) {
					console.log("Error en obtener el listado de marcas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error en obtener el listado de marcas. \n ${errorMessage}`);
				}
			}

			case "listarOrdenesCompra": {
				const idProveedor = this.getNodeParameter("proveedorId", 0);
				const desdeSaldoFecha = this.getNodeParameter("startDate", 0);
				const hastaSaldoFecha = this.getNodeParameter("endDate", 0);
				const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
				const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];

				if (!desdeSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModified (fecha desde) es requerido");
				}

				if (!hastaSaldoFecha) {
					throw new NodeOperationError(this.getNode(), "priceDateModifiedSince (fecha hasta) es requerido");
				}

				try {
					const body = {
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						idProveedor
					};

					const response = await apiRequest<any>(`${centumUrl}/OrdenesCompra/FiltrosOrdenCompra`, {
						method: "POST",
						headers,
						body,
					});

					// Validación de la respuesta
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo ordenes de compra del proveedor ${idProveedor}: ${errorMessage}`);
				}
			}

			case "listarPedidosVenta": {
				const idCliente = this.getNodeParameter("clienteId", 0);
				const idsEstado = this.getNodeParameter("statusId", 0);
				const fechaDesde = this.getNodeParameter("startDate", 0, "") as string;
				const fechaHasta = this.getNodeParameter("endDate", 0, "") as string;
				const separarFechaDesde = String(fechaDesde).split("T")[0];
				const separarFechaHasta = String(fechaHasta).split("T")[0];
				if (!idCliente && !idsEstado && !separarFechaDesde && !separarFechaHasta) {
					throw new NodeOperationError(this.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
				}

				const body = {
					idCliente,
					fechaDocumentoDesde: separarFechaDesde,
					fechaDocumentoHasta: separarFechaHasta,
					idsEstado,
				};

				try {
					const response = await apiRequest<any>(`${centumUrl}/PedidosVenta/FiltrosPedidoVenta`, {
						method: "POST",
						headers,
						body,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo los pedidos ventas para cliente ${idCliente}: ${errorMessage}`);
				}
			}

			case "listarPedidosVentaFiltrados": {
				const idCliente = this.getNodeParameter("clienteId", 0);
				const idsEstado = this.getNodeParameter("statusId", 0);
				const fechaDesde = this.getNodeParameter("startDate", 0, "") as string;
				const fechaHasta = this.getNodeParameter("endDate", 0, "") as string;
				const separarFechaDesde = String(fechaDesde).split("T")[0];
				const separarFechaHasta = String(fechaHasta).split("T")[0];
				if (!idCliente && !idsEstado && !separarFechaDesde && !separarFechaHasta) {
					throw new NodeOperationError(this.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
				}

				const body = {
					idCliente,
					fechaDocumentoDesde: separarFechaDesde,
					fechaDocumentoHasta: separarFechaHasta,
					idsEstado,
				};

				try {
					const response = await apiRequest<any>(`${centumUrl}/PedidosVenta/FiltrosPedidoVentaConsulta`, {
						method: "POST",
						headers,
						body,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo los pedidos ventas para cliente ${idCliente}: ${errorMessage}`);
				}
			}

			case "listarPrecios": {
				try {
					const response = await apiRequest<any>(`${centumUrl}/ListasPrecios`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de promociones para el cliente:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo el listado de precios. \n ${errorMessage}`);
				}
			}

			case "listarProductosDisponibles": {
				const clientId = this.getNodeParameter("clienteId", 0);
				const documentDate: any = this.getNodeParameter("documentDate", 0);
				const IdsRubro = this.getNodeParameter("idsRubros", 0);
				const completeMigration = this.getNodeParameter("migracionCompleta", 0);
				const IdsSubRubro = this.getNodeParameter("idsSubRubros", 0);
				const formattedDocumentDate = documentDate.replace(/\..+/, "");
				const dateModified = this.getNodeParameter("dateModified", 0);
				const dateModifiedImage = this.getNodeParameter("dateModifiedImage", 0);
				const priceDateModified = this.getNodeParameter("priceDateModified", 0);
				const numeroPagina = this.getNodeParameter("numeroPagina", 0);
				const cantidadPorPagina = this.getNodeParameter("cantidadPorPagina", 0);
				const bodyToSend = {
					idCliente: clientId,
					FechaDocumento: formattedDocumentDate,
					incluirAtributosArticulos: true,
					IdsRubro: IdsRubro ? [IdsRubro] : [],
					IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [""],
					fechaModificacionDesde: dateModified ? dateModified : "",
					fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : "",
					fechaPrecioActualizadoDesde: priceDateModified,
					numeroPagina,
					cantidadPorPagina,
				};

				try {
					const response = await apiRequest<IArticulos>(`${centumUrl}/Articulos/Venta`, {
						method: "POST",
						body: bodyToSend,
						headers,
						queryParams: { tipoOrdenArticulos: "Codigo" },
					});

					if (response.Articulos.Items.length > 0) {
						const items = response.Articulos.Items;
						if (!completeMigration) {
							const acc = [];
							for (const item of items) {
								const groupArticle = item.GrupoArticulo;
								if (!groupArticle) continue;

								//  const centumSuiteAccessToken = createHash(
								//  	centumApiCredentials.publicAccessKey as string,
								//  );
								//  const requestHeaders: any = {
								//  	CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
								//  	CentumSuiteAccessToken: centumSuiteAccessToken,
								//  };

								const body = {
									idCliente: clientId,
									FechaDocumento: formattedDocumentDate,
									incluirAtributosArticulos: true,
									IdsRubro: IdsRubro ? [IdsRubro] : [],
									IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [""],
									NombreGrupoArticulo: groupArticle.Nombre,
									IdGrupoArticulo: groupArticle.IdGrupoArticulo,
								};

								try {
									const response = await apiRequest<IArticulos>(`${centumUrl}/Articulos/Venta`, {
										method: "POST",
										headers: { ...headers }, // reusar headers de la primera request
										body,
										queryParams: { tipoOrdenArticulos: "Codigo" },
									});

									if (response.Articulos.Items.length > 0) {
										acc.push(...response.Articulos.Items);
									}
								} catch (error) {
									console.log("Error en solicitud de grupo de artículos", { error });
									const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
									throw new NodeOperationError(this.getNode(), errorMessage);
								}
							}
							const combinedArrays = [...acc, ...items];
							const filteredArray = Array.from(new Map(combinedArrays.map((obj) => [obj.IdArticulo, obj])).values());

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
					console.log("Error en solicitud de artículos", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarProductosPorSucursal": {
				const IdSucursalFisica = this.getNodeParameter("IdSucursalFisica", 0) as string;

				const queryParams: { idsSucursalesFisicas?: string } = {
					idsSucursalesFisicas: IdSucursalFisica,
				};

				if (!IdSucursalFisica) {
					throw new NodeOperationError(this.getNode(), "El id de la sucursal fisica es obligatorio");
				}

				try {
					const dataArticulosExistencias = await apiRequest<any>(`${centumUrl}/ArticulosSucursalesFisicas`, {
						headers,
						queryParams,
					});
					return [this.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarPromocionesCliente": {
				const clientIdParam = this.getNodeParameter("clienteId", 0);
				const documentDate = this.getNodeParameter("documentDate", 0) as string;
				const diaSemana = this.getNodeParameter("diaSemana", 0);
				const clientId = Number(clientIdParam);

				if (!documentDate) {
					throw new NodeOperationError(this.getNode(), "documentDate es requerido");
				}

				const formattedDocumentDate = String(documentDate).split("T")[0];

				try {
					const body = {
						FechaDocumento: formattedDocumentDate,
						IdsCliente: clientId,
						DiaSemana: diaSemana || "",
					};

					const response = await apiRequest<any>(`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`, {
						method: "POST",
						headers,
						body,
					});

					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					if (response.Items && Array.isArray(response.Items)) {
						return [this.helpers.returnJsonArray(response.Items)];
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de promociones para el cliente:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo promociones para el cliente ${clientId}: \n ${errorMessage}`);
				}
			}

			case "listarProvincias": {
				const idPais = this.getNodeParameter("idPais", 0, "") as string;

				try {
					const queryParams: Record<string, string | number | boolean> = {};

					if (idPais) {
						queryParams.idPais = idPais;
					}

					const provincias = await apiRequest<IProvincias[]>(`${centumUrl}/Provincias`, {
						method: "GET",
						headers,
						queryParams,
					});

					return [this.helpers.returnJsonArray(provincias.map((p) => ({ ...p })))];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarProveedores": {
			const codigo = this.getNodeParameter('codigo', 0) as string | undefined;
			const razonSocial = this.getNodeParameter('razonSocial', 0) as string | undefined;
			const cuit = this.getNodeParameter('cuit', 0) as string | undefined;
			const activo = this.getNodeParameter("active", 0) as boolean | undefined;

			// Better filtering function
			const queryParams = Object.fromEntries(
				Object.entries({
					codigo,
					razonSocial,
					cuit,
					activo
				}).filter(([key, value]) => {
					// Debug: log each parameter
					console.log(`Param ${key}:`, value, typeof value);
					
					// Exclude undefined and null
					if (value === undefined || value === null) return false;
					
					// Exclude empty strings (after trimming if it's a string)
					if (typeof value === 'string' && value.trim() === '') return false;
					
					// Include everything else (numbers, booleans, non-empty strings)
					return true;
				})
			);

			console.log('Final queryParams:', queryParams);
			
			try {
				const proveedores = await apiRequest<any>(`${centumUrl}/Proveedores`, {
					method: "GET",
					headers,
					queryParams,
				});
				return [this.helpers.returnJsonArray(proveedores)];
			} catch (err) {
				console.error('Error in listarProveedores:', err);
				throw err; // Don't swallow the error
			}
		}

			case "listarRegimenesEspeciales": {
				try {
					const dataRegimenesList = await apiRequest<any>(`${centumUrl}/RegimenesEspeciales`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(dataRegimenesList)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarRubros": {
				try {
					const response = await apiRequest<any>(`${centumUrl}/Rubros`, {
						method: 'GET',
						headers
					});

					return [this.helpers.returnJsonArray(response)];

				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarSucursales": {
				try {
					const dataListBranches = await apiRequest<any>(`${centumUrl}/SucursalesFisicas`, {
						method: "GET",
						headers,
					});

					return [this.helpers.returnJsonArray(dataListBranches)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarTiposComprobante": {
				try {
					const comprobanteList = await apiRequest<any>(`${centumUrl}/TiposComprobante`, {
						method: "GET",
						headers,
					});

					return [this.helpers.returnJsonArray(comprobanteList)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "listarTodosLosProductos": {
				try {
					const ajustesHTTP = getHttpSettings.call(this);
					const articulosURL = `${centumUrl}/Articulos/DatosGenerales`;

					const fetchOptions: FetchOptions = {
						method: "POST",
						headers,
						body: {},
						queryParams: { tipoOrdenArticulos: "Nombre" },
						pagination: ajustesHTTP.pagination,
						cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
						intervaloPagina: ajustesHTTP.intervaloPagina,
					};
					const paginated = await apiPostRequestPaginated<IArticulos>(articulosURL, fetchOptions);
					return [this.helpers.returnJsonArray(paginated as any)];
				} catch (error) {
					console.log("Error en solicitud de artículos", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case 'listarTurnosEntrega': {
				try {
					const turnoEntrega = await apiRequest<any>(`${centumUrl}/TurnosEntrega`, {
						method: 'GET',
						headers
					})
					return [this.helpers.returnJsonArray(turnoEntrega)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo los turnos de entrega: ${errorMessage}`);
				}
			}

			case 'listarVendedores': {
				try {
					const turnoEntrega = await apiRequest<any>(`${centumUrl}/Vendedores`, {
						method: 'GET',
						headers
					})
					return [this.helpers.returnJsonArray(turnoEntrega)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo los vendedores: ${errorMessage}`);
				}
			}


			case "registrarCobro": {
				const ordenCliente = this.getNodeParameter("cliente", 0);
				const ordenArticulo = this.getNodeParameter("articulo", 0);
				const ordenEnvio = this.getNodeParameter("envio", 0);
				const bodyCharge = createChargeJson(ordenCliente as Cliente, ordenArticulo as LineItem[], ordenEnvio as ShippingLine[]);

				try {
					const dataCobros = await apiRequest<any>(`${centumUrl}/Cobros`, {
						method: "POST",
						body: bodyCharge,
						headers,
					});

					return [this.helpers.returnJsonArray(dataCobros)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "sincronizarImagenes": {
				const dataImages = this.getNodeParameter("dataImg", 0) as {
					json: {
						idArticulo: number;
						images: any[];
						infoImages: { lastModified: string; orderNumber: number }[];
					};
				}[];
				const db = this.getNodeParameter("lastModifiedImg", 0) as {
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
							const currentImageInDB = articleInDB.dataImage.find((dataImageDB) => dataImageDB.orderNumber === currentInfoImage.orderNumber);

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

			case "verDetalleOrdenCompra": {
				const ordenCompraId = this.getNodeParameter("idCompra", 0);

				if (!ordenCompraId) {
					throw new NodeOperationError(this.getNode(), "El id de la compra es requerido");
				}

				try {
					let url = `${centumUrl}/OrdenesCompra/${ordenCompraId}`;

					const response = await apiRequest<any>(`${url}`, {
						method: "GET",
						headers
					});

					// Validación de la respuesta
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					console.log("Error en solicitud de facturas pedidos ventas:", error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo la orden de compra con el id ${ordenCompraId}: ${errorMessage}`);
				}
			}

			case "verDetallePedidoVenta": {
				const pedidoID = this.getNodeParameter("id", 0);
				try {
					const dataActividad = await apiRequest<any>(`${centumUrl}/PedidosVenta/${pedidoID}`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(dataActividad)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "verDetalleRegimenEspecial": {
				const regimenId = this.getNodeParameter("id", 0);
				if (!regimenId) {
					throw new NodeOperationError(this.getNode(), "El ID del regimen es requerido");
				}

				try {
					const regimen = await apiRequest<any>(`${centumUrl}/RegimenesEspeciales/${regimenId}`, {
						method: "GET",
						headers,
					});
					return [this.helpers.returnJsonArray(regimen)];
				} catch (error) {
					console.log(error);
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			case "verDetalleSaldoCliente": {
				const clientIdParam = this.getNodeParameter("clienteId", 0);
				const desdeSaldoFecha = this.getNodeParameter("priceDateModified", 0);
				const separarFecha = String(desdeSaldoFecha).split("T")[0];

				// Validación de parámetros
				const clientId = Number(clientIdParam);
				if (isNaN(clientId) || clientId <= 0) {
					throw new NodeOperationError(this.getNode(), "clienteId debe ser un número positivo");
				}

				try {
					let url = `${centumUrl}/SaldosCuentasCorrientes/Composicion/${clientId}`;
					if (separarFecha) {
						url += `?fechaVencimientoHasta=${separarFecha}`;
					}

					const response = await apiRequest<any>(url, {
						method: "GET",
						headers,
					});

					// Validación de la respuesta
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(this.getNode(), "Respuesta inválida del servidor");
					}

					return [this.helpers.returnJsonArray(response)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), `Error obteniendo composición de saldo para cliente ${clientId}: ${errorMessage}`);
				}
			}

			case "verificarCredencialesOperador": {
				const username = this.getNodeParameter("username", 0, "") as string;
				const password = this.getNodeParameter("password", 0, "") as string;

				try {
					const operadoresActividad = await apiRequest<any>(
						`
						${centumUrl}/OperadoresMoviles/Credenciales?Usuario=${username}&Contrasena=${password}`,
						{
							method: "GET",
							headers,
						},
					);
					return [this.helpers.returnJsonArray(operadoresActividad)];
				} catch (error) {
					const errorMessage = error?.response?.data?.Message || error.message || "Error desconocido";
					throw new NodeOperationError(this.getNode(), errorMessage);
				}
			}

			default: {
				throw new NodeOperationError(this.getNode(), `Operación no implementada: ${resource}`);
			}
		}
	}
}
