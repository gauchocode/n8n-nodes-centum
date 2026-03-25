import { INodeProperties } from 'n8n-workflow';

export const CentumOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: '_Token De Acceso - Generación',
				value: 'generarTokenSeguridad',
				action: 'Genera un nuevo token',
				description: 'Genera un nuevo token para utilizarlo con una herramienta externa como postman'
			},
			{
				name: 'Articulo - Buscar',
				value: 'buscarProductos',
				action: 'Busca un articulo por nombre',
				description: 'Busca un articulo por nombre y retorna todas las ocurrencias'
			},
			{
				name: 'Articulo - Por ID',
				value: 'buscarProductoPorCodigo',
				action: 'Buscar artículo por ID',
				description: 'Retorna un artículo específico basado en su ID único'
			},
			{
				name: 'Artículos - Existencia',
				value: 'consultarStock',
				action: 'Obtener existencias de artículos',
				description: 'Retorna un listado de las existencias de los artículos en base a ciertos filtros'
			},
			{
				name: 'Artículos - Filtrado',
				value: 'listarProductosDisponibles',
				action: 'Buscar artículos con filtros',
				description: 'Retorna un listado de artículos para vender en base a ciertos filtros'
			},
			{
				name: 'Artículos - Imagen',
				value: 'descargarImagenesProductos',
				action: 'Obtener imagen de artículo',
				description: 'Retorna la imagen (binario) de un artículo'
			},
			{
				name: 'Artículos - Listado',
				value: 'listarTodosLosProductos',
				action: 'Obtener datos generales de artículos',
				description: 'Retorna un listado de los artículos y sus datos generales'
			},
			{
				name: 'Artículos - Precio Por Lista',
				value: 'consultarPrecioProducto',
				action: 'Obtén el precio de un artículo según la lista',
				description: 'Devuelve el valor de un artículo, según la lista indicada'
			},
			{
				name: 'Artículos - Stock Sucursal Física',
				value: 'listarProductosPorSucursal',
				action: 'Obtener stock por sucursal física',
				description: 'Retorna el stock de artículos en una sucursal física específica'
			},
			{
				name: 'Artículos - Stock Sucursal Física Por ID Artículo',
				value: 'buscarProductoEnSucursal',
				action: 'Obtener el stock por artículo individual por sucursal física',
				description: 'Retorna el stock de un artículo en específico de una sucursal física'
			},
			{
				name: 'Bonificaciones - Obtener',
				value: 'listarBonificaciones',
				action: 'Obtiene el listado de bonificaciones disponibles',
				description: 'Obtiene el listado completo de bonificaciones disponibles'
			},
			{
				name: 'Categorías - Obtener',
				value: 'listarCategorias',
				action: 'Obten el listado de las categorías',
				description: 'Obten el listado completo de todas las categorías de los articulos'
			},
			{
				name: 'Choferes - Obtener Listado',
				value: 'listarChoferes',
				description: 'Obtiene un listado completo de los choferes disponibles'
			},
			{
				name: 'Cliente - Actualizar',
				value: 'actualizarCliente',
				action: 'Actualizar cliente',
				description: 'Actualiza un cliente y retorna su información con la URL para acceder al recurso'
			},
			{
				name: 'Cliente - Búsqueda',
				value: 'buscarClientes',
				action: 'Buscar cliente',
				description: 'Retorna un listado de clientes en base a ciertos filtros'
			},
			{
				name: 'Cliente - Búsqueda Por CUIT',
				value: 'buscarClientePorCuit',
				action: 'Buscar clientes por CUIT',
				description: 'Retorna un listado de clientes basado en el CUIT proporcionado'
			},
			{
				name: 'Cliente - Lista',
				value: 'listarClientes',
				action: 'Obtener lista de clientes',
				description: 'Retorna una lista con todos los clientes registrados'
			},
			{
				name: 'Cliente - Nuevo',
				value: 'crearCliente',
				action: 'Crear nuevo cliente',
				description: 'Da de alta un cliente. Retornará el cliente creado (con su ID cargado) y la URL para acceder al nuevo recurso.'
			},
			{
				name: 'Cliente - Obtener Composición Del Saldo',
				value: 'verDetalleSaldoCliente',
				description: 'Obtiene la composición del saldo de la cuenta corriente del cliente especificado',
				action: 'Obtener composición del saldo del cliente'
			},
			{
				name: 'Cliente - Obtener Facturas De Cobro',
				value: 'listarFacturasCobros',
				description: 'Obtiene la totalidad de las facturas de los cobros del cliente especificado',
				action: 'Obtener facturas de cobros del cliente'
			},
			{
				name: 'Cliente - Obtener Facturas De Venta',
				value: 'listarFacturasVenta',
				description: 'Obtiene la totalidad de las facturas de los pedido de ventas del cliente especificado',
				action: 'Obtener facturas de pedidos de ventas del cliente'
			},
			{
				name: 'Cliente - Obtener Facturas De Venta Por ID',
				value: 'listarFacturasVentasPorID',
				description: 'Obtiene la totalidad de las facturas de los pedido de ventas del cliente especificado',
				action: 'Obtener facturas de pedidos de ventas del cliente'
			},
			{
				name: 'Cliente - Obtener Promoción Comercial',
				value: 'listarPromocionesComercialesCliente',
				description: 'Obtiene las promociones comerciales aplicadas a un cliente desde una fecha seleccionada',
				action: 'Obtener promociones aplicadas a un cliente'
			},
			{
				name: 'Cliente - Obtener Saldo',
				value: 'consultarSaldoCliente',
				description: 'Obtiene el saldo del cliente especificado',
				action: 'Obtener saldo del cliente'
			},
			{
				name: 'Cliente Contribuyente - Búsqueda',
				value: 'buscarContribuyente',
				description: 'Retorna los datos del contribuyente por medio de una búsqueda por CUIT o Razón Social',
				action: 'Buscar cliente contribuyente'
			},
			{
				name: 'Cliente Contribuyente - Nuevo',
				value: 'crearContribuyente',
				description: 'Da de alta un cliente contribuyente nuevo. Retornará al cliente creado (con su ID cargado) y la URL para acceder al nuevo recurso.',
				action: 'Crear nuevo cliente contribuyente'
			},
			{
				name: 'Cobro - Nuevo',
				value: 'registrarCobro',
				action: 'Registrar nuevo cobro',
				description: 'Da de alta el comprobante. Retornará el comprobante creado con su información y una URL.'
			},
			{
				name: 'Cobro - Obtener Listado',
				value: 'listarCobros',
				action: 'Obtener un listado de cobro',
				description: 'Obtener un listado de cobros en base a ciertos parametros'
			},
			{
			 	name: 'Compras - Generar Compra',
			 	value: 'crearCompra',
			 	action: 'Genera una compra',
			 	description: 'Genera una compra desde los parametros especificados'
			},
			{
				name: 'Compras - Obtener Listado',
				value: 'listarCompras',
				action: 'Obtener un listado de las compras',
				description: 'Obtener un listado de las compras en base a ciertos parametros'
			},
			{
				name: 'Comprobante De Compra - Obtener Listado',
				value: 'listarComprobantesCompra',
				description: 'Obtener un listado de los comprobantes de compra en base a ciertos parametros'
			},
			{
				name: 'Comprobante De Venta - Obtener Listado',
				value: 'listarComprobantesVenta',
				description: 'Obtener un listado de los comprobante de venta en base a ciertos parametros'
			},
			{
				name: 'Conceptos - Obtener Listado',
				value: 'listarConceptos',
				action: 'Obtener un listado de conceptos'
			},
			{
				name: 'Estadística Ranking - Venta',
				value: 'estadisticaVentaRanking',
				description: 'Obtiene un listado de clientes, articulos, vendedores o sucursales fisicas según un ranking de venta'
			},
			{
				name: 'Frecuencias Clientes - Listar',
				value: 'frecuenciasCliente',
				description: 'Obtiene un listado con las frecuencias de los clientes'
			},
			{
				name: 'Marcas - Obtener',
				value: 'listarMarcas',
				action: 'Obten el listado de las marcas',
				description: 'Obten el listado completo de todas las marcas de los articulos'
			},
			{
				name: 'Municipios - Lista',
				value: 'listarMunicipios',
				description: 'Obtiene un listado de los municipios, normalmente filtrado por provincia'
			},
			{
				name: 'Obtener Operador Móvil',
				value: 'listarOperadoresMoviles',
				description: 'Obtiene el listado de todos los operadores moviles. Si desea puede filtrar por nombre / usuario.'
			},
			{
				name: 'Orden De Compra - Generar',
				value: 'crearOrdenCompra',
				description: 'Genera una orden de compra en base a ciertos parametros'
			},
			{
				name: 'Orden De Compra - Obtener',
				value: 'verDetalleOrdenCompra',
				description: 'Obtiene una unica orden de compra en base al ID'
			},
			{
				name: 'Orden De Traspaso - Generar',
				value: 'crearMovimientoStock',
				description: 'Crea un ajuste de movimiendo de stock'
			},
			{
				name: 'Ordenes De Compra - Obtener',
				value: 'listarOrdenesCompra',
				description: 'Obtiene todas las ordenes de compra en base a ciertos filtros'
			},
			{
				name: 'Pais- Obtener Listado',
				value: 'listarPaises',
				description: 'Obtiene el listado de paises disponibles'
			},
			{
				name: 'Pedido De Venta - Actividad',
				value: 'verDetallePedidoVenta',
				action: 'Obtener actividad de pedido de venta',
				description: 'Trae un pedido de venta por un identificador único'
			},
			{
				name: 'Pedido De Venta - Nuevo',
				value: 'crearPedidoVenta',
				action: 'Crear nuevo pedido de venta',
				description: 'Realiza pedidos de venta de los artículos'
			},
			{
				name: 'Pedidos De Venta - Estado',
				value: 'listarEstadosPedidosVenta',
				description: 'Obtiene todos los estados disponibles de los pedidos de ventas'
			},
			{
				name: 'Pedidos De Venta - Listar',
				value: 'listarPedidosVenta',
				description: 'Obtiene todos los pedidos de ventas en base a ciertos parámetros'
			},
			{
				name: 'Pedidos De Venta - Resumido',
				value: 'listarPedidosVentaFiltrados',
				action: 'Obtiene todos los pedidos de venta en base a ciertos parametros',
				description: 'Obtiene todos los pedidos de venta con un cuerpo de respuesta mas ligero',
			},
			{
				name: 'Precios De Productos - Lista',
				value: 'listarPrecios',
				action: 'Obtener lista de precios de productos',
				description: 'Obtiene una lista con el listado de los precios sugeridos'
			},
			{
				name: 'Proceso Binario a Imagen',
				value: 'sincronizarImagenes',
				action: 'Procesar imágenes binarias',
				description: 'Procesa datos binarios de imágenes para su uso en WooCommerce'
			},
			{
				name: 'Productos WooCommerce - Generar (JSON Producto)',
				value: 'convertirProductosParaWooCommerce',
				description: 'Genera un JSON estructurado para productos WooCommerce a partir de artículos Centum',
			},
			{
				name: 'Promociones Comerciales - Lista',
				value: 'listarPromociones',
				description: 'Obtiene las promociones comerciales disponibles',
				action: 'Obtener promociones disponibles'
			},
			{
				name: 'Proveedor - Buscar',
				value: 'buscarProveedor',
				action: 'Obtén el proveedor segun el ID',
				description: 'Retorna la información del proveedor en base al ID'
			},
			{
				name: 'Proveedor - Crear',
				value: 'crearProveedor',
				action: 'Obtén el proveedor segun el ID',
				description: 'Retorna la información del proveedor en base al ID'
			},
			{
				name: 'Proveedores - Listar',
				value: 'listarProveedores',
				description: 'Obtiene una lista entera de los proveedores'
			},
			{
				name: 'Provincias - Lista',
				value: 'listarProvincias',
				description: 'Obtiene un listado de provincias, normalmente filtrado por país'
			},
			{
				name: 'Regímenes Especiales - ID',
				value: 'verDetalleRegimenEspecial',
				description: 'Trae un listado entero de los regímenes especiales'
			},
			{
				name: 'Regímenes Especiales - Lista',
				value: 'listarRegimenesEspeciales',
				description: 'Trae un listado entero de los regímenes especiales'
			},
			{
				name: 'Remito De Compra - Crear',
				value: 'crearRemitoCompra',
				description: 'Crea un remito de compra en base a los parametros enviados'
			},
			{
				name: 'Remito De Venta - Crear',
				value: 'crearRemitoVenta',
				description: 'Crea un remito de compra en base a los parametros enviados'
			},
			{
				name: 'Rubros - Obtener',
				value: 'listarRubros',
				action: 'Obten el listado de los rubros',
				description: 'Obten el listado completo de todos los rubros de los articulos'
			},
      {
        name: 'Sub Rubros - Listar',
        value: 'listarSubRubros',
        description: 'Obten el listado completo de los sub rubros o filtralo por ID'
      },
			{
				name: 'Sucursales Físicas - Lista',
				value: 'listarSucursales',
				description: 'Obtiene un listado de las sucursales físicas disponibles',
			},
			{
				name: 'Tipo De Comprobante - Lista',
				value: 'listarTiposComprobante',
				description: 'Obtiene un listado de todos los tipos de comprobantes'
			},
			{
				name: 'Turno De Entrega - Obtener',
				value: 'listarTurnosEntrega',
				description: 'Obtiene el listado total disponible de turnos de entrega'	
			},
			{
				name: 'Ubicaciones De Articulos - Listar',
				value: 'listarUbicacionArticulos',
				description: 'Obtiene un listado total de las ubicaciones de los articulos'
			},
			{
				name: 'Vendedores - Obtener',
				value: 'listarVendedores',
				description: 'Obtiene una lista de todos los vendedores disponibles'
			},
			{
			 	name: 'Ventas - Generar',
			 	value: 'crearVenta',
				description: 'Genera una venta en base a unos parametros completados'
			},
			{
				name: 'Verificar Operador Movil',
				value: 'verificarCredencialesOperador',
				description: 'Obtiene todos los datos de un operador móvil en base a las credenciales'
			},
		],
		default: 'verDetallePedidoVenta',
	},
];

const getArticulo: INodeProperties[] = [
	{
		displayName: 'Activo',
		name: 'active',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['crearProveedor', 'listarProveedores'] },
		},
	},
	{
		displayName: 'Articulos',
		name: 'articulo',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: { resource: ['registrarCobro', 'crearPedidoVenta', 'crearOrdenCompra', 'crearRemitoCompra'] },
		},
	},
	{
		displayName: 'Artículos',
		name: 'articlesCollection',
		type: 'string',
		placeholder: '[{ "ID": 1234, "Cantidad": 10 }, {"ID": 4567, "Cantidad": 5}]',
		default: '',
		description: 'Lista de artículos en formato JSON',
		displayOptions: {
			show: { resource: ['crearCompra', 'crearVenta', 'crearRemitoVenta'] },
		},
	},
	{
		displayName: 'Cantidad De Cuotas Efectivo',
		name: 'cantidadCuotasValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: { show: { esContado: [true] } },
	},
	// {
	// 	displayName: 'Cantidad Por Página',
	// 	name: 'cantidadPorPagina',
	// 	type: 'number',
	// 	default: 50,
	// 	description: 'Cantidad de artículos por página',
	// 	displayOptions: { show: { resource: ['articulo'] } },
	// },
	{
		displayName: 'Categoría De Impuestos A Las Ganancias',
		name: 'categoriaImpuestosGanancias',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
	{
		displayName: 'Clase De Proveedor',
		name: 'claseProveedor',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
	{
		displayName: 'Cliente',
		name: 'cliente',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: { resource: ['registrarCobro'] },
		},
	},
	{
		displayName: 'Fecha De Entrega Desde',
		name: 'fromDeliveryDate',
		type: 'dateTime',
		default: {},
		displayOptions: {
			show: { resource: ['listarOrdenesCompra'] },
		},
	},
	{
		displayName: 'Fecha De Entrega Hasta',
		name: 'sinceDeliveryDate',
		type: 'dateTime',
		default: {},
		displayOptions: {
			show: { resource: ['listarOrdenesCompra'] },
		},
	},
	{
		displayName: 'Cliente ID',
		name: 'clienteId',
		type: 'number',
		required: true,
		typeOptions: { maxValue: 9999999, minValue: 0, numberStepSize: 1 },
		default: 0,
		description: 'Client ID used to search the articles',
		displayOptions: {
			show: {
				resource: [
					'crearCompra',
					'listarProductosDisponibles',
					'consultarSaldoCliente',
					'verDetalleSaldoCliente',
					'listarFacturasVenta',
					'listarFacturasCobros',
					'listarPromocionesComercialesCliente',
					'listarPedidosVenta',
					'listarOrdenesCompra',
					'listarCobros',
					'listarCompras',
					'crearVenta',
					'listarPedidosVentaFiltrados',
					'consultarPrecioProducto',
					'crearRemitoVenta',
					'crearRemitoCompra'
				],
			},
		},
	},
	{
		displayName: 'Codigo Artículo',
		name: 'codigoArticulo',
		type: 'string',
		default: '',
		placeholder: '[{ "ID": 1234, "Cantidad": 10 }, {"ID": 4567, "Cantidad": 5}]',
		description: 'Codigo del articulo a buscar. (Separa con "," si necesitas mas de uno.',
		displayOptions: {
			show: {
				resource: [
					'buscarProductoPorCodigo',
					'buscarProductos'
				],
			},
		},
	},
		{
		displayName: 'Codigo Cliente',
		name: 'codigoCliente',
		type: 'string',
		default: '',
		typeOptions: { minValue: 1 },
		placeholder: 'Ej. 1507',
		description: 'Codigo del cliente a buscar',
		displayOptions: {
			show: {
				resource: [
					'buscarClientes', 'crearPedidoVenta'
				],
			},
		},
	},
	{
		displayName: 'Código Del Comprobante',
		name: 'codigoComprobante',
		type: 'string',
		default: '',
		placeholder: 'Codigo de la compra (FCC)',
		description: 'Codigo del comprobante de la compra',
		displayOptions: { show: { resource: ['crearCompra'] } },
	},
		{
		displayName: 'Condicion De Venta',
		name: 'idCondicionVenta',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearVenta', 'crearCliente'] } },
	},
	{
		displayName: 'Condición De Pago',
		name: 'condicionDePago',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
  {
		displayName: 'ID Condición IVA',
		name: 'condicionIVA',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor', 'crearCliente'] } },
	},
	{
		displayName: 'Cotizacion',
		name: 'cotizacionValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: { show: { esContado: [true] } },
	},
	// {
	// 	displayName: 'Cuerpo Del Pedido',
	// 	name: 'cuerpoHTTP',
	// 	type: 'json',
	// 	required: true,
	// 	default: "",
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['crearCliente', 'actualizarCliente', 'crearContribuyente'],
	// 		},
	// 	},
	// 	description: 'Información en formato JSON para crear o actualizar un cliente',
	// },
	{
		displayName: 'CUIT',
		name: 'cuit',
		type: 'string',
		default: '',
		placeholder: 'Ingresá el CUIT...',
		displayOptions: {
			show: {
				resource: [
					'crearProveedor',
					'crearCliente',
					'buscarContribuyente',
					'crearContribuyente',
					'buscarClientePorCuit',
					'buscarClientes',,
					'listarProveedores'
				],
			},
		},
	},
	{
		displayName: 'Datos Imagen',
		name: 'dataImg',
		type: 'json',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['sincronizarImagenes'] } },
	},
	{
		displayName: 'Dia De La Semana',
		name: 'diaSemana',
		type: 'number',
		default: 0,
		description: 'Numero de la semana por el cual filtrar promociones aplicadas (0 es Lunes)',
		displayOptions: { show: { resource: ['listarPromocionesComercialesCliente'] } },
	},
	// {
	// 	displayName: 'DNI',
	// 	name: 'dni',
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: { show: { resource: ['crearCliente'] } },
	// },
	// {
	// 	displayName: 'Documento',
	// 	name: 'documentDate',
	// 	type: 'dateTime',
	// 	required: true,
	// 	default: undefined,
	// 	description: 'Parametro fecha del body para las solicitudes',
	// 	displayOptions: {
	// 		show: { resource: ['articulo', 'promocionesCliente', 'generarCompras'] },
	// 	},
	// },
	{
		displayName: 'Endpoint',
		name: 'endpoint',
		type: 'string',
		default: '/Clientes',
		required: true,
		placeholder: '/Clientes, /Articulos/Venta, etc.',
		description: 'Ruta del endpoint a utilizar',
		displayOptions: { show: { resource: [] } },
	},
	{
		displayName: 'Es Contado',
		name: 'esContado',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['crearVenta'] } },
	},
	{
		displayName: 'Fecha Desde',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'crearCompra',
					'listarFacturasVentasPorID',
					'listarFacturasVenta',
					'listarFacturasCobros',
					'listarPedidosVenta',
					'listarPedidosVentaFiltrados',
					'listarOrdenesCompra',
					'listarCobros',
					'listarCompras',
					'crearVenta',
					'listarOrdenesCompra',
					'estadisticaVentaRanking'
				],
			},
		},
	},
		{
		displayName: 'Fecha Hasta',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'listarFacturasVentasPorID',
					'listarFacturasVenta',
					'listarFacturasCobros',
					'listarPedidosVenta',
					'listarPedidosVentaFiltrados',
					'listarOrdenesCompra',
					'listarCobros',
					'listarCompras',
					'listarOrdenesCompra',
					'estadisticaVentaRanking'
				],
			},
		},
	},
	{
		displayName: 'Fecha Documento',
		name: 'documentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Parametro fecha del body para las solicitudes',
		displayOptions: {
			show: { resource: ['crearRemitoVenta', 'listarProductosDisponibles', 'crearRemitoCompra' , 'listarPromocionesComercialesCliente', 'crearCompra', 'crearPedidoVenta', 'crearOrdenCompra', 'listarPromociones', 'consultarPrecioProducto'] },
		},
	},
	{
		displayName: 'Fecha Entrega',
		name: 'deliveryDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Fecha de entrega',
		displayOptions: {
			show: { resource: ['crearOrdenCompra', 'crearRemitoCompra', 'crearRemitoVenta'] },
		},
	},
	{
		displayName: 'Fecha Embarque',
		name: 'shipmentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Fecha de embarque',
		displayOptions: {
			show: { resource: ['crearRemitoVenta'] },
		},
	},
	{
		displayName: 'Fecha De Imputacion',
		name: 'indictmentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Fecha de imputación',
		displayOptions: {
			show: { resource: ['crearRemitoVenta', 'crearMovimientoStock'] },
		},
	},
	{
		displayName: 'Fecha Vencimiento',
		name: 'dueDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Fecha de vencimiento',
		displayOptions: {
			show: { resource: ['crearOrdenCompra', 'crearRemitoCompra'] },
		},
	},
	{
		displayName: 'Tipo De Ranking',
		name: 'tipoDeRanking',
		type: 'options',
		default: 'none',
		description: 'Tipo de ranking a filtrar',
		options: [
			{
				name: 'Ninguno',
				value: 'none'
			},
			{
				name: 'Clientes',
				value: 'esRankingClientes'
			},
			{
				name: 'Artículos',
				value: 'esRankingArticulos'
			},
			{
				name: 'Vendedores',
				value: 'esRankingVendedores'
			}
		],
		displayOptions: {
			show: { resource: ['estadisticaVentaRanking']}
		}
	},
{
	displayName: 'Ordenar Ascendentemente',
	name: 'orderAsc',
	type: 'boolean',
	default: false,
	description: 'Whether to order the sales statistics in ascending mode',
	displayOptions: {
		show: { resource: ['estadisticaVentaRanking'] }
	}
},

	{
		displayName: 'Vendedor ID',
		name: 'vendedorID',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID del vendedor utilizado para generar ventas',
		displayOptions: {
			show: {
				resource: ['crearPedidoVenta']
			}
		}
	},
	{
		displayName: 'Tipo De Orden',
		name: 'ventaRankingOrderBy',
		type: 'options',
		default: 'CantidadUnidadNivel0',
		description: 'Tipo de orden para obtener el ranking',
		options: [
			{
				name: 'Cantidad Unidad Nivel 0',
				value: 'CantidadUnidadNivel0'
			},
			{
				name: 'Cantidad Unidad Nivel 1',
				value: 'CantidadUnidadNivel1'
			},
			{
				name: 'Cantidad Unidad Nivel 2',
				value: 'CantidadUnidadNivel2'
			},
			{
				name: 'Importe Total Final',
				value: 'ImporteTotalFinal'
			},
			{
				name: 'Importe Total Neto',
				value: 'ImporteTotalNeto'
			}
		],
		displayOptions: {
			show: { resource: ['estadisticaVentaRanking'] }
		}
	},
	{
		displayName: 'Fecha De Entrega',
		name: 'deliveryDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Parametro fecha del body para las solicitudes',
		displayOptions: {
			show: { resource: ['crearPedidoVenta'] },
		},
	},
		{
		displayName: 'Bonificación',
		name: 'idBonificacion',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID de la bonificación',
		displayOptions: {
			show: { resource: ['crearPedidoVenta', 'crearVenta', 'crearCliente'] },
		},
	},
	{
		displayName: 'Turno De Entrega',
		name: 'turnoEntrega',
		type: 'string',
		required: true,
		default: '',
		description: 'ID del turno de entrega',
		displayOptions: {
			show: { resource: ['crearPedidoVenta', 'crearOrdenCompra', 'crearRemitoCompra', 'crearRemitoVenta'] },
		},
	},
	{
		displayName: 'Fecha Modificación Desde',
		name: 'dateModified',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['listarProductosDisponibles'] } },
	},
	// {
	// 	displayName: 'Fecha Modificación Imagen Desde',
	// 	name: 'dateModifiedImage',
	// 	type: 'dateTime',
	// 	default: '',
	// 	displayOptions: { show: { resource: ['articulo'] } },
	// },
	{
		displayName: 'Fecha Precio Actualizado Hasta',
		name: 'priceDateModified',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['consultarSaldoCliente', 'verDetalleSaldoCliente'] },
		},
	},
	{
		displayName: 'Forma De Pago Proveedor',
		name: 'formaPagoProveedor',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
	{
		displayName: 'ID Del Chofer',
		name: 'choferId',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearRemitoVenta'] } },
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		type: 'string',
		default: '',
		placeholder: 'Ej. 27231',
		description: 'Identificador unico con el cual hacer solicitudes a la API',
		displayOptions: {
			show: { resource: ['verDetallePedidoVenta', 'verDetalleRegimenEspecial'] },
		},
	},
	{
		displayName: 'ID Articulos',
		name: 'articleId',
		type: 'string',
		default: '',
		placeholder: '1467',
		displayOptions: {
			show: { resource: ['descargarImagenesProductos', 'buscarProductoPorCodigo', 'buscarProductoEnSucursal', 'consultarPrecioProducto',  'listarProductosPorSucursal', 'crearMovimientoStock', ] },
		},
	},
	{
		displayName: 'ID Bonificacion',
		name: 'bonificacion',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['crearVenta'] } },
	},
	{
		displayName: 'Ubicacion Articulo',
		name: 'ubicacionArticulo',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['crearMovimientoStock'] } },
	},
	{
		displayName: 'ID De Cobro',
		name: 'idCobro',
		required: true,
		type: 'number',
		default: 0,
		description: 'ID del cobro',
		displayOptions: { show: { resource: ['listarCobros'] } },
	},
	{
		displayName: 'ID De La Compra',
		name: 'idCompra',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['listarCompras', 'verDetalleOrdenCompra'] } },
	},
	{
		displayName: 'ID Del Estado',
		name: 'statusId',
		type: 'number',
		default: false,
		description: 'Número del estado del pedido',
		displayOptions: { show: { resource: ['listarPedidosVenta', 'obtenerOrdenesCompra', 'listarPedidosVentaFiltrados', 'listarPedidosVenta'] } },
	},
	{
		displayName: 'ID Del Operador Compra',
		name: 'idOperadorCompra',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
	{
		displayName: 'ID Del Proveedor',
		name: 'idProveedor',
		type: 'number',
		default: '',
		placeholder: '2',
		description: 'ID Del proveedor de la compra',
		displayOptions: { show: { resource: ['crearCompra'] } },
	},
	{
		displayName: 'ID Del Tipo De Comprobante',
		name: 'idTipoComprobante',
		type: 'number',
		default: '',
		placeholder: '1',
		description: 'ID del tipo de comprobante de la factura',
		displayOptions: { show: { resource: ['crearCompra', 'listarFacturasVenta', 'crearVenta'] } },
	},
	{
		displayName: 'ID Del Tipo De Comprobante',
		name: 'idTipoComprobante',
		type: 'number',
		default: '',
		placeholder: '1',
		description: 'ID del tipo de comprobante de la venta',
		displayOptions: { show: { resource: ['listarFacturasVenta'] } }
	},
	{
		displayName: 'ID Cuenta Corriente',
		name: 'cuentaCorrienteId',
		type: 'number',
		default: '',
		placeholder: '1',
		description: 'ID del cliente cuenta corriente del comprobante de venta',
		displayOptions: { show: { resource: ['listarFacturasVenta'] } }
	},
	{
		displayName: 'ID Del Vendedor',
		name: 'idVendedor',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearVenta', 'listarFacturasVenta', 'crearRemitoVenta'] } },
	},
	{
		displayName: 'ID De La Venta',
		name: 'ventaId',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['listarFacturasVenta', 'listarPedidosVenta', 'listarFacturasVentasPorID'] } },
	},
	{
		displayName: 'ID De La Sucursal',
		name: 'sucursalId',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: [] } },
	},
	{
		displayName: 'Incluir Pedidos Anulados',
		name: 'incluirAnulados',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['listarFacturasVenta', 'listarPedidosVenta'] } },
	},
	{
		displayName: 'ID Del Canal De Venta',
		name: 'canalVentaId',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['listarFacturasVenta'] } },
	},
	{
		displayName: 'ID De La Division Empresa',
		name: 'divisionEmpresaId',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['listarFacturasVenta'] } },
	},
	{
		displayName: 'ID Usuario Creador',
		name: 'usuarioCreadorId',
		type: 'number',
		description: 'ID Del usuario que creo el comprobante de venta',
		default: '',
		displayOptions: { show: { resource: ['listarFacturasVenta', 'listarPedidosVenta'] } },
	},
	{	
		displayName: 'ID Del Transporte',
		name: 'transporteId',
		type: 'number',
		description: 'ID del transporte asociado al comprobante de venta',
		default: '',
		displayOptions: { show: { resource: ['listarFacturasVenta', 'listarPedidosVenta'] } },
	},
	{
		displayName: 'ID Pais',
		name: 'idPais',
		type: 'string',
		default: '',
		description: 'ID del país por la cual se buscarán las provincias',
		displayOptions: { show: { resource: ['listarProvincias', 'crearProveedor', 'crearCliente'] } },
	},
	{
		displayName: 'ID Provincia',
		name: 'idProvincia',
		type: 'string',
		default: '',
		description: 'ID de la provincia por la cual se buscarán la información',
		displayOptions: { show: { resource: ['listarMunicipios', 'crearProveedor', 'crearCliente'] } },
	},
	{
		displayName: 'ID Sucursal Física',
		name: 'idSucursalFisica',
		type: 'number',
		default: '',
		description: 'The ID of the physical branch to filter stock (optional)',
		displayOptions: {
			show: {
				resource: ['crearMovimientoStock', 'crearMovimientoStock','crearRemitoVenta','searchArticleBySKU', 'crearRemitoCompra' ,'buscarProductoEnSucursal', 'crearCompra', 'crearOrdenCompra', 'listarProductosPorSucursal', 'listarFacturasVenta', 'listarPedidosVenta'],
			},
		},
	},
	{
		displayName: 'ID Valor Efectivo',
		name: 'idValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: { show: { esContado: [true] } },
	},
	{
		displayName: 'ID De La Zona',
		name: 'idZona',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor', 'crearCliente'] } },
	},
		{
		displayName: 'ID del descuento del proveedor',
		name: 'idDescuentoProveedor',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['crearProveedor'] } },
	},
	{
		displayName: 'Importe',
		name: 'importeValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: { show: { esContado: [true] } },
	},
	{
		displayName: 'Información De Envío',
		name: 'envio',
		required: true,
		type: 'json',
		default: {},
		description: 'Shipping info from the order',
		displayOptions: { show: { resource: ['cobros'] } },
	},
	{
		displayName: 'Lista ID',
		name: 'idList',
		type: 'number',
		default: '',
		description: 'ID de la lista para buscar los precios de los articulos',
		displayOptions: { show: { resource: ['consultarPrecioProducto', 'crearVenta', 'estadisticaVentaRanking'] } },
	},
	{
		displayName: 'Letra Del Documento De La Compra',
		name: 'letraDocumento',
		type: 'string',
		default: '',
		placeholder: 'A',
		description: 'Letra del documento de la compra de la factura',
		displayOptions: { show: { resource: ['crearCompra', 'crearOrdenCompra', 'crearRemitoCompra', 'crearRemitoVenta'] } },
	},
	// {
	// 	displayName: 'Migración Completa',
	// 	name: 'migracionCompleta',
	// 	type: 'boolean',
	// 	default: false,
	// 	description: 'Whether complete articles migration or partial',
	// 	displayOptions: { show: { resource: ['articulo'] } },
	// },
	{
		displayName: 'Nombre Del Tipo De Comprobante',
		name: 'nombreTipoComprobante',
		type: 'string',
		default: '',
		placeholder: 'Factura de compras',
		description: 'Nombre del tipo de comprobante de la factura',
		displayOptions: { show: { resource: ['crearCompra'] } },
	},
	{
		displayName: 'Nombre Del Articulo',
		name: 'nombreArticulo',
		type: 'string',
		default: '',
		placeholder: 'Alfajores',
		displayOptions: { show: { resource: ['buscarProductos', 'listarProductosPorSucursal'] } },
		description: 'El nombre del producto a buscar',
	},
	{
		displayName: 'Numero Del Documento De La Compra',
		name: 'numeroFactura',
		type: 'number',
		default: '',
		placeholder: '1',
		description: 'Numero del documento de la compra de la factura',
		displayOptions: { show: { resource: ['crearCompra', 'crearOrdenCompra', 'crearRemitoCompra', 'crearRemitoVenta'] } },
	},
	{
		displayName: 'Observaciones',
		name: 'observacionesValorEfectivo',
		type: 'string',
		default: '',
		displayOptions: { show: { esContado: [true] } },
	},
	{
		displayName: 'Proveedor ID',
		name: 'proveedorId',
		type: 'number',
		required: true,
		default: '',
		description: 'ID del proveedor usado para buscar dentro del sistema',
		displayOptions: { show: { resource: ['crearOrdenCompra','buscarProveedor', 'listarOrdenesCompra', 'crearRemitoCompra'] } },
	},
	{
		displayName: 'Punto De Venta',
		name: 'puntoDeVenta',
		type: 'number',
		default: '',
		placeholder: '1',
		description: 'Numero del punto de venta del documento',
		displayOptions: { show: { resource: ['generarCompras', 'generarVentas', 'crearOrdenCompra', 'crearVenta', 'crearCompra', 'crearRemitoCompra', 'crearRemitoVenta'] } },
	},
	{
		displayName: 'Razón Social',
		name: 'razonSocial',
		type: 'string',
		default: '',
		description: 'Razón social del cliente para buscar',
		displayOptions: {
			show: { resource: ['buscarContribuyente', 'buscarClientes', 'crearProveedor', 'crearPedidoVenta', 'listarProveedores', 'crearOrdenCompra', 'crearCliente'] },
		},
	},
		{
		displayName: 'Cantidad De Items',
		name: 'cantidadDeItems',
		type: 'number',
		default: 1,
		displayOptions:{
			show: { resource: ['estadisticaVentaRanking'] }
		}
	},
	{
		displayName: 'Rubro ID',
		name: 'rubroId',
		type: 'string',
		default: '',
		description: 'ID Rubros used to search the articles',
		displayOptions: { show: { resource: ['estadisticaVentaRanking', 'listarProductosPorSucursal', 'listarSubRubros'] } },
	},
	{
		displayName: 'SKU',
		name: 'sku',
		type: 'string',
		default: '',
		required: true,
		description: 'The SKU (product code) to search for',
		displayOptions: { show: { resource: ['searchArticleBySKU'] } },
	},
	{
		displayName: 'Sub-Rubros IDs',
		name: 'idsSubRubros',
		type: 'string',
		default: '',
		description: 'Client ID used to search the articles',
		displayOptions: { show: { resource: ['listarCategorias', 'listarProductosPorSucursal'] } },
	},
	{
		displayName: 'Sucursales Físicas - IDs Lista',
		name: 'branchOfficeIds',
		type: 'string',
		required: true,
		default: '7345',
		description: 'Physical branch ID separated by comma',
		displayOptions: { show: { resource: ['consultarStock'] } },
	},
	{
		displayName: 'Ultima Modificacion Imagenes',
		name: 'lastModifiedImg',
		type: 'json',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['sincronizarImagenes'] } },
	},
	{
		displayName: 'Usuario',
		name: 'username',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['verificarCredencialesOperador', 'listarOperadoresMoviles'] } },
	},
	{
		displayName: 'Código',
		name: 'codigo',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['listarProveedores']
			}
		}
	},
	{
	 	displayName: 'Correo',
	 	name: 'email',
	 	type: 'string',
	 	placeholder: 'name@email.com',
	 	default: '',
	 	displayOptions: {
	 		show: {
	 			resource: ['listarOperadoresMoviles']
	 		}
	 	}
	},
  {
    displayName: 'ID Marca Articulo',
    name: 'IdMarcaArticulo',
    type: 'string',
    placeholder: '3',
    default: '',
    displayOptions: {
      show: {
        resource: ['listarProductosPorSucursal']
      }
    }
  },
    {
    displayName: 'ID Categoria Articulo',
    name: 'IdCategoriaArticulo',
    type: 'string',
    placeholder: '3',
    default: '',
    displayOptions: {
      show: {
        resource: ['listarProductosPorSucursal']
      }
    }
  }
];



export const CentumFields: INodeProperties[] = [...getArticulo];

export const HttpOptions: INodeProperties[] = [
	{
		displayName: 'Ajustes HTTP',
		name: 'httpSettings',
		type: 'collection',
		placeholder: 'Configuración avanzada',
		default: {},
		options: [
			{
				displayName: 'Paginación',
				name: 'pagination',
				type: 'options',
				options: [
					{
						name: 'Paginación Personalizada',
						value: 'custom',
						description: 'Permite definir la cantidad de ítems por página',
					},
					{
						name: 'All',
						value: 'all',
						description: 'Trae todos los ítems paginando internamente sin opción de modificar cantidad por página ni intervalo',
					},
				],
				default: 'custom',
				description: 'Controla cómo se solicita la información paginada',
			},
			{
				displayName: 'Ítems Por Página',
				name: 'cantidadItemsPorPagina',
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
				description: 'Cantidad de ítems a solicitar por página (solo para modo personalizado)',
			},
			{
				displayName: 'Intervalo Por Pagina(ms)',
				name: 'intervaloPagina',
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
				description: 'Intervalo de tiempo entre cada solicitud (En milisegundos)',
			},
			{
				displayName: 'Número De Página Inicial',
				name: 'numeroPagina',
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
				description: 'Número de página desde donde comenzar la paginación (por defecto comienza desde la página 1)',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'listarClientes',
					'listarTodosLosProductos'
				],
			},
		},
	},
];
