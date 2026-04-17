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
		default: 'GetDatosGenerales',
		options: [
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos generales de un artículo específico en función de su ID único',
			},
			{
				name: 'GetDatosGenerales',
				value: 'GetDatosGenerales',
				action: 'GetDatosGenerales',
				description: 'Devuelve los datos generales de artículos en función de filtros varios.',
			},
			{
				name: 'GetVenta',
				value: 'GetVenta',
				action: 'GetVenta',
				description:
					'Devuelve información completa de artículos para la venta en función de el ID de un cliente específico y filtros varios',
			},
			{
				name: 'GetOneImagen',
				value: 'GetOneImagen',
				action: 'GetOneImagen',
				description:
					'Devuelve la imagen de un artículo específico en función de su ID único y número de orden',
			},
			{
				name: 'GetPrecios',
				value: 'GetPrecios',
				action: 'GetPrecios',
				description:
					'Devuelve los datos de precios de artículos en función de el ID de una lista de precios y filtros varios',
			},
			{
				name: 'GetExistenciasIndicadores',
				value: 'GetExistenciasIndicadores',
				action: 'GetExistenciasIndicadores',
				description:
					'Devuelve las existencias de artículos junto con los indicadores dentro de un depósito en función de filtros varios.',
			},
			{
				name: 'GetExistencias',
				value: 'GetExistencias',
				action: 'GetExistencias',
				description: 'Devuelva el artículo en stock utilizando los filtros seleccionados.',
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
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de marcas de artículos',
			},
		],
	},
	{
		resource: 'categoriasArticulo',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de categorías de artículos',
			},
		],
	},
	{
		resource: 'bonificaciones',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de bonificaciones de clientes',
			},
		],
	},
	{
		resource: 'rubros',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de rubros de artículos',
			},
		],
	},
	{
		resource: 'listasPrecios',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de listas de precios',
			},
		],
	},
	{
		resource: 'subRubros',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description:
					'Devuelve la lista completa de subrubros pudiendo filtrar de manera opcional por IDs de rubros',
			},
		],
	},
	{
		resource: 'ubicacionesArticulos',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
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
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de clientes en función de filtros varios.',
			},
			{
				name: 'Update',
				value: 'Update',
				action: 'Update',
				description: 'Actualiza un cliente y devuelve el objeto actualizado',
			},
			{
				name: 'Taxpayer Customer - Create',
				value: 'createTaxpayerCustomer',
				action: 'Create taxpayer customer',
				description: 'Crea un cliente',
			},
			{
				name: 'GetSaldoCuentaCorriente',
				value: 'GetSaldoCuentaCorriente',
				action: 'GetSaldoCuentaCorriente',
				description:
					'Devuelve el saldo de cuenta corriente de un cliente en función de su ID único.',
			},
			{
				name: 'Create',
				value: 'createCustomer',
				action: 'Create customer',
				description: 'Crea un cliente',
			},
			{
				name: 'GetComposicionSaldoCuentaCorriente',
				value: 'GetComposicionSaldoCuentaCorriente',
				action: 'GetComposicionSaldoCuentaCorriente',
				description:
					'Devuelve la composición del saldo de cuenta corriente de un cliente en función de su ID único.',
			},
			{
				name: 'GetOneContribuyente',
				value: 'GetOneContribuyente',
				action: 'GetOneContribuyente',
				description:
					'Devuelve datos básicos de un contribuyente obtenidos del padrón en función de un CUIT.',
			},
		],
	},
	{
		resource: 'ventas',
		default: 'Create',
		options: [
			{
				name: 'GetConsulta',
				value: 'GetConsulta',
				action: 'GetConsulta',
				description:
					'Devuelve los datos de comprobantes de venta con detalle de totales en función de filtros varios.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de comprobantes de venta en función de filtros varios.',
			},
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description:
					'Crea un comprobante de venta (factura de venta, nota de crédito de ventas, entre otros) a un cliente específico.',
			},
			{
				name: 'GetEstadisticas',
				value: 'GetEstadisticas',
				action: 'GetEstadisticas',
				description:
					'Devuelve información estadística de ventas por clientes, artículos, vendedores o sucursales fisicas en función de filtros varios.',
			},
		],
	},
	{
		resource: 'promocionesComerciales',
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de promociones comerciales en función de filtros varios.',
			},
		],
	},
	{
		resource: 'cobros',
		default: 'registerPayment',
		options: [
			{
				name: 'Create',
				value: 'registerPayment',
				action: 'Create payment',
				description: 'Crea un cobro (recibo) a un cliente específico.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de cobranzas realizadas en funcion de filtros varios.',
			},
		],
	},
	{
		resource: 'frecuenciaClientes',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de frecuencias de compra de un cliente.',
			},
		],
	},
	{
		resource: 'compras',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description:
					'Crea un comprobante de compra (factura de compra, nota de crédito de compras, entre otros) a un proveedor específico.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description:
					'Devuelve los datos de comprobantes de compras realizadas en funcion de filtros varios.',
			},
		],
	},
	{
		resource: 'remitosCompra',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea un remito de compra a un proveedor específico.',
			},
		],
	},
	{
		resource: 'ordenesCompra',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea una orden de compra a un proveedor específico.',
			},
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de una orden de compra específica en función de su ID único.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de ordenes de compra en función de filtros varios.',
			},
		],
	},
	{
		resource: 'tiposComprobante',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de tipos de comprobantes.',
			},
			{
				name: 'GetAllCompras',
				value: 'GetAllCompras',
				action: 'GetAllCompras',
				description:
					'Devuelve la lista completa de tipos de comprobantes utilizados en el circuito de compras.',
			},
			{
				name: 'GetAllVentas',
				value: 'GetAllVentas',
				action: 'GetAllVentas',
				description:
					'Devuelve la lista completa de tipos de comprobantes utilizados en el circuito de ventas.',
			},
		],
	},
	{
		resource: 'paises',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de países.',
			},
		],
	},
	{
		resource: 'departamentos',
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description:
					'Devuelve una lista de departamentos en funcion del ID específico de una provincia.',
			},
		],
	},
	{
		resource: 'provincias',
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve una lista de provincias en funcion del ID específico de un país.',
			},
		],
	},
	{
		resource: 'turnosEntrega',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de turnos de entrega de clientes.',
			},
		],
	},
	{
		resource: 'choferesGuiaLogistica',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de choferes para guías logísticas.',
			},
		],
	},
	{
		resource: 'sucursalesFisicas',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de sucursales físicas.',
			},
		],
	},
	{
		resource: 'vendedores',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de vendedores.',
			},
		],
	},
	{
		resource: 'accessToken',
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Genera el token que se necesita enviar en el header CentumSuiteAccessToken.',
			},
		],
	},
	{
		resource: 'operadoresMoviles',
		default: 'Get',
		options: [
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de un operador móvil en función de filtros varios.',
			},
			{
				name: 'GetCredenciales',
				value: 'GetCredenciales',
				action: 'GetCredenciales',
				description:
					'Devuelve los datos de un operador móvil en función de sus credenciales (usuarios y contraseñas).',
			},
		],
	},
	{
		resource: 'regimenesEspeciales',
		default: 'GetAll',
		options: [
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de un regimen especial específico en función de su ID único.',
			},
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de regímenes especiales.',
			},
		],
	},
	{
		resource: 'conceptos',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de conceptos para comprobantes de compra o venta.',
			},
		],
	},
	{
		resource: 'proveedores',
		default: 'GetOne',
		options: [
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description: 'Devuelve los datos de un proveedor específico en función de su ID único.',
			},
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea un proveedor.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de proveedores en función de filtros varios.',
			},
		],
	},
	{
		resource: 'ajustesMovimientosStock',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea un ajuste de stock de artículos.',
			},
		],
	},
	{
		resource: 'pedidosVenta',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea un pedido de venta a un cliente específico.',
			},
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de un pedido de venta específico en función de su ID único.',
			},
			{
				name: 'GetAllEstados',
				value: 'GetAllEstados',
				action: 'GetAllEstados',
				description:
					'Devuelve los datos de pedidos de venta con detalle de totales en función de filtros varios.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de pedidos de venta en función de filtros varios.',
			},
			{
				name: 'GetConsulta',
				value: 'GetConsulta',
				action: 'GetConsulta',
				description: 'Get sales orders with a lighter response body',
			},
		],
	},
	{
		resource: 'remitosVenta',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea un remito de venta a un cliente específico.',
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
