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
		displayName: 'IdsArticulos',
		name: 'articleIds',
		type: 'string',
		default: '',
		placeholder: '1271,1450,2003',
		description: 'Comma-separated article IDs. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articulo.Cantidad',
		name: 'articleQuantities',
		type: 'string',
		default: '',
		placeholder: '10,2,7',
		description: 'Comma-separated article quantities. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['pedidosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'IdsArticulos',
		name: 'articleIds',
		type: 'string',
		default: '',
		placeholder: '1271,1450,2003',
		description: 'Comma-separated article IDs. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['ordenesCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articulo.Cantidad',
		name: 'articleQuantities',
		type: 'string',
		default: '',
		placeholder: '10,2,7',
		description: 'Comma-separated article quantities. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['ordenesCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'IdsArticulos',
		name: 'articleIds',
		type: 'string',
		default: '',
		placeholder: '1271,1450,2003',
		description: 'Comma-separated article IDs. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articulo.Cantidad',
		name: 'articleQuantities',
		type: 'string',
		default: '',
		placeholder: '10,2,7',
		description: 'Comma-separated article quantities. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Articulo.Precio',
		name: 'articlePrices',
		type: 'string',
		default: '',
		placeholder: '1500.50,230,99.99',
		description: 'Comma-separated article prices. Spaces are ignored. Only positive numbers are allowed.',
		displayOptions: {
			show: {
				resource: ['remitosCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'IdsArticulos',
		name: 'articleIds',
		type: 'string',
		default: '',
		placeholder: '1271,1450,2003',
		description: 'Comma-separated article IDs. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['compras', 'ventas', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articulo.Cantidad',
		name: 'articleQuantities',
		type: 'string',
		default: '',
		placeholder: '10,2,7',
		description: 'Comma-separated article quantities. Spaces are ignored. Only positive integers are allowed.',
		displayOptions: {
			show: {
				resource: ['compras', 'ventas', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'Articulo.Precio',
		name: 'articlePrices',
		type: 'string',
		default: '',
		placeholder: '1500.50,230,99.99',
		description: 'Comma-separated article prices. Spaces are ignored. Only positive numbers are allowed.',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'VentaValoresEfectivos.CantidadCuotas',
		name: 'cashValueInstallmentCount',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'CategoriaImpuestoGanancias.IdCategoriaImpuestoGanancia',
		name: 'incomeTaxCategoryId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'ClaseProveedor.IdClaseProveedor',
		name: 'supplierClassId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'FechaEntregaDesde',
		name: 'fromDeliveryDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['ordenesCompra'], operation: ['Get', 'GetPendientes'] },
		},
	},
	{
		displayName: 'FechaEntregaHasta',
		name: 'sinceDeliveryDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['ordenesCompra'], operation: ['Get', 'GetPendientes'] },
		},
	},
	{
		displayName: 'Cliente.IdCliente',
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
		displayName: 'Cliente.IdCliente',
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
		displayName: 'Cliente.IdCliente',
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
		displayName: 'Proveedor.IdProveedor',
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
		displayName: 'Codigo',
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
		displayName: 'Codigo',
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
		displayName: 'TipoComprobanteCompra.Codigo',
		name: 'voucherCode',
		type: 'string',
		default: '',
		placeholder: 'Purchase code (FCC)',
		description: 'Purchase voucher code',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'CondicionVenta.IdCondicionVenta',
		name: 'salesConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['ventas', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'CondicionPago.IdCondicionPago',
		name: 'paymentConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'CondicionIVA.IdCondicionIVA',
		name: 'vatConditionId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'VentaValoresEfectivos.Cotizacion',
		name: 'cashValueExchangeRate',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
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
		displayName: 'DiaSemana',
		name: 'weekday',
		type: 'number',
		default: 0,
		description: 'Weekday number used to filter applied promotions (0 is Monday)',
		displayOptions: { show: { resource: ['promocionesComerciales'], operation: ['Get'] } },
	},
	{
		displayName: 'EsContado',
		name: 'isCashSale',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['ventas'], operation: ['Create'] } },
	},
	{
		displayName: 'fechaDocumentoDesde',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['ajustesMovimientosStock', 'cobros', 'compras', 'ordenesCompra', 'ordenesTraspaso'],
				operation: ['Create', 'Get', 'GetConsulta', 'GetEstadisticas', 'GetPendientes'],
			},
		},
	},
	{
		displayName: 'fechaDocumentoDesde',
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
		displayName: 'fechaDocumentoDesde',
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
		displayName: 'fechaDocumentoHasta',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['ajustesMovimientosStock', 'cobros', 'compras', 'ordenesCompra', 'ordenesTraspaso'],
				operation: ['Get', 'GetConsulta', 'GetEstadisticas', 'GetPendientes'],
			},
		},
	},
	{
		displayName: 'fechaDocumentoHasta',
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
		displayName: 'fechaDocumentoHasta',
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
			displayName: 'FechaDocumento',
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
		displayName: 'HoraDocumento',
		name: 'documentTime',
		type: 'string',
		default: '',
		description: 'Document time (HH:mm) sent in the request body',
		displayOptions: {
			show: {
				resource: ['remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'FechaImputacion',
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
		displayName: 'FechaDocumento',
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
		displayName: 'HoraDocumento',
		name: 'transferDocumentTime',
		type: 'string',
		default: '',
		description: 'Document time (HH:mm) sent in the request body',
		displayOptions: {
			show: {
				resource: ['ordenesTraspaso'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'FechaEntrega',
		name: 'deliveryDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Document delivery date',
		displayOptions: {
			show: {
				resource: ['ordenesCompra', 'pedidosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'FechaEntrega',
		name: 'deliveryDate',
		type: 'dateTime',
		default: '',
		description: 'Document delivery date',
		displayOptions: {
			show: {
				resource: ['remitosVenta', 'remitosCompra'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'FechaEmbarque',
		name: 'shipmentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'FechaImputacion',
		name: 'indictmentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'FechaImputacion',
		name: 'indictmentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Cantidad',
		name: 'stockAdjustmentQuantity',
		type: 'number',
		required: true,
		default: 0,
		description: 'Cantidad a ajustar en el stock del artículo',
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] },
		},
	},
	{
		displayName: 'bAjustePrevioACero',
		name: 'adjustToZeroFirst',
		type: 'boolean',
		default: false,
		description:
			'Si es true, primero se generarán ajustes para llevar a 0 los artículos. Si es false, solo se ajustará por la cantidad enviada.',
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] },
		},
	},
	{
		displayName: 'ConceptoVarios.IdConceptoVarios',
		name: 'conceptoVariosId',
		type: 'number',
		default: 1,
		description: 'ID del concepto varios para el ajuste de stock',
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] },
		},
	},
	{
		displayName: 'IdAjusteMovimientoStock',
		name: 'adjustmentId',
		type: 'number',
		default: 0,
		description: 'ID único del ajuste de movimiento de stock',
		displayOptions: {
			show: { resource: ['ajustesMovimientosStock'], operation: ['GetOne'] },
		},
	},
	{
		displayName: 'FechaVencimiento',
		name: 'dueDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		displayOptions: {
			show: { resource: ['ordenesCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'FechaVencimiento',
		name: 'dueDate',
		type: 'dateTime',
		default: '',
		description: 'Document due date',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
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
		displayName: 'ordenEstadisticaVentaRankingAscendente',
		name: 'orderAsc',
		type: 'boolean',
		default: false,
		description: 'Whether to order the sales statistics in ascending mode',
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},

	{
		displayName: 'Vendedor.IdVendedor',
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
		displayName: 'tipoOrdenEstadisticaVentaRanking',
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
		displayName: 'Bonificacion.IdBonificacion',
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
		displayName: 'TurnoEntrega.IdTurnoEntrega',
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
		displayName: 'fechaModificacionDesde',
		name: 'dateModified',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetVenta'] } },
	},
	{
		displayName: 'fechaModificacionImagenesDesde',
		name: 'dateModifiedImage',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetVenta'] } },
		description: 'Filter articles whose images were modified from this date',
	},
	{
		displayName: 'FechaPrecioActualizadoHasta',
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
		displayName: 'FechaPrecioActualizadoDesde',
		name: 'priceDateModifiedFrom',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['articulos'], operation: ['GetPrecios'] },
		},
	},
	{
		displayName: 'FormaPagoProveedor.IdFormaPagoProveedor',
		name: 'supplierPaymentMethodId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores'], operation: ['Create'] } },
	},
	{
		displayName: 'Chofer.IdChofer',
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
		displayName: 'OrdenTraspaso.IdOrdenTraspaso',
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
		displayName: 'OrdenTraspasoItems',
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
		displayName: 'Observaciones',
		name: 'notes',
		type: 'string',
		default: '',
		description: 'Additional notes for the purchase delivery note',
		displayOptions: {
			show: { resource: ['remitosCompra'], operation: ['Create'] },
		},
	},
	{
		displayName: 'Observaciones',
		name: 'notes',
		type: 'string',
		default: '',
		description: 'Additional notes for the sales delivery note',
		displayOptions: {
			show: { resource: ['remitosVenta'], operation: ['Create'] },
		},
	},
	{
		displayName: 'PedidoVenta.IdPedidoVenta',
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
		displayName: 'Articulo.IdArticulo',
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
		displayName: 'UbicacionArticulo.IdUbicacionArticulo',
		name: 'articleLocationId',
		type: 'number',
		default: 0,
		description: 'Ubicación del artículo (opcional, se usa la ubicación por defecto si no se envía)',
		displayOptions: { show: { resource: ['ajustesMovimientosStock'], operation: ['Create'] } },
	},
	{
		displayName: 'SeccionSucursal.IdSeccionSucursal',
		name: 'branchSectionId',
		type: 'number',
		default: 0,
		description: 'Sección de sucursal (opcional para ajustes de stock)',
		displayOptions: {
			show: {
				resource: ['ajustesMovimientosStock', 'ubicacionesArticulos', 'remitosCompra', 'remitosVenta'],
				operation: ['Create', 'getArticleLocationsBySection'],
			},
		},
	},
	{
		displayName: 'SeccionSucursalDesde.IdSeccionSucursal',
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
		displayName: 'SeccionSucursalHacia.IdSeccionSucursal',
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
		displayName: 'idCobro',
		name: 'paymentId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['cobros'], operation: ['Get'] } },
	},
	{
		displayName: 'Compra.IdCompra',
		name: 'purchaseId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['compras', 'ordenesCompra'], operation: ['GetOne'] },
		},
	},

	{
		displayName: 'idsEstado',
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
		displayName: 'idEstadoOrdenTraspado',
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
		displayName: 'ConceptoVarios.IdConceptoVarios',
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
		displayName: 'Transporte.IdTransporte',
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
		displayName: 'OperadorCompra.IdOperadorCompra',
		name: 'purchaseOperatorId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'remitosCompra'], operation: ['Create'] } },
	},
	{
		displayName: 'IdProveedor',
		name: 'purchaseSupplierId',
		type: 'string',
		default: '',
		placeholder: 'Enter supplier ID',
		description: 'Supplier ID for the purchase',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'TipoComprobante.IdTipoComprobante',
		name: 'voucherTypeId',
		type: 'string',
		default: '',
		placeholder: 'Enter voucher type ID',
		description: 'Invoice voucher type ID',
		displayOptions: {
			show: { resource: ['compras', 'ventas'], operation: ['Create', 'GetConsulta'] },
		},
	},
	{
		displayName: 'idClienteCuentaCorriente',
		name: 'currentAccountId',
		type: 'number',
		default: 0,
		placeholder: '1',
		description: 'Current-account customer ID used to filter sales vouchers',
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta'] } },
	},
	{
		displayName: 'Vendedor.IdVendedor',
		name: 'sellerId',
		type: 'string',
		default: '',
		placeholder: 'Enter seller ID',
		displayOptions: {
			show: { resource: ['ventas', 'remitosVenta'], operation: ['Create', 'GetConsulta'] },
		},
	},
	{
		displayName: 'Venta.IdVenta',
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
		displayName: 'Venta.IdVenta',
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
		displayName: 'incluirAnulados',
		name: 'includeCanceled',
		type: 'boolean',
		default: false,
		description: 'Whether to include canceled sales vouchers in the results',
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta', 'GetOne'] } },
	},
	{
		displayName: 'incluirAnulados',
		name: 'includeCanceled',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['pedidosVenta'], operation: ['GetConsulta'] },
		},
	},
	{
		displayName: 'idCanalVenta',
		name: 'salesChannelId',
		type: 'number',
		default: 0,
		description: 'Sales channel ID used to filter sales vouchers',
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta'] } },
	},
	{
		displayName: 'idDivisionEmpresa',
		name: 'businessDivisionId',
		type: 'number',
		default: 0,
		description: 'Business division ID used to filter sales vouchers',
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta'] } },
	},
	{
		displayName: 'idUsuarioCreador',
		name: 'createdByUserId',
		type: 'number',
		description: 'User ID that created the sales voucher',
		default: 0,
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta', 'GetOne'] } },
	},
	{
		displayName: 'Vendedor.IdVendedor',
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
		displayName: 'Transporte.IdTransporte',
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
		displayName: 'Transporte.IdTransporte',
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
		displayName: 'Transporte.IdTransporte',
		name: 'transportId',
		type: 'number',
		description: 'Transport ID associated with the sales voucher',
		default: 0,
		displayOptions: { show: { resource: ['ventas'], operation: ['GetConsulta', 'GetOne'] } },
	},
	{
		displayName: 'Transporte.IdTransporte',
		name: 'transportId',
		type: 'number',
		description: 'Transport ID associated with the sales voucher',
		default: 0,
		displayOptions: {
			show: { resource: ['pedidosVenta'], operation: ['GetConsulta'] },
		},
	},
	{
		displayName: 'Pais.IdPais',
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
		displayName: 'Pais.IdPais',
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
		displayName: 'Provincia.IdProvincia',
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
		displayName: 'Provincia.IdProvincia',
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
		displayName: 'SucursalFisica.IdSucursalFisica',
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
		displayName: 'DivisionEmpresaGrupoEconomico.IdDivisionEmpresaGrupoEconomico',
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
		displayName: 'DivisionEmpresaGrupoEconomico.Name or ID',
		name: 'deliveryNoteDivisionCompanyGroupId',
		type: 'options',
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getLoggedUserBusinessGroupDivisions',
		},
		options: [],
		displayOptions: {
			show: {
				resource: ['remitosCompra', 'remitosVenta'],
				operation: ['Create'],
			},
		},
	},
	{
		displayName: 'SucursalFisicaDesde.IdSucursalFisica',
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
		displayName: 'SucursalFisicaHacia.IdSucursalFisica',
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
		displayName: 'VentaValoresEfectivos.IdValor',
		name: 'cashValueId',
		type: 'number',
		default: 0,
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'Zona.IdZona',
		name: 'zoneId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['proveedores', 'clientes'], operation: ['Create', 'Update'] } },
	},
	{
		displayName: 'Vendedor.IdVendedor',
		name: 'customerSellerId',
		type: 'number',
		default: 0,
		description: 'Seller ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'Transporte.IdTransporte',
		name: 'customerTransportId',
		type: 'number',
		default: 0,
		description: 'Transport ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'LimiteCredito.IdLimiteCredito',
		name: 'creditLimitId',
		type: 'number',
		default: 0,
		description: 'Credit limit ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'ClaseCliente.IdClaseCliente',
		name: 'customerClassId',
		type: 'number',
		default: 0,
		description: 'Customer class ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'FrecuenciaCliente.IdFrecuenciaCliente',
		name: 'customerFrequencyId',
		type: 'number',
		default: 0,
		description: 'Customer frequency ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'CanalCliente.IdCanalCliente',
		name: 'customerChannelId',
		type: 'number',
		default: 0,
		description: 'Customer channel ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'CadenaCliente.IdCadenaCliente',
		name: 'customerChainId',
		type: 'number',
		default: 0,
		description: 'Customer chain ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'UbicacionCliente.IdUbicacionCliente',
		name: 'customerLocationId',
		type: 'number',
		default: 0,
		description: 'Customer location ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'EdadesPromedioConsumidoresCliente.IdEdadesPromedioConsumidoresCliente',
		name: 'averageConsumerAgeId',
		type: 'number',
		default: 0,
		description: 'Average consumer age ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'GeneroPromedioConsumidoresCliente.IdGeneroPromedioConsumidoresCliente',
		name: 'averageConsumerGenderId',
		type: 'number',
		default: 0,
		description: 'Average consumer gender ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'DiasAtencionCliente.IdDiasAtencionCliente',
		name: 'customerServiceDaysId',
		type: 'number',
		default: 0,
		description: 'Customer service days ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'HorarioAtencionCliente.IdHorarioAtencionCliente',
		name: 'customerServiceScheduleId',
		type: 'number',
		default: 0,
		description: 'Customer service schedule ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'CigarreraCliente.IdCigarreraCliente',
		name: 'customerTobaccoCompanyId',
		type: 'number',
		default: 0,
		description: 'Customer tobacco company ID used when creating the customer',
		displayOptions: { show: { resource: ['clientes'], operation: ['Create'] } },
	},
	{
		displayName: 'DescuentoProveedor.IdDescuentoProveedor',
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
		displayName: 'CobroAnticipos.Importe',
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
		displayName: 'CobroAnticipos.ConceptoVarios.IdConceptoVarios',
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
		displayName: 'CobroAnticipos.Detalle',
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
		displayName: 'CobroEfectivos.Importe',
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
		displayName: 'CobroEfectivos.Valor.IdValor',
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
		displayName: 'Observacion',
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
		displayName: 'CobroEfectivos.Detalle',
		name: 'effectiveDetail',
		type: 'string',
		default: '',
		description: 'Optional detail for CobroEfectivos.',
		displayOptions: { show: { resource: ['cobros'], operation: ['Create'] } },
	},
	{
		displayName: 'ListaPrecio.IdListaPrecio',
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
		displayName: 'NumeroDocumento.LetraDocumento',
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
		displayName: 'NumeroDocumento.LetraDocumento',
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
		displayName: 'TipoComprobanteCompra.Nombre',
		name: 'voucherTypeName',
		type: 'string',
		default: '',
		placeholder: 'Purchase invoice',
		description: 'Invoice voucher type name',
		displayOptions: { show: { resource: ['compras'], operation: ['Create'] } },
	},
	{
		displayName: 'Articulo.Nombre',
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
		displayName: 'NumeroDocumento.Numero',
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
		displayName: 'NumeroDocumento.Numero',
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
		displayName: 'VentaValoresEfectivos.Observaciones',
		name: 'cashValueNotes',
		type: 'string',
		default: '',
		displayOptions: { show: { isCashSale: [true] } },
	},
	{
		displayName: 'Proveedor.IdProveedor',
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
		displayName: 'Proveedor.IdProveedor',
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
		displayName: 'IdsArticulos',
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
		displayName: 'IdsProveedores',
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
		displayName: 'NumeroDocumento.PuntoVenta',
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
		displayName: 'NumeroDocumento.PuntoVenta',
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
		displayName: 'RazonSocial',
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
		displayName: 'EstadisticaVentaRanking',
		name: 'itemCount',
		type: 'number',
		default: 1,
		displayOptions: {
			show: { resource: ['ventas'], operation: ['GetEstadisticas'] },
		},
	},
	{
		displayName: 'Rubro.IdRubro',
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
		displayName: 'SubRubro.IdsSubRubro',
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
		displayName: 'idsSucursalesFisicas',
		name: 'branchOfficeIds',
		type: 'string',
		required: true,
		default: '7345',
		description: 'Physical branch ID separated by comma',
		displayOptions: { show: { resource: ['articulos'], operation: ['GetExistencias'] } },
	},
	{
		displayName: 'Usuario',
		name: 'username',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['operadoresMoviles'], operation: ['GetCredenciales', 'Get'] },
		},
	},
	{
		displayName: 'Codigo',
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
		displayName: 'idMarcaArticulo',
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
		displayName: 'idCategoriaArticulo',
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
			{
				displayName: 'Include Request Body',
				name: 'includeRequestBody',
				type: 'boolean',
				default: false,
				description: 'Whether to include the JSON body sent in request debug logs',
				displayOptions: {
					show: {
						enableDebugLogging: [true],
					},
				},
			},
		],
	},
];
