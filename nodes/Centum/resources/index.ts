import type { ResourceHandlerMap } from './types';

import { articlesHandlers } from './articles';
import { customersHandlers } from './customers';
import { salesHandlers } from './sales';
import { paymentsHandlers } from './payments';
import { purchasesHandlers } from './purchases';
import { suppliersHandlers } from './suppliers';
import { logisticsHandlers } from './logistics';
import { stockHandlers } from './stock';
import { geographyHandlers } from './geography';
import { extrasHandlers } from './extras';

export const resourceHandlerGroups: Record<string, ResourceHandlerMap> = {
	accessToken: {
		Get: extrasHandlers.generateSecurityToken,
		generateSecurityToken: extrasHandlers.generateSecurityToken,
	},
	ajustesMovimientosStock: {
		Create: stockHandlers.createStockMovement,
		createStockMovement: stockHandlers.createStockMovement,
	},
	articulos: {
		GetDatosGenerales: articlesHandlers.GetDatosGenerales,
		GetOne: articlesHandlers.getProductByCode,
		GetVenta: articlesHandlers.listAvailableProducts,
		GetOneImagen: articlesHandlers.downloadProductImages,
		GetPrecios: articlesHandlers.getProductPrice,
		GetExistenciasIndicadores: articlesHandlers.GetExistenciasIndicadores,
		GetExistencias: articlesHandlers.getStock,
		getProductByCode: articlesHandlers.getProductByCode,
		searchProducts: articlesHandlers.searchProducts,
		listAvailableProducts: articlesHandlers.listAvailableProducts,
		downloadProductImages: articlesHandlers.downloadProductImages,
		listAllProducts: articlesHandlers.listAllProducts,
		getProductPrice: articlesHandlers.getProductPrice,
		getProductInBranch: articlesHandlers.getProductInBranch,
		listProductsByBranch: articlesHandlers.listProductsByBranch,
		getStock: articlesHandlers.getStock,
		convertProductsForWooCommerce: articlesHandlers.convertProductsForWooCommerce,
	},
	bonificaciones: {
		GetAll: extrasHandlers.listDiscounts,
		listDiscounts: extrasHandlers.listDiscounts,
	},
	categoriasArticulo: {
		GetAll: articlesHandlers.listCategories,
		listCategories: articlesHandlers.listCategories,
	},
	choferesGuiaLogistica: {
		GetAll: logisticsHandlers.listDrivers,
		listDrivers: logisticsHandlers.listDrivers,
	},
	clientes: {
		Get: customersHandlers.Get,
		Update: customersHandlers.updateCustomer,
		GetSaldoCuentaCorriente: customersHandlers.getCustomerBalance,
		GetComposicionSaldoCuentaCorriente: customersHandlers.getCustomerBalanceDetails,
		GetOneContribuyente: customersHandlers.searchTaxpayerCustomer,
		updateCustomer: customersHandlers.updateCustomer,
		createTaxpayerCustomer: customersHandlers.createTaxpayerCustomer,
		getCustomerBalance: customersHandlers.getCustomerBalance,
		createCustomer: customersHandlers.createCustomer,
		listCustomers: customersHandlers.listCustomers,
		getCustomerBalanceDetails: customersHandlers.getCustomerBalanceDetails,
		searchCustomers: customersHandlers.searchCustomers,
		searchCustomerByCuit: customersHandlers.searchCustomerByCuit,
		searchTaxpayerCustomer: customersHandlers.searchTaxpayerCustomer,
	},
	cobros: {
		Get: paymentsHandlers.Get,
		listPaymentInvoices: paymentsHandlers.listPaymentInvoices,
		registerPayment: paymentsHandlers.registerPayment,
		listPayments: paymentsHandlers.listPayments,
	},
	compras: {
		Create: purchasesHandlers.createPurchase,
		Get: purchasesHandlers.listPurchases,
		createPurchase: purchasesHandlers.createPurchase,
		listPurchases: purchasesHandlers.listPurchases,
	},
	conceptos: {
		GetAll: extrasHandlers.listConcepts,
		listConcepts: extrasHandlers.listConcepts,
	},
	departamentos: {
		Get: geographyHandlers.listMunicipalities,
		listMunicipalities: geographyHandlers.listMunicipalities,
	},
	frecuenciaClientes: {
		GetAll: customersHandlers.listCustomerFrequencies,
		listCustomerFrequencies: customersHandlers.listCustomerFrequencies,
	},
	listasPrecios: {
		GetAll: salesHandlers.listPrices,
		listPrices: salesHandlers.listPrices,
	},
	marcas: {
		GetAll: articlesHandlers.listBrands,
		listBrands: articlesHandlers.listBrands,
	},
	operadoresMoviles: {
		Get: extrasHandlers.listMobileOperators,
		GetCredenciales: extrasHandlers.verifyOperatorCredentials,
		listMobileOperators: extrasHandlers.listMobileOperators,
		verifyOperatorCredentials: extrasHandlers.verifyOperatorCredentials,
	},
	ordenesCompra: {
		Create: purchasesHandlers.createPurchaseOrder,
		GetOne: purchasesHandlers.getPurchaseOrderDetails,
		Get: purchasesHandlers.listPurchaseOrders,
		createPurchaseOrder: purchasesHandlers.createPurchaseOrder,
		getPurchaseOrderDetails: purchasesHandlers.getPurchaseOrderDetails,
		listPurchaseOrders: purchasesHandlers.listPurchaseOrders,
	},
	paises: {
		GetAll: geographyHandlers.listCountries,
		listCountries: geographyHandlers.listCountries,
	},
	pedidosVenta: {
		Create: salesHandlers.createSalesOrder,
		GetOne: salesHandlers.getSalesOrderDetails,
		GetAllEstados: salesHandlers.listSalesOrderStatuses,
		Get: salesHandlers.listSalesOrders,
		GetConsulta: salesHandlers.listFilteredSalesOrders,
		createSalesOrder: salesHandlers.createSalesOrder,
		getSalesOrderDetails: salesHandlers.getSalesOrderDetails,
		listSalesOrderStatuses: salesHandlers.listSalesOrderStatuses,
		listSalesOrders: salesHandlers.listSalesOrders,
		listFilteredSalesOrders: salesHandlers.listFilteredSalesOrders,
	},
	promocionesComerciales: {
		Get: salesHandlers.Get,
		listCustomerCommercialPromotions: customersHandlers.listCustomerCommercialPromotions,
		listPromotions: salesHandlers.listPromotions,
	},
	proveedores: {
		GetOne: suppliersHandlers.searchSupplier,
		Create: suppliersHandlers.createSupplier,
		Get: suppliersHandlers.listSuppliers,
		searchSupplier: suppliersHandlers.searchSupplier,
		createSupplier: suppliersHandlers.createSupplier,
		listSuppliers: suppliersHandlers.listSuppliers,
	},
	provincias: {
		Get: geographyHandlers.listProvinces,
		listProvinces: geographyHandlers.listProvinces,
	},
	regimenesEspeciales: {
		GetOne: extrasHandlers.getSpecialTaxRegimeDetails,
		GetAll: extrasHandlers.listSpecialTaxRegimes,
		getSpecialTaxRegimeDetails: extrasHandlers.getSpecialTaxRegimeDetails,
		listSpecialTaxRegimes: extrasHandlers.listSpecialTaxRegimes,
	},
	remitosCompra: {
		Create: logisticsHandlers.createPurchaseDeliveryNote,
		createPurchaseDeliveryNote: logisticsHandlers.createPurchaseDeliveryNote,
	},
	remitosVenta: {
		Create: logisticsHandlers.createSalesDeliveryNote,
		createSalesDeliveryNote: logisticsHandlers.createSalesDeliveryNote,
	},
	rubros: {
		GetAll: articlesHandlers.listGroups,
		listGroups: articlesHandlers.listGroups,
	},
	subRubros: {
		GetAll: articlesHandlers.listSubgroups,
		listSubgroups: articlesHandlers.listSubgroups,
	},
	sucursalesFisicas: {
		GetAll: logisticsHandlers.listPhysicalBranches,
		listPhysicalBranches: logisticsHandlers.listPhysicalBranches,
	},
	tiposComprobante: {
		GetAll: extrasHandlers.listVoucherTypes,
		GetAllCompras: purchasesHandlers.listPurchaseVouchers,
		GetAllVentas: salesHandlers.listSalesVouchers,
		listVoucherTypes: extrasHandlers.listVoucherTypes,
		listPurchaseVouchers: purchasesHandlers.listPurchaseVouchers,
		listSalesVouchers: salesHandlers.listSalesVouchers,
	},
	turnosEntrega: {
		GetAll: logisticsHandlers.listDeliveryTimeSlots,
		listDeliveryTimeSlots: logisticsHandlers.listDeliveryTimeSlots,
	},
	ubicacionesArticulos: {
		GetAll: articlesHandlers.listArticleLocations,
		listArticleLocations: articlesHandlers.listArticleLocations,
		getArticleLocationsBySection: articlesHandlers.getArticleLocationsBySection,
	},
	vendedores: {
		GetAll: extrasHandlers.listSellers,
		listSellers: extrasHandlers.listSellers,
	},
	ventas: {
		Get: salesHandlers.listSalesInvoicesById,
		GetConsulta: salesHandlers.listSalesInvoices,
		Create: salesHandlers.createSale,
		GetEstadisticas: salesHandlers.getSalesRanking,
		listSalesInvoices: salesHandlers.listSalesInvoices,
		listSalesInvoicesById: salesHandlers.listSalesInvoicesById,
		createSale: salesHandlers.createSale,
		getSalesRanking: salesHandlers.getSalesRanking,
	},
};

export const resourceHandlers: ResourceHandlerMap = Object.values(resourceHandlerGroups).reduce(
	(handlers, group) => ({
		...handlers,
		...group,
	}),
	{} as ResourceHandlerMap,
);
