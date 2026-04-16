# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is a custom node for [n8n](https://n8n.io/), an open-source workflow automation platform, designed to integrate with the **Centum API**, a system for managing customers, payments, and other business resources.  
The `Centum` node simplifies interaction with the Centum API endpoints, allowing operations such as customer search, payment creation, and more directly inside your n8n workflows.

The node is built to be extensible, making it easy to add new operations for specific integration needs with Centum.

> Breaking change: resource values now follow normalized identifiers derived from the CSV `Resource New` column. Existing workflows created with the previous resource values must be updated before reuse.

## Requires 3 parameters in the **Centum API** credential:

| Field                               | Type         | Example                                                       | Required   |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |
| Public Access Key                   | Password     | a1b2c3d4e5f6g7h8i9j0...                                       | Yes        |
| CentumSuiteConsumidorApiPublicaId   | Number       | 12345                                                         | Yes        |
| Centum URL                          | Text (URL)   | https://plataformaX.centum.com.ar:23990/BLX                   | Yes        |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |

## Available Operations

**69 operations organized into 32 resources:**

The node interface shows resource and operation labels in Spanish. Saved resource values use normalized Spanish identifiers, while operation IDs still use the internal operation identifiers shown below. Some Centum request and response fields remain in Spanish because they mirror the upstream API contract.

### Access Token (`accessToken`)

- `generateSecurityToken`: Generate a token for external tools such as Postman.

### Ajustes Movimientos Stock (`ajustesMovimientosStock`)

- `createStockMovement`: Create a stock movement adjustment.

### Articulos (`articulos`)

- `getProductByCode`: Get a specific article by its unique ID.
- `searchProducts`: Search articles by name and return every match.
- `listAvailableProducts`: List sellable articles using filters.
- `downloadProductImages`: Download the binary image for an article.
- `listAllProducts`: List article general data.
- `getProductPrice`: Get the price of an article for a selected price list.
- `getProductInBranch`: Get stock for a specific article in a physical branch.
- `getStock`: List article stock using filters.
- `listProductsByBranch`: List article stock for a physical branch.
- `convertProductsForWooCommerce`: Generate WooCommerce-ready product JSON from Centum articles.

### Bonificaciones (`bonificaciones`)

- `listDiscounts`: List available discounts.

### Categorias Articulo (`categoriasArticulo`)

- `listCategories`: List article categories.

### Choferes Guia Logistica (`choferesGuiaLogistica`)

- `listDrivers`: List available drivers.

### Clientes (`clientes`)

- `createCustomer`: Create a new customer.
- `getCustomerBalance`: Get the current customer balance.
- `getCustomerBalanceDetails`: Get the detailed account balance composition for a customer.
- `listCustomers`: List all registered customers.
- `searchCustomers`: Search customers using filters.
- `searchCustomerByCuit`: Search customers by CUIT.
- `updateCustomer`: Update a customer and return the updated resource information.
- `createTaxpayerCustomer`: Create a new taxpayer customer.
- `searchTaxpayerCustomer`: Search taxpayer data by CUIT or business name.

### Cobros (`cobros`)

- `listPaymentInvoices`: Get all payment invoices for a customer.
- `registerPayment`: Register a payment voucher.
- `listPayments`: List payments using filters.

### Compras (`compras`)

- `createPurchase`: Generate a purchase.
- `listPurchases`: List purchases using filters.

### Conceptos (`conceptos`)

- `listConcepts`: List concepts.

### Departamentos (`departamentos`)

- `listMunicipalities`: List municipalities, usually filtered by province.

### Frecuencia de Clientes (`frecuenciaClientes`)

- `listCustomerFrequencies`: List customer frequency options.

### Listas Precios (`listasPrecios`)

- `listPrices`: List complete price lists.

### Marcas (`marcas`)

- `listBrands`: List article brands.

### Operadores Moviles (`operadoresMoviles`)

- `verifyOperatorCredentials`: Get mobile operator data using the configured credentials.
- `listMobileOperators`: List mobile operators.

### Ordenes Compra (`ordenesCompra`)

- `createPurchaseOrder`: Generate a purchase order.
- `getPurchaseOrderDetails`: Get a purchase order by ID.
- `listPurchaseOrders`: List purchase orders using filters.

### Paises (`paises`)

- `listCountries`: List available countries.

### Pedidos Venta (`pedidosVenta`)

- `createSalesOrder`: Create a sales order for selected articles.
- `getSalesOrderDetails`: Get a sales order by its unique ID.
- `listSalesOrderStatuses`: List available sales order statuses.
- `listSalesOrders`: List sales orders using filters.
- `listFilteredSalesOrders`: List sales orders with a lighter response body.

### Promociones Comerciales (`promocionesComerciales`)

- `listCustomerCommercialPromotions`: Get commercial promotions applied to a customer from a selected date.
- `listPromotions`: List available commercial promotions.

### Proveedores (`proveedores`)

- `searchSupplier`: Get supplier information by ID.
- `createSupplier`: Create a supplier.
- `listSuppliers`: List all suppliers.

### Provincias (`provincias`)

- `listProvinces`: List provinces, usually filtered by country.

### Regimenes Especiales (`regimenesEspeciales`)

- `getSpecialTaxRegimeDetails`: Get a special tax regime by ID.
- `listSpecialTaxRegimes`: List special tax regimes.

### Remitos Compra (`remitosCompra`)

- `createPurchaseDeliveryNote`: Create a purchase delivery note.

### Remitos Venta (`remitosVenta`)

- `createSalesDeliveryNote`: Create a sales delivery note.

### Rubros (`rubros`)

- `listGroups`: List article groups.

### SubRubros (`subRubros`)

- `listSubgroups`: List subgroups or filter them by ID.

### Sucursales Fisicas (`sucursalesFisicas`)

- `listPhysicalBranches`: List physical branches.

### Tipos Comprobante (`tiposComprobante`)

- `listVoucherTypes`: List generic voucher types.
- `listPurchaseVouchers`: List purchase vouchers using filters.
- `listSalesVouchers`: List sales vouchers using filters.

### Turnos Entrega (`turnosEntrega`)

- `listDeliveryTimeSlots`: List available delivery time slots.

### Ubicaciones Articulos (`ubicacionesArticulos`)

- `listArticleLocations`: List article locations.
- `getArticleLocationsBySection`: Get article locations by branch section.

### Vendedores (`vendedores`)

- `listSellers`: List available sellers.

### Ventas (`ventas`)

- `listSalesInvoices`: Get all sales invoices for a customer.
- `listSalesInvoicesById`: Get sales invoices for a customer by ID.
- `createSale`: Generate a sale from the provided parameters.
- `getSalesRanking`: Get sales rankings for customers, articles, sellers, or branches.

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
