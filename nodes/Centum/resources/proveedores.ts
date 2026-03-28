import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const buscarProveedor: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const proveedorId = helperFns.getNodeParameterOrThrow(executeFunctions, "proveedorId", itemIndex);

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/${proveedorId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const codigo = helperFns.getNodeParameterOrThrow(executeFunctions, "codigoArticulo", itemIndex, "") as string;
	const razonSocial = helperFns.getNodeParameterOrThrow(executeFunctions, "razonSocial", itemIndex, "") as string;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, "cuit", itemIndex);
	const provincia = helperFns.getNodeParameterOrThrow(executeFunctions, "idProvincia", itemIndex);
	const pais = helperFns.getNodeParameterOrThrow(executeFunctions, "idPais", itemIndex);
	const condicionIVA = helperFns.getNodeParameterOrThrow(executeFunctions, "condicionIVA", itemIndex, "") as string;
	const formaPagoProveedor = helperFns.getNodeParameterOrThrow(executeFunctions, "formaPagoProveedor", itemIndex);
	const condicionPago = helperFns.getNodeParameterOrThrow(executeFunctions, "condicionDePago", itemIndex);
	const categoriaImpuestoGanancias = helperFns.getNodeParameterOrThrow(executeFunctions, "categoriaImpuestosGanancias", itemIndex);
	const claseProveedor = helperFns.getNodeParameterOrThrow(executeFunctions, "claseProveedor", itemIndex);
	const activo = helperFns.getNodeParameterOrThrow(executeFunctions, "active", itemIndex);
	const idOperadorCompra = helperFns.getNodeParameterOrThrow(executeFunctions, "idOperadorCompra", itemIndex);
	const idZona = helperFns.getNodeParameterOrThrow(executeFunctions, "idZona", itemIndex);
	const idDescuentoProveedor = helperFns.getNodeParameterOrThrow(executeFunctions, "idDescuentoProveedor", itemIndex);

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
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const codigo = helperFns.getNodeParameterOrThrow(executeFunctions, "codigo", itemIndex) as string | undefined;
	const razonSocial = helperFns.getNodeParameterOrThrow(executeFunctions, "razonSocial", itemIndex) as string | undefined;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, "cuit", itemIndex) as string | undefined;
	const activo = helperFns.getNodeParameterOrThrow(executeFunctions, "active", itemIndex) as boolean | undefined;

	// Better filtering function
	const queryParams = Object.fromEntries(
		Object.entries({
			codigo,
			razonSocial,
			cuit,
			activo,
		}).filter(([, value]) => {
			// Debug: log each parameter

			// Exclude undefined and null
			if (value === undefined || value === null) return false;

			// Exclude empty strings (after trimming if it's a string)
			if (typeof value === "string" && value.trim() === "") return false;

			// Include everything else (numbers, booleans, non-empty strings)
			return true;
		}),
	);

	try {
		const proveedores = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(proveedores)];
	} catch (err) {
		throw err;
	}
};

export const proveedoresHandlers: ResourceHandlerMap = {
	buscarProveedor,
	crearProveedor,
	listarProveedores,
};
