import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { CentumHeaders, ResourceHandler, ResourceHandlerMap } from './types';

const extractCalculatedSaleTotal = (sale: any): number | null => {
	const candidates = [sale?.Total, sale?.Venta?.Total, sale?.data?.Total, sale?.data?.Venta?.Total];

	for (const candidate of candidates) {
		const numericValue = Number(candidate);
		if (Number.isFinite(numericValue) && numericValue > 0) {
			return numericValue;
		}
	}

	const saleArticles = Array.isArray(sale?.VentaArticulos) ? sale.VentaArticulos : [];
	const saleConcepts = Array.isArray(sale?.VentaConceptos) ? sale.VentaConceptos : [];
	const specialRegimes = Array.isArray(sale?.VentaRegimenesEspeciales)
		? sale.VentaRegimenesEspeciales
		: [];
	const promotionDiscounts = Array.isArray(sale?.VentaDescuentosPorPromocion)
		? sale.VentaDescuentosPorPromocion
		: [];

	const sumWithFallback = (
		items: any[],
		totalKey: string,
		priceKey: string,
		quantityKey: string,
	): number =>
		items.reduce((sum, item) => {
			const explicitTotal = Number(item?.[totalKey]);
			if (Number.isFinite(explicitTotal)) {
				return sum + explicitTotal;
			}

			const price = Number(item?.[priceKey]);
			const quantity = Number(item?.[quantityKey] ?? 1);
			if (Number.isFinite(price) && Number.isFinite(quantity)) {
				return sum + price * quantity;
			}

			return sum;
		}, 0);

	const articlesTotal = sumWithFallback(saleArticles, 'Total', 'Precio', 'Cantidad');
	const conceptsTotal = sumWithFallback(saleConcepts, 'Total', 'Precio', 'Cantidad');
	const regimesTotal = specialRegimes.reduce((sum: number, regime: any) => {
		const regimeAmount = Number(regime?.Precio ?? regime?.Total ?? 0);
		return Number.isFinite(regimeAmount) ? sum + regimeAmount : sum;
	}, 0);
	const discountsTotal = promotionDiscounts.reduce((sum: number, discount: any) => {
		const discountAmount = Number(
			discount?.Importe ?? discount?.Precio ?? discount?.Total ?? discount?.Valor ?? 0,
		);
		return Number.isFinite(discountAmount) ? sum + discountAmount : sum;
	}, 0);

	const derivedTotal = articlesTotal + conceptsTotal + regimesTotal - discountsTotal;
	if (Number.isFinite(derivedTotal) && derivedTotal > 0) {
		return derivedTotal;
	}

	return null;
};

const resolveDiscountPercentage = async (
	executeFunctions: any,
	centumUrl: string,
	headers: CentumHeaders,
	itemIndex: number,
	discountId: string | number | null | undefined,
): Promise<number> => {
	if (!discountId) {
		return 0;
	}

	const discountsResponse = await helperFns.apiRequest<any>(`${centumUrl}/Bonificaciones`, {
		context: executeFunctions,
		debugItemIndex: itemIndex,
		method: 'GET',
		headers,
	});

	const discounts = Array.isArray(discountsResponse)
		? discountsResponse
		: Array.isArray(discountsResponse?.Items)
			? discountsResponse.Items
			: Array.isArray(discountsResponse?.Bonificaciones)
				? discountsResponse.Bonificaciones
				: [];

	const matchingDiscount = discounts.find((discount: any) => {
		const currentId = discount?.IdBonificacion ?? discount?.ID ?? discount?.Id;
		return String(currentId) === String(discountId);
	});

	const calculatedValue = Number(matchingDiscount?.Calculada);
	return Number.isFinite(calculatedValue) ? calculatedValue : 0;
};

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
	const articlesRaw = helperFns.getNodeParameterOrThrow(executeFunctions, 'article', itemIndex);
	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
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
	const discountPercentage = await resolveDiscountPercentage(
		executeFunctions,
		centumUrl,
		headers,
		itemIndex,
		discountId,
	);

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

	if (!customerId) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Customer ID is required.',
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

	/* Get article data using the provided customer ID */
	const results: any[] = [];

	for (const articleInput of articles) {
		try {
			// Build the request body dynamically depending on whether an ID or code is present
			const articleBody: any = {
				IdCliente: Number(customerId),
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
		PorcentajeDescuento: discountPercentage,
		PedidoVentaArticulos: results,
		Cliente: {
			IdCliente: Number(customerId),
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
	const salesOrderId = helperFns.getNodeParameterOrThrow(executeFunctions, 'saleId', itemIndex);
	const branchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const includeCanceled = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'includeCanceled',
		itemIndex,
	);
	const sellerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'sellerId', itemIndex),
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
		idVendedor: sellerId,
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
	const discountId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'discountId', itemIndex),
	);

	type SaleArticleInput = {
		ID?: string | number;
		Codigo?: string;
		Cantidad: number;
	};

	const articlesCollectionRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articlesCollection',
		itemIndex,
		[],
	);
	let articlesArray: SaleArticleInput[] = [];

	if (typeof articlesCollectionRaw === 'string') {
		try {
			const parsed = JSON.parse(articlesCollectionRaw);
			if (!Array.isArray(parsed)) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					'The articlesCollection field must be a valid JSON array.',
				);
			}
			articlesArray = parsed as SaleArticleInput[];
		} catch (err) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`The articlesCollection field must be a valid JSON string. Example:[{"ID":"1450","Cantidad":2},{"ID":"1451","Cantidad":5}] Error: ${(err as any)?.message ?? String(err)}`,
			);
		}
	} else if (Array.isArray(articlesCollectionRaw)) {
		articlesArray = articlesCollectionRaw as SaleArticleInput[];
	} else if (typeof articlesCollectionRaw === 'object' && articlesCollectionRaw !== null) {
		articlesArray = [articlesCollectionRaw as SaleArticleInput];
	} else {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Unexpected data type: ${typeof articlesCollectionRaw}`,
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

	for (const article of articlesArray) {
		if (!article.ID && !article.Codigo) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Each article must include either an ID or a Code.',
			);
		}
	}

	// When the sale is cash-based, validate the required fields
	if (isCashSale === true) {
		if (cashValueId == null)
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Cash value ID is required when Cash Sale is true.',
			);
	}

	// 1) Fetch article information for the sale
	const saleItemsWithQuantity: any[] = [];
	for (const articleInput of articlesArray) {
		try {
			const articleBody: any = {
				IdCliente: customerId,
				FechaDocumento: formattedFromDate,
			};

			if (articleInput.ID) {
				articleBody.Ids = [articleInput.ID];
			} else if (articleInput.Codigo) {
				articleBody.Codigo = articleInput.Codigo;
			}

			const articleData = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				method: 'POST',
				body: articleBody,
			});

			const items =
				articleData?.Articulos?.Items ?? articleData?.VentaArticulos ?? articleData?.Items ?? [];
			if (items.length > 0) {
				const itemsConCantidad = items.map((item: any) => ({
					...item,
					Cantidad: articleInput.Cantidad,
				}));

				saleItemsWithQuantity.push(...itemsConCantidad);
			}
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			const errorMessage =
				(error as any)?.response?.data?.Message || (error as any).message || 'Unknown error';
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`Error getting sale article ${articleInput.ID ?? articleInput.Codigo}.\n${errorMessage}`,
			);
		}
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
	};

	// Optional discount
	if (discountId) {
		bodyVenta.Bonificacion = { IdBonificacion: discountId };
		bodyVenta.PorcentajeDescuento = await resolveDiscountPercentage(
			executeFunctions,
			centumUrl,
			headers,
			itemIndex,
			discountId,
		);
	}

	// 3) Calculate the sale total in CENTUM before assigning cash values
	if (isCashSale === true) {
		const exchangeRate =
			!cashExchangeRateValue || cashExchangeRateValue <= 0 ? 1 : Number(cashExchangeRateValue);
		const installmentCount =
			!cashInstallmentCount || cashInstallmentCount <= 0 ? 0 : Number(cashInstallmentCount);
		const bodyVentaCalculada = await helperFns.apiRequest<any>(
			`${centumUrl}/Ventas/RegimenesEspeciales`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				method: 'POST',
				body: bodyVenta,
			},
		);

		const bodyVentaConPromociones = await helperFns.apiRequest<any>(
			`${centumUrl}/Ventas/DescuentosPorPromocion`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				method: 'POST',
				body: bodyVentaCalculada,
			},
		);

		const saleTotal = extractCalculatedSaleTotal(bodyVentaConPromociones);
		if (saleTotal == null) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Could not determine the calculated total for the cash sale.',
			);
		}

		let effectiveCashAmount = saleTotal;
		if (installmentCount > 0) {
			const totalWithSurcharge = await helperFns.apiRequest<any>(
				`${centumUrl}/Ventas/TotalVentaValoresEfectivosConRecargo`,
				{
					context: executeFunctions,
					debugItemIndex: itemIndex,
					headers,
					method: 'POST',
					body: {
						...bodyVentaConPromociones,
						VentaValoresEfectivos: [
							{
								IdValor: Number(cashValueId),
								Cotizacion: exchangeRate,
								Importe: saleTotal,
								Observaciones: cashValueNotes || '',
								CantidadCuotas: installmentCount,
							},
						],
					},
				},
			);

			const numericTotalWithSurcharge = Number(totalWithSurcharge);
			if (!Number.isFinite(numericTotalWithSurcharge) || numericTotalWithSurcharge <= 0) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					'Could not determine the calculated total with surcharge for the cash sale.',
				);
			}

			effectiveCashAmount = numericTotalWithSurcharge;
		}

		bodyVenta.VentaValoresEfectivos = [
			{
				IdValor: Number(cashValueId),
				Cotizacion: exchangeRate,
				Importe: effectiveCashAmount,
				Observaciones: cashValueNotes || '',
				CantidadCuotas: installmentCount,
			},
		];
	}

	// 4) Final POST request
	try {
		const url = `${centumUrl}/Ventas`;

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
		0,
	);
	const includeCanceled = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'includeCanceled',
		itemIndex,
		false,
	);
	const createdByUserId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'createdByUserId',
		itemIndex,
		0,
	);
	const transportId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'transportId',
		itemIndex,
		0,
	);
	const voucherTypeId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'voucherTypeId', itemIndex, ''),
	);
	const currentAccountCustomerId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'currentAccountId',
		itemIndex,
		0,
	);
	const sellerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'sellerId', itemIndex, ''),
	);
	const salesChannelId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesChannelId',
		itemIndex,
		0,
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

const listSalesConditions: ResourceHandler = async (context) => {
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
		const response = await helperFns.apiRequest<any>(`${centumUrl}/CondicionesVenta`, {
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
			`Error getting sales conditions.\n${errorMessage}`,
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
	listFilteredSalesOrders: listFilteredSalesOrders,
	createSale: createSale,
	listSalesInvoices: listSalesInvoices,
	listSalesInvoicesById: listSalesInvoicesById,
	listSalesVouchers: listSalesVouchers,
	listPrices: listPrices,
	listSalesConditions: listSalesConditions,
	getSalesRanking: getSalesRanking,
};
