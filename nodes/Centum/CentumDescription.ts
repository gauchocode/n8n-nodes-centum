import { INodeProperties } from 'n8n-workflow';

export const CentumOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Actividad',
				value: 'activity',
				action: 'Perform an Actividad request',
			},
			{
				name: 'Artículo',
				value: 'article',
				action: 'Perform an Artículo request',
			},
			{
				name: 'Articulo - ArticulosSucursalesFisica',
				value: 'stockArticleByPhysicalBranch',
				action: 'Perform an Artículo request',
			},
			{
				name: 'Articulo - Existencia',
				value: 'stockArticle',
				action: 'Perform an Artículo request',
			},
			{
				name: 'Articulo - Imagen',
				value: 'articleImg',
				action: 'Perform an Artículo request',
			},
			{
				name: 'Articulo - Precio',
				value: 'priceArticle',
				action: 'Perform an Artículo request',
			},
			{
				displayName: 'Cliente - Búsqueda',
				name: 'Cliente - Búsqueda',
				value: 'searchCustomer',
				action: 'Search for a customer',
			},
			{
				name: 'Cliente - Lista',
				value: 'customers',
				action: 'Perform an Artículo request',
			},
			{
				name: 'Cliente - Nuevo',
				value: 'newCustomer',
				action: 'Add new customer',
			},
			{
				name: 'Cliente- Actualizar',
				value: 'putCustomer',
				action: 'Update a customer',
			},
			{
				name: 'Cobro - Nuevo',
				value: 'charge',
			},
			{
				name: 'Get Every Product',
				value: 'productList',
			},
			{
				name: 'JSON Producto',
				value: 'json',
			},
			{
				name: 'Lista Sucursale',
				value: 'listBranches',
			},
			{
				name: 'Pedido De Venta - Nuevo',
				value: 'salesOrder',
			},
			{
				name: 'Precios De Producto',
				value: 'productPriceList',
				action: 'Retrieves the all of the products prices'
			},
			{
				name: 'Proceso Binario a Imagen',
				value: 'processImage',
			},
			{
				name: 'Search Article By SKU',
				value: 'searchArticleBySKU',
			},
		],
		default: 'activity',
	},
];

const getArticulo: INodeProperties[] = [
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
		displayName: 'Physical Branch ID',
		name: 'idSucursalFisica',
		type: 'number',
		default: '',
		required: false,
		displayOptions: {
			show: {
				resource: ['searchArticleBySKU'],
			},
		},
		description: 'The ID of the physical branch to filter stock (optional)',
	},
	{
		displayName: 'Data Imagenes',
		type: 'json',
		required: true,
		name: 'dataImg',
		default: '',
		displayOptions: {
			show: {
				resource: ['processImage'],
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
				resource: ['processImage'],
			},
		},
	},
	{
		displayName: 'IdCliente',
		name: 'clientId',
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
				resource: ['article'],
			},
		},
	},
	{
		displayName: 'IdsRubros',
		name: 'idsRubros',
		type: 'string',
		default: '',
		description: 'ID Rubros used to search the articles',
		displayOptions: {
			show: {
				resource: ['article'],
			},
		},
	},
	{
		displayName: 'IdsSubRubros',
		name: 'idsSubRubros',
		type: 'string',
		default: '',
		description: 'Client ID used to search the articles',
		displayOptions: {
			show: {
				resource: ['article'],
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
				resource: ['article'],
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
				resource: ['article'],
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
				resource: ['article'],
			},
		},
	},
	{
		displayName: 'FechaDocumento',
		name: 'documentDate',
		type: 'dateTime',
		required: true,
		default: undefined,
		description: 'Date for request body',
		displayOptions: {
			show: {
				resource: ['article', 'priceArticle'],
			},
		},
	},
	{
		displayName: 'migracionCompleta',
		name: 'migracionCompleta',
		type: 'boolean',
		default: false,
		description: 'Whether complete articles migration or partial',
		displayOptions: {
			show: {
				resource: ['article', 'priceArticle'],
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
	// 			resource: ['article', 'stockArticle'],
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
	// 			resource: ['article', 'stockArticle'],
	// 		},
	// 	},
	// },
	{
		displayName: 'idsSucursalesFisicas',
		name: 'branchOfficeIds',
		type: 'string',
		required: true,
		default: '7345',
		description:
			'Physical branch IDs separated by comma to be able to fetch only the specified branches',
		displayOptions: {
			show: {
				resource: ['stockArticle'],
			},
		},
	},
	{
		displayName: 'Shipping',
		name: 'shipping',
		required: true,
		type: 'json',
		default: {},
		description: 'Shipping info from the order',
		displayOptions: {
			show: {
				resource: ['charge', 'salesOrder'],
			},
		},
	},
	{
		displayName: 'CobroId',
		name: 'cobroId',
		required: true,
		type: 'number',
		default: 0,
		description: 'ID del cobro',
		displayOptions: {
			show: {
				resource: ['salesOrder'],
			},
		},
	},
	{
		displayName: 'Cantidad',
		name: 'quantity',
		type: 'string',
		required: true,
		default: '1',
		description: 'Quantity of the same item',
		displayOptions: {
			show: {
				resource: ['priceArticle'],
			},
		},
	},
	{
		displayName: 'Body',
		name: 'body',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['newCustomer', 'putCustomer'],
			},
		},
	},
	// {
	// 	displayName: 'DNI/CUIT Campo',
	// 	name: 'dni',
	// 	// required: true, // Uncomment if email required is needed
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['newCustomer', 'searchCustomer'],
	// 		},
	// 	},
	// },
	{
		displayName: 'Tipo De Documento',
		name: 'tipoDocumento',
		type: 'options',
		default: 'dni',
		options: [
			{
				name: 'DNI',
				value: 'dni',
			},
			{
				name: 'CUIT',
				value: 'cuit',
			},
		],
		displayOptions: {
			show: {
				resource: ['newCustomer','searchCustomer'],
			},
		},
		required: true,
	},
	{
		displayName: 'DNI',
		name: 'dni',
		type: 'string',
		default: '',
		placeholder: 'Ingresá el DNI...',
		displayOptions: {
			show: {
				resource: ['newCustomer', 'searchCustomer'],
				tipoDocumento: ['dni'],
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
				resource: ['newCustomer', 'searchCustomer'],
				tipoDocumento: ['cuit'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		// required: true, // Uncomment if email required is needed
		type: 'string',
		placeholder: 'name@email.com',
		default: 'example@example.com',
		displayOptions: {
			show: {
				resource: ['searchCustomer'],
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
				resource: ['searchCustomer'],
			},
		},
	},
	{
		displayName: 'Cliente',
		name: 'customer',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder', 'charge'],
			},
		},
	},
	{
		displayName: 'Articulos',
		name: 'article',
		required: true,
		type: 'json',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder', 'charge'],
			},
		},
	},
	{
		displayName: 'idArticulo',
		name: 'articleId',
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['articleImg'],
			},
		},
	},
	{
		displayName: 'IdSucursalFisica',
		name: 'IdSucursalFisica',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['stockArticleByPhysicalBranch'],
			},
		},
	}
];

export const CentumFields: INodeProperties[] = [...getArticulo];
