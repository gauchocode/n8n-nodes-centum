import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const crearCompra: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	/* Información del comprobante */
	const nombreTipoComprobante = executeFunctions.getNodeParameter("nombreTipoComprobante", itemIndex, "") as string;
	const codigoComprobante = executeFunctions.getNodeParameter("codigoComprobante", itemIndex, "") as string;
	const idTipoComprobante = executeFunctions.getNodeParameter("idTipoComprobante", itemIndex);

	/* Información del documento */
	const numeroDocumento = executeFunctions.getNodeParameter("numeroFactura", itemIndex);
	const puntoVenta = executeFunctions.getNodeParameter("puntoDeVenta", itemIndex);
	const letraDocumento = executeFunctions.getNodeParameter("letraDocumento", itemIndex, "") as string;
	const fechaDocumento = executeFunctions.getNodeParameter("fechaFactura", itemIndex, "") as string;

	const sucursalFisica = executeFunctions.getNodeParameter("idSucursalFisica", itemIndex);

	const articulosArray = executeFunctions.getNodeParameter("articlesCollection", itemIndex) as Array<{
		ID: string;
		Cantidad: number;
	}>;

	const idCliente = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const idProveedor = executeFunctions.getNodeParameter("idProveedor", itemIndex);
	const fechaProducto = executeFunctions.getNodeParameter("startDate", itemIndex);
	const separarFecha = String(fechaProducto).split("T")[0];

	// Sólo los IDs para el request a /Articulos/Venta
	const ids = articulosArray.map((a) => a.ID);
	// Mapa id -> cantidad
	const qtyById: Record<string, number> = Object.fromEntries(articulosArray.map((a) => [a.ID, a.Cantidad]));

	let bodyProveedor: Record<string, unknown>;
	const bodyCompraArticulos = {
		IdCliente: idCliente,
		FechaDocumento: separarFecha,
		Ids: ids,
	};

	try {
		const fetchProveedor = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/${idProveedor}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		bodyProveedor = fetchProveedor;
	} catch (error) {
		const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo el proveedor.\n ${errorMessage}`);
	}

	let articulosVenta: any;
	try {
		articulosVenta = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			body: bodyCompraArticulos,
			headers,
		});
	} catch (error) {
		const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error al obtener la informacion de los articulos ${errorMessage}`);
	}

	const ventaObj = typeof articulosVenta === "string" ? JSON.parse(articulosVenta) : articulosVenta;

	const itemsRespuesta: any[] = ventaObj?.Articulos?.Items ?? ventaObj?.CompraArticulos ?? ventaObj?.Items ?? [];

	// Agrego Cantidad desde el array original
	const compraConCantidad = itemsRespuesta.map((art: any) => ({
		...art,
		Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
	}));

	const finalBody = {
		TipoComprobanteCompra: {
			IdTipoComprobanteCompra: idTipoComprobante,
			Codigo: codigoComprobante,
			Nombre: nombreTipoComprobante,
		},
		SucursalFisica: {
			IdSucursalFisica: sucursalFisica,
		},
		NumeroDocumento: {
			LetraDocumento: letraDocumento,
			PuntoVenta: puntoVenta,
			Numero: numeroDocumento,
		},
		FechaDocumento: fechaDocumento,
		Proveedor: bodyProveedor,
		CompraArticulos: compraConCantidad,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Compras`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body: finalBody,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error creando la compra.\n ${errorMessage}`);
	}
};

const listarCompras: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idCliente = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const idCompra = executeFunctions.getNodeParameter("idCompra", itemIndex);
	const fechaDesde = executeFunctions.getNodeParameter("startDate", itemIndex, "") as string;
	const fechaHasta = executeFunctions.getNodeParameter("endDate", itemIndex, "") as string;
	const separarFechaDesde = String(fechaDesde).split("T")[0];
	const separarFechaHasta = String(fechaHasta).split("T")[0];
	if (!idCliente && !separarFechaDesde && !separarFechaHasta && !idCompra) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
	}

	const body = {
		idCliente,
		fechaDocumentoDesde: separarFechaDesde,
		fechaDocumentoHasta: separarFechaHasta,
		idCompra,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Compras/FiltrosCompra`, {
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

const listarComprobantesCompra: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobanteCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de Comprobantes de Compra: ${errorMessage}`);
	}
};

const crearOrdenCompra: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	type ArticuloInput = {
		ID?: number;
		Codigo?: string;
		Cantidad: number;
	};

	type NodeErr = any;

	const razonSocial = (executeFunctions.getNodeParameter("razonSocial", itemIndex) as string) ?? "";
	const letraDocumento = (executeFunctions.getNodeParameter("letraDocumento", itemIndex) as string) ?? "";
	const puntoDeVenta = (executeFunctions.getNodeParameter("puntoDeVenta", itemIndex) as string) ?? "";
	const numero = (executeFunctions.getNodeParameter("numeroFactura", itemIndex) as string) ?? "";
	const articulosRaw = executeFunctions.getNodeParameter("articulo", itemIndex);
	const fechaDocumento = executeFunctions.getNodeParameter("documentDate", itemIndex) as string;
	const formattedDocumentDate = String(fechaDocumento).split("T")[0];
	const fechaDelivery = executeFunctions.getNodeParameter("deliveryDate", itemIndex) as string;
	const formattedDeliveryDate = String(fechaDelivery).split("T")[0];
	const fechaVencimiento = executeFunctions.getNodeParameter("dueDate", itemIndex) as string;
	const formattedDueDate = String(fechaVencimiento).split("T")[0];
	const proveedorIdRaw = executeFunctions.getNodeParameter("proveedorId", itemIndex);
	const proveedorId = String(proveedorIdRaw ?? "").trim();
	const turnoEntregaId = executeFunctions.getNodeParameter("turnoEntrega", itemIndex) as string;
	const sucursalId = executeFunctions.getNodeParameter("idSucursalFisica", itemIndex);

	if (!proveedorId) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debe especificarse idProveedor.");
	}

	// Parse artículos (tipado seguro)
	let articulos: ArticuloInput[] = [];

	const parseInvalidMsg = 'Formato de artículos inválido. Ej: {"ID": 1271, "Cantidad": 10} o {"Codigo": "ABC123", "Cantidad": 10} o arrays de estos objetos';

	const toArticuloInput = (x: any): ArticuloInput => ({
		ID: typeof x?.ID === "number" ? x.ID : undefined,
		Codigo: typeof x?.Codigo === "string" ? x.Codigo : undefined,
		Cantidad: Number(x?.Cantidad),
	});

	const isArticuloInput = (x: any): x is ArticuloInput => {
		if (!x || typeof x !== "object") return false;
		const hasIdOrCodigo = typeof x.ID === "number" || (typeof x.Codigo === "string" && x.Codigo.trim().length > 0);
		const cant = x.Cantidad;
		const cantOk = typeof cant === "number" && Number.isFinite(cant) && cant > 0;
		return hasIdOrCodigo && cantOk;
	};

	if (typeof articulosRaw === "string") {
		try {
			const parsed = JSON.parse(articulosRaw);
			const arr = Array.isArray(parsed) ? parsed : [parsed];
			articulos = arr.map(toArticuloInput).filter(isArticuloInput);
		} catch {
			throw new NodeOperationError(executeFunctions.getNode(), parseInvalidMsg);
		}
	} else if (Array.isArray(articulosRaw)) {
		// Evita TS2322: no asignar directamente; normalizar y filtrar
		articulos = (articulosRaw as any[]).map(toArticuloInput).filter(isArticuloInput);
	} else if (typeof articulosRaw === "object" && articulosRaw !== null) {
		const one = toArticuloInput(articulosRaw as any);
		articulos = isArticuloInput(one) ? [one] : [];
	} else {
		throw new NodeOperationError(executeFunctions.getNode(), `Tipo de dato inesperado: ${typeof articulosRaw}`);
	}

	if (!razonSocial.trim()) {
		throw new NodeOperationError(executeFunctions.getNode(), "La razón social es obligatoria.");
	}

	if (!articulos.length) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debe enviarse al menos un artículo válido con Cantidad > 0.");
	}

	// 1) any (solo para /Articulos/Venta)
	let clientId: number;

	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes?razonSocial=${encodeURIComponent(razonSocial)}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		const cliente = dataCliente?.Items?.[0];
		if (!cliente?.IdCliente) throw new NodeOperationError(executeFunctions.getNode(), "any no encontrado");

		clientId = cliente.IdCliente;
	} catch (error: NodeErr) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error obteniendo cliente";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 2) Artículos (sin mapping, tal cual; sólo agregar Cantidad)
	const ordenCompraArticulos: any[] = [];

	for (const articuloInput of articulos) {
		try {
			const bodyArticulo: any = {
				IdCliente: clientId,
				FechaDocumento: formattedDocumentDate,
			};

			if (articuloInput.ID) bodyArticulo.Ids = [articuloInput.ID];
			else bodyArticulo.Codigo = articuloInput.Codigo;

			const dataArticulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: "POST",
				headers,
				body: bodyArticulo,
			});

			const items = dataArticulo?.Articulos?.Items ?? [];
			if (!Array.isArray(items) || items.length === 0) throw new NodeOperationError(executeFunctions.getNode(), "Artículo no encontrado");

			for (const item of items) {
				ordenCompraArticulos.push({
					...item,
					Cantidad: articuloInput.Cantidad,
				});
			}
		} catch (error: NodeErr) {
			const msg = error?.response?.data?.Message || (error as any)?.message || "Error resolviendo artículo";
			throw new NodeOperationError(executeFunctions.getNode(), msg);
		}
	}

	// 3) Proveedor (entidad completa)
	let proveedorInfo: any;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/${encodeURIComponent(proveedorId)}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		if (!response?.IdProveedor) throw new NodeOperationError(executeFunctions.getNode(), "Proveedor no encontrado");
		proveedorInfo = response;
	} catch (error: NodeErr) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error obteniendo proveedor";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 4) Body final
	const bodyOrdenCompra = {
		SucursalFisica: {
			IdSucursalFisica: sucursalId,
		},
		NumeroDocumento: {
			LetraDocumento: letraDocumento,
			PuntoVenta: puntoDeVenta,
			Numero: numero,
		},
		TurnoEntrega: {
			IdTurnoEntrega: turnoEntregaId,
		},
		FechaDocumento: `${formattedDocumentDate}T00:00:00`,
		FechaEntrega: `${formattedDeliveryDate}T00:00:00`,
		Proveedor: proveedorInfo,
		OrdenCompraArticulos: ordenCompraArticulos,
		FechaVencimiento: `${formattedDueDate}T00:00:00`,
		OperadorCompra: {
			IdOperadorCompra: 1,
			Codigo: "1",
			Nombre: "Operador de Compras Defecto",
			EsSupervisor: false,
		},
	};

	// 5) POST final
	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/OrdenesCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body: bodyOrdenCompra,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error: NodeErr) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error creando la orden de compra";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const verDetalleOrdenCompra: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const ordenCompraId = executeFunctions.getNodeParameter("idCompra", itemIndex);

	if (!ordenCompraId) {
		throw new NodeOperationError(executeFunctions.getNode(), "El id de la compra es requerido");
	}

	try {
		let url = `${centumUrl}/OrdenesCompra/${ordenCompraId}`;

		const response = await helperFns.apiRequest<any>(`${url}`, {
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
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo la orden de compra con el id ${ordenCompraId}: ${errorMessage}`);
	}
};

const listarOrdenesCompra: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idProveedor = executeFunctions.getNodeParameter("proveedorId", itemIndex);
	const desdeSaldoFecha = executeFunctions.getNodeParameter("startDate", itemIndex);
	const hastaSaldoFecha = executeFunctions.getNodeParameter("endDate", itemIndex);
	const fechaEntregaDesde = executeFunctions.getNodeParameter("fromDeliveryDate", itemIndex);
	const fechaEntregaHasta = executeFunctions.getNodeParameter("sinceDeliveryDate", itemIndex);
	const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
	const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];
	const separarFechaEntregaDesde = String(fechaEntregaDesde).split("T")[0];
	const separarFechaEntregaHasta = String(fechaEntregaHasta).split("T")[0];

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
			idProveedor,
			fechaEntregaDesde: separarFechaEntregaDesde,
			fechaEntregaHasta: separarFechaEntregaHasta,
		};

		const response = await helperFns.apiRequest<any>(`${centumUrl}/OrdenesCompra/FiltrosOrdenCompra`, {
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
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo ordenes de compra del proveedor ${idProveedor}: ${errorMessage}`);
	}
};

export const comprasHandlers: ResourceHandlerMap = {
	crearCompra,
	listarCompras,
	listarComprobantesCompra,
	crearOrdenCompra,
	verDetalleOrdenCompra,
	listarOrdenesCompra,
};
