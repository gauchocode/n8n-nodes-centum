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
	articles: {
		...articlesHandlers,
		listDiscounts: extrasHandlers.listDiscounts,
		listPrices: salesHandlers.listPrices,
	},
	customers: {
		...customersHandlers,
		listPaymentInvoices: paymentsHandlers.listPaymentInvoices,
		listSalesInvoices: salesHandlers.listSalesInvoices,
		listSalesInvoicesById: salesHandlers.listSalesInvoicesById,
	},
	sales: salesHandlers,
	payments: paymentsHandlers,
	purchases: {
		...purchasesHandlers,
		createPurchaseDeliveryNote: logisticsHandlers.createPurchaseDeliveryNote,
	},
	suppliers: suppliersHandlers,
	logistics: {
		...logisticsHandlers,
		listSellers: extrasHandlers.listSellers,
	},
	stock: {
		...stockHandlers,
		getStock: articlesHandlers.getStock,
		listArticleLocations: articlesHandlers.listArticleLocations,
		getArticleLocationsBySection: articlesHandlers.getArticleLocationsBySection,
	},
	geography: geographyHandlers,
	extras: {
		...extrasHandlers,
		syncImages: articlesHandlers.syncImages,
		convertProductsForWooCommerce: articlesHandlers.convertProductsForWooCommerce,
	},
};

export const resourceHandlers: ResourceHandlerMap = Object.values(resourceHandlerGroups).reduce(
	(handlers, group) => ({
		...handlers,
		...group,
	}),
	{} as ResourceHandlerMap,
);
