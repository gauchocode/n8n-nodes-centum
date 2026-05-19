import { INodeProperties } from 'n8n-workflow';
import { CentumOperations, operationDisplayNames, resourceDisplayNames } from './CentumOperations';

export { CentumOperations, operationDisplayNames, resourceDisplayNames };

const fieldDefinitions: INodeProperties[] = [
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['proveedores'], operation: ['Create', 'Get'] },
		},
	},
	{
		displayName: 'Articles',
		name: 'article',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['pedidosVenta', 'ordenesCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articles',
		name: 'article',
		required: true,
		type: 'json',
		default: {},
		description: 'Article object or array with ID or Codigo and Cantidad',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
				useSinglePurchaseDeliveryArticle: [false],
			},
		},
	},
	{
		displayName: 'Use Single Article Input',
		name: 'useSinglePurchaseDeliveryArticle',
		type: 'boolean',
		default: false,
		description: 'Use individual ID, price, and quantity fields instead of article JSON',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Article ID',
		name: 'purchaseDeliveryArticleId',
		type: 'string',
		required: true,
		default: '',
		description: 'Article ID for the purchase delivery note',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
				useSinglePurchaseDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Article Price',
		name: 'purchaseDeliveryArticlePrice',
		type: 'number',
		required: true,
		default: 0,
		description: 'Price to send in RemitoCompraArticulos',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
				useSinglePurchaseDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Article Quantity',
		name: 'purchaseDeliveryArticleQuantity',
		type: 'number',
		required: true,
		default: 1,
		description: 'Quantity to send in RemitoCompraArticulos',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
				useSinglePurchaseDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Articles',
		name: 'articlesCollection',
		type: 'json',
		placeholder: '[{ "ID": 1234, "Quantity": 10 }, {"ID": 4567, "Quantity": 5}]',
		default: [],
		description: 'List of articles as a JSON array with ID or Code and Quantity',
		displayOptions: {
			show: {
				resource: ['compras', 'ventas'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articles',
		name: 'articlesCollection',
		type: 'json',
		placeholder: '[{"ID": 1234, "Cantidad": 10}]',
		default: [],
		description: 'List of articles as a JSON array with ID and Cantidad',
		displayOptions: {
			show: {
				resource: ['remitosVenta'],
				operation: ['Create'],
				useSingleSalesDeliveryArticle: [false],
			},
		},
	},
	{
		displayName: 'Use Single Article Input',
		name: 'useSingleSalesDeliveryArticle',
		type: 'boolean',
		default: false,
		description: 'Use individual ID, price, and quantity fields instead of articlesCollection',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Article ID',
		name: 'salesDeliveryArticleId',
		type: 'string',
		required: true,
		default: '',
		description: 'Article ID for the sales delivery note',
		displayOptions: {
			show: {
				resource: ['remitosVenta'],
				operation: ['Create'],
				useSingleSalesDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Article Price',
		name: 'salesDeliveryArticlePrice',
		type: 'number',
		required: true,
		default: 0,
		description: 'Price to send in RemitoVentaArticulos',
		displayOptions: {
			show: {
				resource: ['remitosVenta'],
				operation: ['Create'],
				useSingleSalesDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Article Quantity',
		name: 'salesDeliveryArticleQuantity',
		type: 'number',
		required: true,
		default: 1,
		description: 'Quantity to send in RemitoVentaArticulos',
		displayOptions: {
			show: {
				resource: ['remitosVenta'],
				operation: ['Create'],
				useSingleSalesDeliveryArticle: [true],
			},
		},
	},
	{
		displayName: 'Cash Installment Count',
		name: 'cashValueInstallmentCount',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'Income Tax Category',
		name: 'incomeTaxCategoryId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'Supplier Class',
		name: 'supplierClassId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'Delivery Date From',
		name: 'fromDeliveryDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['ordenesCompra'], operation: ['Get', 'GetPendientes'] },
		},
	},
	{
		displayName: 'Delivery Date To',
		name: 'sinceDeliveryDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['ordenesCompra'], operation: ['Get', 'GetPendientes'] },
		},
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		placeholder: 'Enter customer ID',
		description: 'Customer used by the selected operation',
			displayOptions: {
				show: {
					resource: [
						'articulos',
						'clientes',
						'cobros',
						'remitosVenta',
					],
					operation: [
						'Create',
						'GetVenta',
						'GetSaldoCuentaCorriente',
						'GetComposicionSaldoCuentaCorriente',
						'GetConsulta',
						'Get',
					'Update',
				],
			},
		},
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		placeholder: 'Enter customer ID',
		description: 'Customer used by the selected operation',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['Create', 'GetConsulta'],
			},
		},
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		placeholder: 'Enter customer ID',
		description: 'Customer used by the selected operation',
		displayOptions: {
			show: {
				resource: ['ventas'],
				operation: ['Create', 'GetConsulta'],
			},
		},
	},
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		placeholder: 'Enter supplier ID',
		description: 'Supplier ID used to filter purchases',
		displayOptions: {
			show: {
				resource: ['compras'],
				operation: ['Get'],
			},
		},
	},
	{
		displayName: 'Article Code',
		name: 'articleCode',
		type: 'string',
		default: '',
		placeholder: 'ART-001,ART-002',
		description: 'Article code to search for. Separate multiple values with a comma.',
		displayOptions: {
			show: {
				resource: ['articulos'],
				operation: ['GetDatosGenerales'],
			},
		},
	},
	{
		displayName: 'Customer Code',
		name: 'customerCode',
		type: 'string',
		default: '',
		typeOptions: { minValue: 1 },
		placeholder: 'Example: 1507',
		description: 'Customer code to search for',
		displayOptions: {
			show: {
				resource: ['clientes', 'pedidosVenta'],
				operation: ['Get'],
			},
		},
	},
	{
		displayName: 'Voucher Code',
		name: 'voucherCode',
		type: 'string',
		default: '',
		placeholder: 'Purchase code (FCC)',
		description: 'Purchase voucher code',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'Sales Condition',
		name: 'salesConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['ventas', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'Payment Condition',
		name: 'paymentConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'VAT Condition ID',
		name: 'vatConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'Exchange Rate',
		name: 'cashValueExchangeRate',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'JSON Body',
		name: 'jsonBody',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				operation: [],
			},
		},
		description: 'JSON object sent to the API to update a customer',
	},
	{
		displayName: 'CUIT',
		name: 'cuit',
		type: 'string',
		default: '',
		placeholder: 'Enter the CUIT...',
		displayOptions: {
			show: {
				operation: ['Create', 'Update', 'Get', 'GetOneContribuyente'],
				resource: ['proveedores', 'clientes'],
			},
		},
	},
	{
		displayName: 'Day of Week',
		name: 'weekday',
		type: 'number',
		default: 0,
		description: 'Weekday number used to filter applied promotions (0 is Monday)',
		displayOptions: { show: { resource: ['promocionesComerciales'], operation: ['Get'] } },
	},
	{
		displayName: 'Cash Sale',
		name: 'isCashSale',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['ventas'], operation: ['Create'] } },
	},
	{
		displayName: 'Date From',
		name: 'startDate',
		type: 'dateTime',
		default: '',
			displayOptions: {
				show: {
					resource: ['cobros', 'compras', 'ordenesCompra', 'ordenesTraspaso'],
					operation: ['Create', 'Get', 'GetConsulta', 'GetEstadisticas', 'GetPendientes'],
				},
			},
	},
	{
		displayName: 'Date From',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['GetConsulta'],
			},
		},
	},
	{
		displayName: 'Date From',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['ventas'],
				operation: ['Create', 'GetConsulta', 'GetEstadisticas'],
			},
		},
	},
	{
		displayName: 'Date To',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['cobros', 'compras', 'ordenesCompra', 'ordenesTraspaso'],
				operation: ['Get', 'GetConsulta', 'GetEstadisticas', 'GetPendientes'],
			},
		},
	},
	{
		displayName: 'Date To',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['GetConsulta'],
			},
		},
	},
	{
		displayName: 'Date To',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['ventas'],
				operation: ['GetConsulta', 'GetEstadisticas'],
			},
		},
	},
	{
			displayName: 'Document Date',
		name: 'documentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Date body parameter used for the request',
		displayOptions: {
			show: {
				resource: [
					'articulos',
					'cobros',
					'pedidosVenta',
					'ordenesCompra',
					'remitosCompra',
					'remitosVenta',
					'promocionesComerciales',
				],
				operation: ['Create', 'GetVenta', 'Get'],
			},
		},
	},
	{
		displayName: 'Posting Date',
		name: 'postingDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Posting date used as FechaImputacion in Cobros.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Transfer Document Date',
		name: 'transferDocumentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Document date for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Delivery Date',
		name: 'deliveryDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Document delivery date',
		displayOptions: {
			show: {
				resource: ['ordenesCompra', 'remitosCompra', 'pedidosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Delivery Date',
		name: 'deliveryDate',
		type: 'dateTime',
		default: '',
		description: 'Document delivery date',
		displayOptions: {
			show: {
				resource: ['remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Shipment Date',
		name: 'shipmentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Posting Date',
		name: 'indictmentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Posting Date',
		name: 'indictmentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		displayOptions: {
			show: { resource: ['ordenesCompra', 'remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Ranking Type',
		name: 'rankingType',
		type: 'options',
		default: 'none',
		description: 'Ranking type to filter by',
		options: [
			{
				name: 'None',
				value: 'none',
			},
			{
				name: 'Customers',
				value: 'customers',
			},
			{
				name: 'Articles',
				value: 'articles',
			},
			{
				name: 'Sellers',
				value: 'sellers',
			},
		],
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},
	{
		displayName: 'Sort Ascending',
		name: 'orderAsc',
		type: 'boolean',
		default: false,
		description: 'Whether to order the sales statistics in ascending mode',
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},

	{
		displayName: 'Seller ID',
		name: 'salesOrderSellerId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter seller ID',
		description: 'Seller used to create the sales order',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Sort Type',
		name: 'salesRankingOrderBy',
		type: 'options',
		default: 'quantityUnitLevel0',
		description: 'Sort type used to generate the ranking',
		options: [
			{
				name: 'Final Total Amount',
				value: 'finalTotalAmount',
			},
			{
				name: 'Net Total Amount',
				value: 'netTotalAmount',
			},
			{
				name: 'Quantity Unit Level 0',
				value: 'quantityUnitLevel0',
			},
			{
				name: 'Quantity Unit Level 1',
				value: 'quantityUnitLevel1',
			},
			{
				name: 'Quantity Unit Level 2',
				value: 'quantityUnitLevel2',
			},
		],
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},
	{
		displayName: 'Customer Discount ID',
		name: 'discountId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter discount ID',
		displayOptions: {
			show: { resource: ['pedidosVenta', 'clientes'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Delivery Time Slot ID',
		name: 'deliveryTimeSlotId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter delivery time slot ID',
		displayOptions: {
			show: {
				resource: ['pedidosVenta', 'ordenesCompra', 'remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Modified Date From',
		name: 'dateModified',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetVenta'] } },
	},
	{
		displayName: 'Image Modified Date From',
		name: 'dateModifiedImage',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetVenta'] } },
		description: 'Filter articles whose images were modified from this date',
	},
	{
		displayName: 'Price Updated Date To',
		name: 'priceDateModifiedTo',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['clientes', 'articulos'],
				operation: [
					'GetSaldoCuentaCorriente',
					'GetComposicionSaldoCuentaCorriente',
					'GetPrecios',
					'GetVenta',
				],
			},
		},
	},
	{
		displayName: 'Price Updated Date From',
		name: 'priceDateModifiedFrom',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['articulos'], operation: ['GetPrecios'] },
		},
	},
	{
		displayName: 'Supplier Payment Method',
		name: 'supplierPaymentMethodId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'Driver ID',
		name: 'driverId',
		type: 'string',
		default: '',
		placeholder: 'Enter driver ID',
		description: 'Driver used for the delivery note',
		displayOptions: {
			show: { resource: ['remitosCompra', 'remitosVenta', 'ordenesTraspaso'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Transfer Order ID',
		name: 'transferOrderId',
		type: 'number',
		default: 0,
		placeholder: '10',
		description: 'Unique transfer-order identifier used by the selected operation',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['GetOne', 'Dispatch', 'Finalize', 'Get'],
			},
		},
	},
	{
		displayName: 'Transfer Articles',
		name: 'transferArticles',
		required: true,
		type: 'json',
		default: [],
		placeholder: '[{"IdArticulo": 13766, "Cantidad": 10}]',
		description: 'List of transfer items as a JSON array with IdArticulo and Cantidad',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		default: '',
		description: 'Additional notes for the purchase delivery note',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		type: 'string',
		default: '',
		placeholder: 'Example: 27231',
		description: 'Unique identifier used to make API requests',
		displayOptions: {
			show: { resource: ['pedidosVenta', 'regimenesEspeciales'], operation: ['GetOne'] },
		},
	},
	{
		displayName: 'Article IDs',
		name: 'articleId',
		type: 'string',
		default: '',
		placeholder: '1467',
		displayOptions: {
			show: {
				resource: ['articulos', 'ajustesMovimientosStock'],
				operation: [
					'GetOneImagen',
					'GetDatosGenerales',
					'GetOne',
					'GetExistenciasIndicadores',
					'GetPrecios',
					'Create',
				],
			},
		},
	},
	{
		displayName: 'Article Location',
		name: 'articleLocationId',
		required: true,
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] } },
	},
	{
		displayName: 'Branch Section ID',
		name: 'branchSectionId',
		required: true,
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['ajustesMovimientosStock', 'ubicacionesArticulos'],
				operation: ['Create', 'getArticleLocationsBySection'],
			},
		},
	},
	{
		displayName: 'Origin Branch Section ID',
		name: 'originBranchSectionId',
		type: 'number',
		default: 0,
		placeholder: '6757',
		description: 'Origin branch section ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Destination Branch Section ID',
		name: 'destinationBranchSectionId',
		type: 'number',
		default: 0,
		placeholder: '7656',
		description: 'Destination branch section ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['cobros'], operation: ['Get'] } },
	},
	{
		displayName: 'Purchase ID',
		name: 'purchaseId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['compras', 'ordenesCompra'], operation: ['GetOne'] },
		},
	},
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		default: '',
		placeholder: 'Enter status ID',
		description: 'Sales order status number',
		displayOptions: {
			show: { operation: [] },
		},
	},
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		default: '',
		placeholder: 'Enter status ID',
		description: 'Sales order status number',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['GetConsulta'],
			},
		},
	},
	{
		displayName: 'Transfer Status ID',
		name: 'transferStatusId',
		type: 'number',
		default: 0,
		placeholder: '6518',
		description: 'Status ID used to filter transfer orders',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Get'],
			},
		},
	},
	{
		displayName: 'Concept ID',
		name: 'transferConceptId',
		type: 'number',
		default: 0,
		placeholder: '31',
		description: 'ConceptoVarios ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Transport ID',
		name: 'transferTransportId',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Transport ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Purchase Operator ID',
		name: 'purchaseOperatorId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'remitosCompra'], operation: ['Create'] } },
	},
	{
		displayName: 'Supplier ID',
		name: 'purchaseSupplierId',
		type: 'string',
		default: '',
		placeholder: 'Enter supplier ID',
		description: 'Supplier ID for the purchase',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'Voucher Type ID',
		name: 'voucherTypeId',
		type: 'string',
		default: '',
		placeholder: 'Enter voucher type ID',
		description: 'Invoice voucher type ID',
		displayOptions: {
			show: { resource: ['compras', 'ventas'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Current Account ID',
		name: 'currentAccountId',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Current-account customer ID for the sales voucher',
		displayOptions: { show: { operation: [] } },
	},
	{
		displayName: 'Seller ID',
		name: 'sellerId',
		type: 'string',
		default: '',
		placeholder: 'Enter seller ID',
		displayOptions: {
			show: { resource: ['ventas', 'remitosVenta'], operation: ['Create', 'GetConsulta'] },
		},
	},
	{
		displayName: 'Sale ID',
		name: 'saleId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['ventas'],
				operation: ['GetConsulta', 'GetOne'],
			},
		},
	},
	{
		displayName: 'Sale ID',
		name: 'saleId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['GetConsulta'],
			},
		},
	},
	{
		displayName: 'Branch ID',
		name: 'branchId',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: [] } },
	},
	{
		displayName: 'Include Canceled Orders',
		name: 'includeCanceled',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['ventas'], operation: ['GetOne'] } },
	},
	{
		displayName: 'Include Canceled Orders',
		name: 'includeCanceled',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['pedidosVenta'], operation: ['GetConsulta'] },
		},
	},
	{
		displayName: 'Sales Channel ID',
		name: 'salesChannelId',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: [] } },
	},
	{
		displayName: 'Business Division ID',
		name: 'businessDivisionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: [] } },
	},
	{
		displayName: 'Created By User ID',
		name: 'createdByUserId',
		type: 'number',
		description: 'User ID that created the sales voucher',
		default: 0,
		displayOptions: { show: { resource: ['ventas'], operation: ['GetOne'] } },
	},
	{
		displayName: 'Seller ID',
		name: 'sellerId',
		type: 'string',
		default: '',
		placeholder: 'Enter seller ID',
		description: 'Seller ID used to filter sales orders',
		displayOptions: {
			show: { resource: ['pedidosVenta'], operation: ['GetConsulta'] },
		},
	},
	{
		displayName: 'Transport ID',
		name: 'transportId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter transport ID',
		description: 'Transport ID associated with the delivery note',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Transport ID',
		name: 'transportId',
		type: 'string',
		default: '',
		placeholder: 'Enter transport ID',
		description: 'Transport ID associated with the delivery note',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Transport ID',
		name: 'transportId',
		type: 'number',
		description: 'Transport ID associated with the sales voucher',
		default: 0,
		displayOptions: { show: { resource: ['ventas'], operation: ['GetOne'] } },
	},
	{
		displayName: 'Transport ID',
		name: 'transportId',
		type: 'number',
		description: 'Transport ID associated with the sales voucher',
		default: 0,
		displayOptions: {
			show: { resource: ['pedidosVenta'], operation: ['GetConsulta'] },
		},
	},
	{
		displayName: 'Country ID',
		name: 'countryId',
		type: 'string',
		default: '',
		placeholder: 'Enter country ID',
		description: 'Country ID used to fetch provinces',
		displayOptions: {
			show: { resource: ['provincias'], operation: ['Get'] },
		},
	},
	{
		displayName: 'Country ID',
		name: 'countryId',
		type: 'string',
		default: '',
		placeholder: 'Enter country ID',
		description: 'Country ID used to create the record',
		displayOptions: {
			show: { resource: ['proveedores', 'clientes'], operation: ['Create', 'Update'] },
		},
	},
	{
		displayName: 'Province ID',
		name: 'provinceId',
		type: 'string',
		default: '',
		placeholder: 'Enter province ID',
		description: 'Province ID used to fetch related information',
		displayOptions: {
			show: {
				resource: ['departamentos'],
				operation: ['Get'],
			},
		},
	},
	{
		displayName: 'Province ID',
		name: 'provinceId',
		type: 'string',
		default: '',
		placeholder: 'Enter province ID',
		description: 'Province ID used to create the record',
		displayOptions: {
			show: {
				resource: ['proveedores', 'clientes'],
				operation: ['Create', 'Update'],
			},
		},
	},
	{
		displayName: 'Physical Branch ID',
		name: 'physicalBranchId',
		type: 'string',
		default: '',
		placeholder: 'Enter branch ID',
		description: 'The ID of the physical branch to filter stock (optional)',
			displayOptions: {
			show: {
				resource: [
					'cobros',
					'remitosCompra',
					'remitosVenta',
					'ordenesCompra',
					'pedidosVenta',
					'ventas',
					'articulos',
					'ajustesMovimientosStock',
				],
				operation: ['Create', 'GetExistenciasIndicadores', 'GetConsulta'],
			},
		},
	},
	{
		displayName: 'Division Company Group ID',
		name: 'divisionCompanyGroupId',
		type: 'string',
		default: '',
		placeholder: 'Enter division ID',
		description: 'Optional division company group ID for the payment.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Origin Physical Branch ID',
		name: 'originPhysicalBranchId',
		type: 'string',
		default: '',
		placeholder: '6084',
		description: 'Origin branch ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Destination Physical Branch ID',
		name: 'destinationPhysicalBranchId',
		type: 'string',
		default: '',
		placeholder: '7655',
		description: 'Destination branch ID for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Cash Value ID',
		name: 'cashValueId',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'Zone ID',
		name: 'zoneId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'Customer Seller ID',
		name: 'customerSellerId',
		type: 'number',
		default: 0,
		description: 'Seller ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Transport ID',
		name: 'customerTransportId',
		type: 'number',
		default: 0,
		description: 'Transport ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Credit Limit ID',
		name: 'creditLimitId',
		type: 'number',
		default: 0,
		description: 'Credit limit ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Class ID',
		name: 'customerClassId',
		type: 'number',
		default: 0,
		description: 'Customer class ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Frequency ID',
		name: 'customerFrequencyId',
		type: 'number',
		default: 0,
		description: 'Customer frequency ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Channel ID',
		name: 'customerChannelId',
		type: 'number',
		default: 0,
		description: 'Customer channel ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Chain ID',
		name: 'customerChainId',
		type: 'number',
		default: 0,
		description: 'Customer chain ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Location ID',
		name: 'customerLocationId',
		type: 'number',
		default: 0,
		description: 'Customer location ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Average Consumer Age ID',
		name: 'averageConsumerAgeId',
		type: 'number',
		default: 0,
		description: 'Average consumer age ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Average Consumer Gender ID',
		name: 'averageConsumerGenderId',
		type: 'number',
		default: 0,
		description: 'Average consumer gender ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Service Days ID',
		name: 'customerServiceDaysId',
		type: 'number',
		default: 0,
		description: 'Customer service days ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Service Schedule ID',
		name: 'customerServiceScheduleId',
		type: 'number',
		default: 0,
		description: 'Customer service schedule ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Customer Tobacco Company ID',
		name: 'customerTobaccoCompanyId',
		type: 'number',
		default: 0,
		description: 'Customer tobacco company ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Supplier Discount ID',
		name: 'supplierDiscountId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'Payment Mode',
		name: 'paymentMode',
		type: 'options',
		default: 'advanceAndCash',
		options: [
			{ name: 'Advance Only', value: 'advanceOnly' },
			{ name: 'Cash Only', value: 'cashOnly' },
			{ name: 'Advance and Cash', value: 'advanceAndCash' },
		],
		description: 'Choose which Cobros components should be included in the request.',
		displayOptions: { show: { resource: ['cobros'], operation: ['Create'] } },
	},
	{
		displayName: 'Advance Amount',
		name: 'advanceAmount',
		type: 'number',
		required: true,
		default: 0,
		description: 'Amount to register in CobroAnticipos.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['advanceOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Advance Concept ID',
		name: 'advanceConceptId',
		type: 'number',
		required: true,
		default: 2,
		description: 'IdConceptoVarios used in CobroAnticipos.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['advanceOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Advance Detail',
		name: 'advanceDetail',
		type: 'string',
		default: '',
		description: 'Optional detail for CobroAnticipos.',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['advanceOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Cash Amount',
		name: 'cashAmount',
		type: 'number',
		required: true,
		default: 0,
		description: 'Amount to register in CobroEfectivos.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['cashOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Value ID',
		name: 'paymentValueId',
		type: 'number',
		required: true,
		default: 1,
		description: 'IdValor used in CobroEfectivos.',
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['cashOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Observation',
		name: 'paymentObservation',
		type: 'string',
		default: '',
		description: 'Optional payment observation sent to Cobros.',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['cobros'],
				operation: ['Create'],
				paymentMode: ['cashOnly', 'advanceAndCash'],
			},
		},
	},
	{
		displayName: 'Effective Detail',
		name: 'effectiveDetail',
		type: 'string',
		default: '',
		description: 'Optional detail for CobroEfectivos.',
		displayOptions: { show: { resource: ['cobros'], operation: ['Create'] } },
	},
	{
		displayName: 'Price List ID',
		name: 'priceListId',
		type: 'string',
		default: '',
		placeholder: 'Enter price list ID',
		description: 'Price list used to look up article prices',
		displayOptions: {
			show: {
				resource: ['articulos', 'ventas'],
				operation: ['GetPrecios', 'Create', 'GetEstadisticas'],
			},
		},
	},
	{
		displayName: 'Purchase Document Letter',
		name: 'documentLetter',
		type: 'string',
		default: '',
		placeholder: 'A',
		description: 'Purchase invoice document letter',
		displayOptions: {
			show: {
				resource: ['compras', 'ordenesCompra', 'remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Transfer Document Letter',
		name: 'transferDocumentLetter',
		type: 'string',
		default: '',
		placeholder: 'T',
		description: 'Document letter for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Full Migration',
		name: 'fullMigration',
		type: 'boolean',
		default: false,
		description: 'Whether to return only the first response without expanding group variants',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetVenta'] } },
	},
	{
		displayName: 'Voucher Type Name',
		name: 'voucherTypeName',
		type: 'string',
		default: '',
		placeholder: 'Purchase invoice',
		description: 'Invoice voucher type name',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'Article Name',
		name: 'articleName',
		type: 'string',
		default: '',
		placeholder: 'Chocolate Bars',
		displayOptions: {
			show: {
				resource: ['articulos'],
				operation: ['GetDatosGenerales', 'GetExistenciasIndicadores'],
			},
		},
		description: 'Name of the product to search for',
	},
	{
		displayName: 'Purchase Document Number',
		name: 'documentNumber',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Purchase invoice document number',
		displayOptions: {
			show: {
				resource: ['compras', 'ordenesCompra', 'remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Transfer Document Number',
		name: 'transferDocumentNumber',
		type: 'number',
		default: 0,
		placeholder: '1170',
		description: 'Document number for the transfer order',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Notes',
		name: 'cashValueNotes',
		type: 'string',
		default: '',
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter supplier ID',
		description: 'Supplier ID used to search inside the system',
		displayOptions: {
			show: {
				resource: ['proveedores'],
				operation: ['GetOne'],
			},
		},
	},
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Enter supplier ID',
		description: 'Supplier ID used to filter or create the record',
		displayOptions: {
			show: {
				resource: ['ordenesCompra', 'remitosCompra'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Article IDs',
		name: 'articleIds',
		type: 'string',
		default: '',
		placeholder: '1,2,3',
		description:
			'Article IDs to filter pending purchase order items. Separate multiple values with a comma.',
		displayOptions: {
			show: {
				resource: ['ordenesCompra'],
				operation: ['GetPendientes'],
			},
		},
	},
	{
		displayName: 'Supplier IDs',
		name: 'supplierIds',
		type: 'string',
		default: '',
		placeholder: '10,25,30',
		description:
			'Supplier IDs to filter pending purchase order items. Separate multiple values with a comma.',
		displayOptions: {
			show: {
				resource: ['ordenesCompra'],
				operation: ['GetPendientes'],
			},
		},
	},
	{
		displayName: 'Point of Sale',
		name: 'pointOfSale',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Document point-of-sale number',
		displayOptions: {
			show: {
				resource: ['ordenesCompra', 'ventas', 'compras', 'remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Transfer Point of Sale',
		name: 'transferPointOfSale',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Point-of-sale number for the transfer order document',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Business Name',
		name: 'businessName',
		type: 'string',
		default: '',
		description: 'Customer business name to search for',
		displayOptions: {
			show: {
				operation: ['Create', 'Update', 'Get'],
				resource: ['clientes', 'proveedores'],
			},
		},
	},
	{
		displayName: 'Item Count',
		name: 'itemCount',
		type: 'number',
		default: 1,
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		description: 'Group ID used to search for articles',
		displayOptions: {
			show: {
				operation: ['GetEstadisticas', 'GetExistenciasIndicadores', 'GetAll', 'GetVenta'],
				resource: ['ventas', 'articulos', 'subRubros'],
			},
		},
	},
	// {
	// 	displayName: "SKU",
	// 	name: "sku",
	// 	type: "string",
	// 	default: "",
	// 	required: true,
	// 	description: "The SKU (product code) to search for",
	// 	displayOptions: { show: { operation: ["getProductByCode"] } },
	// },
	{
		displayName: 'Subgroup IDs',
		name: 'subgroupIds',
		type: 'string',
		default: '',
		description: 'Subgroup IDs used to search for articles',
		displayOptions: {
			show: {
				resource: ['categoriasArticulo', 'articulos'],
				operation: ['GetAll', 'GetExistenciasIndicadores', 'GetVenta'],
			},
		},
	},
	{
		displayName: 'Physical Branches - ID List',
		name: 'branchOfficeIds',
		type: 'string',
		required: true,
		default: '7345',
		description: 'Physical branch ID separated by comma',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetExistencias'] } },
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['operadoresMoviles'], operation: ['GetCredenciales', 'Get'] },
		},
	},
	{
		displayName: 'Supplier Code',
		name: 'supplierCode',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['proveedores'],
				operation: ['Create', 'Get'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['operadoresMoviles'],
				operation: ['Get'],
			},
		},
	},
	{
		displayName: 'Article Brand ID',
		name: 'articleBrandId',
		type: 'string',
		placeholder: '3',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulos'],
				operation: ['GetExistenciasIndicadores'],
			},
		},
	},
	{
		displayName: 'Article Category ID',
		name: 'articleCategoryId',
		type: 'string',
		placeholder: '3',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulos'],
				operation: ['GetExistenciasIndicadores'],
			},
		},
	},
	{
		displayName: 'Simplified Output',
		name: 'simplifiedOutput',
		type: 'boolean',
		default: false,
		description: 'Whether to return only the most useful top-level fields',
			displayOptions: {
				show: {
					resource: [
						'articulos',
						'clientes',
						'ventas',
						'pedidosVenta',
						'ordenesTraspaso',
						'cobros',
						'compras',
						'tiposComprobante',
					'ordenesCompra',
					'proveedores',
					'promocionesComerciales',
				],
				operation: [
					'GetDatosGenerales',
					'GetOne',
					'GetVenta',
					'GetPrecios',
					'GetExistenciasIndicadores',
					'Get',
					'GetOneContribuyente',
					'GetSaldoCuentaCorriente',
					'GetComposicionSaldoCuentaCorriente',
					'GetConsulta',
					'GetAllVentas',
					'GetEstadisticas',
					'GetAllCompras',
					'Dispatch',
					'Finalize',
				],
			},
		},
	},
];

export const CentumFields: INodeProperties[] = [...fieldDefinitions];

export const HttpOptions: INodeProperties[] = [
	{
		displayName: 'HTTP Settings',
		name: 'httpSettings',
		type: 'collection',
		placeholder: 'Advanced configuration',
		default: {},
		options: [
			{
				displayName: 'Pagination',
				name: 'pagination',
				type: 'options',
				options: [
					{
						name: 'Custom Pagination',
						value: 'custom',
						description: 'Lets you define the number of items per page',
					},
					{
						name: 'All',
						value: 'all',
						description:
							'Fetch all items with internal pagination and without per-page or interval customization',
					},
				],
				default: 'custom',
				description: 'Controls how paginated data is requested',
			},
			{
				displayName: 'Items per Page',
				name: 'itemsPerPage',
				type: 'number',
				default: 100,
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						pagination: ['custom'],
					},
				},
				description: 'Number of items to request per page (custom mode only)',
			},
			{
				displayName: 'Page Interval (Ms)',
				name: 'pageInterval',
				type: 'number',
				default: 1000,
				typeOptions: {
					minValue: 500,
				},
				displayOptions: {
					show: {
						pagination: ['custom'],
					},
				},
				description: 'Time interval between requests in milliseconds',
			},
			{
				displayName: 'Starting Page Number',
				name: 'pageNumber',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						pagination: ['custom'],
					},
				},
				description: 'Page number where pagination should start (defaults to page 1)',
			},
		],
		displayOptions: {
			show: {
				resource: ['clientes', 'articulos'],
				operation: ['Get', 'GetDatosGenerales', 'GetVenta'],
			},
		},
	},
	{
		displayName: 'Debug Options',
		name: 'debugSettings',
		type: 'collection',
		placeholder: 'Advanced Options',
		default: {},
		options: [
			{
				displayName: 'Enable Debug Logging',
				name: 'enableDebugLogging',
				type: 'boolean',
				default: false,
				description: 'Whether to log sanitized request metadata for debugging',
			},
			{
				displayName: 'Endpoint Filter',
				name: 'debugEndpointContains',
				type: 'string',
				default: '',
				placeholder: '/Ventas/FiltrosVentaConsulta',
				description: 'Only log requests whose URL contains this value',
				displayOptions: {
					show: {
						enableDebugLogging: [true],
					},
				},
			},
		],
	},
];
