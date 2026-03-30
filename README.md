# n8n-nodes-centum

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

## Available Operations

**69 operations organized into 10 resources:**

### Articles (`articulos`)

- `buscarProductos`: Search articles by name and return every match.
- `buscarProductoPorCodigo`: Get a specific article by its unique ID.
- `listarProductosDisponibles`: List sellable articles using filters.
- `descargarImagenesProductos`: Download the binary image for an article.
- `listarTodosLosProductos`: List article general data.
- `consultarPrecioProducto`: Get the price of an article for a selected price list.
- `listarProductosPorSucursal`: List article stock for a physical branch.
- `buscarProductoEnSucursal`: Get stock for a specific article in a physical branch.
- `listarBonificaciones`: List available discounts.
- `listarCategorias`: List article categories.
- `listarMarcas`: List article brands.
- `listarPrecios`: List suggested product prices.
- `listarRubros`: List article groups.
- `listarSubRubros`: List subgroups or filter them by ID.

### Customers (`clientes`)

- `actualizarCliente`: Update a customer and return the updated resource information.
- `buscarClientes`: Search customers using filters.
- `buscarClientePorCuit`: Search customers by CUIT.
- `listarClientes`: List all registered customers.
- `crearCliente`: Create a new customer.
- `verDetalleSaldoCliente`: Get the detailed account balance composition for a customer.
- `listarFacturasCobros`: Get all payment invoices for a customer.
- `listarFacturasVenta`: Get all sales invoices for a customer.
- `listarFacturasVentasPorID`: Get sales invoices for a customer by ID.
- `listarPromocionesComercialesCliente`: Get commercial promotions applied to a customer from a selected date.
- `consultarSaldoCliente`: Get the current customer balance.
- `buscarContribuyente`: Search taxpayer data by CUIT or business name.
- `crearContribuyente`: Create a new taxpayer customer.
- `frecuenciasCliente`: List customer frequency options.

### Sales (`ventas`)

- `listarComprobantesVenta`: List sales vouchers using filters.
- `estadisticaVentaRanking`: Get sales rankings for customers, articles, sellers, or branches.
- `verDetallePedidoVenta`: Get a sales order by its unique ID.
- `crearPedidoVenta`: Create a sales order for selected articles.
- `listarEstadosPedidosVenta`: List available sales order statuses.
- `listarPedidosVenta`: List sales orders using filters.
- `listarPedidosVentaFiltrados`: List sales orders with a lighter response body.
- `listarPromociones`: List available commercial promotions.
- `crearVenta`: Generate a sale from the provided parameters.

### Payments (`cobros`)

- `registrarCobro`: Register a payment voucher.
- `listarCobros`: List payments using filters.

### Purchases (`compras`)

- `crearCompra`: Generate a purchase.
- `listarCompras`: List purchases using filters.
- `listarComprobantesCompra`: List purchase vouchers using filters.
- `crearOrdenCompra`: Generate a purchase order.
- `verDetalleOrdenCompra`: Get a purchase order by ID.
- `listarOrdenesCompra`: List purchase orders using filters.
- `crearRemitoCompra`: Create a purchase delivery note.

### Suppliers (`proveedores`)

- `buscarProveedor`: Get supplier information by ID.
- `crearProveedor`: Create a supplier.
- `listarProveedores`: List all suppliers.

### Logistics (`logistica`)

- `listarChoferes`: List available drivers.
- `crearRemitoVenta`: Create a sales delivery note.
- `listarSucursales`: List physical branches.
- `listarTurnosEntrega`: List available delivery time slots.
- `listarVendedores`: List available sellers.

### Stock (`stock`)

- `consultarStock`: List article stock using filters.
- `crearMovimientoStock`: Create a stock movement adjustment.
- `listarUbicacionArticulos`: List article locations.

### Geography (`geografia`)

- `listarMunicipios`: List municipalities, usually filtered by province.
- `listarPaises`: List available countries.
- `listarProvincias`: List provinces, usually filtered by country.

### Extras (`extras`)

- `generarTokenSeguridad`: Generate a token for external tools such as Postman.
- `listarConceptos`: List concepts.
- `listarOperadoresMoviles`: List mobile operators.
- `sincronizarImagenes`: Process binary image data for WooCommerce usage.
- `convertirProductosParaWooCommerce`: Generate WooCommerce-ready product JSON from Centum articles.
- `verDetalleRegimenEspecial`: Get a special tax regime by ID.
- `listarRegimenesEspeciales`: List special tax regimes.
- `listarTiposComprobante`: List voucher types.
- `verificarCredencialesOperador`: Get mobile operator data using the configured credentials.

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

Create a local `.env` file with your npm token:

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
