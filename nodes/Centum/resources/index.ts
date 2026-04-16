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
		generateSecurityToken: extrasHandlers.generateSecurityToken,
	},
	ajustesMovimientosStock: {
		createStockMovement: stockHandlers.createStockMovement,
	},
	articulos: {
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
		listDiscounts: extrasHandlers.listDiscounts,
	},
	categoriasArticulo: {
		listCategories: articlesHandlers.listCategories,
	},
	choferesGuiaLogistica: {
		listDrivers: logisticsHandlers.listDrivers,
	},
	clientes: {
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
		listPaymentInvoices: paymentsHandlers.listPaymentInvoices,
		registerPayment: paymentsHandlers.registerPayment,
		listPayments: paymentsHandlers.listPayments,
	},
	compras: {
		createPurchase: purchasesHandlers.createPurchase,
		listPurchases: purchasesHandlers.listPurchases,
	},
	conceptos: {
		listConcepts: extrasHandlers.listConcepts,
	},
	departamentos: {
		listMunicipalities: geographyHandlers.listMunicipalities,
	},
	frecuenciaClientes: {
		listCustomerFrequencies: customersHandlers.listCustomerFrequencies,
	},
	listasPrecios: {
		listPrices: salesHandlers.listPrices,
	},
	marcas: {
		listBrands: articlesHandlers.listBrands,
	},
	operadoresMoviles: {
		listMobileOperators: extrasHandlers.listMobileOperators,
		verifyOperatorCredentials: extrasHandlers.verifyOperatorCredentials,
	},
	ordenesCompra: {
		createPurchaseOrder: purchasesHandlers.createPurchaseOrder,
		getPurchaseOrderDetails: purchasesHandlers.getPurchaseOrderDetails,
		listPurchaseOrders: purchasesHandlers.listPurchaseOrders,
	},
	paises: {
		listCountries: geographyHandlers.listCountries,
	},
	pedidosVenta: {
		createSalesOrder: salesHandlers.createSalesOrder,
		getSalesOrderDetails: salesHandlers.getSalesOrderDetails,
		listSalesOrderStatuses: salesHandlers.listSalesOrderStatuses,
		listSalesOrders: salesHandlers.listSalesOrders,
		listFilteredSalesOrders: salesHandlers.listFilteredSalesOrders,
	},
	promocionesComerciales: {
		listCustomerCommercialPromotions: customersHandlers.listCustomerCommercialPromotions,
		listPromotions: salesHandlers.listPromotions,
	},
	proveedores: {
		searchSupplier: suppliersHandlers.searchSupplier,
		createSupplier: suppliersHandlers.createSupplier,
		listSuppliers: suppliersHandlers.listSuppliers,
	},
	provincias: {
		listProvinces: geographyHandlers.listProvinces,
	},
	regimenesEspeciales: {
		getSpecialTaxRegimeDetails: extrasHandlers.getSpecialTaxRegimeDetails,
		listSpecialTaxRegimes: extrasHandlers.listSpecialTaxRegimes,
	},
	remitosCompra: {
		createPurchaseDeliveryNote: logisticsHandlers.createPurchaseDeliveryNote,
	},
	remitosVenta: {
		createSalesDeliveryNote: logisticsHandlers.createSalesDeliveryNote,
	},
	rubros: {
		listGroups: articlesHandlers.listGroups,
	},
	subRubros: {
		listSubgroups: articlesHandlers.listSubgroups,
	},
	sucursalesFisicas: {
		listPhysicalBranches: logisticsHandlers.listPhysicalBranches,
	},
	tiposComprobante: {
		listVoucherTypes: extrasHandlers.listVoucherTypes,
		listPurchaseVouchers: purchasesHandlers.listPurchaseVouchers,
		listSalesVouchers: salesHandlers.listSalesVouchers,
	},
	turnosEntrega: {
		listDeliveryTimeSlots: logisticsHandlers.listDeliveryTimeSlots,
	},
	ubicacionesArticulos: {
		listArticleLocations: articlesHandlers.listArticleLocations,
		getArticleLocationsBySection: articlesHandlers.getArticleLocationsBySection,
	},
	vendedores: {
		listSellers: extrasHandlers.listSellers,
	},
	ventas: {
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
