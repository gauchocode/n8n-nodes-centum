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
				name: 'Articulo - Por ID',
				value: 'articuloPorId',
				action: 'Buscar artículo por ID',
				description: 'Retorna un artículo específico basado en su ID único'
			},
			{
				name: 'Articulos - Existencia',
				value: 'articulosExistencia',
				action: 'Obtener existencias de artículos',
				description: 'Retorna un listado de las existencias de los artículos en base a ciertos filtros'
			},
			{
				name: 'Articulos - Filtrado',
				value: 'articulo',
				action: 'Buscar artículos con filtros',
				description: 'Retorna un listado de artículos para vender en base a ciertos filtros'
			},
			{
				name: 'Articulos - Imagen',
				value: 'articulosImagenes',
				action: 'Obtener imagen de artículo',
				description: 'Retorna la imagen (binario) de un artículo'
			},
			{
				name: 'Articulos - Listado',
				value: 'articulosDatosGenerales',
				action: 'Obtener datos generales de artículos',
				description: 'Retorna un listado de los artículos y sus datos generales'
			},
			{
				name: 'Articulos - Precio Por Lista',
				value: 'articulosPrecioPorLista',
				action: 'Obten el precio de un articulo segun la lista',
				description: 'Devuelve el valor de un articulo, segun la lista indicada'
			},
			{
				name: 'Articulos - Stock Sucursal Física',
				value: 'articulosSucursalesFisicas',
				action: 'Obtener stock por sucursal física',
				description: 'Retorna el stock de artículos en una sucursal física específica'
			},
			{
				name: 'Articulos - Stock Sucursal Física Por ID Articulo',
				value: 'articuloSucursalFisica',
				action: 'Obtener el stock por articulo individiual por sucursal física',
				description: 'Retorn el stock de un articulo en especifico de una sucursal fisica'
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
				name: 'Cliente - Obtener Promocion',
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
				name: 'Cliente Contribuyente - Busqueda',
				value: 'buscarContribuyente',
				description: 'Retorna los datos del contribuyente por medio de una búsqueda por CUIT o Razon Social',
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
				name: 'Departamentos - Lista',
				value: 'departamentosLista',
				description: 'Obtiene un listado de departamentos, normalmente filtrado por provincia'
			},
			{
				name: 'Obtener Operador Movil',
				value: 'operadoresMoviles',
				description: 'Obtiene todos los datos de un operador movil en base a las credenciales'
			},
			{
				name: 'Pedido De Venta - Actividad',
				value: 'pedidoVentaActividad',
				action: 'Obtener actividad de pedido de venta',
				description: 'Trae un pedido de venta por un identificador único'
			},
			{
				name: 'Pedidos De Venta - Estados',
				value: 'obtenerEstadosPedidosDeVenta',
				description: 'Obtiene todos los estados disponibles de los pedidos de ventas'
			},
			{
				name: 'Pedidos De Venta - Listar',
				value: 'obtenerPedidosDeVenta',
				description: 'Obtiene todos los pedidos de ventas en base a ciertos parametros'
			},
			{
				name: 'Pedido De Venta - Nuevo',
				value: 'crearPedidoVenta',
				action: 'Crear nuevo pedido de venta',
				description: 'Realiza pedidos de venta de los artículos'
			},
			{
				name: 'Precios De Productos - Lista',
				value: 'listaPrecios',
				action: 'Obtener lista de precios de productos',
				description: 'Obtiene una lista con los listado de los precios sugeridos'
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
				name: 'Provincias - Lista',
				value: 'provinciasLista',
				description: 'Obtiene un listado de provincias, normalmente filtrado por país'
			},
			{
				name: 'Regimenes Especiales - ID',
				value: 'regimenesEspecialesPorId',
				description: 'Trae un listado entero de los regimenes especiales'
			},
			{
				name: 'Regimenes Especiales - Lista',
				value: 'regimenesEspecialesLista',
				description: 'Trae un listado entero de los regimenes especiales'
			},
			{
				name: 'Sucursales Físicas - Lista',
				value: 'sucursalesFisicas',
				description: 'Obtiene un listado de las sucursales físicas disponibles',
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
				resource: ['searchArticleBySKU', 'articuloSucursalFisica'],
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
				resource: ['articulo', 'obtenerSaldoCliente', 'composicionSaldoCliente', 'obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'promocionesCliente', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra'],
			},
		},
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
				resource: ['articulo'],
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
				resource: ['obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra'],
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
				resource: ['obtenerFacturasPedidosVentas', 'obtenerFacturasCobros', 'obtenerPedidosDeVenta', 'obtenerOrdenesCompra'],
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
				resource: ['articulo', 'promocionesCliente'],
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
		description: 'Numero del estado del pedido',
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
			'Physical branch IDs separated by comma to be able to fetch only the specified branches',
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
				resource: ['articulosPrecioPorLista'],
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
				resource: ['crearPedidoVenta'],
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
				resource: ['clienteNuevo', 'buscarContribuyente', 'nuevoContribuyente', 'clientesBusquedaPorCuit', 'clientesBusqueda'],
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
				resource: ['buscarContribuyente', 'clientesBusqueda'],
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
		displayName: 'ID País (Opcional)',
		name: 'idPais',
		type: 'string',
		default: '',
		description: "ID del país por la cual se buscarán las provincias",
		displayOptions: {
			show: {
				resource: ['provinciasLista'],
			},
		},
	},
	{
		displayName: 'ID Provincia (Opcional)',
		name: 'idProvincia',
		type: 'string',
		default: '',
		description: "ID de la provincia por la cual se buscarán los departamentos",
		displayOptions: {
			show: {
				resource: ['departamentosLista'],
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
					resource: ['articuloPorId', 'articulosPrecioPorLista', 'articuloSucursalFisica', 'clientesBusqueda'],
				},
			},
		},
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
