import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const createSalesOrder: ResourceHandler = async (context) => {
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
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
	) as string;
	const articlesRaw = helperFns.getNodeParameterOrThrow(executeFunctions, 'article', itemIndex);
	const customerCode = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'customerCode',
		itemIndex,
	) as string;
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const formattedDocumentDate = String(documentDate).split('T')[0];
	const discountId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'discountId', itemIndex),
	);
	const deliveryTimeSlotId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'deliveryTimeSlotId', itemIndex),
	);
	const deliveryDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'deliveryDate',
		itemIndex,
	);
	const sellerId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesOrderSellerId',
		itemIndex,
	);
	const sellerIdValue = helperFns.getResourceLocatorValue(sellerId);

	let articles: ArticuloInput[];

	if (typeof articlesRaw === 'string') {
		try {
			const parsed = JSON.parse(articlesRaw);

			if (typeof parsed === 'object' && !Array.isArray(parsed)) {
				articles = [parsed] as ArticuloInput[];
			} else if (Array.isArray(parsed)) {
				articles = parsed as ArticuloInput[];
			} else {
				throw new NodeOperationError(executeFunctions.getNode(), 'Invalid format');
			}
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Article format is invalid. Valid examples: {"ID": 1271, "Cantidad": 10}, {"Codigo": "ABC123", "Cantidad": 10}, or arrays of those objects.',
			);
		}
	} else if (Array.isArray(articlesRaw)) {
		articles = articlesRaw as ArticuloInput[];
	} else if (typeof articlesRaw === 'object' && articlesRaw !== null) {
		articles = [articlesRaw as ArticuloInput];
	} else {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Unexpected data type: ${typeof articlesRaw}`,
		);
	}

	let clientId: number;
	let queryParams = '';

	if (!businessName.trim() && !customerCode.trim()) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Customer code or business name is required.',
		);
	}

	if (!Array.isArray(articles) || articles.length === 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one article with its quantity.',
		);
	}

	// Validate that each article includes either an ID or a code
	for (const art of articles) {
		if (!art.ID && !art.Codigo) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Each article must include either an ID or a Code.',
			);
		}
	}

	if (!sellerIdValue) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Seller is required.');
	}

	if (customerCode) queryParams = `codigo=${encodeURIComponent(customerCode)}`;
	if (businessName) queryParams = `razonSocial=${encodeURIComponent(businessName)}`;

	/* 1st Request to get Client ID */
	try {
		const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes?${queryParams}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		const customer = dataCliente?.Items?.[0];
		if (!customer?.IdCliente) {
			throw new NodeOperationError(executeFunctions.getNode(), 'Customer not found.');
		}
		clientId = customer.IdCliente;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Error getting customer.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}

	/* 2nd request to get article data */
	const results: any[] = [];

	for (const articleInput of articles) {
		try {
			// Build the request body dynamically depending on whether an ID or code is present
			const articleBody: any = {
				IdCliente: clientId,
				FechaDocumento: formattedDocumentDate,
			};

			// Use Ids (plural) when an ID is present, or Codigo (singular) when a code is present
			if (articleInput.ID) {
				articleBody.Ids = [articleInput.ID];
			} else if (articleInput.Codigo) {
				articleBody.Codigo = articleInput.Codigo;
			}

			const articleData = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body: articleBody,
			});

			const items = articleData?.Articulos?.Items ?? [];
			if (items.length > 0) {
				const itemsConCantidad = items.map((item: any) => ({
					...item,
					Cantidad: articleInput.Cantidad,
				}));

				results.push(...itemsConCantidad);
			}
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			results.push({
				id: articleInput.ID,
				codigo: articleInput.Codigo,
				error: (error as any).message || 'Unknown error',
			});
		}
	}

	const bodyPedidoVenta = {
		Bonificacion: {
			IdBonificacion: discountId,
		},
		PedidoVentaArticulos: results,
		Cliente: {
			IdCliente: clientId,
		},
		Vendedor: {
			IdVendedor: Number(sellerIdValue),
		},
		TurnoEntrega: {
			IdTurnoEntrega: deliveryTimeSlotId,
		},
		FechaEntrega: deliveryDate,
	};

	try {
		const salesOrderResponse = await helperFns.apiRequest<any>(`${centumUrl}/PedidosVenta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: bodyPedidoVenta,
		});
		return [executeFunctions.helpers.returnJsonArray(salesOrderResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Error creating sales order.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getSalesOrderDetails: ResourceHandler = async (context) => {
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

	const salesOrderId = helperFns.getNodeParameterOrThrow(executeFunctions, 'id', itemIndex);
	try {
		const dataActividad = await helperFns.apiRequest<any>(
			`${centumUrl}/PedidosVenta/${salesOrderId}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(dataActividad)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listSalesOrderStatuses: ResourceHandler = async (context) => {
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
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/EstadosPedidoVenta?bIncluirTodosEstados=true`,
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
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listSalesOrders: ResourceHandler = async (context) => {
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

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const salesOrderId = helperFns.getNodeParameterOrThrow(executeFunctions, 'saleId', itemIndex);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const includeCanceled = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'includeCanceled',
		itemIndex,
	);
	const createdByUserId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'createdByUserId',
		itemIndex,
	);
	const transportId = helperFns.getNodeParameterOrThrow(executeFunctions, 'transportId', itemIndex);
	const statusIds = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'statusId', itemIndex),
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

	if (!customerId && !statusIds && !formattedFromDate && !formattedToDate) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one filter before running the search.',
		);
	}

	const body = {
		idCliente: customerId,
		fechaDocumentoDesde: formattedFromDate,
		fechaDocumentoHasta: formattedToDate,
		idsEstado: statusIds,
		idPedidoDeVenta: salesOrderId,
		idSucursal: branchId,
		incluirAnulados: includeCanceled,
		idUsuarioCreador: createdByUserId,
		idTransporte: transportId,
	};

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/PedidosVenta/FiltrosPedidoVenta`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting sales orders for customer ${customerId}: ${errorMessage}`,
		);
	}
};

const listFilteredSalesOrders: ResourceHandler = async (context) => {
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

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const statusIds = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'statusId', itemIndex),
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
	if (!customerId && !statusIds && !formattedFromDate && !formattedToDate) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one filter before running the search.',
		);
	}

	const body = {
		idCliente: customerId,
		fechaDocumentoDesde: formattedFromDate,
		fechaDocumentoHasta: formattedToDate,
		idsEstado: statusIds,
	};

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/PedidosVenta/FiltrosPedidoVentaConsulta`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting filtered sales orders for customer ${customerId}: ${errorMessage}`,
		);
	}
};

const createSale: ResourceHandler = async (context) => {
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

	const pointOfSaleNumber = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'pointOfSale',
		itemIndex,
	) as number;
	const discount = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'saleDiscountId',
		itemIndex,
		'',
	) as string;
	const isCashSale = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'isCashSale',
		itemIndex,
	) as boolean;
	const customerId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
		),
	);
	const salesConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesConditionId',
		itemIndex,
	) as number;
	const tipoComprobanteVenta = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'voucherTypeId', itemIndex),
		),
	);
	const sellerId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'sellerId', itemIndex),
		),
	);
	const priceListId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'priceListId', itemIndex),
	);

	// === articlesCollection como STRING, luego parse ===
	const articlesCollectionRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articlesCollection',
		itemIndex,
		'',
	) as string;
	let articlesArray: Array<{ ID: string; Cantidad: number }> = [];
	try {
		articlesArray = JSON.parse(articlesCollectionRaw);
		if (!Array.isArray(articlesArray)) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'The articlesCollection field must be a valid JSON array.',
			);
		}
	} catch (err) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`The articlesCollection field must be a valid JSON string. Example:[{"ID":"1450","Cantidad":2},{"ID":"1451","Cantidad":5}] Error: ${(err as any)?.message ?? String(err)}`,
		);
	}

	const fromDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
		'',
	) as string;
	const formattedFromDate = String(fromDate).split('T')[0];

	// Conditional fields may not exist when isCashSale is false
	const cashValueId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashValueId',
		itemIndex,
		null,
	) as number | null;
	const cashExchangeRateValue = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashValueExchangeRate',
		itemIndex,
		null,
	) as number | null;
	const cashAmountValue = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashValueAmount',
		itemIndex,
		null,
	) as number | null;
	const cashValueNotes = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashValueNotes',
		itemIndex,
		'',
	) as string;
	const cashInstallmentCount = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashValueInstallmentCount',
		itemIndex,
		null,
	) as number | null;

	// Minimum validations
	if (!pointOfSaleNumber)
		throw new NodeOperationError(executeFunctions.getNode(), 'Point of sale is required.');
	if (!tipoComprobanteVenta)
		throw new NodeOperationError(executeFunctions.getNode(), 'Sales voucher type is required.');
	if (!customerId)
		throw new NodeOperationError(executeFunctions.getNode(), 'Customer ID is required.');
	if (!priceListId)
		throw new NodeOperationError(executeFunctions.getNode(), 'Price list ID is required.');
	if (!articlesArray?.length)
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one article in articlesCollection.',
		);

	// When the sale is cash-based, validate the required fields
	if (isCashSale === true) {
		if (cashValueId == null)
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Cash value ID is required when Cash Sale is true.',
			);
		if (cashAmountValue == null)
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Cash amount is required when Cash Sale is true.',
			);
	}

	// Build article IDs and quantity map using the same approach as purchases
	const ids = articlesArray.map((a) => a.ID);
	const qtyById: Record<string, number> = Object.fromEntries(
		articlesArray.map((a) => [a.ID, a.Cantidad]),
	);

	// 1) Fetch article information for the sale
	let saleItemsWithQuantity: any[] = [];
	try {
		const salesArticlesBody = {
			IdCliente: customerId,
			FechaDocumento: formattedFromDate,
			Ids: ids,
		};

		let salesArticlesResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: 'POST',
			body: salesArticlesBody,
		});
		const salesPayload =
			typeof salesArticlesResponse === 'string'
				? JSON.parse(salesArticlesResponse)
				: salesArticlesResponse;

		const responseItems: any[] =
			salesPayload?.Articulos?.Items ?? salesPayload?.VentaArticulos ?? salesPayload?.Items ?? [];

		// Attach the original quantity using IdArticulo as the lookup key
		saleItemsWithQuantity = responseItems.map((art: any) => ({
			...art,
			Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
		}));
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			(error as any)?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting sale articles.\n${errorMessage}`,
		);
	}

	// 2) Build the sale request body
	const bodyVenta: any = {
		NumeroDocumento: { PuntoVenta: Number(pointOfSaleNumber) },
		EsContado: Boolean(isCashSale),
		Cliente: { IdCliente: Number(customerId) },
		CondicionVenta: { IdCondicionVenta: Number(salesConditionId) },
		Observaciones: 'Venta desde API',
		TipoComprobanteVenta: { IdTipoComprobanteVenta: Number(tipoComprobanteVenta) },
		Vendedor: { IdVendedor: Number(sellerId) },
		ListaPrecio: { IdListaPrecio: Number(priceListId) },
		VentaArticulos: saleItemsWithQuantity,
		PorcentajeDescuento: 0,
	};

	// Optional discount
	if (discount) {
		bodyVenta.Bonificacion = { IdBonificacion: discount };
	}

	// 3) Add VentaValoresEfectivos only when it applies and values are valid
	if (isCashSale === true) {
		const exchangeRate =
			!cashExchangeRateValue || cashExchangeRateValue <= 0 ? 0 : Number(cashExchangeRateValue);
		const installmentCount =
			!cashInstallmentCount || cashInstallmentCount <= 0 ? 0 : Number(cashInstallmentCount);

		bodyVenta.VentaValoresEfectivos = [
			{
				IdValor: Number(cashValueId),
				Cotizacion: exchangeRate,
				Importe: Number(cashAmountValue),
				Observaciones: cashValueNotes || '',
				CantidadCuotas: installmentCount,
			},
		];
	}

	// 4) Final POST request
	try {
		const url = `${centumUrl}/Ventas?verificaLimiteCreditoCliente=false&verificaStockNegativo=false&verificaCuotificador=false`;

		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: bodyVenta,
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
			`Error creating sale.\n${errorMessage}`,
		);
	}
};

const listSalesInvoices: ResourceHandler = async (context) => {
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

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const saleId = helperFns.getNodeParameterOrThrow(executeFunctions, 'saleId', itemIndex);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const divisionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessDivisionId',
		itemIndex,
	);
	const includeCanceled = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'includeCanceled',
		itemIndex,
	);
	const createdByUserId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'createdByUserId',
		itemIndex,
	);
	const transportId = helperFns.getNodeParameterOrThrow(executeFunctions, 'transportId', itemIndex);
	const voucherTypeId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'voucherTypeId', itemIndex),
	);
	const currentAccountCustomerId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'currentAccountId',
		itemIndex,
	);
	const sellerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'sellerId', itemIndex),
	);
	const salesChannelId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesChannelId',
		itemIndex,
	);
	const fromDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const toDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'endDate', itemIndex);

	if (!fromDate || !toDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Both from and to dates are required');
	}

	const body: Record<string, any> = {
		fechaDocumentoDesde: String(fromDate).split('T')[0],
		fechaDocumentoHasta: String(toDate).split('T')[0],
	};

	customerId && (body.idCliente = customerId);
	saleId && (body.idVenta = saleId);
	branchId && (body.idSucursal = branchId);
	divisionId && (body.idDivisionEmpresa = divisionId);
	createdByUserId && (body.idUsuarioCreador = createdByUserId);
	transportId && (body.idTransporte = transportId);
	voucherTypeId && (body.idTipoComprobante = voucherTypeId);
	currentAccountCustomerId && (body.idClienteCuentaCorriente = currentAccountCustomerId);
	sellerId && (body.idVendedor = sellerId);
	salesChannelId && (body.idCanalVenta = salesChannelId);
	includeCanceled && (body.incluirAnulados = includeCanceled);

	const response = await helperFns.apiRequest<any>(`${centumUrl}/Ventas/FiltrosVentaConsulta`, {
		context: executeFunctions,
		debugItemIndex: itemIndex,
		method: 'POST',
		headers,
		body,
	});
	if (!response || typeof response !== 'object') {
		throw new NodeOperationError(executeFunctions.getNode(), 'Invalid server response.');
	}

	return [executeFunctions.helpers.returnJsonArray(response)];
};

const listSalesInvoicesById: ResourceHandler = async (context) => {
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

	const saleIdParam = helperFns.getNodeParameterOrThrow(executeFunctions, 'saleId', itemIndex);

	// Parameter validation
	const saleId = Number(saleIdParam);
	if (isNaN(saleId) || saleId <= 0) {
		throw new NodeOperationError(executeFunctions.getNode(), 'saleId must be a positive number.');
	}

	try {
		const sale = await helperFns.apiRequest<any>(`${centumUrl}/Ventas/${saleId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(sale)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting sales invoices for sale ${saleId}: ${errorMessage}`,
		);
	}
};

const listSalesVouchers: ResourceHandler = async (context) => {
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
		const response = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobanteVenta`, {
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
			`Error getting sales voucher list: ${errorMessage}`,
		);
	}
};

const listPrices: ResourceHandler = async (context) => {
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
		const response = await helperFns.apiRequest<any>(`${centumUrl}/ListasPrecios`, {
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
			`Error getting price list.\n${errorMessage}`,
		);
	}
};

const listPromotions: ResourceHandler = async (context) => {
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

	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex, ''),
	);
	const weekday = helperFns.getNodeParameterOrThrow(executeFunctions, 'weekday', itemIndex, '');
	const formattedDocumentDate = String(documentDate).split('T')[0];

	const body: Record<string, unknown> = {
		FechaDocumento: formattedDocumentDate,
	};

	if (customerId) {
		body.IdsCliente = Number(customerId);
	}

	if (weekday !== '' && weekday !== null && weekday !== undefined) {
		body.DiaSemana = weekday;
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);

		if (response.Items && Array.isArray(response.Items)) {
			return [executeFunctions.helpers.returnJsonArray(response.Items)];
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
			`Error getting promotions.\n${errorMessage}`,
		);
	}
};

const getSalesRanking: ResourceHandler = async (context) => {
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

	const fromDateString = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
	);
	const toDateString = helperFns.getNodeParameterOrThrow(executeFunctions, 'endDate', itemIndex);
	const rankingType = helperFns.getNodeParameterOrThrow(executeFunctions, 'rankingType', itemIndex);
	const orderByRanking = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesRankingOrderBy',
		itemIndex,
	);
	const orderAsc = helperFns.getNodeParameterOrThrow(executeFunctions, 'orderAsc', itemIndex);
	const itemCount = helperFns.getNodeParameterOrThrow(executeFunctions, 'itemCount', itemIndex);
	const groupId = helperFns.getNodeParameterOrThrow(executeFunctions, 'groupId', itemIndex);
	const priceListId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'priceListId', itemIndex),
	);

	const fromDate = String(fromDateString).split('T')[0];
	const toDate = String(toDateString).split('T')[0];

	let url = `${centumUrl}/EstadisticaVentaRanking/${itemCount}`;

	if (fromDate && toDate) {
		url += `?fechaDocumentoDesde=${fromDate}&fechaDocumentoHasta=${toDate}`;
	} else {
		throw new NodeOperationError(executeFunctions.getNode(), 'Both date periods are required.');
	}

	if (groupId) {
		url += `&idsRubro=${groupId}`;
	}

	if (priceListId) {
		url += `&idsListaPrecio=${priceListId}`;
	}

	if (rankingType) {
		const rankingTypeMap: Record<string, string> = {
			customers: 'esRankingClientes',
			articles: 'esRankingArticulos',
			sellers: 'esRankingVendedores',
		};
		const apiRankingType = rankingTypeMap[String(rankingType)];
		if (apiRankingType) {
			url += `&${apiRankingType}=true`;
		}
	}

	// OrderBy while preserving the current conditional logic
	if (orderByRanking) {
		const orderByRankingMap: Record<string, string> = {
			quantityUnitLevel0: 'CantidadUnidadNivel0',
			quantityUnitLevel1: 'CantidadUnidadNivel1',
			quantityUnitLevel2: 'CantidadUnidadNivel2',
			netTotalAmount: 'ImporteTotalNeto',
			finalTotalAmount: 'ImporteTotalFinal',
		};
		const apiOrderByRanking = orderByRankingMap[String(orderByRanking)];
		if (apiOrderByRanking) {
			url += `&tipoOrdenEstadisticaVentaRanking=${apiOrderByRanking}`;
		}
	}
	if (typeof orderAsc === 'boolean') {
		if (!orderByRanking) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'"salesRankingOrderBy" must be specified when "orderAsc" is provided, as required by the EstadisticaVentaRanking endpoint.',
			);
		}
		url += `&ordenEstadisticaVentaRankingAscendente=${orderAsc}`;
	}

	try {
		const response = await helperFns.apiRequest<any>(`${url}`, {
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
			`Error getting ranking statistics.\n${errorMessage}`,
		);
	}
};

export const salesHandlers: ResourceHandlerMap = {
	Get: listPromotions,
	createSalesOrder: createSalesOrder,
	getSalesOrderDetails: getSalesOrderDetails,
	listSalesOrderStatuses: listSalesOrderStatuses,
	listSalesOrders: listSalesOrders,
	listFilteredSalesOrders: listFilteredSalesOrders,
	createSale: createSale,
	listSalesInvoices: listSalesInvoices,
	listSalesInvoicesById: listSalesInvoicesById,
	listSalesVouchers: listSalesVouchers,
	listPrices: listPrices,
	getSalesRanking: getSalesRanking,
};
