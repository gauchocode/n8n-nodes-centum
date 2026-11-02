# n8n-nodes-centum-v2

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is a custom node for [n8n](https://n8n.io/), an open-source workflow automation platform, designed to integrate with the **Centum API**, a system for managing customers, payments, and other business resources.  
The `Centum` node simplifies interaction with the Centum API endpoints, allowing operations such as customer search, payment creation, and more directly inside your n8n workflows.

The node is built to be extensible, making it easy to add new operations for specific integration needs with Centum.

## Requires 3 parameters in the **Centum API** credential:

| Field                               | Type         | Example                                                       | Required   |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |
| Public Access Key                   | Password     | a1b2c3d4e5f6g7h8i9j0...                                       | Yes        |
| CentumSuiteConsumidorApiPublicaId   | Number       | 12345                                                         | Yes        |
| Centum URL                          | Text (URL)   | https://plataformaX.centum.com.ar:23990/BLX                   | Yes        |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ---------- |

The credential test generates a short-lived Centum access token and performs an authenticated `GET /Paises` request. A successful response confirms the URL, consumer ID, and public access key.

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
- `searchTaxpayerCustomer`: Search taxpayer data by CUIT.
- `searchCustomerByCuit`: Search customers by CUIT.
- `updateCustomer`: Update a customer and return the updated resource information.

### Condiciones Venta (`condicionesVenta`)

- `listSalesConditions`: List available sales conditions.

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

### Transportes (`transportes`)

- `listTransports`: List transports.

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

## HTTP diagnostics

The shared `apiRequest`, `apiGetRequest`, `apiPostRequest` and
`apiPostRequestPaginated` clients emit single-line JSON prefixed with
`[Centum HTTP]`. The JSON is part of the log message, so log transports that
discard metadata still retain the original transport cause. In queue mode, look
in the worker logs, not only the main n8n container. These records are additional:
existing `[Centum debug]` logs and debug options retain their original behavior.
The following fields and redaction guarantees apply only to `[Centum HTTP]`.

- `request` and successful `response` events respect **Enable Debug Logging** and
  **Debug Endpoint Contains**. HTTP error responses and `failure` events are logged
  at error level even when debug is off. Logging does not add retries.
- Every HTTP call has a unique `request_id`; retries and pagination calls get new
  IDs. Correlate them with `execution_id`, `node` and zero-based `item_index`.
  `request_id` is not a retry-attempt number. `origin` contains only scheme/host/port.
- `response` is emitted immediately after headers arrive, before reading the body.
  `http_status` is the actual response status, never a synthetic 500. Only
  `content-type` (media type), `retry-after` and `x-request-id` are allowlisted.
- `failure.phase` distinguishes `request` (fetch rejected), `body` (body reading),
  `http` (non-success status) and `parse` (JSON decoding/item extraction).
  A pre-response failure has `response_received: false`, `http_status: null` and
  empty response headers. A body failure can have `http_status: 200`.
- Transport errors retain explicit `name`, sanitized `message`, `code`, `errno`,
  `syscall`, nested `cause` and `AggregateError.errors`. Depth, breadth and text
  length are bounded; cycles are marked `truncated`. No arbitrary error fields or
  stacks are dumped. After a response arrives, free-text error messages are omitted
  because API errors and parser messages can contain business data; codes remain.
- `duration_ms` is elapsed time at the event: time to headers for `response`, time
  to failure for `failure`. DNS/TLS attribution requires an actual cause code; a
  generic `fetch failed` is not classified as DNS by assumption.
- If URL/context/header/error metadata cannot be read, a minimal record is emitted
  with `diagnostic_incomplete: true`, the event, phase, response presence and any
  status already obtained. No exception text from the diagnostic failure is logged.
  Initialization failures use fail-closed redaction; if UUID creation fails,
  `request_id` is null. Failures writing these new records are swallowed;
  no logging code can guarantee delivery when the log transport itself is unavailable.

Example failure (illustrative):

```json
{
  "event": "failure",
  "request_id": "a-per-request-uuid",
  "execution_id": "123",
  "node": "Get Choferes",
  "item_index": 0,
  "method": "GET",
  "origin": "https://centum.example:23990",
  "phase": "request",
  "duration_ms": 5014,
  "response_received": false,
  "http_status": null,
  "response_headers": {},
  "error": {
    "name": "TypeError",
    "message": "fetch failed",
    "cause": { "code": "EAI_AGAIN", "syscall": "getaddrinfo" }
  }
}
```

The new diagnostics omit request headers, URL paths/query/userinfo and all request
and response bodies. Known request credentials and query values are redacted from
transport messages. Existing node outputs, error messages, continue-on-fail
behavior and requests are unchanged; diagnostics do not add an `error_details`
output field or a database record.

### Existing debug options (unchanged)

- **Enable Debug Logging** and **Debug Endpoint Contains** still gate the original
  `[Centum debug]` request, response and error-request-body logs.
- **Include Request Body** still controls body inclusion in the normal request
  debug record. Response debug records still contain the complete text body,
  regardless of that option. Request headers retain their original redaction.
- As before, a non-success HTTP response logs the request body when debug is
  enabled and the endpoint matches, even if **Include Request Body** is off
  (`apiRequest` when a body is defined, and both POST helpers).
- Binary `apiRequest` responses retain their original behavior: no response-body
  debug dump; HTTP failures still log a defined request body under the same gate.
- The original `API request failed` error/metadata log and legacy logger behavior
  are preserved. The new observer does not sanitize or suppress legacy records.

Legacy debug logs can contain complete URLs and business data. Their verbosity
and conditions have not changed; the new structured-log redaction guarantees do
not apply to them.

Standalone image downloads, credential tests and dropdown requests are not
instrumented by this patch. This change improves future evidence; it neither fixes
DNS availability nor reconstructs causes missing from historical logs.

### Offline regression checks

The tests mock `fetch`; they require no Centum credentials or live service. To use
the existing build image with current source and tests mounted read-only:

```bash
docker compose run --rm --no-deps \
  -v "$PWD/nodes:/app/nodes:ro" -v "$PWD/tests:/app/tests:ro" \
  build sh -lc 'rm -rf dist/* && pnpm exec tsc --incremental false && pnpm exec gulp build:icons && node --test tests/http-diagnostics.test.cjs'
```

This validates a local build only. Publishing and installing a new node version on
the main n8n service and its workers are separate, explicitly approved operations.

## Support

For issues or questions:

- Open an **issue** in the [GitHub repository](https://github.com/gauchocode/n8n-nodes-centum).
- Contact your Centum provider for API-related support.
- Check the [n8n documentation](https://docs.n8n.io/) for help with workflow integration.

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.
