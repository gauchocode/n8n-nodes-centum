import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const createPurchaseDeliveryNote: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	type ArticuloInput = {
		ID?: number;
		Codigo?: string;
		Cantidad: number;
		Precio?: number;
	};

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const documentLetter =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentLetter', itemIndex) as string) ??
		'';
	const pointOfSale =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'pointOfSale', itemIndex) as string) ?? '';
	const numero =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentNumber', itemIndex) as string) ??
		'';
	const useSinglePurchaseDeliveryArticle = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'useSinglePurchaseDeliveryArticle',
		itemIndex,
		false,
	) as boolean;
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const formattedDocumentDate = String(documentDate).split('T')[0];
	const deliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryDate',
		itemIndex,
	) as string;
	const formattedDeliveryDate = String(deliveryDate).split('T')[0];
	const dueDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'dueDate',
		itemIndex,
	) as string;
	const formattedDueDate = String(dueDate).split('T')[0];
	const supplierIdRaw = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierId', itemIndex),
	);
	const supplierId = String(supplierIdRaw ?? '').trim();
	const deliveryTimeSlotId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'deliveryTimeSlotId', itemIndex),
	);
	const driverId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'driverId', itemIndex, ''),
	);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const notes = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'notes',
		itemIndex,
		'',
	) as string;

	if (!supplierId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'idProveedor must be specified.');
	}

	// Parse articles safely
	let articles: ArticuloInput[] = [];

	const parseInvalidMsg =
		'Article format is invalid. Example: {"ID": 1271, "Cantidad": 10}, {"Codigo": "ABC123", "Cantidad": 10}, or arrays of these objects.';

	const toArticuloInput = (x: any): ArticuloInput => ({
		ID: typeof x?.ID === 'number' ? x.ID : undefined,
		Codigo: typeof x?.Codigo === 'string' ? x.Codigo : undefined,
		Cantidad: Number(x?.Cantidad),
		Precio: x?.Precio !== undefined ? Number(x.Precio) : undefined,
	});

	const isArticuloInput = (x: any): x is ArticuloInput => {
		if (!x || typeof x !== 'object') return false;
		const hasIdOrCodigo =
			typeof x.ID === 'number' || (typeof x.Codigo === 'string' && x.Codigo.trim().length > 0);
		const cant = x.Cantidad;
		const cantOk = typeof cant === 'number' && Number.isFinite(cant) && cant > 0;
		return hasIdOrCodigo && cantOk;
	};

	if (useSinglePurchaseDeliveryArticle) {
		const singleArticleId = helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseDeliveryArticleId', itemIndex),
		);
		const singleArticlePrice = helperFns.getNodeParameterOrThrow(
			executeFunctions,
			'purchaseDeliveryArticlePrice',
			itemIndex,
		) as number;
		const singleArticleQuantity = helperFns.getNodeParameterOrThrow(
			executeFunctions,
			'purchaseDeliveryArticleQuantity',
			itemIndex,
		) as number;

		articles = [
			{
				ID: Number(singleArticleId),
				Cantidad: singleArticleQuantity,
				Precio: singleArticlePrice,
			},
		];
	} else {
		const articlesRaw = helperFns.getNodeParameterOrThrow(executeFunctions, 'article', itemIndex);

		if (typeof articlesRaw === 'string') {
			try {
				const parsed = JSON.parse(articlesRaw);
				const arr = Array.isArray(parsed) ? parsed : [parsed];
				articles = arr.map(toArticuloInput).filter(isArticuloInput);
			} catch {
				throw new NodeOperationError(executeFunctions.getNode(), parseInvalidMsg);
			}
		} else if (Array.isArray(articlesRaw)) {
			// Avoid TS2322 by normalizing and filtering instead of assigning directly
			articles = (articlesRaw as any[]).map(toArticuloInput).filter(isArticuloInput);
		} else if (typeof articlesRaw === 'object' && articlesRaw !== null) {
			const one = toArticuloInput(articlesRaw as any);
			articles = isArticuloInput(one) ? [one] : [];
		} else {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Unexpected data type: ${typeof articlesRaw}`,
			);
		}
	}

	if (!customerId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Customer ID is required.');
	}

	if (!articles.length) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one valid article with Quantity > 0.',
		);
	}

	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${customerId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		const customer = dataCliente;
		if (!customer) throw new NodeOperationError(executeFunctions.getNode(), 'Customer not found.');
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message || (error as any)?.message || 'Error getting customer';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 2) Keep the article payload as-is and only add quantity
	const purchaseDeliveryNoteArticles: any[] = [];

	for (const articleInput of articles) {
		try {
			const articleBody: any = {
				IdCliente: customerId,
				FechaDocumento: formattedDocumentDate,
			};

			if (articleInput.ID) articleBody.Ids = [articleInput.ID];
			else articleBody.Codigo = articleInput.Codigo;

			const articleData = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body: articleBody,
			});

			const items = articleData?.Articulos?.Items ?? [];
			if (!Array.isArray(items) || items.length === 0)
				throw new NodeOperationError(executeFunctions.getNode(), 'Article not found.');

			for (const item of items) {
				purchaseDeliveryNoteArticles.push({
					...item,
					Cantidad: articleInput.Cantidad,
					Precio: articleInput.Precio ?? item.Precio,
				});
			}
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			const msg =
				error?.response?.data?.Message || (error as any)?.message || 'Error resolving article';
			throw new NodeOperationError(executeFunctions.getNode(), msg);
		}
	}

	// 3) Resolve the supplier as a full entity
	let supplierInfo: any;

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/Proveedores/${encodeURIComponent(supplierId)}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);

		if (!response?.IdProveedor)
			throw new NodeOperationError(executeFunctions.getNode(), 'Supplier not found.');
		supplierInfo = response;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message || (error as any)?.message || 'Error getting supplier';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 4) Build the final request body
	const bodyRemitoCompra = {
		SucursalFisica: {
			IdSucursalFisica: branchId,
		},
		NumeroDocumento: {
			LetraDocumento: documentLetter,
			PuntoVenta: pointOfSale,
			Numero: numero,
		},
		TurnoEntrega: {
			IdTurnoEntrega: deliveryTimeSlotId,
		},
		FechaDocumento: formattedDocumentDate,
		FechaEntrega: formattedDeliveryDate,
		Proveedor: supplierInfo,
		RemitoCompraArticulos: purchaseDeliveryNoteArticles,
		FechaVencimiento: formattedDueDate,
		Observaciones: notes,
		OperadorCompra: {
			// Required
			IdOperadorCompra: 1,
			Codigo: '1',
			Nombre: 'Operador de Compras Defecto',
			EsSupervisor: false,
		},
		IdChofer: Number(driverId),
	};

	// 5) Send the final POST request
	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/RemitosCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: bodyRemitoCompra,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message || (error as any)?.message || 'Error creating purchase order';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const createSalesDeliveryNote: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const physicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const pointOfSale = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'pointOfSale',
		itemIndex,
	) as string;
	const documentLetter = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentLetter',
		itemIndex,
	) as string;
	const numeroDocumento = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentNumber',
		itemIndex,
	);
	const deliveryTimeSlotId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'deliveryTimeSlotId', itemIndex),
	);
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const normalizeDateTime = (value: unknown): string | undefined => {
		if (value === null || value === undefined || value === '') {
			return undefined;
		}

		return String(value).replace(/\..+/, '');
	};
	const formattedDocumentDate = normalizeDateTime(documentDate);

	if (!formattedDocumentDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'documentDate is required.');
	}

	const shipmentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'shipmentDate',
		itemIndex,
		'',
	) as string;
	const formattedShipmentDate = normalizeDateTime(shipmentDate);
	const indictmentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'indictmentDate',
		itemIndex,
		'',
	) as string;
	const formattedIndictmentDate = normalizeDateTime(indictmentDate);
	const deliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryDate',
		itemIndex,
		'',
	) as string;
	const formattedDeliveryDate = normalizeDateTime(deliveryDate);
	const sellerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'sellerId', itemIndex),
	);
	const driverId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'driverId', itemIndex, ''),
	);
	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const useSingleSalesDeliveryArticle = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'useSingleSalesDeliveryArticle',
		itemIndex,
		false,
	) as boolean;

	type SalesDeliveryArticleInput = { ID: string; Cantidad: number; Precio?: number };

	let articlesArray: SalesDeliveryArticleInput[] = [];

	if (useSingleSalesDeliveryArticle) {
		const singleArticleId = helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'salesDeliveryArticleId', itemIndex),
		);
		const singleArticlePrice = helperFns.getNodeParameterOrThrow(
			executeFunctions,
			'salesDeliveryArticlePrice',
			itemIndex,
		) as number;
		const singleArticleQuantity = helperFns.getNodeParameterOrThrow(
			executeFunctions,
			'salesDeliveryArticleQuantity',
			itemIndex,
		) as number;

		articlesArray = [
			{
				ID: String(singleArticleId),
				Cantidad: singleArticleQuantity,
				Precio: singleArticlePrice,
			},
		];
	} else {
		const rawArticles = helperFns.getNodeParameterOrThrow(
			executeFunctions,
			'articlesCollection',
			itemIndex,
		);

		if (typeof rawArticles === 'string') {
			try {
				articlesArray = JSON.parse(rawArticles) as SalesDeliveryArticleInput[];
			} catch (error) {
				if (error instanceof NodeApiError) {
					throw error;
				}
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`The articlesCollection field must contain valid JSON. ${error}`,
				);
			}
		} else {
			articlesArray = rawArticles as SalesDeliveryArticleInput[];
		}
	}

	// Only the IDs are sent to the /Articulos/Venta request
	const ids = articlesArray.map((a) => a.ID);
	// Map article ID to quantity
	const qtyById: Record<string, number> = Object.fromEntries(
		articlesArray.map((a) => [a.ID, a.Cantidad]),
	);
	const priceById: Record<string, number> = Object.fromEntries(
		articlesArray.filter((a) => a.Precio !== undefined).map((a) => [a.ID, a.Precio as number]),
	);
	const purchaseArticlesBody = {
		IdCliente: customerId,
		FechaDocumento: formattedDocumentDate,
		Ids: ids,
	};

	let salesArticlesResponse: any;
	try {
		salesArticlesResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body: purchaseArticlesBody,
			headers,
		});
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			(error as any)?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting article information ${errorMessage}`,
		);
	}

	const salesPayload =
		typeof salesArticlesResponse === 'string'
			? JSON.parse(salesArticlesResponse)
			: salesArticlesResponse;

	const itemsRespuesta: any[] =
		salesPayload?.Articulos?.Items ?? salesPayload?.CompraArticulos ?? salesPayload?.Items ?? [];

	// Attach the original quantity from the source array
	const purchaseItemsWithQuantity = itemsRespuesta.map((art: any) => ({
		...art,
		Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
		Precio: priceById[String(art.IdArticulo)] ?? art.Precio,
	}));

	let clientInfo: Record<string, unknown>;

	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${customerId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		const customer = dataCliente;
		if (!customer?.IdCliente) {
			throw new NodeOperationError(executeFunctions.getNode(), 'Customer not found.');
		}
		clientInfo = customer;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Error getting customer.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}

	const salesDeliveryNoteBody: Record<string, unknown> = {
		SucursalFisica: {
			IdSucursalFisica: physicalBranchId,
		},
		NumeroDocumento: {
			LetraDocumento: documentLetter,
			PuntoVenta: pointOfSale,
			Numero: numeroDocumento,
		},
		FechaDocumento: formattedDocumentDate,
		TurnoEntrega: {
			IdTurnoEntrega: deliveryTimeSlotId,
		},
		Cliente: clientInfo,
		Vendedor: {
			IdVendedor: sellerId,
		},
		IdChofer: Number(driverId || '1'),
		PorcentajeDescuento: 0.0,
		Observaciones: 'Remito creado desde n8n.',
		RemitoVentaArticulos: purchaseItemsWithQuantity,
	};

	if (formattedShipmentDate) {
		salesDeliveryNoteBody.FechaEmbarque = formattedShipmentDate;
	}

	if (formattedIndictmentDate) {
		salesDeliveryNoteBody.FechaImputacion = formattedIndictmentDate;
	}

	if (formattedDeliveryDate) {
		salesDeliveryNoteBody.FechaEntrega = formattedDeliveryDate;
	}

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/RemitosVenta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: 'POST',
			body: salesDeliveryNoteBody,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message ||
			(error as any)?.message ||
			'Error creating sales delivery note';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const listDrivers: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/GuiaLogisticaChoferes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(executeFunctions.getNode(), `Error getting driver list: ${error}`);
	}
};

const listDeliveryTimeSlots: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const deliveryTimeSlots = await helperFns.apiRequest<any>(`${centumUrl}/TurnosEntrega`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(deliveryTimeSlots)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting delivery time slots: ${errorMessage}`,
		);
	}
};

const listPhysicalBranches: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const dataListBranches = await helperFns.apiRequest<any>(`${centumUrl}/SucursalesFisicas`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(dataListBranches)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

export const logisticsHandlers: ResourceHandlerMap = {
	createPurchaseDeliveryNote: createPurchaseDeliveryNote,
	createSalesDeliveryNote: createSalesDeliveryNote,
	listDrivers: listDrivers,
	listDeliveryTimeSlots: listDeliveryTimeSlots,
	listPhysicalBranches: listPhysicalBranches,
};
