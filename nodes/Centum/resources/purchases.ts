import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const createPurchase: ResourceHandler = async (context) => {
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

	/* Voucher information */
	const voucherTypeName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'voucherTypeName',
		itemIndex,
		'',
	) as string;
	const voucherCode = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'voucherCode',
		itemIndex,
		'',
	) as string;
	const voucherTypeId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'voucherTypeId', itemIndex),
	);

	/* Document information */
	const numeroDocumento = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentNumber',
		itemIndex,
	);
	const pointOfSale = helperFns.getNodeParameterOrThrow(executeFunctions, 'pointOfSale', itemIndex);
	const documentLetter = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentLetter',
		itemIndex,
		'',
	) as string;
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
		'',
	) as string;

	const physicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);

	const articlesArray = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articlesCollection',
		itemIndex,
	) as Array<{
		ID: string;
		Cantidad: number;
	}>;

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const supplierId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseSupplierId', itemIndex),
	);
	const productDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const formattedProductDate = String(productDate).split('T')[0];

	// Only the IDs are sent to the /Articulos/Venta request
	const ids = articlesArray.map((a) => a.ID);
	// Map article ID to quantity
	const qtyById: Record<string, number> = Object.fromEntries(
		articlesArray.map((a) => [a.ID, a.Cantidad]),
	);

	let supplierBody: Record<string, unknown>;
	const purchaseArticlesBody = {
		IdCliente: customerId,
		FechaDocumento: formattedProductDate,
		Ids: ids,
	};

	try {
		const supplierResponse = await helperFns.apiRequest<any>(
			`${centumUrl}/Proveedores/${supplierId}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		supplierBody = supplierResponse;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			(error as any)?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting supplier.\n ${errorMessage}`,
		);
	}

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

	const purchasePayload =
		typeof salesArticlesResponse === 'string'
			? JSON.parse(salesArticlesResponse)
			: salesArticlesResponse;

	const responseItems: any[] =
		purchasePayload?.Articulos?.Items ??
		purchasePayload?.CompraArticulos ??
		purchasePayload?.Items ??
		[];

	// Attach the original quantity from the source array
	const purchaseItemsWithQuantity = responseItems.map((art: any) => ({
		...art,
		Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
	}));

	const finalBody = {
		TipoComprobanteCompra: {
			IdTipoComprobanteCompra: voucherTypeId,
			Codigo: voucherCode,
			Nombre: voucherTypeName,
		},
		SucursalFisica: {
			IdSucursalFisica: physicalBranchId,
		},
		NumeroDocumento: {
			LetraDocumento: documentLetter,
			PuntoVenta: pointOfSale,
			Numero: numeroDocumento,
		},
		FechaDocumento: documentDate,
		Proveedor: supplierBody,
		CompraArticulos: purchaseItemsWithQuantity,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Compras`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: finalBody,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			(error as any)?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error creating purchase.\n ${errorMessage}`,
		);
	}
};

const listPurchases: ResourceHandler = async (context) => {
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

	const supplierId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierId', itemIndex),
	);
	const purchaseId = helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseId', itemIndex);
	const fromDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
		'',
	) as string;
	const toDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'endDate',
		itemIndex,
		'',
	) as string;
	const formattedFromDate = String(fromDate).split('T')[0];
	const formattedToDate = String(toDate).split('T')[0];
	if (!supplierId && !formattedFromDate && !formattedToDate && !purchaseId) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one filter before running the search.',
		);
	}

	if (!purchaseId && (!fromDate || !toDate)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Both fechaDocumentoDesde and fechaDocumentoHasta are required for Compras/FiltrosCompra.',
		);
	}

	const body = {
		idProveedor: supplierId,
		fechaDocumentoDesde: formattedFromDate,
		fechaDocumentoHasta: formattedToDate,
		idCompra: purchaseId,
	};

	try {
		if (purchaseId) {
			return await getPurchaseDetails(context);
		}

		const response = await helperFns.apiRequest<any>(`${centumUrl}/Compras/FiltrosCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting purchases for supplier ${supplierId}: ${errorMessage}`,
		);
	}
};

const getPurchaseDetails: ResourceHandler = async (context) => {
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

	const purchaseId = helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseId', itemIndex);
	if (!purchaseId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Purchase ID is required.');
	}

	const parsedPurchaseId = Number(purchaseId);
	if (!Number.isInteger(parsedPurchaseId) || parsedPurchaseId <= 0) {
		throw new NodeOperationError(executeFunctions.getNode(), 'purchaseId must be a positive integer.');
	}

	try {
		const purchase = await helperFns.apiRequest<any>(`${centumUrl}/Compras/${parsedPurchaseId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(purchase)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting purchase with ID ${parsedPurchaseId}: ${errorMessage}`,
		);
	}
};

const listPurchaseVouchers: ResourceHandler = async (context) => {
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
		const response = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobanteCompra`, {
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
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error en obtener el listado de Comprobantes de Compra: ${errorMessage}`,
		);
	}
};

const createPurchaseOrder: ResourceHandler = async (context) => {
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
	};

	const businessName =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'businessName', itemIndex) as string) ??
		'';
	const documentLetter =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentLetter', itemIndex) as string) ??
		'';
	const pointOfSale =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'pointOfSale', itemIndex) as string) ?? '';
	const numero =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentNumber', itemIndex) as string) ??
		'';
	const articlesRaw = helperFns.getNodeParameterOrThrow(executeFunctions, 'article', itemIndex);
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
	const supplierIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierId',
		itemIndex,
	);
	const supplierId = String(supplierIdRaw ?? '').trim();
	const deliveryTimeSlotId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryTimeSlotId',
		itemIndex,
	) as string;
	const branchId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'physicalBranchId',
		itemIndex,
	);

	if (!supplierId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'supplierId must be specified.');
	}

	// Parse articles safely
	let articles: ArticuloInput[] = [];

	const parseInvalidMsg =
		'Article format is invalid. Example: {"ID": 1271, "Cantidad": 10}, {"Codigo": "ABC123", "Cantidad": 10}, or arrays of these objects.';

	const toArticuloInput = (x: any): ArticuloInput => ({
		ID: typeof x?.ID === 'number' ? x.ID : undefined,
		Codigo: typeof x?.Codigo === 'string' ? x.Codigo : undefined,
		Cantidad: Number(x?.Cantidad),
	});

	const isArticuloInput = (x: any): x is ArticuloInput => {
		if (!x || typeof x !== 'object') return false;
		const hasIdOrCodigo =
			typeof x.ID === 'number' || (typeof x.Codigo === 'string' && x.Codigo.trim().length > 0);
		const cant = x.Cantidad;
		const cantOk = typeof cant === 'number' && Number.isFinite(cant) && cant > 0;
		return hasIdOrCodigo && cantOk;
	};

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

	if (!businessName.trim()) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Business name is required.');
	}

	if (!articles.length) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one valid article with Quantity > 0.',
		);
	}

	// 1) Resolve the customer only for the /Articulos/Venta request
	let clientId: number;

	try {
		const dataCliente = await helperFns.apiRequest<any>(
			`${centumUrl}/Clientes?razonSocial=${encodeURIComponent(businessName)}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);

		const customer = dataCliente?.Items?.[0];
		if (!customer?.IdCliente)
			throw new NodeOperationError(executeFunctions.getNode(), 'Customer not found.');

		clientId = customer.IdCliente;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message || (error as any)?.message || 'Error getting customer';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}

	// 2) Keep the article payload as-is and only add quantity
	const purchaseOrderArticles: any[] = [];

	for (const articleInput of articles) {
		try {
			const articleBody: any = {
				IdCliente: clientId,
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
				purchaseOrderArticles.push({
					...item,
					Cantidad: articleInput.Cantidad,
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
	const bodyOrdenCompra = {
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
		FechaDocumento: `${formattedDocumentDate}T00:00:00`,
		FechaEntrega: `${formattedDeliveryDate}T00:00:00`,
		Proveedor: supplierInfo,
		OrdenCompraArticulos: purchaseOrderArticles,
		FechaVencimiento: `${formattedDueDate}T00:00:00`,
		OperadorCompra: {
			IdOperadorCompra: 1,
			Codigo: '1',
			Nombre: 'Operador de Compras Defecto',
			EsSupervisor: false,
		},
	};

	// 5) Send the final POST request
	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/OrdenesCompra`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: bodyOrdenCompra,
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

const getPurchaseOrderDetails: ResourceHandler = async (context) => {
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

	const purchaseOrderId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'purchaseId',
		itemIndex,
	);

	if (!purchaseOrderId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Purchase ID is required.');
	}

	try {
		let url = `${centumUrl}/OrdenesCompra/${purchaseOrderId}`;

		const response = await helperFns.apiRequest<any>(`${url}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		// Validate the response
		if (!response || typeof response !== 'object') {
			throw new NodeOperationError(executeFunctions.getNode(), 'Invalid server response.');
		}

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting purchase order with ID ${purchaseOrderId}: ${errorMessage}`,
		);
	}
};

const listPurchaseOrders: ResourceHandler = async (context) => {
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

	const supplierId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierId', itemIndex),
	);
	const fromDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const toDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'endDate', itemIndex);
	const deliveryDateFrom = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'fromDeliveryDate',
		itemIndex,
	);
	const deliveryDateTo = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'sinceDeliveryDate',
		itemIndex,
	);
	const formattedFromDate = String(fromDate).split('T')[0];
	const formattedToDate = String(toDate).split('T')[0];
	const formattedDeliveryDateFrom = String(deliveryDateFrom).split('T')[0];
	const formattedDeliveryDateTo = String(deliveryDateTo).split('T')[0];

	if (!fromDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'startDate is required.');
	}

	if (!toDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'endDate is required.');
	}

	try {
		const body = {
			fechaDocumentoDesde: formattedFromDate,
			fechaDocumentoHasta: formattedToDate,
			idProveedor: supplierId,
			fechaEntregaDesde: formattedDeliveryDateFrom,
			fechaEntregaHasta: formattedDeliveryDateTo,
		};

		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/OrdenesCompra/FiltrosOrdenCompra`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);

		// Validate the response
		if (!response || typeof response !== 'object') {
			throw new NodeOperationError(executeFunctions.getNode(), 'Invalid server response.');
		}

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting purchase orders for supplier ${supplierId}: ${errorMessage}`,
		);
	}
};

export const purchasesHandlers: ResourceHandlerMap = {
	createPurchase: createPurchase,
	listPurchases: listPurchases,
	getPurchaseDetails: getPurchaseDetails,
	listPurchaseVouchers: listPurchaseVouchers,
	createPurchaseOrder: createPurchaseOrder,
	getPurchaseOrderDetails: getPurchaseOrderDetails,
	listPurchaseOrders: listPurchaseOrders,
};
