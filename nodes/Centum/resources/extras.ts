import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const generarTokenSeguridad: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const tokenGenerado = helperFns.createHash(headers.publicAccessKey);
	
						return [executeFunctions.helpers.returnJsonArray(tokenGenerado as any)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarBonificaciones: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const bonificaciones = await helperFns.apiRequest<any>(`${centumUrl}/Bonificaciones`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray([bonificaciones])];
					} catch (error) {
						console.error("Error al obtener las bonificaciones:", error);
						const statusCode = error?.response?.status;
						const responseData = error?.response?.data;
						const errorMessage = responseData?.Message || responseData?.message || (error as any)?.message || "Error desconocido al crear el contribuyente.";
						const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;
						throw new NodeOperationError(executeFunctions.getNode(), fullMessage, {
							description: responseData?.Detail || "Ocurrió un error inesperado al llamar a la API de Centum.",
						});
					}
				
};

const listarConceptos: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					let url = `${centumUrl}/Conceptos`;
	
					try {
						const response = await helperFns.apiRequest<any>(url, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						throw new NodeOperationError(executeFunctions.getNode(), `Hubo un error al obtener el listado de conceptos. Error: ${error}`);
					}
				
};

const listarRegimenesEspeciales: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const dataRegimenesList = await helperFns.apiRequest<any>(`${centumUrl}/RegimenesEspeciales`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(dataRegimenesList)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const verDetalleRegimenEspecial: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const regimenId = executeFunctions.getNodeParameter("id", 0);
					if (!regimenId) {
						throw new NodeOperationError(executeFunctions.getNode(), "El ID del regimen es requerido");
					}
	
					try {
						const regimen = await helperFns.apiRequest<any>(`${centumUrl}/RegimenesEspeciales/${regimenId}`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(regimen)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarTiposComprobante: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const comprobanteList = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobante`, {
							method: "GET",
							headers,
						});
	
						return [executeFunctions.helpers.returnJsonArray(comprobanteList)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarVendedores: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const turnoEntrega = await helperFns.apiRequest<any>(`${centumUrl}/Vendedores`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(turnoEntrega)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo los vendedores: ${errorMessage}`);
					}
				
};

const listarOperadoresMoviles: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const username = executeFunctions.getNodeParameter("username", 0) as string;
					const email = executeFunctions.getNodeParameter("email", 0) as string;
	
					let params = "";
					if (username) {
						params = `?usuario=${username}`;
					}
					if (email) {
						params = `?email=${email}`;
					}
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/OperadoresMoviles${params}`, {
							headers,
							method: "GET",
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (err) {
						console.log("Error al obtener el listado de operadores moviles.", err);
						const errorMessage = err?.response?.data?.Message || (err as any).message || "Error Desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de marcas. \n ${errorMessage}`);
					}
				
};

const verificarCredencialesOperador: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const username = executeFunctions.getNodeParameter("username", 0, "") as string;
					try {
						const operadoresActividad = await helperFns.apiRequest<any>(
							`
							${centumUrl}/OperadoresMoviles?Usuario=${username}`,
							{
								method: "GET",
								headers,
							},
						);
						return [executeFunctions.helpers.returnJsonArray(operadoresActividad)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

export const extrasHandlers: ResourceHandlerMap = {
	generarTokenSeguridad,
	listarBonificaciones,
	listarConceptos,
	listarRegimenesEspeciales,
	verDetalleRegimenEspecial,
	listarTiposComprobante,
	listarVendedores,
	listarOperadoresMoviles,
	verificarCredencialesOperador,
};
