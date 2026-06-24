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
	accessToken: 'Access Token',
	ajustesMovimientosStock: 'Ajustes Movimientos Stock',
	articulos: 'Articulos',
	bonificaciones: 'Bonificaciones',
	categoriasArticulo: 'Categorías Articulo',
	choferes: 'Choferes',
	choferesGuiaLogistica: 'Choferes Guía Logística',
	clientes: 'Clientes',
	cobros: 'Cobros',
	compras: 'Compras',
	conceptos: 'Conceptos',
	departamentos: 'Departamentos',
	divisionesEmpresasGrupoEconomico: 'Divisiones Empresa Grupo Economico',
	frecuenciaClientes: 'Frecuencia Clientes',
	listasPrecios: 'Listas Precios',
	marcas: 'Marcas',
	operadoresMoviles: 'Operadores Móviles',
	ordenesCompra: 'Órdenes Compra',
	ordenesTraspaso: 'Orden Traspaso',
	paises: 'Países',
	pedidosVenta: 'Pedidos Venta',
	promocionesComerciales: 'Promociones Comerciales',
	proveedores: 'Proveedores',
	provincias: 'Provincias',
	regimenesEspeciales: 'Regimenes Especiales',
	remitosCompra: 'Remitos Compra',
	remitosVenta: 'Remitos Venta',
	rubros: 'Rubros',
	seccionesSucursales: 'Secciones Sucursales',
	subRubros: 'SubRubros',
	sucursalesFisicas: 'Sucursales Físicas',
	transportes: 'Transportes',
	tiposComprobante: 'Tipos Comprobante',
	turnosEntrega: 'Turnos Entrega',
	ubicacionesArticulos: 'Ubicaciones Artículos',
	vendedores: 'Vendedores',
	ventas: 'Ventas',
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
		resource: 'condicionesVenta',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de condiciones de venta.',
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
				name: 'GetArticulos',
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
				name: 'GetOneContribuyente',
				value: 'GetOneContribuyente',
				action: 'Get taxpayer customer',
				description: 'Busca un contribuyente por CUIT.',
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
				value: 'Create',
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
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de un comprobante de venta específico en función de su ID único.',
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
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
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
		resource: 'divisionesEmpresasGrupoEconomico',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'Get all divisions',
				description: 'Devuelve todas las divisiones empresa grupo económico de la implementación.',
			},
			{
				name: 'GetUsuarioLogueado',
				value: 'GetUsuarioLogueado',
				action: 'Get user divisions',
				description:
					'Devuelve las divisiones empresa grupo económico habilitadas para el consumidor autenticado.',
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
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de un comprobante de compra específico en función de su ID único.',
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
			{
				name: 'GetPendientes',
				value: 'GetPendientes',
				action: 'GetPendientes',
				description:
					'Devuelve los datos de ordenes de compra y el detalle de artículos que aún se encuentran pendientes por parte del proveedor en función de filtros varios.',
			},
		],
	},
	{
		resource: 'ordenesTraspaso',
		default: 'Create',
		options: [
			{
				name: 'Create',
				value: 'Create',
				action: 'Create',
				description: 'Crea una orden de traspaso entre sucursales físicas.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description: 'Devuelve los datos de órdenes de traspaso en función de filtros varios.',
			},
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de una orden de traspaso específica en función de su ID único.',
			},
			{
				name: 'Dispatch',
				value: 'Dispatch',
				action: 'Dispatch',
				description: 'Despacha una orden de traspaso por su ID único.',
			},
			{
				name: 'Finalize',
				value: 'Finalize',
				action: 'Finalize',
				description: 'Efectiviza una orden de traspaso por su ID único.',
			},
		],
	},
	{
		resource: 'transportes',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de transportes.',
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
		resource: 'choferes',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de choferes.',
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
		resource: 'seccionesSucursales',
		default: 'GetAll',
		options: [
			{
				name: 'GetAll',
				value: 'GetAll',
				action: 'GetAll',
				description: 'Devuelve la lista completa de secciones de sucursales.',
			},
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description: 'Devuelve una sección de sucursal por ID.',
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
			{
				name: 'GetOne',
				value: 'GetOne',
				action: 'GetOne',
				description:
					'Devuelve los datos de un ajuste de stock en función de su ID único.',
			},
			{
				name: 'Get',
				value: 'Get',
				action: 'Get',
				description:
					'Devuelve ajustes de stock en función de filtros de fecha de imputación.',
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
				name: 'GetConsulta',
				value: 'GetConsulta',
				action: 'GetConsulta',
				description: 'Devuelve los datos de pedidos de venta en función de filtros varios.',
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
			{ name: 'Access Token', value: 'accessToken' },
			{ name: 'Ajustes Movimientos Stock', value: 'ajustesMovimientosStock' },
			{ name: 'Articulos', value: 'articulos' },
			{ name: 'Bonificaciones', value: 'bonificaciones' },
			{ name: 'Categorías Articulo', value: 'categoriasArticulo' },
			{ name: 'Choferes', value: 'choferes' },
			{ name: 'Choferes Guía Logística', value: 'choferesGuiaLogistica' },
			{ name: 'Clientes', value: 'clientes' },
			{ name: 'Cobros', value: 'cobros' },
			{ name: 'Compras', value: 'compras' },
			{ name: 'Conceptos', value: 'conceptos' },
			{ name: 'Condiciones Venta', value: 'condicionesVenta' },
			{ name: 'Departamentos', value: 'departamentos' },
			{ name: 'Divisiones Empresa Grupo Economico', value: 'divisionesEmpresasGrupoEconomico' },
			{ name: 'Frecuencia Clientes', value: 'frecuenciaClientes' },
			{ name: 'Listas Precios', value: 'listasPrecios' },
			{ name: 'Marcas', value: 'marcas' },
			{ name: 'Operadores Móviles', value: 'operadoresMoviles' },
			{ name: 'Orden Traspaso', value: 'ordenesTraspaso' },
			{ name: 'Órdenes Compra', value: 'ordenesCompra' },
			{ name: 'Países', value: 'paises' },
			{ name: 'Pedidos Venta', value: 'pedidosVenta' },
			{ name: 'Promociones Comerciales', value: 'promocionesComerciales' },
			{ name: 'Proveedores', value: 'proveedores' },
			{ name: 'Provincias', value: 'provincias' },
			{ name: 'Regimenes Especiales', value: 'regimenesEspeciales' },
			{ name: 'Remitos Compra', value: 'remitosCompra' },
			{ name: 'Remitos Venta', value: 'remitosVenta' },
			{ name: 'Rubros', value: 'rubros' },
			{ name: 'Secciones Sucursales', value: 'seccionesSucursales' },
			{ name: 'SubRubros', value: 'subRubros' },
			{ name: 'Sucursales Físicas', value: 'sucursalesFisicas' },
			{ name: 'Tipos Comprobante', value: 'tiposComprobante' },
			{ name: 'Transportes', value: 'transportes' },
			{ name: 'Turnos Entrega', value: 'turnosEntrega' },
			{ name: 'Ubicaciones Artículos', value: 'ubicacionesArticulos' },
			{ name: 'Vendedores', value: 'vendedores' },
			{ name: 'Ventas', value: 'ventas' },
		],
		default: 'articulos',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['divisionesEmpresasGrupoEconomico'] } },
		options: operationOptionsByResource.divisionesEmpresasGrupoEconomico,
		default: '',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['transportes'] } },
		options: operationOptionsByResource.transportes,
		default: '',
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
		displayOptions: { show: { resource: ['condicionesVenta'] } },
		options: operationOptionsByResource.condicionesVenta,
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
		displayOptions: { show: { resource: ['ordenesTraspaso'] } },
		options: operationOptionsByResource.ordenesTraspaso,
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
		displayOptions: { show: { resource: ['choferes'] } },
		options: operationOptionsByResource.choferes,
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
		displayOptions: { show: { resource: ['seccionesSucursales'] } },
		options: operationOptionsByResource.seccionesSucursales,
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
