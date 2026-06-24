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
		ID: number;
		Cantidad: number;
		Precio: number;
	};

	const parseCommaSeparatedList = (
		value: string,
		fieldLabel: string,
		valueKind: 'integer' | 'number',
	): string[] => {
		if (!value.trim()) {
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
	const articlePricesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articlePrices', itemIndex, ''),
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
	const documentTime =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentTime', itemIndex, '') as string) ??
		'';
	const deliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryDate',
		itemIndex,
	) as string;
	const formattedDeliveryDate = normalizeDateTime(deliveryDate);
	const dueDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'dueDate',
		itemIndex,
	) as string;
	const formattedDueDate = normalizeDateTime(dueDate);
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
	const transportId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transportId', itemIndex),
	);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const branchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'branchSectionId', itemIndex, 0),
	);
	const divisionCompanyGroupIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryNoteDivisionCompanyGroupId',
		itemIndex,
		'',
	);
	const purchaseOperatorId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'purchaseOperatorId', itemIndex),
	);
	const notes = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'notes',
		itemIndex,
		'',
	) as string;
	const qualityAnalysisNumber = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'qualityAnalysisNumber',
		itemIndex,
		'',
	) as string;
	const divisionCompanyGroupId =
		String(divisionCompanyGroupIdRaw).trim() === '' ? undefined : Number(divisionCompanyGroupIdRaw);

	if (!supplierId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'idProveedor must be specified.');
	}

	if (!formattedDocumentDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'documentDate is required.');
	}

	if (!Number.isInteger(purchaseOperatorId) || purchaseOperatorId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'purchaseOperatorId must be a positive integer.',
		);
	}

	if (
		divisionCompanyGroupId !== undefined &&
		(!Number.isInteger(divisionCompanyGroupId) || divisionCompanyGroupId <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'divisionCompanyGroupId must be a positive integer.',
		);
	}

	if (branchSectionId < 0 || !Number.isInteger(branchSectionId)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'branchSectionId must be zero or a positive integer.',
		);
	}

	const articleIds = parseCommaSeparatedList(articleIdsRaw, 'Article IDs', 'integer');
	const articleQuantities = parseCommaSeparatedList(
		articleQuantitiesRaw,
		'Article Quantities',
		'integer',
	);
	const articlePrices = parseCommaSeparatedList(articlePricesRaw, 'Article Prices', 'number');

	if (
		articleIds.length !== articleQuantities.length ||
		articleIds.length !== articlePrices.length
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Article IDs, quantities, and prices must contain the same number of values.',
		);
	}

	const articles: ArticuloInput[] = articleIds.map((rawId, index) => {
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

		const normalizedPrice = Number(articlePrices[index]);
		if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive price.`,
			);
		}

		return {
			ID: normalizedId,
			Cantidad: normalizedQuantity,
			Precio: normalizedPrice,
		};
	});

	const resolvedArticles = await helperFns.resolvePurchaseArticles(
		executeFunctions,
		centumUrl,
		headers,
		itemIndex,
		articles.map((articleInput) => articleInput.ID),
	);

	// RemitosCompra expects purchase-side article payloads and does not use a customer context.
	const purchaseDeliveryNoteArticles = await Promise.all(articles.map(async (articleInput) => {
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

		if (articleInput.Precio !== undefined) {
			article.Precio = articleInput.Precio;
		}

		return article;
	}));

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
	const bodyRemitoCompra: Record<string, unknown> = {
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
		Proveedor: supplierInfo,
		RemitoCompraArticulos: purchaseDeliveryNoteArticles,
		Observaciones: notes,
		OperadorCompra: {
			IdOperadorCompra: purchaseOperatorId,
		},
		IdChofer: Number(driverId),
	};

	if (documentTime) {
		bodyRemitoCompra.HoraDocumento = documentTime;
	}

	if (formattedDeliveryDate) {
		bodyRemitoCompra.FechaEntrega = formattedDeliveryDate;
	}

	if (formattedDueDate) {
		bodyRemitoCompra.FechaVencimiento = formattedDueDate;
	}

	if (qualityAnalysisNumber.trim()) {
		bodyRemitoCompra.NumeroAnalisisCalidad = qualityAnalysisNumber.trim();
	}

	if (branchSectionId > 0) {
		bodyRemitoCompra.SeccionSucursal = {
			IdSeccionSucursal: branchSectionId,
		};
	}

	if (transportId) {
		bodyRemitoCompra.Transporte = {
			IdTransporte: Number(transportId),
		};
	}

	if (divisionCompanyGroupId !== undefined) {
		bodyRemitoCompra.DivisionEmpresaGrupoEconomico = {
			IdDivisionEmpresaGrupoEconomico: divisionCompanyGroupId,
		};
	}

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
	const branchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'branchSectionId', itemIndex, 0),
	);
	const divisionCompanyGroupIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryNoteDivisionCompanyGroupId',
		itemIndex,
		'',
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
	const documentTime =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'documentTime', itemIndex, '') as string) ??
		'';
	const divisionCompanyGroupId =
		String(divisionCompanyGroupIdRaw).trim() === '' ? undefined : Number(divisionCompanyGroupIdRaw);

	if (!formattedDocumentDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'documentDate is required.');
	}

	if (
		divisionCompanyGroupId !== undefined &&
		(!Number.isInteger(divisionCompanyGroupId) || divisionCompanyGroupId <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'divisionCompanyGroupId must be a positive integer.',
		);
	}

	if (branchSectionId < 0 || !Number.isInteger(branchSectionId)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'branchSectionId must be zero or a positive integer.',
		);
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
	const transportId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transportId', itemIndex),
	);
	const notes = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'notes',
		itemIndex,
		'',
	) as string;
	const qualityAnalysisNumber = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'qualityAnalysisNumber',
		itemIndex,
		'',
	) as string;

	if (!transportId) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'transportId is required to create a sales delivery note.',
		);
	}

	const driverId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'driverId', itemIndex, ''),
	);
	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const parseCommaSeparatedList = (
		value: string,
		fieldLabel: string,
		valueKind: 'integer' | 'number',
	): string[] => {
		if (!value.trim()) {
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

	type SalesDeliveryArticleInput = { ID: number; Cantidad: number; Precio: number };

	const articleIdsRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleIds', itemIndex, ''),
	);
	const articleQuantitiesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articleQuantities', itemIndex, ''),
	);
	const articlePricesRaw = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'articlePrices', itemIndex, ''),
	);
	const articleIds = parseCommaSeparatedList(articleIdsRaw, 'Article IDs', 'integer');
	const articleQuantities = parseCommaSeparatedList(
		articleQuantitiesRaw,
		'Article Quantities',
		'integer',
	);
	const articlePrices = parseCommaSeparatedList(articlePricesRaw, 'Article Prices', 'number');

	if (
		articleIds.length !== articleQuantities.length ||
		articleIds.length !== articlePrices.length
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Article IDs, quantities, and prices must contain the same number of values.',
		);
	}

	const articlesArray: SalesDeliveryArticleInput[] = articleIds.map((rawId, index) => {
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

		const normalizedPrice = Number(articlePrices[index]);
		if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`${articleLabel} must have a positive price.`,
			);
		}

		return {
			ID: normalizedId,
			Cantidad: normalizedQuantity,
			Precio: normalizedPrice,
		};
	});

	// Only the IDs are sent to the /Articulos/Venta request
	const ids = articlesArray.map((a) => a.ID);
	// Map article ID to quantity
	const qtyById: Record<string, number> = Object.fromEntries(
		articlesArray.map((a) => [String(a.ID), a.Cantidad]),
	);
	const priceById: Record<string, number> = Object.fromEntries(
		articlesArray.map((a) => [String(a.ID), a.Precio]),
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
		PorcentajeDescuento: 0.0,
		Observaciones: notes,
		RemitoVentaArticulos: purchaseItemsWithQuantity,
		Transporte: {
			IdTransporte: Number(transportId),
		},
	};

	if (documentTime) {
		salesDeliveryNoteBody.HoraDocumento = documentTime;
	}

	if (branchSectionId > 0) {
		salesDeliveryNoteBody.SeccionSucursal = {
			IdSeccionSucursal: branchSectionId,
		};
	}

	if (driverId) {
		salesDeliveryNoteBody.IdChofer = Number(driverId);
	}

	if (formattedShipmentDate) {
		salesDeliveryNoteBody.FechaEmbarque = formattedShipmentDate;
	}

	if (formattedIndictmentDate) {
		salesDeliveryNoteBody.FechaImputacion = formattedIndictmentDate;
	}

	if (formattedDeliveryDate) {
		salesDeliveryNoteBody.FechaEntrega = formattedDeliveryDate;
	}

	if (qualityAnalysisNumber.trim()) {
		salesDeliveryNoteBody.NumeroAnalisisCalidad = qualityAnalysisNumber.trim();
	}

	if (divisionCompanyGroupId !== undefined) {
		salesDeliveryNoteBody.DivisionEmpresaGrupoEconomico = {
			IdDivisionEmpresaGrupoEconomico: divisionCompanyGroupId,
		};
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

const listChoferes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Choferes`, {
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
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listBranchSections: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/SeccionesSucursales`, {
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
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getBranchSection: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const branchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'branchSectionId', itemIndex, 0),
	);

	if (!Number.isInteger(branchSectionId) || branchSectionId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'branchSectionId must be a positive integer.',
			{ itemIndex },
		);
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/SeccionesSucursales/${encodeURIComponent(String(branchSectionId))}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
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

const listTransports: ResourceHandler = async (context) => {
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
		const transports = await helperFns.apiRequest<any>(`${centumUrl}/Transportes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(transports)];
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
	listChoferes: listChoferes,
	listBranchSections: listBranchSections,
	getBranchSection: getBranchSection,
	listDeliveryTimeSlots: listDeliveryTimeSlots,
	listPhysicalBranches: listPhysicalBranches,
	listTransports: listTransports,
};
