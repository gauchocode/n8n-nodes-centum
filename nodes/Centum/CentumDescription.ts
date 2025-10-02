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
				value: 'generarToken',
				action: 'Genera un nuevo token',
				description: 'Genera un nuevo token para utilizarlo con una herramienta externa como postman'
			},
			{
				name: 'Articulo - Buscar',
				value: 'buscarArticulo',
				action: 'Busca un articulo por nombre',
				description: 'Busca un articulo por nombre y retorna todas las ocurrencias'
			},
			{
				name: 'Articulo - Por ID',
				value: 'articuloPorId',
				action: 'Buscar artículo por ID',
				description: 'Retorna un artículo específico basado en su ID único'
			},
			{
				name: 'Artículos - Existencia',
				value: 'articulosExistencia',
				action: 'Obtener existencias de artículos',
				description: 'Retorna un listado de las existencias de los artículos en base a ciertos filtros'
			},
			{
				name: 'Artículos - Filtrado',
				value: 'articulo',
				action: 'Buscar artículos con filtros',
				description: 'Retorna un listado de artículos para vender en base a ciertos filtros'
			},
			{
				name: 'Artículos - Imagen',
				value: 'articulosImagenes',
				action: 'Obtener imagen de artículo',
				description: 'Retorna la imagen (binario) de un artículo'
			},
			{
				name: 'Artículos - Listado',
				value: 'articulosDatosGenerales',
				action: 'Obtener datos generales de artículos',
				description: 'Retorna un listado de los artículos y sus datos generales'
			},
			{
				name: 'Artículos - Precio Por Lista',
				value: 'articulosPrecioPorLista',
				action: 'Obtén el precio de un artículo según la lista',
				description: 'Devuelve el valor de un artículo, según la lista indicada'
			},
			{
				name: 'Artículos - Stock Sucursal Física',
				value: 'articulosSucursalesFisicas',
				action: 'Obtener stock por sucursal física',
				description: 'Retorna el stock de artículos en una sucursal física específica'
			},
			{
				name: 'Artículos - Stock Sucursal Física Por ID Artículo',
				value: 'articuloSucursalFisica',
				action: 'Obtener el stock por artículo individual por sucursal física',
				description: 'Retorna el stock de un artículo en específico de una sucursal física'
			},
			{
				name: 'Categorías - Obtener',
				value: 'categoriasObtener',
				action: 'Obten el listado de las categorías',
				description: 'Obten el listado completo de todas las categorías de los articulos'
			},
			{
				name: 'Cliente - Actualizar',
				value: 'clientesActualizar',
				action: 'Actualizar cliente',
				description: 'Actualiza un cliente y retorna su información con la URL para acceder al recurso'
			},
			{
				name: 'Cliente - Búsqueda',
				value: 'clientesBusqueda',
				action: 'Buscar cliente',
				description: 'Retorna un listado de clientes en base a ciertos filtros'
			},
			{
				name: 'Cliente - Búsqueda Por CUIT',
				value: 'clientesBusquedaPorCuit',
				action: 'Buscar clientes por CUIT',
				description: 'Retorna un listado de clientes basado en el CUIT proporcionado'
			},
			{
				name: 'Cliente - Lista',
				value: 'clientes',
				action: 'Obtener lista de clientes',
				description: 'Retorna una lista con todos los clientes registrados'
			},
			{
				name: 'Cliente - Nuevo',
				value: 'clienteNuevo',
				action: 'Crear nuevo cliente',
				description: 'Da de alta un cliente. Retornará el cliente creado (con su ID cargado) y la URL para acceder al nuevo recurso.'
			},
			{
				name: 'Cliente - Obtener Composición Del Saldo',
				value: 'composicionSaldoCliente',
				description: 'Obtiene la composición del saldo de la cuenta corriente del cliente especificado',
				action: 'Obtener composición del saldo del cliente'
			},
			{
				name: 'Cliente - Obtener Facturas De Cobro',
				value: 'obtenerFacturasCobros',
				description: 'Obtiene la totalidad de las facturas de los cobros del cliente especificado',
				action: 'Obtener facturas de cobros del cliente'
			},
			{
				name: 'Cliente - Obtener Facturas De Venta',
				value: 'obtenerFacturasPedidosVentas',
				description: 'Obtiene la totalidad de las facturas de los pedido de ventas del cliente especificado',
				action: 'Obtener facturas de pedidos de ventas del cliente'
			},
			{
				name: 'Cliente - Obtener Promoción',
				value: 'promocionesCliente',
				description: 'Obtiene las promociones aplicadas a un cliente desde una fecha seleccionada',
				action: 'Obtener promociones aplicadas a un cliente'
			},
			{
				name: 'Cliente - Obtener Saldo',
				value: 'obtenerSaldoCliente',
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
				value: 'nuevoContribuyente',
				description: 'Da de alta un cliente contribuyente nuevo. Retornará al cliente creado (con su ID cargado) y la URL para acceder al nuevo recurso.',
				action: 'Crear nuevo cliente contribuyente'
			},
			{
				name: 'Cobro - Nuevo',
				value: 'cobros',
				action: 'Registrar nuevo cobro',
				description: 'Da de alta el comprobante. Retornará el comprobante creado con su información y una URL.'
			},
			{
				name: 'Cobro - Obtener Listado',
				value: 'obtenerCobros',
				action: 'Obtener un listado de cobro',
				description: 'Obtener un listado de cobros en base a ciertos parametros'
			},
			{
				name: 'Compras - Generar Compra',
				value: 'generarCompras',
				action: 'Genera una compra',
				description: 'Genera una compra desde los parametros especificados'
			},
			{
				name: 'Compras - Obtener Listado',
				value: 'obtenerCompras',
				action: 'Obtener un listado de las compras',
				description: 'Obtener un listado de las compras en base a ciertos parametros'
			},
			{
				name: 'Departamentos - Lista',
				value: 'departamentosLista',
				description: 'Obtiene un listado de departamentos, normalmente filtrado por provincia'
			},
			{
				name: 'Marcas - Obtener',
				value: 'marcasObtener',
				action: 'Obten el listado de las marcas',
				description: 'Obten el listado completo de todas las marcas de los articulos'
			},
			{
				name: 'Obtener Operador Móvil',
				value: 'operadoresMoviles',
				description: 'Obtiene todos los datos de un operador móvil en base a las credenciales'
			},
			{
				name: 'Pedido De Venta - Actividad',
				value: 'pedidoVentaActividad',
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
				value: 'obtenerEstadosPedidosDeVenta',
				description: 'Obtiene todos los estados disponibles de los pedidos de ventas'
			},
			{
				name: 'Pedidos De Venta - Listar',
				value: 'obtenerPedidosDeVenta',
				description: 'Obtiene todos los pedidos de ventas en base a ciertos parámetros'
			},
			{
				name: 'Precios De Productos - Lista',
				value: 'listaPrecios',
				action: 'Obtener lista de precios de productos',
				description: 'Obtiene una lista con el listado de los precios sugeridos'
			},
			{
				name: 'Proceso Binario a Imagen',
				value: 'procesarImagenes',
				action: 'Procesar imágenes binarias',
				description: 'Procesa datos binarios de imágenes para su uso en WooCommerce'
			},
			{
				name: 'Productos WooCommerce - Generar (JSON Producto)',
				value: 'generarProductosWoo',
				description: 'Genera un JSON estructurado para productos WooCommerce a partir de artículos Centum',
			},
			{
				name: 'Proveedor - Buscar',
				value: 'proveedorBuscar',
				action: 'Obtén el proveedor segun el ID',
				description: 'Retorna la información del proveedor en base al ID'
			},
			{
				name: 'Proveedor - Crear',
				value: 'proveedorCrear',
				action: 'Obtén el proveedor segun el ID',
				description: 'Retorna la información del proveedor en base al ID'
			},
			{
				name: 'Provincias - Lista',
				value: 'provinciasLista',
				description: 'Obtiene un listado de provincias, normalmente filtrado por país'
			},
			{
				name: 'Regímenes Especiales - ID',
				value: 'regimenesEspecialesPorId',
				description: 'Trae un listado entero de los regímenes especiales'
			},
			{
				name: 'Regímenes Especiales - Lista',
				value: 'regimenesEspecialesLista',
				description: 'Trae un listado entero de los regímenes especiales'
			},
			{
				name: 'Rubros - Obtener',
				value: 'rubrosObtener',
				action: 'Obten el listado de los rubros',
				description: 'Obten el listado completo de todos los rubros de los articulos'
			},
			{
				name: 'Sucursales Físicas - Lista',
				value: 'sucursalesFisicas',
				description: 'Obtiene un listado de las sucursales físicas disponibles',
			},
			{
				name: 'Tipo De Comprobante - Lista',
				value: 'tipoComprobante',
				description: 'Obtiene un listado de todos los tipos de comprobantes'
			},
			{
				name: 'Ventas - Generar',
				value: 'generarVentas',
				description: 'Genera una venta en base a unos parametros completados'
			}

		],
		default: 'pedidoVentaActividad',
	},
];

const getArticulo: INodeProperties[] = [
	{
		displayName: 'Endpoint',
		name: 'endpoint',
		type: 'string',
		default: '/Clientes',
		required: true,
		displayOptions: {
			show: {
				resource: [
					// 'activity',
					// 'clientesBusqueda',
					// 'searchArticleBySKU',
					// 'productPriceList'
				],
			},
		},
		placeholder: '/Clientes, /Articulos/Venta, etc.',
		description: 'Ruta del endpoint a utilizar',
	},
	{
		displayName: 'Nombre del articulo',
		name: 'nombreArticulo',
		type: 'string',
		default: '',
		placeholder: 'Alfajores',
		displayOptions:{
			show: {
				resource: ['buscarArticulo']
			}
		},
		description: 'El nombre del producto a buscar'
	},
	{
		displayName: 'SKU',
		name: 'sku',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['searchArticleBySKU'],
			},
		},
		description: 'The SKU (product code) to search for',
	},
	{
		displayName: 'ID Sucursal Física',
		name: 'idSucursalFisica',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['searchArticleBySKU', 'articuloSucursalFisica', 'generarCompras'],
			},
		},
		description: 'The ID of the physical branch to filter stock (optional)',
	},
	{
		displayName: 'Datos Imagen',
		type: 'json',
		required: true,
		name: 'dataImg',
		default: '',
		displayOptions: {
			show: {
				resource: ['procesarImagenes'],
			},
		},
	},
	{
		displayName: 'Ultima Modificacion Imagenes',
		type: 'json',
		required: true,
		name: 'lastModifiedImg',
		default: '',
		displayOptions: {
			show: {
				resource: ['procesarImagenes'],
			},
		},
	},
	{
		displayName: 'Cliente ID',
		name: 'clienteId',
		type: 'number',
		required: true,
		typeOptions: {
			maxValue: 9999999,
			minValue: 0,
			numberStepSize: 1,
		},
		default: 0,
		description: 'Client ID used to search the articles',
		displayOptions: {
			show: {
				resource: ['generarCompras', 'articulo', 'obtenerSaldoCliente', 'composicionSaldoCliente', 'obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'promocionesCliente', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra', 'obtenerCobros', 'obtenerCompras', 'generarVentas'],
			},
		},
	},
	{
		displayName: 'Proveedor ID',
		name: 'proveedorId',
		type: 'number',
		required: true,
		default: '',
		description: 'ID del proveedor usado para buscar dentro del sistema',
		displayOptions: {
			show: {
				resource: ['proveedorBuscar']
			}
		}
	},
	{
		displayName: 'Rubros IDs',
		name: 'idsRubros',
		type: 'string',
		default: '',
		description: 'ID Rubros used to search the articles',
		displayOptions: {
			show: {
				resource: ['articulo'],
			},
		},
	},
	{
		displayName: 'Sub-Rubros IDs',
		name: 'idsSubRubros',
		type: 'string',
		default: '',
		description: 'Client ID used to search the articles',
		displayOptions: {
			show: {
				resource: ['articulo', 'categoriasObtener'],
			},
		},
	},
	{
		displayName: 'Fecha Modificación Desde',
		name: 'dateModified',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulo'],
			},
		},
	},
	{
		displayName: 'Fecha Precio Actualizado Desde',
		name: 'priceDateModified',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulo', 'obtenerSaldoCliente', 'composicionSaldoCliente'],
			},
		},
	},
	{
		displayName: 'Fecha Desde',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['generarCompras', 'obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra', 'obtenerCobros', 'obtenerCompras', 'generarVentas'],
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
				resource: ['obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra', 'obtenerCobros', 'obtenerCompras'],
			},
		},
	},
	{
		displayName: 'Fecha Modificación Imagen Desde',
		name: 'dateModifiedImage',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulo'],
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
			show: {
				resource: ['articulo', 'promocionesCliente', 'generarCompras'],
			},
		},
	},
	{
		displayName: 'Dia De La Semana',
		name: 'diaSemana',
		type: 'number',
		default: 0,
		description: 'Numero de la semana por el cual filtrar promociones aplicadas (0 es Lunes)',
		displayOptions: {
			show: {
				resource: ['promocionesCliente'],
			},
		},
	},
	{
		displayName: 'Migración Completa',
		name: 'migracionCompleta',
		type: 'boolean',
		default: false,
		description: 'Whether complete articles migration or partial',
		displayOptions: {
			show: {
				resource: ['articulo'],
			},
		},
	},
		{
		displayName: 'ID Del Estado',
		name: 'statusId',
		type: 'number',
		default: false,
		description: 'Número del estado del pedido',
		displayOptions: {
			show: {
				resource: ['obtenerPedidosDeVenta', 'obtenerOrdenesCompra'],
			},
		},
	},
	// {
	// 	displayName: 'Habilitado',
	// 	name: 'enabled',
	// 	type: 'boolean',
	// 	required: true,
	// 	default: true,
	// 	// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
	// 	description: 'Select the items that are enabled',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['articulo', 'articulosExistencia'],
	// 		},
	// 	},
	// },
	// {
	// 	displayName: 'ActivoWeb',
	// 	name: 'activeWeb',
	// 	type: 'boolean',
	// 	required: true,
	// 	default: true,
	// 	// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
	// 	description: 'Select the items that are active on the web',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['articulo', 'articulosExistencia'],
	// 		},
	// 	},
	// },
		{
		displayName: 'Sucursales Físicas - IDs Lista',
		name: 'branchOfficeIds',
		type: 'string',
		required: true,
		default: '7345',
		description:
			'Physical branch ID separated by comma to be able to fetch only the specified branch',
		displayOptions: {
			show: {
				resource: ['articulosExistencia'],
			},
		},
	},
	{
		displayName: 'Información De Envío',
		name: 'envio',
		required: true,
		type: 'json',
		default: {},
		description: 'Shipping info from the order',
		displayOptions: {
			show: {
				resource: ['cobros', 'crearPedidoVenta'],
			},
		},
	},
	{
		displayName: 'Lista ID',
		name: 'idList',
		type: 'number',
		default: '',
		description: 'ID de la lista para buscar los precios de los articulos',
		displayOptions: {
			show: {
				resource: ['articulosPrecioPorLista', 'generarVentas'],
			},
		},
	},
	{
		displayName: 'ID De Cobro',
		name: 'idCobro',
		required: true,
		type: 'number',
		default: 0,
		description: 'ID del cobro',
		displayOptions: {
			show: {
				resource: ['crearPedidoVenta', 'obtenerCobros'],
			},
		},
	},
	{
		displayName: 'ID De La Compra',
		name: 'idCompra',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['obtenerCompras'],
			},
		},
	},
	{
		displayName: 'ID Del Vendedor',
		name: 'idVendedor',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['generarVentas'],
			},
		},
	},
	{
		displayName: 'Condicion De Venta',
		name: 'idCondicionVenta',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['generarVentas'],
			},
		},
	},
	{
		displayName: 'Es Contado',
		name: 'esContado',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['generarVentas'],
			},
		},
	},
	{
		displayName: 'ID Valor Efectivo',
		name: 'idValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				esContado: [true]
			},
		},
	},
	{
		displayName: 'ID Bonificacion',
		name: 'bonificacion',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['generarVentas'],
			},
		},
	},
	{
		displayName: 'Cotizacion',
		name: 'cotizacionValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				esContado: [true]
			},
		},
	},
	{
		displayName: 'Importe',
		name: 'importeValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				esContado: [true]
			},
		},
	},
	{
		displayName: 'Observaciones',
		name: 'observacionesValorEfectivo',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				esContado: [true]
			},
		},
	},
	{
		displayName: 'Cantidad De Cuotas Efectivo',
		name: 'cantidadCuotasValorEfectivo',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				esContado: [true]
			},
		},
	},
	{
		displayName: 'Cuerpo Del Pedido',
		name: 'cuerpoHTTP',
		type: 'json',
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ['clienteNuevo', 'clientesActualizar', 'nuevoContribuyente'],
			},
		},
		description: 'Información en formato JSON para crear o actualizar un cliente',
	},
	{
		displayName: 'DNI',
		name: 'dni',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['clienteNuevo'],
			},
		},
	},
	{
		displayName: 'CUIT',
		name: 'cuit',
		type: 'string',
		default: '',
		placeholder: 'Ingresá el CUIT...',
		displayOptions: {
			show: {
				resource: ['proveedorCrear','clienteNuevo', 'buscarContribuyente', 'nuevoContribuyente', 'clientesBusquedaPorCuit', 'clientesBusqueda'],
			},
		},
	},
	{
		displayName: 'Condición IVA',
		name: 'condicionIVA',
		type: 'string',
		default: '',
		placeholder: 'Consumidor Final, Exento, Monotributo...',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Forma De Pago Proveedor',
		name: 'formaPagoProveedor',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Condición De Pago',
		name: 'condicionDePago',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Categoría De Impuestos A Las Ganancias',
		name: 'categoriaImpuestosGanancias',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Clase De Proveedor',
		name: 'claseProveedor',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Activo',
		name: 'active',
		type: 'boolean',
		default: '',
		displayOptions: {
			show: {
				resource: ['proveedorCrear'],
			},
		},
	},
		{
		displayName: 'Usuario',
		name: 'username',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['operadoresMoviles'],
			},
		},
	},
		{
		displayName: 'Contraseña',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['operadoresMoviles'],
			},
		},
	},
	{
		displayName: 'Razón Social',
		name: 'razonSocial',
		type: 'string',
		default: '',
		description: 'Razón social del cliente para buscar',
		displayOptions: {
			show: {
				resource: ['buscarContribuyente', 'clientesBusqueda', 'proveedorCrear'],
			},
		},
	},
	{
		displayName: 'Cliente',
		name: 'cliente',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['crearPedidoVenta', 'cobros'],
			},
		},
	},
	{
		displayName: 'Articulos',
		name: 'articulo',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['crearPedidoVenta', 'cobros'],
			},
		},
	},
		{
			displayName: 'ID Articulo',
			name: 'articleId',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['articulosImagenes', 'articuloPorId', 'articuloSucursalFisica'],
				},
			},
		},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		type: 'string',
		default: '',
		placeholder:'Ej. 27231',
		description: 'Identificador unico con el cual hacer solicitudes a la API',
		displayOptions: {
			show: {
				resource: ['pedidoVentaActividad', 'regimenesEspecialesPorId'],
			},
		},
	},
	{
		displayName: 'ID País',
		name: 'idPais',
		type: 'string',
		default: '',
		description: "ID del país por la cual se buscarán las provincias",
		displayOptions: {
			show: {
				resource: ['provinciasLista', 'proveedorCrear'],
			},
		},
	},
	{
		displayName: 'ID Provincia',
		name: 'idProvincia',
		type: 'string',
		default: '',
		description: "ID de la provincia por la cual se buscarán los departamentos",
		displayOptions: {
			show: {
				resource: ['departamentosLista', 'proveedorCrear'],
			},
		},
	},
	{
		displayName: 'ID Sucursal Física',
		name: 'IdSucursalFisica',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulosSucursalesFisicas'],
			},
		},
	},
	{
		displayName: 'Número De Página',
		name: 'numeroPagina',
		type: 'number',
		default: 1,
		description: 'Número de página para la paginación de artículos',
		displayOptions: {
			show: {
				resource: ['articulo'],
			},
		},
	},
	{
		displayName: 'Cantidad Por Página',
		name: 'cantidadPorPagina',
		type: 'number',
		default: 50,
		description: 'Cantidad de artículos por página',
		displayOptions: {
			show: {
				resource: ['articulo'],
			},
		},
	},
		{
			displayName: 'Codigo',
			name: 'codigo',
			type: 'string',
			default: '',
			typeOptions: {
				minValue: 1,
			},
			placeholder: 'Ej. 1507',
			description: 'Codigo del articulo a buscar',
			displayOptions: {
				show: {
					resource: ['proveedorCrear','articuloPorId', 'articulosPrecioPorLista', 'articuloSucursalFisica', 'clientesBusqueda'],
				},
			},
		},
		{
			displayName: 'Nombre Del Tipo De Comprobante',
			name: 'nombreTipoComprobante',
			type: 'string',
			default: '',
			placeholder: 'Factura de compras',
			description: 'Nombre del tipo de comprobante de la factura',
			displayOptions:{
				show:{
					resource: ['generarCompras']
				}
			}
		},
		{
			displayName: 'Código Del Comprobante',
			name: 'codigoComprobante',
			type: 'string',
			default: '',
			placeholder: 'Codigo de la compra (FCC)',
			description: 'Codigo del comprobante de la compra',
			displayOptions:{
				show:{
					resource: ['generarCompras']
				}
			}
		},
		{
			displayName: 'ID Del Tipo De Comprobante',
			name: 'idTipoComprobante',
			type: 'number',
			default: '',
			placeholder: '1',
			description: 'ID del tipo de comprobante de la factura',
			displayOptions:{
				show:{
					resource: ['generarCompras']
				}
			}
		},
				{
			displayName: 'ID Del Tipo De Comprobante',
			name: 'idTipoComprobanteVenta',
			type: 'number',
			default: '',
			placeholder: '1',
			description: 'ID del tipo de comprobante de la venta',
			displayOptions:{
				show:{
					resource: ['generarVentas']
				}
			}
		},
		{
			displayName: 'Numero Del Documento De La Compra',
			name: 'numeroFactura',
			type: 'number',
			default: '',
			placeholder: '1',
			description: 'Numero del documento de la compra de la factura',
			displayOptions:{
				show:{
					resource: ['generarCompras']
				}
			}
		},
		{
			displayName: 'Punto De Venta',
			name: 'puntoDeVenta',
			type: 'number',
			default: '',
			placeholder: '1',
			description: 'Numero del punto de venta del documento',
			displayOptions:{
				show:{
					resource: ['generarCompras', 'generarVentas']
				}
			}
		},
		{
			displayName: 'Letra Del Documento De La Compra',
			name: 'letraDocumento',
			type: 'string',
			default: '',
			placeholder: 'A',
			description: 'Letra del documento de la compra de la factura',
			displayOptions:{
				show:{
					resource: ['generarCompras']
				}
			}
		},
		{
			displayName: 'ID Del Proveedor',
			name: 'idProveedor',
			type: 'number',
			default: '',
			placeholder: '2',
			description: 'ID Del proveedor de la compra',
			displayOptions: {
				show:{
					resource: ['generarCompras']
				}
			}
		},
		{
			displayName: 'Artículos',
			name: 'articlesCollection',
			type: 'string',
			placeholder: '[{ "ID": 1234, "Cantidad": 10 }, {"ID": 4567, "Cantidad": 5}]',
			default: '',
			description: 'Lista de artículos en formato JSON',
			displayOptions: {
				show: {
					resource: ['generarCompras', 'generarVentas']
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
		],
		displayOptions: {
			show: {
				resource: [
					'clientes',
					'articulosDatosGenerales'
				],
			},
		},
	},
];
