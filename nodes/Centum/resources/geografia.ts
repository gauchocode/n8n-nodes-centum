import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const listarMunicipios: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idProvincia = executeFunctions.getNodeParameter("idProvincia", 0, "") as string;
	
					try {
						const queryParams: Record<string, string | number | boolean> = {};
	
						if (idProvincia) {
							queryParams.idProvincia = idProvincia;
						}
	
						const departamentos = await helperFns.apiRequest<any[]>(`${centumUrl}/Departamentos`, {
							method: "GET",
							headers,
							queryParams,
						});
						return [executeFunctions.helpers.returnJsonArray(departamentos.map((d) => ({ ...d })))];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarPaises: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Paises`, {
							headers,
							method: "GET",
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en obtener el listado de paises:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo el listado de paises: ${errorMessage}`);
					}
				
};

const listarProvincias: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idPais = executeFunctions.getNodeParameter("idPais", 0, "") as string;
	
					try {
						const queryParams: Record<string, string | number | boolean> = {};
	
						if (idPais) {
							queryParams.idPais = idPais;
						}
	
						const provincias = await helperFns.apiRequest<any[]>(`${centumUrl}/Provincias`, {
							method: "GET",
							headers,
							queryParams,
						});
	
						return [executeFunctions.helpers.returnJsonArray(provincias.map((p) => ({ ...p })))];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

export const geografiaHandlers: ResourceHandlerMap = {
	listarMunicipios,
	listarPaises,
	listarProvincias,
};
