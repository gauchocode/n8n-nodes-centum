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

	const parseCommaSeparatedList = (value: string, fieldLabel: string): string[] => {
		if (!value.trim()) {
			throw new NodeOperationError(executeFunctions.getNode(), `${fieldLabel} is required.`);
		}

		const values = value.split(',').map((item) => item.trim());
		if (values.some((item) => item.length === 0)) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${fieldLabel} contains an empty value. Use commas only between valid integers.`,
			);
		}

		return values;
	};

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

	const articleIdsRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleIds', itemIndex, ''),
	);
	const articleQuantitiesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleQuantities', itemIndex, ''),
	);

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const supplierId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseSupplierId', itemIndex),
	);
	const productDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const formattedProductDate = String(productDate).split('T')[0];

	const articleIds = parseCommaSeparatedList(articleIdsRaw, 'Article IDs');
	const articleQuantities = parseCommaSeparatedList(articleQuantitiesRaw, 'Article Quantities');

	if (articleIds.length !== articleQuantities.length) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Article IDs and quantities must contain the same number of values.',
		);
	}

	const articles = articleIds.map((rawId, index) => {
		const articleLabel = `Article at position ${index + 1}`;
		const normalizedId = Number(rawId);
		if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive integer ID.`,
			);
		}

		const normalizedQuantity = Number(articleQuantities[index]);
		if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive integer quantity.`,
			);
		}

		return {
			ID: normalizedId,
			Cantidad: normalizedQuantity,
		};
	});

	const ids = articles.map((article) => article.ID);
	const qtyById: Record<string, number> = Object.fromEntries(
		articles.map((article) => [String(article.ID), article.Cantidad]),
	);

	let supplierBody: Record<string, unknown>;
	void customerId;
	void formattedProductDate;

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

	let purchaseArticles: helperFns.ResolvedPurchaseArticle[];
	try {
		const resolvedArticles = await helperFns.resolvePurchaseArticles(
			executeFunctions,
			centumUrl,
			headers,
			itemIndex,
			ids,
		);
		purchaseArticles = ids.map((articleId) => {
			const resolvedArticle = resolvedArticles.get(articleId);
			if (!resolvedArticle) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`Article ${articleId} was not found in Centum.`,
				);
			}

			return {
				...resolvedArticle,
				Cantidad: qtyById[String(articleId)] ?? 0,
			};
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
		CompraArticulos: purchaseArticles,
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
	if (!supplierId && !formattedFromDate && !formattedToDate) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one filter before running the search.',
		);
	}

	if ((!fromDate || !toDate)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Both fechaDocumentoDesde and fechaDocumentoHasta are required for Compras/FiltrosCompra.',
		);
	}

	const body = {
		idProveedor: supplierId,
		fechaDocumentoDesde: formattedFromDate,
		fechaDocumentoHasta: formattedToDate,
	};

	try {

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

	const divisionId = executeFunctions.getNodeParameter('divisionEmpresaGrupoEconomicoId', itemIndex, 0) as number;

	try {
		let url = `${centumUrl}/Compras/${parsedPurchaseId}`;
		if (divisionId && divisionId > 0) {
			url += `/${divisionId}`;
		}

		const purchase = await helperFns.apiRequest<any>(url, {
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

	const parseCommaSeparatedList = (value: string, fieldLabel: string): string[] => {
		if (!value.trim()) {
			throw new NodeOperationError(executeFunctions.getNode(), `${fieldLabel} is required.`);
		}

		const values = value.split(',').map((item) => item.trim());
		if (values.some((item) => item.length === 0)) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${fieldLabel} contains an empty value. Use commas only between valid integers.`,
			);
		}

		return values;
	};

	const documentLetter =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentLetter', itemIndex) as string) ??
		'';
	const pointOfSale =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'pointOfSale', itemIndex) as string) ?? '';
	const numero =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentNumber', itemIndex) as string) ??
		'';
	const articleIdsRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleIds', itemIndex, ''),
	);
	const articleQuantitiesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleQuantities', itemIndex, ''),
	);
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

	const articleIds = parseCommaSeparatedList(articleIdsRaw, 'Article IDs');
	const articleQuantities = parseCommaSeparatedList(articleQuantitiesRaw, 'Article Quantities');

	if (articleIds.length !== articleQuantities.length) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Article IDs and quantities must contain the same number of values.',
		);
	}

	const articles = articleIds.map((rawId, index) => {
		const articleLabel = `Article at position ${index + 1}`;
		const normalizedId = Number(rawId);
		if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive integer ID.`,
			);
		}

		const normalizedQuantity = Number(articleQuantities[index]);
		if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive integer quantity.`,
			);
		}

		return {
			ID: normalizedId,
			Cantidad: normalizedQuantity,
		};
	});

	const resolvedArticles = await helperFns.resolvePurchaseArticles(
		executeFunctions,
		centumUrl,
		headers,
		itemIndex,
		articles.map((articleInput) => articleInput.ID),
	);

	const purchaseOrderArticles = await Promise.all(
		articles.map(async (articleInput) => {
			const resolvedArticle = resolvedArticles.get(articleInput.ID);
			if (!resolvedArticle) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`Article ${articleInput.ID} was not found in Centum.`,
				);
			}

			const article: Record<string, number | string | Record<string, number | string>> = {
				Cantidad: articleInput.Cantidad,
				IdArticulo: resolvedArticle.IdArticulo,
				Codigo: resolvedArticle.Codigo,
				Nombre: resolvedArticle.Nombre,
				CategoriaImpuestoIVA: resolvedArticle.CategoriaImpuestoIVA,
				Precio: resolvedArticle.Precio,
				PorcentajeDescuento1: resolvedArticle.PorcentajeDescuento1,
				PorcentajeDescuento2: resolvedArticle.PorcentajeDescuento2,
				PorcentajeDescuento3: resolvedArticle.PorcentajeDescuento3,
			};

			return article;
		}),
	);

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

	if (!deliveryDateFrom) {
		throw new NodeOperationError(executeFunctions.getNode(), 'fromDeliveryDate is required.');
	}

	if (!deliveryDateTo) {
		throw new NodeOperationError(executeFunctions.getNode(), 'sinceDeliveryDate is required.');
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

const listPendingPurchaseOrderArticles: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const startDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const endDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'endDate', itemIndex);
	const fromDeliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'fromDeliveryDate',
		itemIndex,
	);
	const sinceDeliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'sinceDeliveryDate',
		itemIndex,
	);
	const articleIdsRaw = helperFns.getNodeParameterOrThrow(executeFunctions, 'articleIds', itemIndex);
	const supplierIdsRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierIds',
		itemIndex,
	);

	const articleIds = String(articleIdsRaw ?? '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean)
		.map((value) => Number(value))
		.filter((value) => Number.isFinite(value));

	const supplierIds = String(supplierIdsRaw ?? '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean)
		.map((value) => Number(value))
		.filter((value) => Number.isFinite(value));

	const body: Record<string, string | number[] | boolean> = {};

	if (startDate) {
		body.FechaDocumentoDesde = String(startDate);
	}

	if (endDate) {
		body.FechaDocumentoHasta = String(endDate);
	}

	if (fromDeliveryDate) {
		body.FechaEntregaDesde = String(fromDeliveryDate);
	}

	if (sinceDeliveryDate) {
		body.FechaEntregaHasta = String(sinceDeliveryDate);
	}

	if (articleIds.length > 0) {
		body.IdsArticulos = articleIds;
	}

	if (supplierIds.length > 0) {
		body.IdsProveedores = supplierIds;
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/OrdenesCompra/ArticulosPendientes`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);

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
			`Error getting pending purchase order articles: ${errorMessage}`,
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
	listPendingPurchaseOrderArticles: listPendingPurchaseOrderArticles,
};
