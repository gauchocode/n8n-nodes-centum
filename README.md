# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is a custom node for [n8n](https://n8n.io/), an open-source workflow automation platform, designed to integrate with the **Centum API**, a system for managing customers, payments, and other business resources.  
The `Centum` node simplifies interaction with the Centum API endpoints, allowing operations such as customer search, payment creation, and more directly inside your n8n workflows.

The node is built to be extensible, making it easy to add new operations for specific integration needs with Centum.

> Breaking change: workflow parameter keys are English-only. Resource and operation labels in the UI are Spanish, but saved workflow values still use the English identifiers shown below.

## Requires 3 parameters in the **Centum API** credential:

| Field                               | Type         | Example                                                       | Required   |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |
| Public Access Key                   | Password     | a1b2c3d4e5f6g7h8i9j0...                                       | Yes        |
| CentumSuiteConsumidorApiPublicaId   | Number       | 12345                                                         | Yes        |
| Centum URL                          | Text (URL)   | https://plataformaX.centum.com.ar:23990/BLX                   | Yes        |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |

## Available Operations

**69 operations organized into 10 resources:**

The node interface shows resource and operation labels in Spanish, while the resource values and operation IDs below match the actual English values exposed by the node. Some Centum request and response fields remain in Spanish because they mirror the upstream API contract.

### Articulos (`articles`)

- `getProductByCode`: Get a specific article by its unique ID.
- `searchProducts`: Search articles by name and return every match.
- `listAvailableProducts`: List sellable articles using filters.
- `downloadProductImages`: Download the binary image for an article.
- `listAllProducts`: List article general data.
- `getProductPrice`: Get the price of an article for a selected price list.
- `getProductInBranch`: Get stock for a specific article in a physical branch.
- `listProductsByBranch`: List article stock for a physical branch.
- `listBrands`: List article brands.
- `listCategories`: List article categories.
- `listDiscounts`: List available discounts.
- `listGroups`: List article groups.
- `listPrices`: List suggested product prices.
- `listSubgroups`: List subgroups or filter them by ID.

### Clientes (`customers`)

- `createCustomer`: Create a new customer.
- `getCustomerBalance`: Get the current customer balance.
- `getCustomerBalanceDetails`: Get the detailed account balance composition for a customer.
- `listCustomerCommercialPromotions`: Get commercial promotions applied to a customer from a selected date.
- `listPaymentInvoices`: Get all payment invoices for a customer.
- `listSalesInvoices`: Get all sales invoices for a customer.
- `listSalesInvoicesById`: Get sales invoices for a customer by ID.
- `listCustomers`: List all registered customers.
- `searchCustomers`: Search customers using filters.
- `searchCustomerByCuit`: Search customers by CUIT.
- `updateCustomer`: Update a customer and return the updated resource information.
- `listCustomerFrequencies`: List customer frequency options.
- `createTaxpayerCustomer`: Create a new taxpayer customer.
- `searchTaxpayerCustomer`: Search taxpayer data by CUIT or business name.

### Ventas (`sales`)

- `listPromotions`: List available commercial promotions.
- `createSale`: Generate a sale from the provided parameters.
- `createSalesOrder`: Create a sales order for selected articles.
- `getSalesOrderDetails`: Get a sales order by its unique ID.
- `listSalesOrderStatuses`: List available sales order statuses.
- `listSalesOrders`: List sales orders using filters.
- `listFilteredSalesOrders`: List sales orders with a lighter response body.
- `getSalesRanking`: Get sales rankings for customers, articles, sellers, or branches.
- `listSalesVouchers`: List sales vouchers using filters.

### Pagos (`payments`)

- `registerPayment`: Register a payment voucher.
- `listPayments`: List payments using filters.

### Compras (`purchases`)

- `createPurchaseDeliveryNote`: Create a purchase delivery note.
- `createPurchaseOrder`: Generate a purchase order.
- `getPurchaseOrderDetails`: Get a purchase order by ID.
- `listPurchaseOrders`: List purchase orders using filters.
- `listPurchaseVouchers`: List purchase vouchers using filters.
- `createPurchase`: Generate a purchase.
- `listPurchases`: List purchases using filters.

### Proveedores (`suppliers`)

- `searchSupplier`: Get supplier information by ID.
- `createSupplier`: Create a supplier.
- `listSuppliers`: List all suppliers.

### Logistica (`logistics`)

- `listDeliveryTimeSlots`: List available delivery time slots.
- `listDrivers`: List available drivers.
- `listPhysicalBranches`: List physical branches.
- `createSalesDeliveryNote`: Create a sales delivery note.
- `listSellers`: List available sellers.

### Stock (`stock`)

- `listArticleLocations`: List article locations.
- `getStock`: List article stock using filters.
- `createStockMovement`: Create a stock movement adjustment.

### Geografia (`geography`)

- `listCountries`: List available countries.
- `listMunicipalities`: List municipalities, usually filtered by province.
- `listProvinces`: List provinces, usually filtered by country.

### Extras (`extras`)

- `generateSecurityToken`: Generate a token for external tools such as Postman.
- `syncImages`: Process binary image data for WooCommerce usage.
- `listConcepts`: List concepts.
- `verifyOperatorCredentials`: Get mobile operator data using the configured credentials.
- `listMobileOperators`: List mobile operators.
- `getSpecialTaxRegimeDetails`: Get a special tax regime by ID.
- `listSpecialTaxRegimes`: List special tax regimes.
- `listVoucherTypes`: List voucher types.
- `convertProductsForWooCommerce`: Generate WooCommerce-ready product JSON from Centum articles.

## Prerequisites

To use or develop this node, you need:

- **n8n** 1.75.2 or higher.
- **Node.js** 20.x or higher.
- **Docker** and **Docker Compose** for local builds in this repository.
- **Centum API access** with valid credentials: `centumUrl`, `consumerApiPublicId`, and `publicAccessKey`.

## Development

This repository uses a Docker-only build workflow.

### Build

```bash
rm -rf dist
docker compose run build
```

### Publish

For verified community-node publication, use the GitHub release workflow in `.github/workflows/publish.yml` with the `NPM_TOKEN` GitHub secret.

For local publishing, create a local `.env` file with your npm token:

```bash
NPM_TOKEN=npm_your_token_here
```

Then publish with Docker:

```bash
rm -rf dist
docker compose build --no-cache
docker compose run publish
```

### Local testing in n8n

1. Build the package with Docker.
2. Link or copy the package into your n8n community nodes/custom directory.
3. Restart n8n.
4. Add the `Centum` node to a workflow and test with valid Centum credentials.

## Support

For issues or questions:

- Open an **issue** in the [GitHub repository](https://github.com/gauchocode/n8n-nodes-centum).
- Contact your Centum provider for API-related support.
- Check the [n8n documentation](https://docs.n8n.io/) for help with workflow integration.

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.
