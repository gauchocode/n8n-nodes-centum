import type { ResourceHandlerMap } from "./tipos";

import { articulosHandlers } from "./articulos";
import { clientesHandlers } from "./clientes";
import { ventasHandlers } from "./ventas";
import { cobrosHandlers } from "./cobros";
import { comprasHandlers } from "./compras";
import { proveedoresHandlers } from "./proveedores";
import { logisticaHandlers } from "./logistica";
import { stockHandlers } from "./stock";
import { geografiaHandlers } from "./geografia";
import { extrasHandlers } from "./extras";

export const resourceHandlerGroups: Record<string, ResourceHandlerMap> = {
	articulos: {
		...articulosHandlers,
		listarBonificaciones: extrasHandlers.listarBonificaciones,
		listarPrecios: ventasHandlers.listarPrecios,
	},
	clientes: {
		...clientesHandlers,
		listarFacturasCobros: cobrosHandlers.listarFacturasCobros,
		listarFacturasVenta: ventasHandlers.listarFacturasVenta,
		listarFacturasVentasPorID: ventasHandlers.listarFacturasVentasPorID,
	},
	ventas: ventasHandlers,
	cobros: cobrosHandlers,
	compras: {
		...comprasHandlers,
		crearRemitoCompra: logisticaHandlers.crearRemitoCompra,
	},
	proveedores: proveedoresHandlers,
	logistica: {
		...logisticaHandlers,
		listarVendedores: extrasHandlers.listarVendedores,
	},
	stock: {
		...stockHandlers,
		consultarStock: articulosHandlers.consultarStock,
		listarUbicacionArticulos: articulosHandlers.listarUbicacionArticulos,
	},
	geografia: geografiaHandlers,
	extras: {
		...extrasHandlers,
		sincronizarImagenes: articulosHandlers.sincronizarImagenes,
		convertirProductosParaWooCommerce: articulosHandlers.convertirProductosParaWooCommerce,
	},
};

export const resourceHandlers: ResourceHandlerMap = Object.values(resourceHandlerGroups).reduce(
	(handlers, group) => ({
		...handlers,
		...group,
	}),
	{} as ResourceHandlerMap,
);
