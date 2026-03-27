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

**55 endpoints organized into 5 categories:**

### 📦 Articles

- `articulo`: Search articles with filters (categories, dates, stock)
- `articuloPorId`: Query by exact ID or code
- `articuloPorNombre`: Query by article name
- `articulosDatosGenerales`: Retrieve general article data
- `articulosExistencia`: Stock availability by branch
- `articulosImagenes`: Download and process article images
- `articulosPrecioPorLista`: Prices by price list
- `articulosSucursalesFisicas`: Articles grouped by branch
- `articuloSucursalFisica`: Specific article in branch
- `buscarArticulo`: Search article by name or code
- `categoriasObtener`: List categories
- `marcasObtener`: List brands
- `rubrosObtener`: List product groups

### 👤 Customers

- `clienteNuevo`: Create a new customer
- `nuevoContribuyente`: Register a taxpayer with CUIT
- `clientes`: Paginated customer list
- `clientesActualizar`: Update customer data
- `clientesBusqueda`: Search by email or DNI
- `clientesBusquedaPorCuit`: Search by CUIT
- `buscarContribuyente`: Search taxpayer
- `composicionSaldoCliente`: Detailed account status
- `obtenerSaldoCliente`: Current account balance

### 💳 Orders and Payments

- `cobros`: Register a payment
- `obtenerCobros`: Filter payments
- `obtenerFacturasCobros`: Payment invoice history
- `crearPedidoVenta`: Create a sales order
- `obtenerPedidosDeVenta`: List sales orders
- `obtenerFacturasPedidosVentas`: Sales order invoice history
- `obtenerFacturasPedidosVentasPorID`: Sales order invoice history by ID
- `obtenerEstadosPedidosDeVenta`: Available sales order statuses
- `pedidoVentaActividad`: Check sales order activity
- `generarVentas`: Generate a sale
- `generarCompras`: Generate a purchase
- `obtenerCompras`: Filter purchases
- `generarOrdenCompra`: Generate a purchase order
- `obtenerOrdenCompra`: Get purchase order by ID
- `obtenerOrdenesCompras`: Filter purchase orders
- `obtenerBonificaciones`: Get available discounts

### 🌍 Catalogs

- `provinciasLista`: List of provinces (Argentina)
- `departamentosLista`: Departments by province
- `sucursalesFisicas`: Physical branches
- `listaPrecios`: Available price lists
- `promocionesCliente`: Commercial promotions for customers
- `regimenesEspecialesLista`: Special tax regimes
- `regimenesEspecialesPorId`: Special regime by ID
- `tipoComprobante`: Voucher types
- `obtenerTurnoEntrega`: Get delivery time slots
- `obtenerVendedores`: Get sales representatives

### ⚙️ Utilities

- `generarProductosWoo`: Transform data to WooCommerce format
- `procesarImagenes`: Image processing and synchronization
- `generarToken`: Authentication token generation
- `operadoresMoviles`: Retrieve mobile operator data based on credentials
- `proveedorBuscar`: Search supplier by ID
- `proveedorCrear`: Create a new supplier

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
