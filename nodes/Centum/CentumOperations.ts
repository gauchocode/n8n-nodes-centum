import { INodeProperties } from 'n8n-workflow';

type OperationOption = {
	name: string;
	value: string;
	action: string;
	description: string;
};

type OperationGroup = {
	resource: string;
	default: string;
	options: OperationOption[];
};

export const resourceDisplayNames: Record<string, string> = {
	accessToken: 'Token De Acceso',
	ajustesMovimientosStock: 'Ajuste Movimiento Stock',
	articulos: 'Articulo',
	bonificaciones: 'Bonificacion',
	categoriasArticulo: 'Categoria Articulo',
	choferesGuiaLogistica: 'Chofer Guia Logistica',
	clientes: 'Cliente',
	cobros: 'Cobro',
	compras: 'Compra',
	conceptos: 'Concepto',
	departamentos: 'Departamento',
	frecuenciaClientes: 'Frecuencia De Cliente',
	listasPrecios: 'Lista Precio',
	marcas: 'Marca',
	operadoresMoviles: 'Operador Movil',
	ordenesCompra: 'Orden Compra',
	paises: 'País',
	pedidosVenta: 'Pedido Venta',
	promocionesComerciales: 'Promocion Comercial',
	proveedores: 'Proveedor',
	provincias: 'Provincia',
	regimenesEspeciales: 'Regimen Especial',
	remitosCompra: 'Remito Compra',
	remitosVenta: 'Remito Venta',
	rubros: 'Rubro',
	subRubros: 'SubRubro',
	sucursalesFisicas: 'Sucursal Fisica',
	tiposComprobante: 'Tipo Comprobante',
	turnosEntrega: 'Turno Entrega',
	ubicacionesArticulos: 'Ubicacion Articulo',
	vendedores: 'Vendedor',
	ventas: 'Venta',
};

const operationGroups: OperationGroup[] = [
	{
		resource: 'articulos',
		default: 'searchProducts',
		options: [
			{
				name: 'By ID',
				value: 'getProductByCode',
				action: 'Get article by ID',
				description:
					'Devuelve los datos generales de un artículo específico en función de su ID único',
			},
			{
				name: 'Search',
				value: 'searchProducts',
				action: 'Search articles by name',
				description: 'Search for an article by name and return every match',
			},
			{
				name: 'Filter',
				value: 'listAvailableProducts',
				action: 'List filtered articles',
				description:
					'Devuelve información completa de artículos para la venta en función de el ID de un cliente específico y filtros varios',
			},
			{
				name: 'Image',
				value: 'downloadProductImages',
				action: 'Get article image',
				description:
					'Devuelve la imagen de un artículo específico en función de su ID único y número de orden',
			},
			{
				name: 'List',
				value: 'listAllProducts',
				action: 'List article details',
				description: 'Devuelve los datos generales de artículos en función de filtros varios',
			},
			{
				name: 'Price By List',
				value: 'getProductPrice',
				action: 'Get article price by list',
				description:
					'Devuelve los datos de precios de artículos en función de el ID de una lista de precios y filtros varios',
			},
			{
				name: 'Stock By Branch And Article ID',
				value: 'getProductInBranch',
				action: 'Get branch stock by article',
				description: 'Return stock for a specific article in a physical branch',
			},
			{
				name: 'Stock By Physical Branch',
				value: 'listProductsByBranch',
				action: 'List stock by physical branch',
				description: 'Return article stock for a specific physical branch',
			},
			{
				name: 'Stock',
				value: 'getStock',
				action: 'Get article stock',
				description: 'Return article stock using the selected filters',
			},
			{
				name: 'WooCommerce - Generate JSON',
				value: 'convertProductsForWooCommerce',
				action: 'Convert woo commerce products',
				description: 'Generate structured WooCommerce product JSON from Centum articles',
			},
		],
	},
	{
		resource: 'marcas',
		default: 'listBrands',
		options: [
			{
				name: 'List',
				value: 'listBrands',
				action: 'List brands',
				description: 'Devuelve la lista completa de marcas de artículos',
			},
		],
	},
	{
		resource: 'categoriasArticulo',
		default: 'listCategories',
		options: [
			{
				name: 'List',
				value: 'listCategories',
				action: 'List categories',
				description: 'Devuelve la lista completa de categorías de artículos',
			},
		],
	},
	{
		resource: 'bonificaciones',
		default: 'listDiscounts',
		options: [
			{
				name: 'List',
				value: 'listDiscounts',
				action: 'List discounts',
				description: 'Devuelve la lista completa de bonificaciones de clientes',
			},
		],
	},
	{
		resource: 'rubros',
		default: 'listGroups',
		options: [
			{
				name: 'List',
				value: 'listGroups',
				action: 'List groups',
				description: 'Devuelve la lista completa de rubros de artículos',
			},
		],
	},
	{
		resource: 'listasPrecios',
		default: 'listPrices',
		options: [
			{
				name: 'List',
				value: 'listPrices',
				action: 'List product prices',
				description: 'Devuelve la lista completa de listas de precios',
			},
		],
	},
	{
		resource: 'subRubros',
		default: 'listSubgroups',
		options: [
			{
				name: 'List',
				value: 'listSubgroups',
				action: 'List subgroups',
				description:
					'Devuelve la lista completa de subrubros pudiendo filtrar de manera opcional por IDs de rubros',
			},
		],
	},
	{
		resource: 'ubicacionesArticulos',
		default: 'listArticleLocations',
		options: [
			{
				name: 'List',
				value: 'listArticleLocations',
				action: 'List article locations',
				description:
					'Devuelve la lista completa de ubicaciones de artículos dentro de una sección sucursal',
			},
			{
				name: 'By Section - Get',
				value: 'getArticleLocationsBySection',
				action: 'Get article locations by section',
				description: 'Get article locations for a specific branch section',
			},
		],
	},
	{
		resource: 'clientes',
		default: 'updateCustomer',
		options: [
			{
				name: 'Update',
				value: 'updateCustomer',
				action: 'Update customer',
				description: 'Actualiza un cliente y devuelve el objeto actualizado',
			},
			{
				name: 'Taxpayer Customer - Create',
				value: 'createTaxpayerCustomer',
				action: 'Create taxpayer customer',
				description: 'Create a new taxpayer customer',
			},
			{
				name: 'Get Balance',
				value: 'getCustomerBalance',
				action: 'Get customer balance',
				description: 'Get the balance for the selected customer',
			},
			{
				name: 'Create',
				value: 'createCustomer',
				action: 'Create customer',
				description: 'Create a new customer',
			},
			{
				name: 'List',
				value: 'listCustomers',
				action: 'List customers',
				description: 'Return a list of all registered customers',
			},
			{
				name: 'Get Balance Breakdown',
				value: 'getCustomerBalanceDetails',
				action: 'Get customer balance breakdown',
				description: 'Get the account balance breakdown for the selected customer',
			},
			{
				name: 'Search',
				value: 'searchCustomers',
				action: 'Search customers',
				description: 'Return a list of customers that match the selected filters',
			},
			{
				name: 'Search By CUIT',
				value: 'searchCustomerByCuit',
				action: 'Search customers by CUIT',
				description: 'Return a list of customers based on the provided CUIT',
			},
			{
				name: 'Taxpayer Customer - Search',
				value: 'searchTaxpayerCustomer',
				action: 'Search taxpayer customer',
				description: 'Return taxpayer data by CUIT or business name',
			},
		],
	},
	{
		resource: 'ventas',
		default: 'createSale',
		options: [
			{
				name: 'Invoices - Get',
				value: 'listSalesInvoices',
				action: 'Get sales invoices',
				description: 'Get all sales invoices for the selected customer',
			},
			{
				name: 'Invoices By ID - Get',
				value: 'listSalesInvoicesById',
				action: 'Get sales invoices by ID',
				description: 'Get all sales invoices for the selected customer by ID',
			},
			{
				name: 'Create',
				value: 'createSale',
				action: 'Create sale',
				description: 'Create a sale from the completed parameters',
			},
			{
				name: 'Ranking - Get',
				value: 'getSalesRanking',
				action: 'Get sales ranking',
				description: 'Get a ranking of customers, articles, sellers, or branches',
			},
		],
	},
	{
		resource: 'promocionesComerciales',
		default: 'listPromotions',
		options: [
			{
				name: 'By Customer - Get',
				value: 'listCustomerCommercialPromotions',
				action: 'Get customer commercial promotions',
				description: 'Get the commercial promotions applied to a customer from the selected date',
			},
			{
				name: 'List',
				value: 'listPromotions',
				action: 'List commercial promotions',
				description: 'Get the available commercial promotions',
			},
		],
	},
	{
		resource: 'cobros',
		default: 'registerPayment',
		options: [
			{
				name: 'Invoices - Get',
				value: 'listPaymentInvoices',
				action: 'Get payment invoices',
				description: 'Get all payment invoices for the selected customer',
			},
			{
				name: 'Create',
				value: 'registerPayment',
				action: 'Create payment',
				description: 'Create a payment voucher',
			},
			{
				name: 'List',
				value: 'listPayments',
				action: 'List payments',
				description: 'Get a list of payments using the selected filters',
			},
		],
	},
	{
		resource: 'frecuenciaClientes',
		default: 'listCustomerFrequencies',
		options: [
			{
				name: 'List',
				value: 'listCustomerFrequencies',
				action: 'List customer frequencies',
				description: 'Get a list of customer frequency options',
			},
		],
	},
	{
		resource: 'compras',
		default: 'createPurchase',
		options: [
			{
				name: 'Create',
				value: 'createPurchase',
				action: 'Create purchase',
				description: 'Create a purchase using the selected parameters',
			},
			{
				name: 'List',
				value: 'listPurchases',
				action: 'List purchases',
				description: 'Get a list of purchases using the selected filters',
			},
		],
	},
	{
		resource: 'remitosCompra',
		default: 'createPurchaseDeliveryNote',
		options: [
			{
				name: 'Create',
				value: 'createPurchaseDeliveryNote',
				action: 'Create purchase delivery note',
				description: 'Create a purchase delivery note from the provided parameters',
			},
		],
	},
	{
		resource: 'ordenesCompra',
		default: 'createPurchaseOrder',
		options: [
			{
				name: 'Create',
				value: 'createPurchaseOrder',
				action: 'Create purchase order',
				description: 'Create a purchase order using the selected parameters',
			},
			{
				name: 'By ID',
				value: 'getPurchaseOrderDetails',
				action: 'Get purchase order',
				description: 'Get a single purchase order by ID',
			},
			{
				name: 'List',
				value: 'listPurchaseOrders',
				action: 'List purchase orders',
				description: 'Get all purchase orders using the selected filters',
			},
		],
	},
	{
		resource: 'tiposComprobante',
		default: 'listVoucherTypes',
		options: [
			{
				name: 'General - List',
				value: 'listVoucherTypes',
				action: 'List voucher types',
				description: 'Get a list of all voucher types',
			},
			{
				name: 'Purchases - List',
				value: 'listPurchaseVouchers',
				action: 'List purchase vouchers',
				description: 'Get a list of purchase vouchers using the selected filters',
			},
			{
				name: 'Sales - List',
				value: 'listSalesVouchers',
				action: 'List sales vouchers',
				description: 'Get a list of sales vouchers using the selected filters',
			},
		],
	},
	{
		resource: 'paises',
		default: 'listCountries',
		options: [
			{
				name: 'List',
				value: 'listCountries',
				action: 'List countries',
				description: 'Get the list of available countries',
			},
		],
	},
	{
		resource: 'departamentos',
		default: 'listMunicipalities',
		options: [
			{
				name: 'List',
				value: 'listMunicipalities',
				action: 'List municipalities',
				description: 'Get a list of municipalities, usually filtered by province',
			},
		],
	},
	{
		resource: 'provincias',
		default: 'listProvinces',
		options: [
			{
				name: 'List',
				value: 'listProvinces',
				action: 'List provinces',
				description: 'Get a list of provinces, usually filtered by country',
			},
		],
	},
	{
		resource: 'turnosEntrega',
		default: 'listDeliveryTimeSlots',
		options: [
			{
				name: 'List',
				value: 'listDeliveryTimeSlots',
				action: 'List delivery time slots',
				description: 'Get the full list of available delivery time slots',
			},
		],
	},
	{
		resource: 'choferesGuiaLogistica',
		default: 'listDrivers',
		options: [
			{
				name: 'List',
				value: 'listDrivers',
				action: 'List drivers',
				description: 'Get the complete list of available drivers',
			},
		],
	},
	{
		resource: 'sucursalesFisicas',
		default: 'listPhysicalBranches',
		options: [
			{
				name: 'List',
				value: 'listPhysicalBranches',
				action: 'List physical branches',
				description: 'Get the available physical branches',
			},
		],
	},
	{
		resource: 'vendedores',
		default: 'listSellers',
		options: [
			{
				name: 'List',
				value: 'listSellers',
				action: 'List sellers',
				description: 'Get a list of all available sellers',
			},
		],
	},
	{
		resource: 'accessToken',
		default: 'generateSecurityToken',
		options: [
			{
				name: 'Generate',
				value: 'generateSecurityToken',
				action: 'Generate access token',
				description: 'Generate a token for external tools such as Postman',
			},
		],
	},
	{
		resource: 'operadoresMoviles',
		default: 'listMobileOperators',
		options: [
			{
				name: 'List',
				value: 'listMobileOperators',
				action: 'List mobile operators',
				description: 'Get the list of all mobile operators',
			},
			{
				name: 'Verify',
				value: 'verifyOperatorCredentials',
				action: 'Verify mobile operator',
				description: 'Get the data for a mobile operator using the configured credentials',
			},
		],
	},
	{
		resource: 'regimenesEspeciales',
		default: 'listSpecialTaxRegimes',
		options: [
			{
				name: 'By ID',
				value: 'getSpecialTaxRegimeDetails',
				action: 'Get special tax regime by ID',
				description: 'Get a special tax regime by ID',
			},
			{
				name: 'List',
				value: 'listSpecialTaxRegimes',
				action: 'List special tax regimes',
				description: 'Get the complete list of special tax regimes',
			},
		],
	},
	{
		resource: 'conceptos',
		default: 'listConcepts',
		options: [
			{
				name: 'List',
				value: 'listConcepts',
				action: 'List concepts',
				description: 'Get a list of concepts',
			},
		],
	},
	{
		resource: 'proveedores',
		default: 'searchSupplier',
		options: [
			{
				name: 'Search',
				value: 'searchSupplier',
				action: 'Search supplier',
				description: 'Return supplier information based on its ID',
			},
			{
				name: 'Create',
				value: 'createSupplier',
				action: 'Create supplier',
				description: 'Create a supplier using the provided data',
			},
			{
				name: 'List',
				value: 'listSuppliers',
				action: 'List suppliers',
				description: 'Get a complete list of suppliers',
			},
		],
	},
	{
		resource: 'ajustesMovimientosStock',
		default: 'createStockMovement',
		options: [
			{
				name: 'Create',
				value: 'createStockMovement',
				action: 'Create stock movement',
				description: 'Create a stock movement adjustment',
			},
		],
	},
	{
		resource: 'pedidosVenta',
		default: 'listSalesOrders',
		options: [
			{
				name: 'Create',
				value: 'createSalesOrder',
				action: 'Create sales order',
				description: 'Create a sales order using the provided articles',
			},
			{
				name: 'By ID',
				value: 'getSalesOrderDetails',
				action: 'Get sales order',
				description: 'Get a sales order by its unique identifier',
			},
			{
				name: 'Statuses - List',
				value: 'listSalesOrderStatuses',
				action: 'List sales order statuses',
				description: 'Get all available sales order statuses',
			},
			{
				name: 'List',
				value: 'listSalesOrders',
				action: 'List sales orders',
				description: 'Get all sales orders using the selected filters',
			},
			{
				name: 'Summary',
				value: 'listFilteredSalesOrders',
				action: 'List summarized sales orders',
				description: 'Get sales orders with a lighter response body',
			},
		],
	},
	{
		resource: 'remitosVenta',
		default: 'createSalesDeliveryNote',
		options: [
			{
				name: 'Create',
				value: 'createSalesDeliveryNote',
				action: 'Create sales delivery note',
				description: 'Create a sales delivery note from the provided parameters',
			},
		],
	},
];

const operationOptionsByResource = Object.fromEntries(
	operationGroups.map((group) => [group.resource, group.options]),
) as Record<string, OperationOption[]>;

export const CentumOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Ajuste Movimiento Stock', value: 'ajustesMovimientosStock' },
			{ name: 'Articulo', value: 'articulos' },
			{ name: 'Bonificacion', value: 'bonificaciones' },
			{ name: 'Categoria Articulo', value: 'categoriasArticulo' },
			{ name: 'Chofer Guia Logistica', value: 'choferesGuiaLogistica' },
			{ name: 'Cliente', value: 'clientes' },
			{ name: 'Cobro', value: 'cobros' },
			{ name: 'Compra', value: 'compras' },
			{ name: 'Concepto', value: 'conceptos' },
			{ name: 'Departamento', value: 'departamentos' },
			{ name: 'Frecuencia De Cliente', value: 'frecuenciaClientes' },
			{ name: 'Lista Precio', value: 'listasPrecios' },
			{ name: 'Marca', value: 'marcas' },
			{ name: 'Operador Movil', value: 'operadoresMoviles' },
			{ name: 'Orden Compra', value: 'ordenesCompra' },
			{ name: 'País', value: 'paises' },
			{ name: 'Pedido Venta', value: 'pedidosVenta' },
			{ name: 'Promocion Comercial', value: 'promocionesComerciales' },
			{ name: 'Proveedor', value: 'proveedores' },
			{ name: 'Provincia', value: 'provincias' },
			{ name: 'Regimen Especial', value: 'regimenesEspeciales' },
			{ name: 'Remito Compra', value: 'remitosCompra' },
			{ name: 'Remito Venta', value: 'remitosVenta' },
			{ name: 'Rubro', value: 'rubros' },
			{ name: 'SubRubro', value: 'subRubros' },
			{ name: 'Sucursal Fisica', value: 'sucursalesFisicas' },
			{ name: 'Tipo Comprobante', value: 'tiposComprobante' },
			{ name: 'Token De Acceso', value: 'accessToken' },
			{ name: 'Turno Entrega', value: 'turnosEntrega' },
			{ name: 'Ubicacion Articulo', value: 'ubicacionesArticulos' },
			{ name: 'Vendedor', value: 'vendedores' },
			{ name: 'Venta', value: 'ventas' },
		],
		default: 'articulos',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['articulos'] } },
		options: operationOptionsByResource.articulos,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['marcas'] } },
		options: operationOptionsByResource.marcas,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['categoriasArticulo'] } },
		options: operationOptionsByResource.categoriasArticulo,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bonificaciones'] } },
		options: operationOptionsByResource.bonificaciones,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['rubros'] } },
		options: operationOptionsByResource.rubros,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['listasPrecios'] } },
		options: operationOptionsByResource.listasPrecios,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['subRubros'] } },
		options: operationOptionsByResource.subRubros,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ubicacionesArticulos'] } },
		options: operationOptionsByResource.ubicacionesArticulos,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['clientes'] } },
		options: operationOptionsByResource.clientes,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ventas'] } },
		options: operationOptionsByResource.ventas,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['promocionesComerciales'] } },
		options: operationOptionsByResource.promocionesComerciales,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cobros'] } },
		options: operationOptionsByResource.cobros,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['frecuenciaClientes'] } },
		options: operationOptionsByResource.frecuenciaClientes,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['compras'] } },
		options: operationOptionsByResource.compras,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['remitosCompra'] } },
		options: operationOptionsByResource.remitosCompra,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ordenesCompra'] } },
		options: operationOptionsByResource.ordenesCompra,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['tiposComprobante'] } },
		options: operationOptionsByResource.tiposComprobante,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['paises'] } },
		options: operationOptionsByResource.paises,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['departamentos'] } },
		options: operationOptionsByResource.departamentos,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['provincias'] } },
		options: operationOptionsByResource.provincias,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['turnosEntrega'] } },
		options: operationOptionsByResource.turnosEntrega,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['choferesGuiaLogistica'] } },
		options: operationOptionsByResource.choferesGuiaLogistica,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sucursalesFisicas'] } },
		options: operationOptionsByResource.sucursalesFisicas,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['vendedores'] } },
		options: operationOptionsByResource.vendedores,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['accessToken'] } },
		options: operationOptionsByResource.accessToken,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['operadoresMoviles'] } },
		options: operationOptionsByResource.operadoresMoviles,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['regimenesEspeciales'] } },
		options: operationOptionsByResource.regimenesEspeciales,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['conceptos'] } },
		options: operationOptionsByResource.conceptos,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['proveedores'] } },
		options: operationOptionsByResource.proveedores,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ajustesMovimientosStock'] } },
		options: operationOptionsByResource.ajustesMovimientosStock,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['pedidosVenta'] } },
		options: operationOptionsByResource.pedidosVenta,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['remitosVenta'] } },
		options: operationOptionsByResource.remitosVenta,
		default: '',
	},
];

export const operationDisplayNames = operationGroups.reduce<Record<string, string>>(
	(displayNames, group) => {
		for (const option of group.options) {
			displayNames[option.value] = option.name;
		}

		return displayNames;
	},
	{},
);
