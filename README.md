# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is a custom node for [n8n](https://n8n.io/), an open-source workflow automation platform, designed to integrate with the **Centum API**, a system for managing customers, charges, and other business resources. The `Centum` node simplifies interaction with Centum's API endpoints, enabling operations such as searching for customers, creating charges, and more, directly within your n8n workflows.

The node is built to be extensible, allowing for easy addition of new operations to meet specific integration needs with Centum.

## Features

The `Centum` node supports the following operations:

- **Search Customers (`searchCustomer`)**: Search for customers in Centum using parameters like `email`, `Code`, or `Business Name`. Returns customer data if a single match is found.
- **Create Charges (`charge`)**: Create a new charge in Centum by sending customer details, articles, and shipping information.
- **Extensibility**: The node is designed to support additional operations (e.g., managing articles, activities, or inventory) as needed.

This node uses authenticated requests to the Centum API, ensuring secure and efficient integration with your Centum system.

## Prerequisites

To use this node, ensure you have the following installed on your development machine:

- **n8n**: Version 1.75.2 or higher (latest version recommended for compatibility).
- **Node.js**: Version 18.x or higher.
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
