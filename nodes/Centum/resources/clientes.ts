import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const actualizarCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const nuevosDatos = executeFunctions.getNodeParameter("cuerpoHTTP", itemIndex);
	try {
		const updateCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			body: nuevosDatos,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(updateCustomer)];
	} catch (error) {
		throw new NodeOperationError(executeFunctions.getNode(), helperFns.getErrorMessage(error, "Error actualizando cliente"));
	}
};

const buscarClientes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const codigo = executeFunctions.getNodeParameter("codigoCliente", itemIndex, "") as string;
	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex, "") as string;
	const razonSocial = executeFunctions.getNodeParameter("razonSocial", itemIndex, "") as string;

	if (!codigo && !cuit && !razonSocial) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debe proporcionar al menos un campo para la búsqueda (CUIT, Codigo o Razón Social).");
	}

	const queryParams: Record<string, string> = {};
	if (cuit) queryParams.Cuit = cuit;
	if (codigo) queryParams.codigo = codigo;
	if (razonSocial) queryParams.RazonSocial = razonSocial;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const buscarClientePorCuit: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex, "") as string;

	if (!cuit) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debe proporcionar CUIT para buscar clientes.");
	}

	const queryParams: Record<string, string> = { Cuit: cuit };

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
			queryParams,
		});

		return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarClientes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
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
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const razonSocial = executeFunctions.getNodeParameter("razonSocial", itemIndex);
	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex);
	const provincia = executeFunctions.getNodeParameter("idProvincia", itemIndex);
	const pais = executeFunctions.getNodeParameter("idPais", itemIndex);
	const zona = executeFunctions.getNodeParameter("idZona", itemIndex);
	const condicionIVA = executeFunctions.getNodeParameter("condicionIVA", itemIndex);
	const condicionVentaId = executeFunctions.getNodeParameter("idCondicionVenta", itemIndex);
	const bonificacionId = executeFunctions.getNodeParameter("idBonificacion", itemIndex);

	try {
		const crearCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
		throw new NodeOperationError(executeFunctions.getNode(), `Error al obtener la informacion de los articulos ${error}`);
	}
};

const buscarContribuyente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex, "") as string;
	const razonSocial = executeFunctions.getNodeParameter("razonSocial", itemIndex, "") as string;

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
		const response = await helperFns.apiRequest<any>(requestDetails.url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers: requestDetails.headers,
			queryParams: requestDetails.queryParams,
		});
		if (response.CantidadTotalItems === 1) {
			return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
		}

		return [executeFunctions.helpers.returnJsonArray(response as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const crearContribuyente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const bodyJson = executeFunctions.getNodeParameter("cuerpoHTTP", itemIndex) as any;
	const cuit = executeFunctions.getNodeParameter("cuit", itemIndex);

	if (typeof cuit !== "string" || !/^\d{11}$/.test(cuit)) {
		throw new NodeOperationError(executeFunctions.getNode(), "El CUIT debe ser una cadena de 11 dígitos numéricos.");
	}

	const contribuyenteJSON = helperFns.createContribuyenteJson(bodyJson, cuit);

	try {
		const crearCliente = await helperFns.apiRequest(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			body: contribuyenteJSON,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray([crearCliente as any])];
	} catch (error: any) {
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientIdParam = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const desdeSaldoFecha = executeFunctions.getNodeParameter("priceDateModified", itemIndex);
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
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientIdParam = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const hastaSaldoFecha = executeFunctions.getNodeParameter("priceDateModified", itemIndex);
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
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientIdParam = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const documentDate = executeFunctions.getNodeParameter("documentDate", itemIndex) as string;
	const diaSemana = executeFunctions.getNodeParameter("diaSemana", itemIndex);
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
			context: executeFunctions,
			debugItemIndex: itemIndex,
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
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo promociones para el cliente ${clientId}: \n ${errorMessage}`);
	}
};

const frecuenciasCliente: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const frecuenciasCliente = await helperFns.apiRequest<any>(`${centumUrl}/FrecuenciasCliente`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(frecuenciasCliente)];
	} catch (error) {
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
