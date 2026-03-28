import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const generarTokenSeguridad: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const tokenGenerado = helperFns.createHash(headers.publicAccessKey);

		return [executeFunctions.helpers.returnJsonArray([{ token: tokenGenerado }])];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarBonificaciones: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const bonificaciones = await helperFns.apiRequest<any>(`${centumUrl}/Bonificaciones`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray([bonificaciones])];
	} catch (error) {
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	let url = `${centumUrl}/Conceptos`;

	try {
		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		throw new NodeOperationError(executeFunctions.getNode(), `Hubo un error al obtener el listado de conceptos. Error: ${error}`);
	}
};

const listarRegimenesEspeciales: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const dataRegimenesList = await helperFns.apiRequest<any>(`${centumUrl}/RegimenesEspeciales`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(dataRegimenesList)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const verDetalleRegimenEspecial: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const regimenId = helperFns.getNodeParameterOrThrow(executeFunctions, "id", itemIndex);
	if (!regimenId) {
		throw new NodeOperationError(executeFunctions.getNode(), "El ID del regimen es requerido");
	}

	try {
		const regimen = await helperFns.apiRequest<any>(`${centumUrl}/RegimenesEspeciales/${regimenId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(regimen)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarTiposComprobante: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const comprobanteList = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobante`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(comprobanteList)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarVendedores: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const turnoEntrega = await helperFns.apiRequest<any>(`${centumUrl}/Vendedores`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const username = helperFns.getNodeParameterOrThrow(executeFunctions, "username", itemIndex) as string;
	const email = helperFns.getNodeParameterOrThrow(executeFunctions, "email", itemIndex) as string;

	const searchParams = new URLSearchParams();
	if (username) {
		searchParams.set("usuario", username);
	}
	if (email) {
		searchParams.set("email", email);
	}
	const params = searchParams.toString() ? `?${searchParams.toString()}` : "";

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/OperadoresMoviles${params}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: "GET",
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (err) {
		const errorMessage = err?.response?.data?.Message || (err as any).message || "Error Desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de marcas. \n ${errorMessage}`);
	}
};

const verificarCredencialesOperador: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const username = helperFns.getNodeParameterOrThrow(executeFunctions, "username", itemIndex, "") as string;
	try {
		const operadoresActividad = await helperFns.apiRequest<any>(`${centumUrl}/OperadoresMoviles?Usuario=${username}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
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
