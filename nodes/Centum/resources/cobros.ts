import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const registrarCobro: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const ordenCliente = executeFunctions.getNodeParameter("cliente", 0);
					const ordenArticulo = executeFunctions.getNodeParameter("articulo", 0);
					const ordenEnvio = executeFunctions.getNodeParameter("envio", 0);
					const bodyCharge = helperFns.createChargeJson(ordenCliente as any, ordenArticulo as any[], ordenEnvio as any[]);
	
					try {
						const dataCobros = await helperFns.apiRequest<any>(`${centumUrl}/Cobros`, {
							method: "POST",
							body: bodyCharge,
							headers,
						});
	
						return [executeFunctions.helpers.returnJsonArray(dataCobros)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarCobros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idCliente = executeFunctions.getNodeParameter("clienteId", 0);
					const idCobro = executeFunctions.getNodeParameter("idCobro", 0);
					const fechaDesde = executeFunctions.getNodeParameter("startDate", 0, "") as string;
					const fechaHasta = executeFunctions.getNodeParameter("endDate", 0, "") as string;
					const separarFechaDesde = String(fechaDesde).split("T")[0];
					const separarFechaHasta = String(fechaHasta).split("T")[0];
					if (!idCliente && !separarFechaDesde && !separarFechaHasta && !idCobro) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
					}
	
					const body = {
						idCliente,
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						idCobro,
					};
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
							method: "POST",
							headers,
							body,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en obtener el listado de cobros:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de cobros para cliente ${idCliente}: ${errorMessage}`);
					}
				
};

const listarFacturasCobros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const clientIdParam = executeFunctions.getNodeParameter("clienteId", 0);
					const desdeSaldoFecha = executeFunctions.getNodeParameter("startDate", 0);
					const hastaSaldoFecha = executeFunctions.getNodeParameter("endDate", 0);
					const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
					const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];
	
					// Validación de parámetros
					const clientId = Number(clientIdParam);
					if (isNaN(clientId) || clientId <= 0) {
						throw new NodeOperationError(executeFunctions.getNode(), "clienteId debe ser un número positivo");
					}
	
					if (!desdeSaldoFecha) {
						throw new NodeOperationError(executeFunctions.getNode(), "priceDateModified (fecha desde) es requerido");
					}
	
					if (!hastaSaldoFecha) {
						throw new NodeOperationError(executeFunctions.getNode(), "priceDateModifiedSince (fecha hasta) es requerido");
					}
	
					try {
						const body = {
							fechaDocumentoDesde: separarFechaDesde,
							fechaDocumentoHasta: separarFechaHasta,
							IdCliente: clientId,
						};
	
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
							method: "POST",
							headers,
							body,
						});
	
						// Validación de la respuesta
						if (!response || typeof response !== "object") {
							throw new NodeOperationError(executeFunctions.getNode(), "Respuesta inválida del servidor");
						}
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de facturas pedidos ventas:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
					}
				
};

export const cobrosHandlers: ResourceHandlerMap = {
	registrarCobro,
	listarCobros,
	listarFacturasCobros,
};
