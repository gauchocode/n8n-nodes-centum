# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is a custom node for [n8n](https://n8n.io/), an open-source workflow automation platform, designed to integrate with the **Centum API**, a system for managing customers, charges, and other business resources. The `Centum` node simplifies interaction with Centum's API endpoints, enabling operations such as searching for customers, creating charges, and more, directly within your n8n workflows.

The node is built to be extensible, allowing for easy addition of new operations to meet specific integration needs with Centum.

## Available Operations

**28 endpoints organized in 5 categories:**

### 📦 Articles
- `articulo`: Filtered search (categories, dates, stock)
- `articuloPorId`: Query by ID/exact code
- `articulosExistencia`: Stock by physical branch
- `articulosImagenes`: Image download and processing
- `articulosPrecioPorLista`: Prices by price list
- `articulosSucursalesFisicas`: Articles by physical branch
- `articuloSucursalFisica`: Specific article by branch

### 👤 Customers
- `clienteNuevo`: Creation from WooCommerce (automatic mapping)
- `nuevoContribuyente`: Taxpayer registration with CUIT
- `composicionSaldoCliente`: Detailed account statement
- `obtenerSaldoCliente`: Current balance query
- `clientes`: Paginated customer list
- `clientesActualizar`: Customer data update
- `clientesBusqueda`: Search by email/DNI
- `clientesBusquedaPorCuit`: Search by CUIT

### 📦 Orders and Payments
- `cobros`: Payment registration
- `crearPedidoVenta`: Sales order creation
- `obtenerFacturasCobros`: Payment history
- `obtenerFacturasPedidosVentas`: Sales order history
- `pedidoVentaActividad`: Order activity tracking

### 🌍 Catalogs
- `provinciasLista`: Argentine provinces list
- `departamentosLista`: Departments by province
- `sucursalesFisicas`: Available physical branches
- `listaPrecios`: Price lists
- `promocionesCliente`: Customer promotions

### ⚙️ Utilities
- `generarProductosWoo`: WooCommerce format transformation
- `procesarImagenes`: Smart image synchronization
- `generarToken`: Authentication token generation
- `buscarContribuyente`: Taxpayer search

## Prerequisites

To use this node, ensure you have the following installed on your development machine:

- **n8n**: Version 1.75.2 or higher (latest version recommended for compatibility).
- **Node.js**: Version 20.x or higher.
- **npm**: Required for installing and building the plugin.
- **Git**: For cloning the repository.
- **Centum API Access**: Valid credentials (`centumUrl`, `consumerApiPublicId`, `publicAccessKey`) provided by your Centum provider.

Recommended: Follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1.  [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2.  git clone https://github.com//.git
3.  Run npm i to install dependencies.
4.  Open the project in your editor.
5.  Browse the examples in /nodes and /credentials. Modify the examples, or replace them with your own nodes.
6.  Update the package.json to match your details.
7.  Run npm run lint to check for errors or npm run lintfix to automatically fix errors when possible.
8.  Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9.  Replace this README with documentation for your node. Use the [README\_TEMPLATE](/broobe/n8n/n8n-nodes-blocky-nodes/-/blob/main/README_TEMPLATE.md) to get started.
10.  Update the LICENSE file to use your details.
11.  [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## Support

For issues or questions:
- Open an **issue** on the [GitHub repository](https://github.com/your-username/n8n-nodes-centum).
- Contact your Centum provider for API-related support.
- Refer to the [n8n documentation](https://docs.n8n.io/) for help with workflow integration.

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.
