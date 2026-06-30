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

	type PurchaseOrderArticleInput = {
		ID: number;
		Cantidad: number;
		Precio?: number;
		PorcentajeDescuento1?: number;
		PorcentajeDescuento2?: number;
		PorcentajeDescuento3?: number;
	};

	const parseCommaSeparatedList = (
		value: string,
		fieldLabel: string,
		valueKind: 'integer' | 'number',
		options: { required?: boolean } = {},
	): string[] => {
		if (!value.trim()) {
			if (options.required === false) {
				return [];
			}

			throw new NodeOperationError(executeFunctions.getNode(), `${fieldLabel} is required.`);
		}

		const values = value.split(',').map((item) => item.trim());
		if (values.some((item) => item.length === 0)) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${fieldLabel} contains an empty value. Use commas only between valid ${valueKind === 'integer' ? 'integers' : 'numbers'}.`,
			);
		}

		return values;
	};

	const documentLetter =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentLetter', itemIndex) as string) ??
		'';
	const pointOfSale = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'pointOfSale', itemIndex, 0),
	);
	const numero = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'documentNumber', itemIndex, 0),
	);
	const articleIdsRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleIds', itemIndex, ''),
	);
	const articleQuantitiesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleQuantities', itemIndex, ''),
	);
	const articlePricesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articlePrices', itemIndex, ''),
	);
	const articleDiscounts1Raw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleDiscounts1', itemIndex, ''),
	);
	const articleDiscounts2Raw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleDiscounts2', itemIndex, ''),
	);
	const articleDiscounts3Raw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleDiscounts3', itemIndex, ''),
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
	const supplierIdRaw = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierId', itemIndex),
	);
	const supplierId = String(supplierIdRaw ?? '').trim();
	const deliveryTimeSlotId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'deliveryTimeSlotId', itemIndex, ''),
	);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex, ''),
	);
	const rawPurchaseOperatorId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'purchaseOperatorId',
		itemIndex,
		0,
	);
	const purchaseOperatorId = Number(rawPurchaseOperatorId);

	if (!supplierId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'supplierId must be specified.');
	}

	if (purchaseOperatorId !== 0 && (!Number.isInteger(purchaseOperatorId) || purchaseOperatorId <= 0)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'purchaseOperatorId must be a positive integer.',
		);
	}

	if (!Number.isFinite(pointOfSale) || pointOfSale < 0 || !Number.isInteger(pointOfSale)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'pointOfSale must be zero or a positive integer.',
		);
	}

	if (!Number.isFinite(numero) || numero < 0 || !Number.isInteger(numero)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'documentNumber must be zero or a positive integer.',
		);
	}

	const articleIds = parseCommaSeparatedList(articleIdsRaw, 'Article IDs', 'integer');
	const articleQuantities = parseCommaSeparatedList(
		articleQuantitiesRaw,
		'Article Quantities',
		'number',
	);
	const articlePrices = parseCommaSeparatedList(articlePricesRaw, 'Article Prices', 'number', {
		required: false,
	});
	const articleDiscounts1 = parseCommaSeparatedList(
		articleDiscounts1Raw,
		'Article Discount 1',
		'number',
		{ required: false },
	);
	const articleDiscounts2 = parseCommaSeparatedList(
		articleDiscounts2Raw,
		'Article Discount 2',
		'number',
		{ required: false },
	);
	const articleDiscounts3 = parseCommaSeparatedList(
		articleDiscounts3Raw,
		'Article Discount 3',
		'number',
		{ required: false },
	);

	if (
		articleIds.length !== articleQuantities.length ||
		(articlePrices.length > 0 && articleIds.length !== articlePrices.length) ||
		(articleDiscounts1.length > 0 && articleIds.length !== articleDiscounts1.length) ||
		(articleDiscounts2.length > 0 && articleIds.length !== articleDiscounts2.length) ||
		(articleDiscounts3.length > 0 && articleIds.length !== articleDiscounts3.length)
	) {
		const hasManualDiscounts =
			articleDiscounts1.length > 0 || articleDiscounts2.length > 0 || articleDiscounts3.length > 0;
		throw new NodeOperationError(
			executeFunctions.getNode(),
			articlePrices.length > 0 || hasManualDiscounts
				? 'Article IDs, quantities, prices, and manual discounts must contain the same number of values when provided.'
				: 'Article IDs and quantities must contain the same number of values.',
		);
	}

	const articles: PurchaseOrderArticleInput[] = articleIds.map((rawId, index) => {
		const articleLabel = `Article at position ${index + 1}`;
		const normalizedId = Number(rawId);
		if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive integer ID.`,
			);
		}

		const normalizedQuantity = Number(articleQuantities[index]);
		if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive quantity.`,
			);
		}

		const normalizedPrice =
			articlePrices.length > 0 ? Number(articlePrices[index]) : undefined;
		if (
			normalizedPrice !== undefined &&
			(!Number.isFinite(normalizedPrice) || normalizedPrice <= 0)
		) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive price.`,
			);
		}

		const normalizedDiscount1 =
			articleDiscounts1.length > 0 ? Number(articleDiscounts1[index]) : undefined;
		if (
			normalizedDiscount1 !== undefined &&
			(!Number.isFinite(normalizedDiscount1) || normalizedDiscount1 < 0 || normalizedDiscount1 > 100)
		) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a discount 1 between 0 and 100.`,
			);
		}

		const normalizedDiscount2 =
			articleDiscounts2.length > 0 ? Number(articleDiscounts2[index]) : undefined;
		if (
			normalizedDiscount2 !== undefined &&
			(!Number.isFinite(normalizedDiscount2) || normalizedDiscount2 < 0 || normalizedDiscount2 > 100)
		) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a discount 2 between 0 and 100.`,
			);
		}

		const normalizedDiscount3 =
			articleDiscounts3.length > 0 ? Number(articleDiscounts3[index]) : undefined;
		if (
			normalizedDiscount3 !== undefined &&
			(!Number.isFinite(normalizedDiscount3) || normalizedDiscount3 < 0 || normalizedDiscount3 > 100)
		) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a discount 3 between 0 and 100.`,
			);
		}

		return {
			ID: normalizedId,
			Cantidad: normalizedQuantity,
			Precio: normalizedPrice,
			PorcentajeDescuento1: normalizedDiscount1,
			PorcentajeDescuento2: normalizedDiscount2,
			PorcentajeDescuento3: normalizedDiscount3,
		};
	});

	const effectivePurchaseOperatorId = purchaseOperatorId > 0 ? purchaseOperatorId : 1;

	const resolvedArticles = await helperFns.resolvePurchaseArticles(
		executeFunctions,
		centumUrl,
		headers,
		itemIndex,
		articles.map((articleInput) => articleInput.ID),
		{ preserveDiscountPresence: true },
	);

	const purchaseOrderArticles = await Promise.all(
		articles.map(async (articleInput, index) => {
			const articleLabel = `Article at position ${index + 1}`;
			const resolvedArticle = resolvedArticles.get(articleInput.ID);
			if (!resolvedArticle) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`Article ${articleInput.ID} was not found in Centum.`,
				);
			}

			const finalPrice = articleInput.Precio ?? resolvedArticle.Precio;
			if (!Number.isFinite(finalPrice) || finalPrice <= 0) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`${articleLabel} must have a positive price. Provide articlePrices or configure PrecioListaCompra in Centum.`,
				);
			}

			const article: Record<string, number | string | Record<string, number | string>> = {
				Cantidad: articleInput.Cantidad,
				IdArticulo: resolvedArticle.IdArticulo,
				Codigo: resolvedArticle.Codigo,
				Nombre: resolvedArticle.Nombre,
				CategoriaImpuestoIVA: resolvedArticle.CategoriaImpuestoIVA,
				Precio: finalPrice,
			};

			if (resolvedArticle.DiscountPresence?.PorcentajeDescuento1) {
				article.PorcentajeDescuento1 = resolvedArticle.PorcentajeDescuento1;
			}

			if (articleInput.PorcentajeDescuento1 !== undefined) {
				article.PorcentajeDescuento1 = articleInput.PorcentajeDescuento1;
			}

			if (resolvedArticle.DiscountPresence?.PorcentajeDescuento2) {
				article.PorcentajeDescuento2 = resolvedArticle.PorcentajeDescuento2;
			}

			if (articleInput.PorcentajeDescuento2 !== undefined) {
				article.PorcentajeDescuento2 = articleInput.PorcentajeDescuento2;
			}

			if (resolvedArticle.DiscountPresence?.PorcentajeDescuento3) {
				article.PorcentajeDescuento3 = resolvedArticle.PorcentajeDescuento3;
			}

			if (articleInput.PorcentajeDescuento3 !== undefined) {
				article.PorcentajeDescuento3 = articleInput.PorcentajeDescuento3;
			}

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
	const bodyOrdenCompra: Record<string, unknown> = {
		FechaDocumento: `${formattedDocumentDate}T00:00:00`,
		FechaEntrega: `${formattedDeliveryDate}T00:00:00`,
		Proveedor: supplierInfo,
		OrdenCompraArticulos: purchaseOrderArticles,
		FechaVencimiento: `${formattedDueDate}T00:00:00`,
		OperadorCompra: {
			IdOperadorCompra: effectivePurchaseOperatorId,
		},
	};

	if (branchId.trim()) {
		bodyOrdenCompra.SucursalFisica = {
			IdSucursalFisica: branchId,
		};
	}

	if (deliveryTimeSlotId.trim()) {
		bodyOrdenCompra.TurnoEntrega = {
			IdTurnoEntrega: deliveryTimeSlotId,
		};
	}

	const numeroDocumento: Record<string, string | number> = {};
	if (documentLetter.trim()) {
		numeroDocumento.LetraDocumento = documentLetter.trim();
	}
	if (pointOfSale > 0) {
		numeroDocumento.PuntoVenta = pointOfSale;
	}
	if (numero > 0) {
		numeroDocumento.Numero = numero;
		bodyOrdenCompra.NumeroDocumento = numeroDocumento;
	}

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
