import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from "n8n-workflow";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

import { CentumFields, CentumOperations, HttpOptions } from "./CentumDescription";
import { resourceHandlers } from "./resources";

const resourceCategoryMap: Record<string, string> = {
	generarTokenSeguridad: "extras",
	buscarProductos: "articulos",
	buscarProductoPorCodigo: "articulos",
	consultarStock: "stock",
	listarProductosDisponibles: "articulos",
	descargarImagenesProductos: "articulos",
	listarTodosLosProductos: "articulos",
	consultarPrecioProducto: "articulos",
	listarProductosPorSucursal: "articulos",
	buscarProductoEnSucursal: "articulos",
	listarBonificaciones: "articulos",
	listarCategorias: "articulos",
	listarChoferes: "logistica",
	actualizarCliente: "clientes",
	buscarClientes: "clientes",
	buscarClientePorCuit: "clientes",
	listarClientes: "clientes",
	crearCliente: "clientes",
	verDetalleSaldoCliente: "clientes",
	listarFacturasCobros: "clientes",
	listarFacturasVenta: "clientes",
	listarFacturasVentasPorID: "clientes",
	listarPromocionesComercialesCliente: "clientes",
	consultarSaldoCliente: "clientes",
	buscarContribuyente: "clientes",
	crearContribuyente: "clientes",
	registrarCobro: "cobros",
	listarCobros: "cobros",
	crearCompra: "compras",
	listarCompras: "compras",
	listarComprobantesCompra: "compras",
	listarComprobantesVenta: "ventas",
	listarConceptos: "extras",
	estadisticaVentaRanking: "ventas",
	frecuenciasCliente: "clientes",
	listarMarcas: "articulos",
	listarMunicipios: "geografia",
	listarOperadoresMoviles: "extras",
	crearOrdenCompra: "compras",
	verDetalleOrdenCompra: "compras",
	crearMovimientoStock: "stock",
	listarOrdenesCompra: "compras",
	listarPaises: "geografia",
	verDetallePedidoVenta: "ventas",
	crearPedidoVenta: "ventas",
	listarEstadosPedidosVenta: "ventas",
	listarPedidosVenta: "ventas",
	listarPedidosVentaFiltrados: "ventas",
	listarPrecios: "articulos",
	sincronizarImagenes: "extras",
	convertirProductosParaWooCommerce: "extras",
	listarPromociones: "ventas",
	buscarProveedor: "proveedores",
	crearProveedor: "proveedores",
	listarProveedores: "proveedores",
	listarProvincias: "geografia",
	verDetalleRegimenEspecial: "extras",
	listarRegimenesEspeciales: "extras",
	crearRemitoCompra: "compras",
	crearRemitoVenta: "logistica",
	listarRubros: "articulos",
	listarSubRubros: "articulos",
	listarSucursales: "logistica",
	listarTiposComprobante: "extras",
	listarTurnosEntrega: "logistica",
	listarUbicacionArticulos: "stock",
	listarVendedores: "logistica",
	crearVenta: "ventas",
	verificarCredencialesOperador: "extras",
};

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Centum",
		name: "centum",
		icon: "file:centum.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] ? $parameter["resource"] + ": " + $parameter["operation"] : $parameter["resource"]}}',
		description: "Consumes Centum API",
		defaults: {
			name: "Centum",
		},
		usableAsTool: true,
		inputs: ["main"] as [NodeConnectionType],
		outputs: ["main"] as [NodeConnectionType],
		credentials: [
			{
				name: "centumApi",
				required: true,
			},
		],
		properties: [...CentumOperations, ...CentumFields, ...HttpOptions],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = await this.getCredentials("centumApi");
		const centumUrl = String(centumApiCredentials.centumUrl);
		const consumerApiPublicId = centumApiCredentials.consumerApiPublicId as string | number;

		const headers = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			publicAccessKey: centumApiCredentials.publicAccessKey,
		};

		const nodeParameters = this.getNode().parameters as Record<string, unknown>;
		const resource = this.getNodeParameter("resource", 0) as string;
		const hasOperation = typeof nodeParameters.operation !== "undefined";
		const operation = hasOperation ? (this.getNodeParameter("operation", 0) as string) : resource;
		const resolvedResource = hasOperation && resourceHandlers[resource] && !resourceCategoryMap[resource] ? resource : operation;
		const handler = resourceHandlers[resolvedResource];

		if (!handler) {
			throw new NodeOperationError(this.getNode(), `Operación no implementada: ${resolvedResource}`);
		}

		return await handler({
			executeFunctions: this,
			centumUrl,
			headers,
			centumApiCredentials,
			consumerApiPublicId,
		});
	}
}
