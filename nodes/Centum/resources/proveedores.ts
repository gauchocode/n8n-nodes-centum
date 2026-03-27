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

	const proveedorId = executeFunctions.getNodeParameter("proveedorId", itemIndex);

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

	const codigo = executeFunctions.getNodeParameter("codigoArticulo", itemIndex, "") as string;
	const razonSocial = executeFunctions.getNodeParameter("razonSocial", itemIndex, "") as string;
	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex);
	const provincia = executeFunctions.getNodeParameter("idProvincia", itemIndex);
	const pais = executeFunctions.getNodeParameter("idPais", itemIndex);
	const condicionIVA = executeFunctions.getNodeParameter("condicionIVA", itemIndex, "") as string;
	const formaPagoProveedor = executeFunctions.getNodeParameter("formaPagoProveedor", itemIndex);
	const condicionPago = executeFunctions.getNodeParameter("condicionDePago", itemIndex);
	const categoriaImpuestoGanancias = executeFunctions.getNodeParameter("categoriaImpuestosGanancias", itemIndex);
	const claseProveedor = executeFunctions.getNodeParameter("claseProveedor", itemIndex);
	const activo = executeFunctions.getNodeParameter("active", itemIndex);
	const idOperadorCompra = executeFunctions.getNodeParameter("idOperadorCompra", itemIndex);
	const idZona = executeFunctions.getNodeParameter("idZona", itemIndex);
	const idDescuentoProveedor = executeFunctions.getNodeParameter("idDescuentoProveedor", itemIndex);

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

	const codigo = executeFunctions.getNodeParameter("codigo", itemIndex) as string | undefined;
	const razonSocial = executeFunctions.getNodeParameter("razonSocial", itemIndex) as string | undefined;
	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex) as string | undefined;
	const activo = executeFunctions.getNodeParameter("active", itemIndex) as boolean | undefined;

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
