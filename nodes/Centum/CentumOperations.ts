import { INodeProperties } from "n8n-workflow";

export const CentumOperations: INodeProperties[] = [
	{
		displayName: "Resource",
		name: "resource",
		type: "options",
		noDataExpression: true,
		options: [
			{
				name: "Artículo",
				value: "articulos",
			},
			{
				name: "Cliente",
				value: "clientes",
			},
			{
				name: "Cobro",
				value: "cobros",
			},
			{
				name: "Compra",
				value: "compras",
			},
			{
				name: "Extra",
				value: "extras",
			},
			{
				name: "Geografía",
				value: "geografia",
			},
			{
				name: "Logística",
				value: "logistica",
			},
			{
				name: "Proveedor",
				value: "proveedores",
			},
			{
				name: "Stock",
				value: "stock",
			},
			{
				name: "Venta",
				value: "ventas",
			},
		],
		default: "ventas",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["articulos"],
			},
		},
		options: [
			{
				name: "Artículo - Buscar",
				value: "buscarProductos",
				action: "Busca articulos por nombre",
				description: "Busca un artículo por nombre y retorna todas las ocurrencias",
			},
			{
				name: "Artículo - Por ID",
				value: "buscarProductoPorCodigo",
				action: "Busca articulo por id",
				description: "Retorna un artículo específico basado en su ID único",
			},
			{
				name: "Artículos - Filtrado",
				value: "listarProductosDisponibles",
				action: "Lista articulos con filtros",
				description: "Retorna un listado de artículos para vender en base a ciertos filtros",
			},
			{
				name: "Artículos - Imagen",
				value: "descargarImagenesProductos",
				action: "Obtiene imagen de articulo",
				description: "Retorna la imagen binaria de un artículo",
			},
			{
				name: "Artículos - Listado",
				value: "listarTodosLosProductos",
				action: "Lista datos generales de articulos",
				description: "Retorna un listado de los artículos y sus datos generales",
			},
			{
				name: "Artículos - Precio Por Lista",
				value: "consultarPrecioProducto",
				action: "Obtiene precio por lista",
				description: "Devuelve el valor de un artículo según la lista indicada",
			},
			{
				name: "Artículos - Stock Sucursal Física",
				value: "listarProductosPorSucursal",
				action: "Lista stock por sucursal fisica",
				description: "Retorna el stock de artículos en una sucursal física específica",
			},
			{
				name: "Artículos - Stock Sucursal Física Por ID Artículo",
				value: "buscarProductoEnSucursal",
				action: "Obtiene stock por articulo en sucursal",
				description: "Retorna el stock de un artículo específico en una sucursal física",
			},
			{
				name: "Bonificaciones - Obtener",
				value: "listarBonificaciones",
				action: "Lista bonificaciones",
				description: "Obtiene el listado completo de bonificaciones disponibles",
			},
			{
				name: "Categorías - Obtener",
				value: "listarCategorias",
				action: "Lista categorias",
				description: "Obtiene el listado completo de todas las categorías de los artículos",
			},
			{
				name: "Marcas - Obtener",
				value: "listarMarcas",
				action: "Lista marcas",
				description: "Obtiene el listado completo de las marcas de los artículos",
			},
			{
				name: "Precios De Productos - Lista",
				value: "listarPrecios",
				action: "Lista precios de productos",
				description: "Obtiene una lista con los precios sugeridos",
			},
			{
				name: "Rubros - Obtener",
				value: "listarRubros",
				action: "Lista rubros",
				description: "Obtiene el listado completo de los rubros de los artículos",
			},
			{
				name: "Sub Rubros - Listar",
				value: "listarSubRubros",
				action: "Lista sub rubros",
				description: "Obtiene el listado completo de los sub rubros o los filtra por ID",
			},
		],
		default: "buscarProductos",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["clientes"],
			},
		},
		options: [
			{
				name: "Cliente - Actualizar",
				value: "actualizarCliente",
				action: "Actualiza cliente",
				description: "Actualiza un cliente y retorna su información con la URL para acceder al recurso",
			},
			{
				name: "Cliente - Búsqueda",
				value: "buscarClientes",
				action: "Busca clientes",
				description: "Retorna un listado de clientes en base a ciertos filtros",
			},
			{
				name: "Cliente - Búsqueda Por CUIT",
				value: "buscarClientePorCuit",
				action: "Busca clientes por CUIT",
				description: "Retorna un listado de clientes basado en el CUIT proporcionado",
			},
			{
				name: "Cliente - Lista",
				value: "listarClientes",
				action: "Lista clientes",
				description: "Retorna una lista con todos los clientes registrados",
			},
			{
				name: "Cliente - Nuevo",
				value: "crearCliente",
				action: "Crea cliente",
				description: "Da de alta un cliente nuevo",
			},
			{
				name: "Cliente - Obtener Composición Del Saldo",
				value: "verDetalleSaldoCliente",
				action: "Obtiene composicion del saldo",
				description: "Obtiene la composición del saldo de la cuenta corriente del cliente especificado",
			},
			{
				name: "Cliente - Obtener Facturas De Cobro",
				value: "listarFacturasCobros",
				action: "Obtiene facturas de cobro",
				description: "Obtiene la totalidad de las facturas de los cobros del cliente especificado",
			},
			{
				name: "Cliente - Obtener Facturas De Venta",
				value: "listarFacturasVenta",
				action: "Obtiene facturas de venta",
				description: "Obtiene la totalidad de las facturas de los pedidos de venta del cliente especificado",
			},
			{
				name: "Cliente - Obtener Facturas De Venta Por ID",
				value: "listarFacturasVentasPorID",
				action: "Obtiene facturas de venta por ID",
				description: "Obtiene la totalidad de las facturas de ventas del cliente especificado",
			},
			{
				name: "Cliente - Obtener Promoción Comercial",
				value: "listarPromocionesComercialesCliente",
				action: "Obtiene promociones comerciales del cliente",
				description: "Obtiene las promociones comerciales aplicadas a un cliente desde una fecha seleccionada",
			},
			{
				name: "Cliente - Obtener Saldo",
				value: "consultarSaldoCliente",
				action: "Obtiene saldo del cliente",
				description: "Obtiene el saldo del cliente especificado",
			},
			{
				name: "Cliente Contribuyente - Búsqueda",
				value: "buscarContribuyente",
				action: "Busca cliente contribuyente",
				description: "Retorna los datos del contribuyente por CUIT o razón social",
			},
			{
				name: "Cliente Contribuyente - Nuevo",
				value: "crearContribuyente",
				action: "Crea cliente contribuyente",
				description: "Da de alta un cliente contribuyente nuevo",
			},
			{
				name: "Frecuencias Clientes - Listar",
				value: "frecuenciasCliente",
				action: "Lista frecuencias de clientes",
				description: "Obtiene un listado con las frecuencias de los clientes",
			},
		],
		default: "actualizarCliente",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["ventas"],
			},
		},
		options: [
			{
				name: "Comprobante De Venta - Obtener Listado",
				value: "listarComprobantesVenta",
				action: "Lista comprobantes de venta",
				description: "Obtiene un listado de los comprobantes de venta en base a ciertos parámetros",
			},
			{
				name: "Estadística Ranking - Venta",
				value: "estadisticaVentaRanking",
				action: "Obtiene ranking de ventas",
				description: "Obtiene un listado de clientes, artículos, vendedores o sucursales según un ranking de venta",
			},
			{
				name: "Pedido De Venta - Actividad",
				value: "verDetallePedidoVenta",
				action: "Obtiene pedido de venta",
				description: "Trae un pedido de venta por un identificador único",
			},
			{
				name: "Pedido De Venta - Nuevo",
				value: "crearPedidoVenta",
				action: "Crea pedido de venta",
				description: "Realiza pedidos de venta de los artículos",
			},
			{
				name: "Pedidos De Venta - Estado",
				value: "listarEstadosPedidosVenta",
				action: "Lista estados de pedidos de venta",
				description: "Obtiene todos los estados disponibles de los pedidos de venta",
			},
			{
				name: "Pedidos De Venta - Listar",
				value: "listarPedidosVenta",
				action: "Lista pedidos de venta",
				description: "Obtiene todos los pedidos de venta en base a ciertos parámetros",
			},
			{
				name: "Pedidos De Venta - Resumido",
				value: "listarPedidosVentaFiltrados",
				action: "Lista pedidos de venta resumidos",
				description: "Obtiene todos los pedidos de venta con un cuerpo de respuesta más ligero",
			},
			{
				name: "Promociones Comerciales - Lista",
				value: "listarPromociones",
				action: "Lista promociones comerciales",
				description: "Obtiene las promociones comerciales disponibles",
			},
			{
				name: "Ventas - Generar",
				value: "crearVenta",
				action: "Genera venta",
				description: "Genera una venta en base a parámetros completados",
			},
		],
		default: "listarComprobantesVenta",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["cobros"],
			},
		},
		options: [
			{
				name: "Cobro - Nuevo",
				value: "registrarCobro",
				action: "Registra cobro",
				description: "Da de alta el comprobante de cobro",
			},
			{
				name: "Cobro - Obtener Listado",
				value: "listarCobros",
				action: "Lista cobros",
				description: "Obtiene un listado de cobros en base a ciertos parámetros",
			},
		],
		default: "registrarCobro",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["compras"],
			},
		},
		options: [
			{
				name: "Compras - Generar Compra",
				value: "crearCompra",
				action: "Genera compra",
				description: "Genera una compra desde los parámetros especificados",
			},
			{
				name: "Compras - Obtener Listado",
				value: "listarCompras",
				action: "Lista compras",
				description: "Obtiene un listado de las compras en base a ciertos parámetros",
			},
			{
				name: "Comprobante De Compra - Obtener Listado",
				value: "listarComprobantesCompra",
				action: "Lista comprobantes de compra",
				description: "Obtiene un listado de los comprobantes de compra en base a ciertos parámetros",
			},
			{
				name: "Orden De Compra - Generar",
				value: "crearOrdenCompra",
				action: "Genera orden de compra",
				description: "Genera una orden de compra en base a ciertos parámetros",
			},
			{
				name: "Orden De Compra - Obtener",
				value: "verDetalleOrdenCompra",
				action: "Obtiene orden de compra",
				description: "Obtiene una única orden de compra en base al ID",
			},
			{
				name: "Órdenes De Compra - Obtener",
				value: "listarOrdenesCompra",
				action: "Lista ordenes de compra",
				description: "Obtiene todas las órdenes de compra en base a ciertos filtros",
			},
			{
				name: "Remito De Compra - Crear",
				value: "crearRemitoCompra",
				action: "Crea remito de compra",
				description: "Crea un remito de compra en base a los parámetros enviados",
			},
		],
		default: "crearCompra",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["proveedores"],
			},
		},
		options: [
			{
				name: "Proveedor - Buscar",
				value: "buscarProveedor",
				action: "Busca proveedor",
				description: "Retorna la información del proveedor en base al ID",
			},
			{
				name: "Proveedor - Crear",
				value: "crearProveedor",
				action: "Crea proveedor",
				description: "Crea un proveedor en base a los datos enviados",
			},
			{
				name: "Proveedores - Listar",
				value: "listarProveedores",
				action: "Lista proveedores",
				description: "Obtiene una lista completa de los proveedores",
			},
		],
		default: "buscarProveedor",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["logistica"],
			},
		},
		options: [
			{
				name: "Choferes - Obtener Listado",
				value: "listarChoferes",
				action: "Lista choferes",
				description: "Obtiene un listado completo de los choferes disponibles",
			},
			{
				name: "Remito De Venta - Crear",
				value: "crearRemitoVenta",
				action: "Crea remito de venta",
				description: "Crea un remito de venta en base a los parámetros enviados",
			},
			{
				name: "Sucursales Físicas - Lista",
				value: "listarSucursales",
				action: "Lista sucursales fisicas",
				description: "Obtiene un listado de las sucursales físicas disponibles",
			},
			{
				name: "Turno De Entrega - Obtener",
				value: "listarTurnosEntrega",
				action: "Lista turnos de entrega",
				description: "Obtiene el listado total disponible de turnos de entrega",
			},
			{
				name: "Vendedores - Obtener",
				value: "listarVendedores",
				action: "Lista vendedores",
				description: "Obtiene una lista de todos los vendedores disponibles",
			},
		],
		default: "listarChoferes",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["stock"],
			},
		},
		options: [
			{
				name: "Artículos - Existencia",
				value: "consultarStock",
				action: "Consulta existencias de articulos",
				description: "Retorna un listado de las existencias de los artículos en base a ciertos filtros",
			},
			{
				name: "Orden De Traspaso - Generar",
				value: "crearMovimientoStock",
				action: "Genera movimiento de stock",
				description: "Crea un ajuste de movimiento de stock",
			},
			{
				name: "Ubicaciones De Artículos - Listar",
				value: "listarUbicacionArticulos",
				action: "Lista ubicaciones de articulos",
				description: "Obtiene un listado total de las ubicaciones de los artículos",
			},
		],
		default: "consultarStock",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["geografia"],
			},
		},
		options: [
			{
				name: "Municipios - Lista",
				value: "listarMunicipios",
				action: "Lista municipios",
				description: "Obtiene un listado de los municipios, normalmente filtrado por provincia",
			},
			{
				name: "País - Obtener Listado",
				value: "listarPaises",
				action: "Lista paises",
				description: "Obtiene el listado de países disponibles",
			},
			{
				name: "Provincias - Lista",
				value: "listarProvincias",
				action: "Lista provincias",
				description: "Obtiene un listado de provincias, normalmente filtrado por país",
			},
		],
		default: "listarMunicipios",
	},
	{
		displayName: "Operación",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["extras"],
			},
		},
		options: [
			{
				name: "_Token De Acceso - Generación",
				value: "generarTokenSeguridad",
				action: "Genera un nuevo token",
				description: "Genera un nuevo token para utilizarlo con una herramienta externa como Postman",
			},
			{
				name: "Conceptos - Obtener Listado",
				value: "listarConceptos",
				action: "Lista conceptos",
				description: "Obtiene un listado de conceptos",
			},
			{
				name: "Obtener Operador Móvil",
				value: "listarOperadoresMoviles",
				action: "Lista operadores moviles",
				description: "Obtiene el listado de todos los operadores móviles",
			},
			{
				name: "Proceso Binario a Imagen",
				value: "sincronizarImagenes",
				action: "Procesa imagenes binarias",
				description: "Procesa datos binarios de imágenes para su uso en WooCommerce",
			},
			{
				name: "Productos WooCommerce - Generar (JSON Producto)",
				value: "convertirProductosParaWooCommerce",
				action: "Convierte productos para woocommerce",
				description: "Genera un JSON estructurado para productos WooCommerce a partir de artículos Centum",
			},
			{
				name: "Regímenes Especiales - ID",
				value: "verDetalleRegimenEspecial",
				action: "Obtiene regimen especial por id",
				description: "Trae un régimen especial por ID",
			},
			{
				name: "Regímenes Especiales - Lista",
				value: "listarRegimenesEspeciales",
				action: "Lista regimenes especiales",
				description: "Trae un listado completo de los regímenes especiales",
			},
			{
				name: "Tipo De Comprobante - Lista",
				value: "listarTiposComprobante",
				action: "Lista tipos de comprobante",
				description: "Obtiene un listado de todos los tipos de comprobantes",
			},
			{
				name: "Verificar Operador Móvil",
				value: "verificarCredencialesOperador",
				action: "Verifica operador movil",
				description: "Obtiene todos los datos de un operador móvil en base a las credenciales",
			},
		],
		default: "generarTokenSeguridad",
	},
];
