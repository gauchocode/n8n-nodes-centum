import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { CentumFields, CentumOperations, HttpOptions } from './CentumDescription';
import { resourceHandlerGroups } from './resources';
import type { CentumApiCredentials, CentumHeaders } from './resources/tipos';

type SimplifiedFieldSpec = string | { key: string; fields: SimplifiedFieldSpec[] };

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

const comprobanteVentaFields: SimplifiedFieldSpec[] = [
	'IdTipoComprobanteVenta',
	'IdTipoComprobante',
	'Codigo',
	'Nombre',
	'Descripcion',
	'Activo',
];

const comprobanteCompraFields: SimplifiedFieldSpec[] = [
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

const simplifiedOutputFields: Record<string, SimplifiedFieldSpec[]> = {
	buscarProductos: productFields,
	buscarProductoPorCodigo: productFields,
	listarProductosDisponibles: productFields,
	listarTodosLosProductos: productFields,
	consultarPrecioProducto: [...productFields, 'IdListaPrecio', 'NombreListaPrecio', 'Moneda'],
	listarProductosPorSucursal: branchStockFields,
	buscarProductoEnSucursal: branchStockFields,
	listarClientes: customerFields,
	buscarClientes: customerFields,
	buscarClientePorCuit: customerFields,
	buscarContribuyente: customerFields,
	consultarSaldoCliente: [...customerFields, 'FechaVencimiento', 'Importe', 'ImportePendiente'],
	verDetalleSaldoCliente: [...documentFields, 'FechaVencimiento', 'Importe', 'ImportePendiente'],
	listarFacturasCobros: documentFields,
	listarFacturasVenta: documentFields,
	listarFacturasVentasPorID: documentFields,
	listarPromocionesComercialesCliente: [
		'IdPromocionComercial',
		'Codigo',
		'Nombre',
		'Descripcion',
		'FechaDesde',
		'FechaHasta',
		'Activa',
	],
	listarComprobantesVenta: comprobanteVentaFields,
	estadisticaVentaRanking: [
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
	listarPedidosVenta: documentFields,
	listarPedidosVentaFiltrados: documentFields,
	listarCobros: [...documentFields, 'FechaCobro', 'ImporteCobrado', 'ImporteAplicado'],
	listarCompras: documentFields,
	listarComprobantesCompra: comprobanteCompraFields,
	listarOrdenesCompra: documentFields,
	verDetalleOrdenCompra: documentFields,
	listarProveedores: supplierFields,
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

function simplifyOutputItem(item: INodeExecutionData, operation: string): INodeExecutionData {
	const fields = simplifiedOutputFields[operation];
	if (!fields) {
		return item;
	}

	return {
		...item,
		json: simplifyJsonPayload(item.json, fields),
	};
}

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Centum',
		name: 'centum',
		icon: 'file:centum.svg',
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["operation"] ? $parameter["resource"] + ": " + $parameter["operation"] : $parameter["resource"]}}',
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
						`Operación no implementada para ${resource}: ${operation}`,
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
					? handlerResult[0].map((entry) => simplifyOutputItem(entry, operation))
					: handlerResult[0];

				returnData.push(...outputItems);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);

				if (this.continueOnFail()) {
					returnData.push({
						json: { error: message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeOperationError(this.getNode(), message, { itemIndex });
			}
		}

		return [returnData];
	}
}
