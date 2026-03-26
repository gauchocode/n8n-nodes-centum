import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const buscarProveedor: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const proveedorId = executeFunctions.getNodeParameter("proveedorId", 0);
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/${proveedorId}`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const crearProveedor: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const codigo = executeFunctions.getNodeParameter("codigoArticulo", 0, "") as string;
					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0, "") as string;
					const cuit = executeFunctions.getNodeParameter("cuit", 0);
					const provincia = executeFunctions.getNodeParameter("idProvincia", 0);
					const pais = executeFunctions.getNodeParameter("idPais", 0);
					const condicionIVA = executeFunctions.getNodeParameter("condicionIVA", 0, "") as string;
					const formaPagoProveedor = executeFunctions.getNodeParameter("formaPagoProveedor", 0);
					const condicionPago = executeFunctions.getNodeParameter("condicionDePago", 0);
					const categoriaImpuestoGanancias = executeFunctions.getNodeParameter("categoriaImpuestosGanancias", 0);
					const claseProveedor = executeFunctions.getNodeParameter("claseProveedor", 0);
					const activo = executeFunctions.getNodeParameter("active", 0);
					const idOperadorCompra = executeFunctions.getNodeParameter("idOperadorCompra", 0);
					const idZona = executeFunctions.getNodeParameter("idZona", 0);
					const idDescuentoProveedor = executeFunctions.getNodeParameter("idDescuentoProveedor", 0);
	
					const body = {
						Codigo: codigo,
						RazonSocial: razonSocial,
						CUIT: cuit,
						Provincia: {
							IdProvincia: provincia,
						},
						Pais: {
							IdPais: pais,
						},
						CondicionIVA: {
							IdCondicionIVA: condicionIVA,
						},
						FormaPagoProveedor: {
							IdFormaPagoProveedor: formaPagoProveedor,
						},
						CondicionPago: {
							IdCondicionPago: condicionPago,
						},
						CategoriaImpuestoGanancias: {
							IdCategoriaImpuestoGanancia: categoriaImpuestoGanancias,
						},
						ClaseProveedor: {
							IdClaseProveedor: claseProveedor,
						},
						OperadorCompra: {
							IdOperadorCompra: idOperadorCompra,
						},
						Activo: activo,
						Zona: {
							IdZona: idZona,
						},
						DescuentoProveedor: {
							IdDescuentoProveedor: idDescuentoProveedor,
						},
					};
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/`, {
							method: "POST",
							headers,
							body,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarProveedores: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const codigo = executeFunctions.getNodeParameter("codigo", 0) as string | undefined;
					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0) as string | undefined;
					const cuit = executeFunctions.getNodeParameter("cuit", 0) as string | undefined;
					const activo = executeFunctions.getNodeParameter("active", 0) as boolean | undefined;
	
					// Better filtering function
					const queryParams = Object.fromEntries(
						Object.entries({
							codigo,
							razonSocial,
							cuit,
							activo,
						}).filter(([key, value]) => {
							// Debug: log each parameter
							console.log(`Param ${key}:`, value, typeof value);
	
							// Exclude undefined and null
							if (value === undefined || value === null) return false;
	
							// Exclude empty strings (after trimming if it's a string)
							if (typeof value === "string" && value.trim() === "") return false;
	
							// Include everything else (numbers, booleans, non-empty strings)
							return true;
						}),
					);
	
					console.log("Final queryParams:", queryParams);
	
					try {
						const proveedores = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores`, {
							method: "GET",
							headers,
							queryParams,
						});
						return [executeFunctions.helpers.returnJsonArray(proveedores)];
					} catch (err) {
						console.error("Error in listarProveedores:", err);
						throw err; // Don't swallow the error
					}
				
};

export const proveedoresHandlers: ResourceHandlerMap = {
	buscarProveedor,
	crearProveedor,
	listarProveedores,
};
