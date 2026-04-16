import { INodeProperties } from 'n8n-workflow';

const resourceOptions = [
	{ name: 'Articulos', value: 'articles' },
	{ name: 'Clientes', value: 'customers' },
	{ name: 'Extras', value: 'extras' },
	{ name: 'Geografia', value: 'geography' },
	{ name: 'Logistica', value: 'logistics' },
	{ name: 'Pagos', value: 'payments' },
	{ name: 'Compras', value: 'purchases' },
	{ name: 'Ventas', value: 'sales' },
	{ name: 'Stock', value: 'stock' },
	{ name: 'Proveedores', value: 'suppliers' },
];

export const resourceDisplayNames = resourceOptions.reduce<Record<string, string>>(
	(displayNames, option) => {
		displayNames[option.value] = option.name;
		return displayNames;
	},
	{},
);

export const CentumOperations: INodeProperties[] = [
	{
		displayName: 'Recurso',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: resourceOptions,
		default: 'sales',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['articles'] } },
		options: [
			{
				name: 'Por ID',
				value: 'getProductByCode',
				action: 'Get article by ID',
				description:
					'Devuelve los datos generales de un artículo específico en función de su ID único.',
			},
			{
				name: 'Buscar',
				value: 'searchProducts',
				action: 'Search articles by name',
				description: 'Search for an article by name and return every match',
			},
			{
				name: 'Filtrar',
				value: 'listAvailableProducts',
				action: 'List filtered articles',
				description:
					'Devuelve información completa de artículos para la venta en función de el ID de un cliente específico y filtros varios.',
			},
			{
				name: 'Imagen',
				value: 'downloadProductImages',
				action: 'Get article image',
				description:
					'Devuelve la imagen de un artículo específico en función de su ID único y número de orden	',
			},
			{
				name: 'Listar',
				value: 'listAllProducts',
				action: 'List article details',
				description: 'Devuelve los datos generales de artículos en función de filtros varios',
			},
			{
				name: 'Precio por Lista',
				value: 'getProductPrice',
				action: 'Get article price by list',
				description:
					'Devuelve los datos de precios de artículos en función de el ID de una lista de precios y filtros varios',
			},
			{
				name: 'Stock por Sucursal e ID de Articulo',
				value: 'getProductInBranch',
				action: 'Get branch stock by article',
				description: 'Return stock for a specific article in a physical branch',
			},
			{
				name: 'Stock por Sucursal Fisica',
				value: 'listProductsByBranch',
				action: 'List stock by physical branch',
				description: 'Return article stock for a specific physical branch',
			},
			{
				name: 'Marcas - Obtener',
				value: 'listBrands',
				action: 'List brands',
				description: 'Devuelve la lista completa de marcas de artículos',
			},
			{
				name: 'Categorias - Obtener',
				value: 'listCategories',
				action: 'List categories',
				description: 'Devuelve la lista completa de categorías de artículos',
			},
			{
				name: 'Descuentos - Obtener',
				value: 'listDiscounts',
				action: 'List discounts',
				description: 'Devuelve la lista completa de bonificaciones de clientes.',
			},
			{
				name: 'Grupos - Obtener',
				value: 'listGroups',
				action: 'List groups',
				description: 'Devuelve la lista completa de rubros de artículos.',
			},
			{
				name: 'Precios de Productos - Listar',
				value: 'listPrices',
				action: 'List product prices',
				description: 'Devuelve la lista completa de listas de precios',
			},
			{
				name: 'Subgrupos - Listar',
				value: 'listSubgroups',
				action: 'List subgroups',
				description:
					'Devuelve la lista completa de subrubros pudiendo filtrar de manera opcional por IDs de rubros.',
			},
		],
		default: 'searchProducts',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customers'] } },
		options: [
			{
				name: 'Crear',
				value: 'createCustomer',
				action: 'Create customer',
				description: 'Create a new customer',
			},
			{
				name: 'Obtener Saldo',
				value: 'getCustomerBalance',
				action: 'Get customer balance',
				description: 'Get the balance for the selected customer',
			},
			{
				name: 'Obtener Desglose de Saldo',
				value: 'getCustomerBalanceDetails',
				action: 'Get customer balance breakdown',
				description: 'Get the account balance breakdown for the selected customer',
			},
			{
				name: 'Obtener Promociones Comerciales',
				value: 'listCustomerCommercialPromotions',
				action: 'Get customer commercial promotions',
				description: 'Get the commercial promotions applied to a customer from the selected date',
			},
			{
				name: 'Obtener Facturas de Pago',
				value: 'listPaymentInvoices',
				action: 'Get payment invoices',
				description: 'Get all payment invoices for the selected customer',
			},
			{
				name: 'Obtener Facturas de Venta',
				value: 'listSalesInvoices',
				action: 'Get sales invoices',
				description: 'Get all sales invoices for the selected customer',
			},
			{
				name: 'Obtener Facturas de Venta por ID',
				value: 'listSalesInvoicesById',
				action: 'Get sales invoices by ID',
				description: 'Get all sales invoices for the selected customer by ID',
			},
			{
				name: 'Listar',
				value: 'listCustomers',
				action: 'List customers',
				description: 'Return a list of all registered customers',
			},
			{
				name: 'Buscar',
				value: 'searchCustomers',
				action: 'Search customers',
				description: 'Return a list of customers that match the selected filters',
			},
			{
				name: 'Buscar por CUIT',
				value: 'searchCustomerByCuit',
				action: 'Search customers by CUIT',
				description: 'Return a list of customers based on the provided CUIT',
			},
			{
				name: 'Actualizar',
				value: 'updateCustomer',
				action: 'Update customer',
				description: 'Actualiza un cliente y devuelve el objeto actualizado.',
			},
			{
				name: 'Frecuencias de Clientes - Listar',
				value: 'listCustomerFrequencies',
				action: 'List customer frequencies',
				description: 'Get a list of customer frequency options',
			},
			{
				name: 'Cliente Contribuyente - Crear',
				value: 'createTaxpayerCustomer',
				action: 'Create taxpayer customer',
				description: 'Create a new taxpayer customer',
			},
			{
				name: 'Cliente Contribuyente - Buscar',
				value: 'searchTaxpayerCustomer',
				action: 'Search taxpayer customer',
				description: 'Return taxpayer data by CUIT or business name',
			},
		],
		default: 'updateCustomer',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sales'] } },
		options: [
			{
				name: 'Promociones Comerciales - Listar',
				value: 'listPromotions',
				action: 'List commercial promotions',
				description: 'Get the available commercial promotions',
			},
			{
				name: 'Crear',
				value: 'createSale',
				action: 'Create sale',
				description: 'Create a sale from the completed parameters',
			},
			{
				name: 'Pedido de Venta - Crear',
				value: 'createSalesOrder',
				action: 'Create sales order',
				description: 'Create a sales order using the provided articles',
			},
			{
				name: 'Pedido de Venta - Obtener',
				value: 'getSalesOrderDetails',
				action: 'Get sales order',
				description: 'Get a sales order by its unique identifier',
			},
			{
				name: 'Estados de Pedido de Venta - Listar',
				value: 'listSalesOrderStatuses',
				action: 'List sales order statuses',
				description: 'Get all available sales order statuses',
			},
			{
				name: 'Pedidos de Venta - Listar',
				value: 'listSalesOrders',
				action: 'List sales orders',
				description: 'Get all sales orders using the selected filters',
			},
			{
				name: 'Pedidos de Venta - Resumen',
				value: 'listFilteredSalesOrders',
				action: 'List summarized sales orders',
				description: 'Get sales orders with a lighter response body',
			},
			{
				name: 'Ranking de Ventas - Obtener',
				value: 'getSalesRanking',
				action: 'Get sales ranking',
				description: 'Get a ranking of customers, articles, sellers, or branches',
			},
			{
				name: 'Comprobantes de Venta - Listar',
				value: 'listSalesVouchers',
				action: 'List sales vouchers',
				description: 'Get a list of sales vouchers using the selected filters',
			},
		],
		default: 'listSalesVouchers',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['payments'] } },
		options: [
			{
				name: 'Crear',
				value: 'registerPayment',
				action: 'Create payment',
				description: 'Create a payment voucher',
			},
			{
				name: 'Listar',
				value: 'listPayments',
				action: 'List payments',
				description: 'Get a list of payments using the selected filters',
			},
		],
		default: 'registerPayment',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['purchases'] } },
		options: [
			{
				name: 'Remito de Compra - Crear',
				value: 'createPurchaseDeliveryNote',
				action: 'Create purchase delivery note',
				description: 'Create a purchase delivery note from the provided parameters',
			},
			{
				name: 'Orden de Compra - Crear',
				value: 'createPurchaseOrder',
				action: 'Create purchase order',
				description: 'Create a purchase order using the selected parameters',
			},
			{
				name: 'Orden de Compra - Obtener',
				value: 'getPurchaseOrderDetails',
				action: 'Get purchase order',
				description: 'Get a single purchase order by ID',
			},
			{
				name: 'Ordenes de Compra - Listar',
				value: 'listPurchaseOrders',
				action: 'List purchase orders',
				description: 'Get all purchase orders using the selected filters',
			},
			{
				name: 'Comprobantes de Compra - Listar',
				value: 'listPurchaseVouchers',
				action: 'List purchase vouchers',
				description: 'Get a list of purchase vouchers using the selected filters',
			},
			{
				name: 'Crear',
				value: 'createPurchase',
				action: 'Create purchase',
				description: 'Create a purchase using the selected parameters',
			},
			{
				name: 'Listar',
				value: 'listPurchases',
				action: 'List purchases',
				description: 'Get a list of purchases using the selected filters',
			},
		],
		default: 'createPurchase',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['suppliers'] } },
		options: [
			{
				name: 'Buscar',
				value: 'searchSupplier',
				action: 'Search supplier',
				description: 'Return supplier information based on its ID',
			},
			{
				name: 'Crear',
				value: 'createSupplier',
				action: 'Create supplier',
				description: 'Create a supplier using the provided data',
			},
			{
				name: 'Listar',
				value: 'listSuppliers',
				action: 'List suppliers',
				description: 'Get a complete list of suppliers',
			},
		],
		default: 'searchSupplier',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['logistics'] } },
		options: [
			{
				name: 'Turnos de Entrega - Listar',
				value: 'listDeliveryTimeSlots',
				action: 'List delivery time slots',
				description: 'Get the full list of available delivery time slots',
			},
			{
				name: 'Choferes - Listar',
				value: 'listDrivers',
				action: 'List drivers',
				description: 'Get the complete list of available drivers',
			},
			{
				name: 'Sucursales Fisicas - Listar',
				value: 'listPhysicalBranches',
				action: 'List physical branches',
				description: 'Get the available physical branches',
			},
			{
				name: 'Remito de Venta - Crear',
				value: 'createSalesDeliveryNote',
				action: 'Create sales delivery note',
				description: 'Create a sales delivery note from the provided parameters',
			},
			{
				name: 'Vendedores - Listar',
				value: 'listSellers',
				action: 'List sellers',
				description: 'Get a list of all available sellers',
			},
		],
		default: 'listDrivers',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['stock'] } },
		options: [
			{
				name: 'Ubicaciones de Articulos - Listar',
				value: 'listArticleLocations',
				action: 'List article locations',
				description:
					'Devuelve la lista completa de ubicaciones de artículos dentro de una sección sucursal.',
			},
			{
				name: 'Ubicaciones de Articulos por Seccion - Obtener',
				value: 'getArticleLocationsBySection',
				action: 'Get article locations by section',
				description: 'Get article locations for a specific branch section',
			},
			{
				name: 'Stock',
				value: 'getStock',
				action: 'Get article stock',
				description: 'Return article stock using the selected filters',
			},
			{
				name: 'Orden de Transferencia - Crear',
				value: 'createStockMovement',
				action: 'Create stock movement',
				description: 'Create a stock movement adjustment',
			},
		],
		default: 'getStock',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['geography'] } },
		options: [
			{
				name: 'Paises - Listar',
				value: 'listCountries',
				action: 'List countries',
				description: 'Get the list of available countries',
			},
			{
				name: 'Municipios - Listar',
				value: 'listMunicipalities',
				action: 'List municipalities',
				description: 'Get a list of municipalities, usually filtered by province',
			},
			{
				name: 'Provincias - Listar',
				value: 'listProvinces',
				action: 'List provinces',
				description: 'Get a list of provinces, usually filtered by country',
			},
		],
		default: 'listMunicipalities',
	},
	{
		displayName: 'Operacion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['extras'] } },
		options: [
			{
				name: 'Token de Acceso - Generar',
				value: 'generateSecurityToken',
				action: 'Generate access token',
				description: 'Generate a token for external tools such as Postman',
			},
			{
				name: 'Binario a Imagen',
				value: 'syncImages',
				action: 'Process binary images',
				description: 'Process binary image data for WooCommerce usage',
			},
			{
				name: 'Conceptos - Listar',
				value: 'listConcepts',
				action: 'List concepts',
				description: 'Get a list of concepts',
			},
			{
				name: 'Operador Movil - Verificar',
				value: 'verifyOperatorCredentials',
				action: 'Verify mobile operator',
				description: 'Get the data for a mobile operator using the configured credentials',
			},
			{
				name: 'Operadores Moviles - Listar',
				value: 'listMobileOperators',
				action: 'List mobile operators',
				description: 'Get the list of all mobile operators',
			},
			{
				name: 'Regimenes Impositivos Especiales - Por ID',
				value: 'getSpecialTaxRegimeDetails',
				action: 'Get special tax regime by ID',
				description: 'Get a special tax regime by ID',
			},
			{
				name: 'Regimenes Impositivos Especiales - Listar',
				value: 'listSpecialTaxRegimes',
				action: 'List special tax regimes',
				description: 'Get the complete list of special tax regimes',
			},
			{
				name: 'Tipos de Comprobante - Listar',
				value: 'listVoucherTypes',
				action: 'List voucher types',
				description: 'Get a list of all voucher types',
			},
			{
				name: 'Productos WooCommerce - Generar (JSON de Producto)',
				value: 'convertProductsForWooCommerce',
				action: 'Convert woo commerce products',
				description: 'Generate structured WooCommerce product JSON from Centum articles',
			},
		],
		default: 'generateSecurityToken',
	},
];

export const operationDisplayNames = CentumOperations.reduce<Record<string, string>>(
	(displayNames, property) => {
		if (property.name !== 'operation' || !property.options) {
			return displayNames;
		}

		for (const option of property.options) {
			if (
				'name' in option &&
				'value' in option &&
				typeof option.name === 'string' &&
				typeof option.value === 'string'
			) {
				displayNames[option.value] = option.name;
			}
		}

		return displayNames;
	},
	{},
);
