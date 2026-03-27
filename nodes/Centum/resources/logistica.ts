import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const crearRemitoCompra: ResourceHandler = async (context) => {
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

	const idCliente = executeFunctions.getNodeParameter("clienteId", itemIndex) ?? "";
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

	if (!idCliente) {
		throw new NodeOperationError(executeFunctions.getNode(), "El ID del cliente es obligatorio.");
	}

	if (!articulos.length) {
		throw new NodeOperationError(executeFunctions.getNode(), "Debe enviarse al menos un artículo válido con Cantidad > 0.");
	}

	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${idCliente}`, { context: executeFunctions, debugItemIndex: itemIndex, method: "GET", headers });

		const cliente = dataCliente;
		if (!cliente) throw new NodeOperationError(executeFunctions.getNode(), "any no encontrado");
	} catch (error: NodeErr) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error obteniendo cliente";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 2) Artículos (sin mapping, tal cual; sólo agregar Cantidad)
	const RemitoCompraArticulos: any[] = [];

	for (const articuloInput of articulos) {
		try {
			const bodyArticulo: any = {
				IdCliente: idCliente,
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
				RemitoCompraArticulos.push({
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
	const bodyRemitoCompra = {
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
		FechaDocumento: formattedDocumentDate,
		FechaEntrega: formattedDeliveryDate,
		Proveedor: proveedorInfo,
		RemitoCompraArticulos,
		FechaVencimiento: formattedDueDate,
		OperadorCompra: {
			//Obligatorio
			IdOperadorCompra: 1,
			Codigo: "1",
			Nombre: "Operador de Compras Defecto",
			EsSupervisor: false,
		},
		IdChofer: 1, //Obligatorio,
	};

	// 5) POST final
	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/RemitosCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body: bodyRemitoCompra,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error creando la orden de compra";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const crearRemitoVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idSucursalFisica = executeFunctions.getNodeParameter("idSucursalFisica", itemIndex);
	const puntoDeVenta = executeFunctions.getNodeParameter("puntoDeVenta", itemIndex) as string;
	const letraDocumento = executeFunctions.getNodeParameter("letraDocumento", itemIndex) as string;
	const numeroDocumento = executeFunctions.getNodeParameter("numeroFactura", itemIndex);
	const turnoDeEntrega = executeFunctions.getNodeParameter("turnoEntrega", itemIndex);
	const fechaDocumento = executeFunctions.getNodeParameter("documentDate", itemIndex) as string;
	const fechaDocumentoFormateada = fechaDocumento.replace(/\..+/, "");
	const fechaEmbarque = executeFunctions.getNodeParameter("shipmentDate", itemIndex) as string;
	const fechaEmbarqueFormateada = fechaEmbarque.replace(/\..+/, "");
	const fechaImputacion = executeFunctions.getNodeParameter("indictmentDate", itemIndex) as string;
	const fechaImputacionFormateada = fechaImputacion.replace(/\..+/, "");
	const fechaEntrega = executeFunctions.getNodeParameter("deliveryDate", itemIndex) as string;
	const fechaEntregaFormateada = fechaEntrega.replace(/\..+/, "");
	const idVendedor = executeFunctions.getNodeParameter("idVendedor", itemIndex);
	const idCliente = executeFunctions.getNodeParameter("clienteId", itemIndex);
	const rawArticles = executeFunctions.getNodeParameter("articlesCollection", itemIndex);

	let articulosArray: { ID: string; Cantidad: number }[] = [];

	if (typeof rawArticles === "string") {
		try {
			articulosArray = JSON.parse(rawArticles) as { ID: string; Cantidad: number }[];
		} catch (error) {
			throw new NodeOperationError(executeFunctions.getNode(), `El campo articlesCollection debe ser un JSON válido. ${error}`);
		}
	} else {
		articulosArray = rawArticles as { ID: string; Cantidad: number }[];
	}

	// Sólo los IDs para el request a /Articulos/Venta
	const ids = articulosArray.map((a) => a.ID);
	// Mapa id -> cantidad
	const qtyById: Record<string, number> = Object.fromEntries(articulosArray.map((a) => [a.ID, a.Cantidad]));
	const bodyCompraArticulos = {
		IdCliente: idCliente,
		FechaDocumento: fechaDocumentoFormateada,
		Ids: ids,
	};

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

	let clientInfo: Record<string, unknown>;

	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${idCliente}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		const cliente = dataCliente;
		if (!cliente?.IdCliente) {
			throw new NodeOperationError(executeFunctions.getNode(), "El cliente no fue encontrado");
		}
		clientInfo = cliente;
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error al obtener el cliente.";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/RemitosVenta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: "POST",
			body: {
				SucursalFisica: {
					IdSucursalFisica: idSucursalFisica, //Opcional
				},
				NumeroDocumento: {
					//Opcional
					LetraDocumento: letraDocumento,
					PuntoVenta: puntoDeVenta,
					Numero: numeroDocumento,
				},
				FechaDocumento: fechaDocumentoFormateada, //Opcional
				FechaEmbarque: fechaEmbarqueFormateada, //Opcional
				FechaImputacion: fechaImputacionFormateada, //Opcional
				FechaEntrega: fechaEntregaFormateada, //Opcional
				TurnoEntrega: {
					IdTurnoEntrega: turnoDeEntrega, //Obligatorio
				},
				Cliente: clientInfo,
				Vendedor: {
					IdVendedor: idVendedor,
				},
				IdChofer: 1, //Opcional
				PorcentajeDescuento: 0.0, //Opcional
				Observaciones: "Remito creado desde n8n.",
				RemitoVentaArticulos: compraConCantidad,
			},
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const msg = error?.response?.data?.Message || (error as any)?.message || "Error creando el Remito De Venta";
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const listarChoferes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/GuiaLogisticaChoferes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		throw new NodeOperationError(executeFunctions.getNode(), `Hubo un error al obtener el listado de choferes. Error: ${error}`);
	}
};

const listarTurnosEntrega: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const turnoEntrega = await helperFns.apiRequest<any>(`${centumUrl}/TurnosEntrega`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(turnoEntrega)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo los turnos de entrega: ${errorMessage}`);
	}
};

const listarSucursales: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const dataListBranches = await helperFns.apiRequest<any>(`${centumUrl}/SucursalesFisicas`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(dataListBranches)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

export const logisticaHandlers: ResourceHandlerMap = {
	crearRemitoCompra,
	crearRemitoVenta,
	listarChoferes,
	listarTurnosEntrega,
	listarSucursales,
};
