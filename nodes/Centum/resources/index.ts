import type { ResourceHandlerMap } from './types';

import { articlesHandlers } from './articles';
import { customersHandlers } from './customers';
import { salesHandlers } from './sales';
import { paymentsHandlers } from './payments';
import { purchasesHandlers } from './purchases';
import { suppliersHandlers } from './suppliers';
import { logisticsHandlers } from './logistics';
import { transferHandlers } from './transfers';
import { stockHandlers } from './stock';
import { geographyHandlers } from './geography';
import { extrasHandlers } from './extras';

export const resourceHandlerGroups: Record<string, ResourceHandlerMap> = {
	accessToken: {
		Get: extrasHandlers.generateSecurityToken,
	},
	ajustesMovimientosStock: {
		Create: stockHandlers.createStockMovement,
	},
	articulos: {
		GetDatosGenerales: articlesHandlers.GetDatosGenerales,
		GetOne: articlesHandlers.getProductByCode,
		GetVenta: articlesHandlers.listAvailableProducts,
		GetOneImagen: articlesHandlers.downloadProductImages,
		GetPrecios: articlesHandlers.getProductPrice,
		GetExistenciasIndicadores: articlesHandlers.GetExistenciasIndicadores,
		GetExistencias: articlesHandlers.getStock,
		convertProductsForWooCommerce: articlesHandlers.convertProductsForWooCommerce,
	},
	bonificaciones: {
		GetAll: extrasHandlers.listDiscounts,
	},
	categoriasArticulo: {
		GetAll: articlesHandlers.listCategories,
	},
	choferesGuiaLogistica: {
		GetAll: logisticsHandlers.listDrivers,
	},
	condicionesVenta: {
		GetAll: salesHandlers.listSalesConditions,
	},
	clientes: {
		Get: customersHandlers.Get,
		Update: customersHandlers.updateCustomer,
		GetSaldoCuentaCorriente: customersHandlers.getCustomerBalance,
		GetComposicionSaldoCuentaCorriente: customersHandlers.getCustomerBalanceDetails,
		GetOneContribuyente: customersHandlers.searchTaxpayerCustomer,
		Create: customersHandlers.createCustomer,
	},
	cobros: {
		Get: paymentsHandlers.Get,
		Create: paymentsHandlers.registerPayment,
	},
	compras: {
		Create: purchasesHandlers.createPurchase,
		Get: purchasesHandlers.listPurchases,
		GetOne: purchasesHandlers.getPurchaseDetails,
	},
	conceptos: {
		GetAll: extrasHandlers.listConcepts,
	},
	departamentos: {
		Get: geographyHandlers.listMunicipalities,
	},
	frecuenciaClientes: {
		GetAll: customersHandlers.listCustomerFrequencies,
	},
	listasPrecios: {
		GetAll: salesHandlers.listPrices,
	},
	marcas: {
		GetAll: articlesHandlers.listBrands,
	},
	operadoresMoviles: {
		Get: extrasHandlers.listMobileOperators,
		GetCredenciales: extrasHandlers.verifyOperatorCredentials,
	},
	ordenesCompra: {
		Create: purchasesHandlers.createPurchaseOrder,
		GetOne: purchasesHandlers.getPurchaseOrderDetails,
		Get: purchasesHandlers.listPurchaseOrders,
	},
	ordenesTraspaso: {
		Create: transferHandlers.createTransferOrder,
		Get: transferHandlers.listTransferOrders,
		GetOne: transferHandlers.getTransferOrderDetails,
		Dispatch: transferHandlers.dispatchTransferOrder,
		Finalize: transferHandlers.finalizeTransferOrder,
	},
	paises: {
		GetAll: geographyHandlers.listCountries,
	},
	pedidosVenta: {
		Create: salesHandlers.createSalesOrder,
		GetOne: salesHandlers.getSalesOrderDetails,
		GetAllEstados: salesHandlers.listSalesOrderStatuses,
		GetConsulta: salesHandlers.listFilteredSalesOrders,
	},
	promocionesComerciales: {
		Get: salesHandlers.Get,
	},
	proveedores: {
		GetOne: suppliersHandlers.searchSupplier,
		Create: suppliersHandlers.createSupplier,
		Get: suppliersHandlers.listSuppliers,
	},
	provincias: {
		Get: geographyHandlers.listProvinces,
	},
	regimenesEspeciales: {
		GetOne: extrasHandlers.getSpecialTaxRegimeDetails,
		GetAll: extrasHandlers.listSpecialTaxRegimes,
	},
	remitosCompra: {
		Create: logisticsHandlers.createPurchaseDeliveryNote,
	},
	remitosVenta: {
		Create: logisticsHandlers.createSalesDeliveryNote,
	},
	rubros: {
		GetAll: articlesHandlers.listGroups,
	},
	subRubros: {
		GetAll: articlesHandlers.listSubgroups,
	},
	sucursalesFisicas: {
		GetAll: logisticsHandlers.listPhysicalBranches,
	},
	tiposComprobante: {
		GetAll: extrasHandlers.listVoucherTypes,
		GetAllCompras: purchasesHandlers.listPurchaseVouchers,
		GetAllVentas: salesHandlers.listSalesVouchers,
	},
	turnosEntrega: {
		GetAll: logisticsHandlers.listDeliveryTimeSlots,
	},
	ubicacionesArticulos: {
		GetAll: articlesHandlers.listArticleLocations,
		getArticleLocationsBySection: articlesHandlers.getArticleLocationsBySection,
	},
	vendedores: {
		GetAll: extrasHandlers.listSellers,
	},
	ventas: {
		GetOne: salesHandlers.listSalesInvoicesById,
		GetConsulta: salesHandlers.listSalesInvoices,
		Create: salesHandlers.createSale,
		GetEstadisticas: salesHandlers.getSalesRanking,
	},
};

export const resourceHandlers: ResourceHandlerMap = Object.values(resourceHandlerGroups).reduce(
	(handlers, group) => ({
		...handlers,
		...group,
	}),
	{} as ResourceHandlerMap,
);
