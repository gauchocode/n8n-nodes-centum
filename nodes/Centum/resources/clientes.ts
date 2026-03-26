import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const actualizarCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const nuevosDatos = executeFunctions.getNodeParameter("cuerpoHTTP", 0);
					try {
						const updateCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
							method: "POST",
							body: nuevosDatos,
							headers,
						});
	
						return [executeFunctions.helpers.returnJsonArray(updateCustomer)];
					} catch (error) {
						console.log(error);
						return [executeFunctions.helpers.returnJsonArray([])];
					}
				
};

const buscarClientes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const codigo = executeFunctions.getNodeParameter("codigoCliente", 0, "") as string;
					const cuit = executeFunctions.getNodeParameter("cuit", 0, "") as string;
					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0, "") as string;
	
					if (!codigo && !cuit && !razonSocial) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debe proporcionar al menos un campo para la búsqueda (CUIT, Codigo o Razón Social).");
					}
	
					const queryParams: Record<string, string> = {};
					if (cuit) queryParams.Cuit = cuit;
					if (codigo) queryParams.codigo = codigo;
					if (razonSocial) queryParams.RazonSocial = razonSocial;
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
							method: "GET",
							headers,
							queryParams,
						});
						console.log(response);
						return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
					} catch (error) {
						console.log(`[ClientesBusqueda] Error:`, error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const buscarClientePorCuit: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const cuit = executeFunctions.getNodeParameter("cuit", 0, "") as string;
	
					if (!cuit) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debe proporcionar CUIT para buscar clientes.");
					}
	
					const queryParams: Record<string, string> = { Cuit: cuit };
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
							method: "GET",
							headers,
							queryParams,
						});
	
						return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
					} catch (error) {
						console.log(`[ClientesBusquedaPorCuit] Error:`, error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarClientes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const ajustesHTTP = helperFns.getHttpSettings.call(executeFunctions);
						const clientesURL = `${centumUrl}/Clientes`;
	
						const fetchOptions: any = {
							method: "GET",
							pagination: ajustesHTTP.pagination,
							cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
							intervaloPagina: ajustesHTTP.intervaloPagina,
							itemsField: "Items",
							context: executeFunctions,
							headers,
						};
	
						let clientes: any | any[] = [];
						const paginated = await helperFns.apiGetRequest<any>(clientesURL, fetchOptions);
						clientes = paginated;
	
						return [executeFunctions.helpers.returnJsonArray(clientes as any)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const crearCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0);
					const cuit = executeFunctions.getNodeParameter("cuit", 0);
					const provincia = executeFunctions.getNodeParameter("idProvincia", 0);
					const pais = executeFunctions.getNodeParameter("idPais", 0);
					const zona = executeFunctions.getNodeParameter("idZona", 0);
					const condicionIVA = executeFunctions.getNodeParameter("condicionIVA", 0);
					const condicionVentaId = executeFunctions.getNodeParameter("idCondicionVenta", 0);
					const bonificacionId = executeFunctions.getNodeParameter("idBonificacion", 0);
	
					try {
						const crearCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
							method: "POST",
							headers,
							body: {
								RazonSocial: razonSocial,
								CUIT: cuit,
								Provincia: {
									IdProvincia: provincia,
								},
								Pais: {
									IdPais: pais,
								},
								Zona: {
									IdZona: zona,
								},
								CondicionIVA: {
									IdCondicionIVA: condicionIVA,
								},
								CondicionVenta: {
									IdCondicionVenta: condicionVentaId,
								},
								Vendedor: {
									IdVendedor: 2, //Esto hay que reemplazarlo por el body entero del vendedor
								},
								Transporte: {
									IdTransporte: 1,
								},
								Bonificacion: {
									IdBonificacion: bonificacionId,
								},
								LimiteCredito: {
									IdLimiteCredito: 46002,
								},
								ClaseCliente: {
									IdClaseCliente: 6087,
								},
								FrecuenciaCliente: {
									IdFrecuenciaCliente: 6891,
								},
								CanalCliente: {
									IdCanalCliente: 6904,
								},
								CadenaCliente: {
									IdCadenaCliente: 6920,
								},
								UbicacionCliente: {
									IdUbicacionCliente: 6942,
								},
								EdadesPromedioConsumidoresCliente: {
									IdEdadesPromedioConsumidoresCliente: 6951,
								},
								GeneroPromedioConsumidoresCliente: {
									IdGeneroPromedioConsumidoresCliente: 6964,
								},
								DiasAtencionCliente: {
									IdDiasAtencionCliente: 6969,
								},
								HorarioAtencionCliente: {
									IdHorarioAtencionCliente: 6970,
								},
								CigarreraCliente: {
									IdCigarreraCliente: 6972,
								},
							},
						});
						return [executeFunctions.helpers.returnJsonArray(crearCliente)];
					} catch (error) {
						console.log(error);
						throw new NodeOperationError(executeFunctions.getNode(), `Error al obtener la informacion de los articulos ${error}`);
					}
				
};

const buscarContribuyente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const cuit = executeFunctions.getNodeParameter("cuit", 0, "") as string;
					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0, "") as string;
	
					if (!cuit && !razonSocial) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debe proporcionar al menos CUIT o Razón Social para buscar contribuyentes.");
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
	
						const response = await helperFns.apiRequest<any>(requestDetails.url, {
							method: "GET",
							headers: requestDetails.headers,
							queryParams: requestDetails.queryParams,
						});
						console.log(`[BuscarContribuyente] Response:`, JSON.stringify(response, null, 2));
						if (response.CantidadTotalItems === 1) {
							return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
						}
	
						return [executeFunctions.helpers.returnJsonArray(response as any)];
					} catch (error) {
						console.log(`[BuscarContribuyente] Error:`, error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const crearContribuyente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const bodyJson = executeFunctions.getNodeParameter("cuerpoHTTP", 0) as any;
					const cuit = executeFunctions.getNodeParameter("cuit", 0);
					console.log(bodyJson);
	
					if (typeof cuit !== "string" || !/^\d{11}$/.test(cuit)) {
						throw new NodeOperationError(executeFunctions.getNode(), "El CUIT debe ser una cadena de 11 dígitos numéricos.");
					}
	
					const contribuyenteJSON = helperFns.createContribuyenteJson(bodyJson, cuit);
	
					try {
						const crearCliente = await helperFns.apiRequest(`${centumUrl}/Clientes`, {
							method: "POST",
							body: contribuyenteJSON,
							headers,
						});
	
						console.log("Contribuyente creado:", crearCliente);
						return [executeFunctions.helpers.returnJsonArray([crearCliente as any])];
					} catch (error: any) {
						console.error("Error al crear contribuyente:", error);
	
						const statusCode = error?.response?.status;
						const responseData = error?.response?.data;
						const errorMessage = responseData?.Message || responseData?.message || (error as any)?.message || "Error desconocido al crear el contribuyente.";
	
						const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;
	
						throw new NodeOperationError(executeFunctions.getNode(), fullMessage, {
							description: responseData?.Detail || "Ocurrió un error inesperado al llamar a la API de Centum.",
						});
					}
				
};

const consultarSaldoCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const clientIdParam = executeFunctions.getNodeParameter("clienteId", 0);
					const desdeSaldoFecha = executeFunctions.getNodeParameter("priceDateModified", 0);
					const soloFecha = String(desdeSaldoFecha).split("T")[0];
	
					// Validación de parámetros
					const clientId = Number(clientIdParam);
					if (isNaN(clientId) || clientId <= 0) {
						throw new NodeOperationError(executeFunctions.getNode(), "clienteId debe ser un número positivo");
					}
	
					try {
						let url = `${centumUrl}/SaldosCuentasCorrientes/${clientId}`;
						if (soloFecha) {
							url += `?fechaVencimientoHasta=${soloFecha}`;
						}
	
						const response = await helperFns.apiRequest<any>(url, {
							method: "GET",
							headers,
						});
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo saldo para cliente ${clientId}: ${errorMessage}`);
					}
				
};

const verDetalleSaldoCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const clientIdParam = executeFunctions.getNodeParameter("clienteId", 0);
					const hastaSaldoFecha = executeFunctions.getNodeParameter("priceDateModified", 0);
					const separarFecha = String(hastaSaldoFecha).split("T")[0];
	
					// Validación de parámetros
					const clientId = Number(clientIdParam);
					if (isNaN(clientId) || clientId <= 0) {
						throw new NodeOperationError(executeFunctions.getNode(), "clienteId debe ser un número positivo");
					}
	
					try {
						let url = `${centumUrl}/SaldosCuentasCorrientes/Composicion/${clientId}`;
						if (separarFecha) {
							url += `?fechaVencimientoHasta=${separarFecha}`;
						}
	
						const response = await helperFns.apiRequest<any>(url, {
							method: "GET",
							headers,
						});
	
						// Validación de la respuesta
						if (!response || typeof response !== "object") {
							throw new NodeOperationError(executeFunctions.getNode(), "Respuesta inválida del servidor");
						}
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo composición de saldo para cliente ${clientId}: ${errorMessage}`);
					}
				
};

const listarPromocionesComercialesCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const clientIdParam = executeFunctions.getNodeParameter("clienteId", 0);
					const documentDate = executeFunctions.getNodeParameter("documentDate", 0) as string;
					const diaSemana = executeFunctions.getNodeParameter("diaSemana", 0);
					const clientId = Number(clientIdParam);
	
					if (!documentDate) {
						throw new NodeOperationError(executeFunctions.getNode(), "documentDate es requerido");
					}
	
					const formattedDocumentDate = String(documentDate).split("T")[0];
	
					try {
						const body = {
							FechaDocumento: formattedDocumentDate,
							IdsCliente: clientId,
							DiaSemana: diaSemana || "",
						};
	
						const response = await helperFns.apiRequest<any>(`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`, {
							method: "POST",
							headers,
							body,
						});
	
						if (!response || typeof response !== "object") {
							throw new NodeOperationError(executeFunctions.getNode(), "Respuesta inválida del servidor");
						}
	
						if (response.Items && Array.isArray(response.Items)) {
							return [executeFunctions.helpers.returnJsonArray(response.Items)];
						}
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de promociones para el cliente:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo promociones para el cliente ${clientId}: \n ${errorMessage}`);
					}
				
};

const frecuenciasCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const frecuenciasCliente = await helperFns.apiRequest<any>(`${centumUrl}/FrecuenciasCliente`, {
							headers,
						});
	
						return [executeFunctions.helpers.returnJsonArray(frecuenciasCliente)];
					} catch (error) {
						console.log("ArticulosExistencias error: ", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

export const clientesHandlers: ResourceHandlerMap = {
	actualizarCliente,
	buscarClientes,
	buscarClientePorCuit,
	listarClientes,
	crearCliente,
	buscarContribuyente,
	crearContribuyente,
	consultarSaldoCliente,
	verDetalleSaldoCliente,
	listarPromocionesComercialesCliente,
	frecuenciasCliente,
};
