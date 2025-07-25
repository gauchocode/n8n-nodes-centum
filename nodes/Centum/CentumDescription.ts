import { INodeProperties } from 'n8n-workflow';

export const CentumOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Articulos - Existencia',
				value: 'articulosExistencia',
				action: 'Perform an Artículo request',
				description: 'Retorna un listado de las existencias de los artículos en base a ciertos filtros'
			},
			{
				name: 'Articulos - Filtrado',
				value: 'articulo',
				action: 'Perform an Artículo request',
				description: 'Retorna un listado de artículos para vender en base a ciertos filtros'
			},
			{
				name: 'Articulos - Imagen',
				value: 'articulosImagenes',
				action: 'Solicitud de las imagenes de un articulo',
				description: 'Retorna la imagen (binario) de un artículo'
			},
			{
				name: 'Articulos - Precio',
				value: 'precioArticulo',
				action: 'Perform an Artículo request',
				description: 'Retorna el valor decimal que representa el precio del artículo pidiendo una cantidad determinada en una fecha específica'
			},
			{
				name: 'Articulos - Sucursal Física',
				value: 'articulosSucursalesFisicas',
				action: 'Perform an Artículo request',
				description: 'Stock de articulos en la sucursal física'
			},
			{
				name: 'Buscar Contribuyente',
				value: 'buscarContribuyente',
				description: 'Retorna los datos del contribuyente por medio de una búsqueda por CUIT o Razon Social',
				action: 'Buscar contribuyente',
			},
			{
				name: 'Cliente - Actualizar',
				value: 'clientesActualizar',
				action: 'Actualizar un cliente',
				description: 'Actualiza un cliente y retorna su información con la URL para acceder al recurso'
			},
			{
				displayName: 'Cliente - Búsqueda',
				name: 'Cliente - Búsqueda',
				value: 'clientesBusqueda',
				action: 'Buscar un cliente',
				description: 'Retorna un listado de clientes en base a ciertos filtros'
			},
			// DESHABILITADO TEMPORALMENTE - EN DESARROLLO
			{
				name: 'Cliente - Lista',
				value: 'clientes',
				action: 'Obtener lista de clientes',
				description: 'Retorna una lista con todos los clientes registrados'
			},
			{
				name: 'Cliente - Nuevo',
				value: 'clienteNuevo',
				action: 'Agregar un nuevo cliente',
				description: 'Da de alta un cliente. Retornará el cliente creado (con su ID cargado) y la URL para acceder al nuevo recurso.'
			},
			{
				name: 'Cobro - Nuevo',
				value: 'cobros',
				action: 'Efectuar alta de comprobante y retornar datos.',
				description: 'Da de alta el comprobante. Retornará el comprobante creado con su información y una URL.'
			},
			{
				name: 'Obtener Productos - Lista',
				value: 'obtenerProductos',
				description: 'Obtener una lista con todos los productos utilizando Cliente ID'
			},
			{
				name: 'Pedido De Venta - Actividad',
				value: 'pedidoVentaActividad',
				action: 'Perform an Actividad request',
				description: 'Traer un pedido de venta por un identificador único'
			},
			{
				name: 'Pedido De Venta - Nuevo',
				value: 'crearPedidoVenta',
				description: 'Realizar pedidos de venta de los articulos'
			},
			{
				name: 'Precios De Productos - Lista',
				value: 'productPriceList',
				action: 'Retrieves the all of the products prices'
			},
			{
				name: 'Proceso Binario a Imagen',
				value: 'procesarImagenes',
			},
			{
				name: 'Productos WooCommerce - Generar (JSON Producto)',
				value: 'generarProductosWoo',
				description: 'Generar JSON estructurado para productos WooCommerce a partir de artículos Centum',
			},
			{
				name: 'Provincias - Lista',
				value: 'provinciasLista',
				description: 'Generar JSON estructurado para productos WooCommerce a partir de artículos Centum',
			},
			{
				name: 'Sucursales Físicas - Lista',
				value: 'sucursalesFisicas',
			},
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
				resource: ['searchArticleBySKU'],
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
			maxValue: 99999,
			minValue: 0,
			numberStepSize: 1,
		},
		default: 0,
		description: 'Client ID used to search the articles',
		displayOptions: {
			show: {
				resource: ['articulo'],
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
				resource: ['articulo'],
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
				resource: ['articulo', 'precioArticulo'],
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
				resource: ['articulo', 'precioArticulo'],
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
		displayName: 'Cantidad',
		name: 'articuloCantidad',
		type: 'string',
		required: true,
		default: '1',
		description: 'Cantidad para este articulo',
		displayOptions: {
			show: {
				resource: ['precioArticulo'],
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
				resource: ['clienteNuevo', 'clientesActualizar', 'contribuyenteNuevo'],
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
				resource: ['clienteNuevo', 'clientesBusqueda'],
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
				resource: ['clienteNuevo', 'clientesBusqueda', 'buscarContribuyente', 'contribuyenteNuevo'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: 'example@example.com',
		displayOptions: {
			show: {
				resource: ['clientesBusqueda'],
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
				resource: ['buscarContribuyente'],
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
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulosImagenes'],
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
				resource: ['pedidoVentaActividad'],
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
		displayName: 'ID Sucursal Física',
		name: 'IdSucursalFisica',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['articulosSucursalesFisicas'],
			},
		},
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
		displayName: 'Método HTTP',
		name: 'method',
		type: 'options',
		default: 'GET',
		options: [
			{ name: 'GET', value: 'GET' },
			{ name: 'POST', value: 'POST' },
		],
		description: 'Método de solicitud HTTP a usar',
	},
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
				],
			},
		},
	},
];
