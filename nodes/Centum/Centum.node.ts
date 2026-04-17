import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import {
	CentumFields,
	CentumOperations,
	HttpOptions,
	operationDisplayNames,
	resourceDisplayNames,
} from './CentumDescription';

import {
	buildCentumHeaders,
	getErrorDescription,
	getResourceLocatorValue,
} from './helpers/functions';
import { resourceHandlerGroups } from './resources';
import type { CentumApiCredentials, CentumHeaders } from './resources/types';

type SimplifiedFieldSpec = string | { key: string; fields: SimplifiedFieldSpec[] };

const resourceDisplayNamesExpression = JSON.stringify(resourceDisplayNames);
const operationDisplayNamesExpression = JSON.stringify(operationDisplayNames);

const resourceSubtitleExpression = [
	'={{$parameter["operation"] ? (',
	`${resourceDisplayNamesExpression}[$parameter["resource"]] || $parameter["resource"]`,
	') + ": " + (',
	`${operationDisplayNamesExpression}[$parameter["operation"]] || $parameter["operation"]`,
	') : (',
	`${resourceDisplayNamesExpression}[$parameter["resource"]] || $parameter["resource"]`,
	')}}',
].join('');

const productFields: SimplifiedFieldSpec[] = [
	'ID',
	'Id',
	'IdArticulo',
	'Codigo',
	'Nombre',
	'Descripcion',
	'DescripcionCorta',
	'Precio',
	'PrecioLista',
	'PrecioFinal',
	'PrecioSugerido',
	'Stock',
	'Existencia',
	'ExistenciasSucursal',
	'ExistenciasTotal',
	'StockDisponible',
	'Masa',
	'Volumen',
	'Alto',
	'Largo',
	'Ancho',
	'Activo',
	'Habilitado',
	'ActivoWeb',
	'FechaModificacion',
	'FechaPrecioActualizado',
	'FechaUltimaActualizacionPrecio',
	{ key: 'Marca', fields: ['IdMarcaArticulo', 'Nombre'] },
	{ key: 'MarcaArticulo', fields: ['IdMarcaArticulo', 'Nombre'] },
	{ key: 'Rubro', fields: ['IdRubro', 'Nombre'] },
	{ key: 'SubRubro', fields: ['IdSubRubro', 'Nombre'] },
	{ key: 'Categoria', fields: ['IdCategoriaArticulo', 'Nombre'] },
	{ key: 'CategoriaArticulo', fields: ['IdCategoriaArticulo', 'Nombre'] },
	{ key: 'CategoriaImpuestoIVA', fields: ['IdCategoriaImpuestoIVA', 'Nombre', 'Tasa'] },
	{ key: 'SucursalFisica', fields: ['IdSucursalFisica', 'Codigo', 'Nombre'] },
];

const branchStockFields: SimplifiedFieldSpec[] = [
	'IdArticulo',
	'ExistenciasSucursales',
	'ExistenciasTotal',
	'CantidadPedidosVenta',
	'CantidadOrdenesCompra',
	'StockComprometido',
];

const customerFields: SimplifiedFieldSpec[] = [
	'IdCliente',
	'Codigo',
	'RazonSocial',
	'NombreFantasia',
	'CUIT',
	'Documento',
	'Email',
	'Telefono',
	'Activo',
	'Saldo',
	'SaldoPendiente',
	{ key: 'CondicionIVA', fields: ['IdCondicionIVA', 'Nombre'] },
	{ key: 'Zona', fields: ['IdZona', 'Nombre'] },
	{ key: 'Vendedor', fields: ['IdVendedor', 'Codigo', 'Nombre'] },
];

const supplierFields: SimplifiedFieldSpec[] = [
	'IdProveedor',
	'Codigo',
	'RazonSocial',
	'CUIT',
	'Email',
	'Telefono',
	'Activo',
	{ key: 'Provincia', fields: ['IdProvincia', 'Nombre'] },
	{ key: 'Pais', fields: ['IdPais', 'Nombre'] },
	{ key: 'Zona', fields: ['IdZona', 'Nombre'] },
];

const salesVoucherFields: SimplifiedFieldSpec[] = [
	'IdTipoComprobanteVenta',
	'IdTipoComprobante',
	'Codigo',
	'Nombre',
	'Descripcion',
	'Activo',
];

const purchaseVoucherFields: SimplifiedFieldSpec[] = [
	'IdTipoComprobanteCompra',
	'IdTipoComprobante',
	'Codigo',
	'Nombre',
	'Descripcion',
	'Activo',
];

const documentFields: SimplifiedFieldSpec[] = [
	'IdVenta',
	'IdPedidoVenta',
	'IdPedido',
	'IdCobro',
	'IdCompra',
	'IdOrdenCompra',
	'IdComprobante',
	'Codigo',
	'Numero',
	'NumeroDocumento',
	'Fecha',
	'FechaDocumento',
	'FechaEntrega',
	'Estado',
	'ImporteNeto',
	'ImporteIVA',
	'ImporteTotal',
	'Total',
	'Saldo',
	'SaldoPendiente',
	{ key: 'Cliente', fields: ['IdCliente', 'Codigo', 'RazonSocial', 'CUIT'] },
	{ key: 'Proveedor', fields: ['IdProveedor', 'Codigo', 'RazonSocial', 'CUIT'] },
	{ key: 'SucursalFisica', fields: ['IdSucursalFisica', 'Codigo', 'Nombre'] },
	{ key: 'Vendedor', fields: ['IdVendedor', 'Codigo', 'Nombre'] },
	{ key: 'TipoComprobante', fields: ['IdTipoComprobante', 'Codigo', 'Nombre'] },
	{ key: 'CanalVenta', fields: ['IdCanalVenta', 'Nombre'] },
];

function simplifiedFieldKey(resource: string, operation: string): string {
	return `${resource}:${operation}`;
}

const simplifiedOutputFields: Record<string, SimplifiedFieldSpec[]> = {
	[simplifiedFieldKey('articulos', 'GetDatosGenerales')]: productFields,
	[simplifiedFieldKey('articulos', 'GetOne')]: productFields,
	[simplifiedFieldKey('articulos', 'GetVenta')]: productFields,
	[simplifiedFieldKey('articulos', 'GetPrecios')]: [
		...productFields,
		'IdListaPrecio',
		'NombreListaPrecio',
		'Moneda',
	],
	[simplifiedFieldKey('articulos', 'GetExistenciasIndicadores')]: branchStockFields,
	[simplifiedFieldKey('articulos', 'GetExistencias')]: productFields,
	[simplifiedFieldKey('clientes', 'Get')]: customerFields,
	[simplifiedFieldKey('clientes', 'GetSaldoCuentaCorriente')]: [
		...customerFields,
		'FechaVencimiento',
		'Importe',
		'ImportePendiente',
	],
	[simplifiedFieldKey('clientes', 'GetComposicionSaldoCuentaCorriente')]: [
		...documentFields,
		'FechaVencimiento',
		'Importe',
		'ImportePendiente',
	],
	[simplifiedFieldKey('clientes', 'GetOneContribuyente')]: customerFields,
	[simplifiedFieldKey('ventas', 'Get')]: documentFields,
	[simplifiedFieldKey('ventas', 'GetConsulta')]: documentFields,
	[simplifiedFieldKey('ventas', 'GetEstadisticas')]: [
		'IdCliente',
		'IdArticulo',
		'Codigo',
		'Nombre',
		'Cantidad',
		'ImporteTotal',
		'Total',
		{ key: 'Cliente', fields: ['IdCliente', 'Codigo', 'RazonSocial'] },
		{ key: 'Articulo', fields: ['IdArticulo', 'Codigo', 'Nombre'] },
	],
	[simplifiedFieldKey('pedidosVenta', 'Get')]: documentFields,
	[simplifiedFieldKey('pedidosVenta', 'GetConsulta')]: documentFields,
	[simplifiedFieldKey('cobros', 'Get')]: [
		...documentFields,
		'FechaCobro',
		'ImporteCobrado',
		'ImporteAplicado',
	],
	[simplifiedFieldKey('promocionesComerciales', 'Get')]: [
		'IdPromocionComercial',
		'Codigo',
		'Nombre',
		'Descripcion',
		'FechaDesde',
		'FechaHasta',
		'Activa',
	],
	[simplifiedFieldKey('compras', 'Get')]: documentFields,
	[simplifiedFieldKey('tiposComprobante', 'GetAllCompras')]: purchaseVoucherFields,
	[simplifiedFieldKey('tiposComprobante', 'GetAllVentas')]: salesVoucherFields,
	[simplifiedFieldKey('ordenesCompra', 'Get')]: documentFields,
	[simplifiedFieldKey('ordenesCompra', 'GetOne')]: documentFields,
	[simplifiedFieldKey('proveedores', 'Get')]: supplierFields,
};

function pickSimplifiedValue(value: unknown, fields: SimplifiedFieldSpec[]): unknown {
	if (value === null || value === undefined) {
		return undefined;
	}

	if (typeof value !== 'object') {
		return value;
	}

	const source = value as Record<string, unknown>;
	const result: Record<string, unknown> = {};

	for (const field of fields) {
		if (typeof field === 'string') {
			if (source[field] !== undefined) {
				result[field] = source[field];
			}
			continue;
		}

		const nestedValue = source[field.key];
		if (nestedValue === undefined || nestedValue === null) {
			continue;
		}

		if (Array.isArray(nestedValue)) {
			const simplifiedItems = nestedValue
				.map((item) => pickSimplifiedValue(item, field.fields))
				.filter((item) => item !== undefined);

			if (simplifiedItems.length > 0) {
				result[field.key] = simplifiedItems;
			}
			continue;
		}

		const simplifiedNestedValue = pickSimplifiedValue(nestedValue, field.fields);
		if (
			simplifiedNestedValue &&
			typeof simplifiedNestedValue === 'object' &&
			Object.keys(simplifiedNestedValue as object).length > 0
		) {
			result[field.key] = simplifiedNestedValue;
		}
	}

	return Object.keys(result).length > 0 ? result : undefined;
}

function simplifyJsonPayload(
	json: INodeExecutionData['json'],
	fields: SimplifiedFieldSpec[],
): INodeExecutionData['json'] {
	const simplifyCollectionWrapper = (value: unknown): unknown => {
		if (!value || typeof value !== 'object') {
			return undefined;
		}

		const source = value as Record<string, unknown>;

		if (Array.isArray(source.Items)) {
			const simplifiedItems = source.Items.map((entry) =>
				pickSimplifiedValue(entry, fields),
			).filter((entry) => entry !== undefined);

			if (simplifiedItems.length > 0) {
				return {
					...source,
					Items: simplifiedItems,
				};
			}
		}

		const nestedEntries = Object.entries(source).map(
			([key, entryValue]) => [key, simplifyCollectionWrapper(entryValue)] as const,
		);
		const hasNestedWrapper = nestedEntries.some(([, entryValue]) => entryValue !== undefined);

		if (hasNestedWrapper) {
			return Object.fromEntries(
				nestedEntries.map(([key, entryValue]) => [
					key,
					entryValue === undefined ? source[key] : entryValue,
				]),
			);
		}

		return undefined;
	};

	if (json && typeof json === 'object') {
		const source = json as Record<string, unknown>;

		const simplifiedWrapper = simplifyCollectionWrapper(source);
		if (simplifiedWrapper !== undefined) {
			return simplifiedWrapper as INodeExecutionData['json'];
		}

		const simplifiedValue = pickSimplifiedValue(source, fields);
		if (simplifiedValue !== undefined) {
			return simplifiedValue as INodeExecutionData['json'];
		}
	}

	return json;
}

function simplifyOutputItem(
	item: INodeExecutionData,
	resource: string,
	operation: string,
): INodeExecutionData {
	const fields =
		simplifiedOutputFields[simplifiedFieldKey(resource, operation)] ??
		simplifiedOutputFields[operation];
	if (!fields) {
		return item;
	}

	return {
		...item,
		json: simplifyJsonPayload(item.json, fields),
	};
}

function linkOutputItems(items: INodeExecutionData[], itemIndex: number): INodeExecutionData[] {
	return items.map((item) => ({
		...item,
		pairedItem: item.pairedItem ?? { item: itemIndex },
	}));
}

type LoadOptionItem = Record<string, unknown>;

const loadOptionCollectionKeys = [
	'Items',
	'Articulos',
	'Clientes',
	'Proveedores',
	'SucursalesFisicas',
	'TurnosEntrega',
	'Paises',
	'Provincias',
	'Bonificaciones',
	'TiposComprobante',
	'Vendedores',
	'EstadosPedidoVenta',
] as const;

function asArray(value: unknown): LoadOptionItem[] {
	if (Array.isArray(value)) {
		return value.filter(
			(item): item is LoadOptionItem => typeof item === 'object' && item !== null,
		);
	}

	if (!value || typeof value !== 'object') {
		return [];
	}

	const source = value as Record<string, unknown>;

	for (const key of loadOptionCollectionKeys) {
		const nested = source[key];
		if (nested === undefined) {
			continue;
		}

		const nestedItems = asArray(nested);
		if (nestedItems.length > 0) {
			return nestedItems;
		}
	}

	const nestedValues = Object.values(source);
	if (nestedValues.length === 1) {
		const nestedItems = asArray(nestedValues[0]);
		if (nestedItems.length > 0) {
			return nestedItems;
		}
	}

	return [source];
}

function readField(item: LoadOptionItem, keys: string[]): unknown {
	for (const key of keys) {
		if (item[key] !== undefined && item[key] !== null && String(item[key]).trim() !== '') {
			return item[key];
		}
	}

	return undefined;
}

function toOptions(
	items: unknown,
	valueKeys: string[],
	nameKeys: string[],
	fallbackLabel: string,
): INodePropertyOptions[] {
	const options: INodePropertyOptions[] = [];

	for (const item of asArray(items)) {
		const value = readField(item, valueKeys);
		if (value === undefined) {
			continue;
		}

		const name = readField(item, nameKeys);
		options.push({
			name: name === undefined ? `${fallbackLabel} ${String(value)}` : String(name),
			value: String(value),
		});
	}

	return options;
}

async function fetchLoadOptionData(
	context: ILoadOptionsFunctions,
	path: string,
	queryParams?: Record<string, string | number | boolean>,
): Promise<unknown> {
	const credentials = (await context.getCredentials(
		'centumApi',
	)) as unknown as CentumApiCredentials;
	const centumUrl = String(credentials.centumUrl);
	const headers = buildCentumHeaders(
		credentials.consumerApiPublicId as string | number,
		String(credentials.publicAccessKey),
	);
	const requestUrl = new URL(`${centumUrl}${path}`);

	for (const [key, value] of Object.entries(queryParams ?? {})) {
		if (value !== '' && value !== undefined && value !== null) {
			requestUrl.searchParams.append(key, String(value));
		}
	}

	const response = await fetch(requestUrl.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	});

	if (!response.ok) {
		throw new NodeOperationError(
			context.getNode(),
			`Load options request failed: ${response.status} ${response.statusText}`,
		);
	}

	const rawText = await response.text();
	return rawText.trim() ? (JSON.parse(rawText) as unknown) : [];
}

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Centum',
		name: 'centum',
		icon: 'file:centum.svg',
		group: ['transform'],
		version: 1,
		subtitle: resourceSubtitleExpression,
		description: 'Consumes Centum API',
		defaults: {
			name: 'Centum',
		},
		usableAsTool: true,
		inputs: ['main'] as [NodeConnectionType],
		outputs: ['main'] as [NodeConnectionType],
		credentials: [
			{
				name: 'centumApi',
				required: true,
			},
		],
		properties: [...CentumOperations, ...CentumFields, ...HttpOptions],
	};

	methods = {
		loadOptions: {
			async getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/Clientes');
				return toOptions(
					response,
					['IdCliente', 'ID', 'Id'],
					['RazonSocial', 'NombreFantasia', 'Codigo'],
					'Customer',
				);
			},
			async getSuppliers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/Proveedores');
				return toOptions(
					response,
					['IdProveedor', 'ID', 'Id'],
					['RazonSocial', 'Codigo', 'Nombre'],
					'Supplier',
				);
			},
			async getPhysicalBranches(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/SucursalesFisicas');
				return toOptions(
					response,
					['IdSucursalFisica', 'ID', 'Id'],
					['Nombre', 'Codigo'],
					'Branch',
				);
			},
			async getDeliveryTimeSlots(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/TurnosEntrega');
				return toOptions(
					response,
					['IdTurnoEntrega', 'ID', 'Id'],
					['Nombre', 'Codigo', 'Descripcion'],
					'Delivery Slot',
				);
			},
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/Paises');
				return toOptions(response, ['IdPais', 'ID', 'Id'], ['Nombre', 'Codigo'], 'Country');
			},
			async getProvinces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const currentNodeParameter = (
					this as unknown as {
						getCurrentNodeParameter?: (name: string) => unknown;
					}
				).getCurrentNodeParameter;
				const countryId = getResourceLocatorValue(currentNodeParameter?.('countryId'));
				const response = await fetchLoadOptionData(
					this,
					'/Provincias',
					countryId ? { idPais: countryId } : undefined,
				);
				return toOptions(response, ['IdProvincia', 'ID', 'Id'], ['Nombre', 'Codigo'], 'Province');
			},
			async getDiscounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/Bonificaciones');
				return toOptions(
					response,
					['IdBonificacion', 'ID', 'Id'],
					['Nombre', 'Codigo', 'Descripcion'],
					'Discount',
				);
			},
			async getVoucherTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/TiposComprobante');
				return toOptions(
					response,
					['IdTipoComprobante', 'ID', 'Id'],
					['Nombre', 'Codigo', 'Descripcion'],
					'Voucher Type',
				);
			},
			async getSellers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/Vendedores');
				return toOptions(response, ['IdVendedor', 'ID', 'Id'], ['Nombre', 'Codigo'], 'Seller');
			},
			async getDrivers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/GuiaLogisticaChoferes');
				return toOptions(
					response,
					['IdChofer', 'ID', 'Id'],
					['Nombre', 'Apellido', 'Descripcion', 'Codigo'],
					'Driver',
				);
			},
			async getPriceLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/ListasPrecios');
				return toOptions(
					response,
					['IdListaPrecio', 'ID', 'Id'],
					['Nombre', 'Descripcion', 'Codigo'],
					'Price List',
				);
			},
			async getSalesOrderStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await fetchLoadOptionData(this, '/EstadosPedidoVenta', {
					bIncluirTodosEstados: true,
				});
				return toOptions(
					response,
					['IdEstadoPedidoVenta', 'IdEstado', 'ID', 'Id'],
					['Nombre', 'Codigo', 'Descripcion'],
					'Status',
				);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = (await this.getCredentials(
			'centumApi',
		)) as unknown as CentumApiCredentials;
		const centumUrl = String(centumApiCredentials.centumUrl);
		const consumerApiPublicId = centumApiCredentials.consumerApiPublicId as string | number;
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const headers: CentumHeaders = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			publicAccessKey: String(centumApiCredentials.publicAccessKey),
		};

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const handler = resourceHandlerGroups[resource]?.[operation];

				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`Operation not implemented for ${resource}: ${operation}`,
						{ itemIndex },
					);
				}

				const handlerResult = await handler({
					executeFunctions: this,
					centumUrl,
					headers,
					centumApiCredentials,
					consumerApiPublicId,
					itemIndex,
				});

				const simplifiedOutput = this.getNodeParameter(
					'simplifiedOutput',
					itemIndex,
					false,
				) as boolean;
				const outputItems = simplifiedOutput
					? handlerResult[0].map((entry) => simplifyOutputItem(entry, resource, operation))
					: handlerResult[0];

				returnData.push(...linkOutputItems(outputItems, itemIndex));
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);

				if (this.continueOnFail()) {
					returnData.push({
						json: { error: message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError || error instanceof NodeApiError) {
					if (error instanceof NodeApiError) {
						throw error;
					}

					const description = getErrorDescription(error);
					throw new NodeOperationError(this.getNode(), message, {
						itemIndex,
						...(description ? { description } : {}),
					});
				}

				throw new NodeOperationError(this.getNode(), message, { itemIndex });
			}
		}

		return [returnData];
	}
}
