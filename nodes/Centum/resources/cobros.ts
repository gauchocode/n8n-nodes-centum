import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const registrarCobro: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const ordenCliente = helperFns.getNodeParameterOrThrow(executeFunctions, "cliente", itemIndex);
	const ordenArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "articulo", itemIndex);
	const ordenEnvio = helperFns.getNodeParameterOrThrow(executeFunctions, "envio", itemIndex);
	const bodyCharge = helperFns.createChargeJson(ordenCliente as any, ordenArticulo as any[], ordenEnvio as any[]);

	try {
		const dataCobros = await helperFns.apiRequest<any>(`${centumUrl}/Cobros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			body: bodyCharge,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(dataCobros)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarCobros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idCliente = helperFns.getNodeParameterOrThrow(executeFunctions, "clienteId", itemIndex);
	const idCobro = helperFns.getNodeParameterOrThrow(executeFunctions, "idCobro", itemIndex);
	const fechaDesde = helperFns.getNodeParameterOrThrow(executeFunctions, "startDate", itemIndex, "") as string;
	const fechaHasta = helperFns.getNodeParameterOrThrow(executeFunctions, "endDate", itemIndex, "") as string;
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
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de cobros para cliente ${idCliente}: ${errorMessage}`);
	}
};

const listarFacturasCobros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientIdParam = helperFns.getNodeParameterOrThrow(executeFunctions, "clienteId", itemIndex);
	const desdeSaldoFecha = helperFns.getNodeParameterOrThrow(executeFunctions, "startDate", itemIndex);
	const hastaSaldoFecha = helperFns.getNodeParameterOrThrow(executeFunctions, "endDate", itemIndex);
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
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo facturas pedidos ventas para cliente ${clientId}: ${errorMessage}`);
	}
};

export const cobrosHandlers: ResourceHandlerMap = {
	registrarCobro,
	listarCobros,
	listarFacturasCobros,
};
