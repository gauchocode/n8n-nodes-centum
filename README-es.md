# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

Este es un nodo personalizado para [n8n](https://n8n.io/), una plataforma de automatización de flujos de trabajo de código abierto, diseñado para integrarse con la **API de Centum**, un sistema para gestionar clientes, cobros y otros recursos empresariales. El nodo `Centum` simplifica la interacción con los endpoints de la API de Centum, permitiendo operaciones como buscar clientes, crear cobros y más, directamente dentro de sus flujos de trabajo en n8n.

El nodo está construido para ser extensible, permitiendo la fácil adición de nuevas operaciones para satisfacer necesidades específicas de integración con Centum.

## Requiere 3 parametros en la credencial **Centum API**:

| Campo                               | Typo         | Ejemplo                                                       | Requerido   |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ----------- |
| Public Access Key                   | Password     | a1b2c3d4e5f6g7h8i9j0...                                       | Yes         |
| CentumSuiteConsumidorApiPublicaId   | Number       | 12345                                                         | Yes         |
| Centum URL                          | Text (URL)   | https://plataformaX.centum.com.ar:23990/BLX                   | Yes         |
| ----------------------------------- | ------------ | ------------------------------------------------------------- | ----------- |

## Operaciones Disponibles

**69 operaciones organizadas en 10 recursos:**

### Articulos (`articulos`)

- `buscarProductos`: Busca artículos por nombre y devuelve todas las coincidencias.
- `buscarProductoPorCodigo`: Obtiene un artículo específico por su ID único.
- `listarProductosDisponibles`: Lista artículos para vender usando filtros.
- `descargarImagenesProductos`: Descarga la imagen binaria de un artículo.
- `listarTodosLosProductos`: Lista los datos generales de los artículos.
- `consultarPrecioProducto`: Obtiene el precio de un artículo según una lista de precios seleccionada.
- `listarProductosPorSucursal`: Lista el stock de artículos en una sucursal física.
- `buscarProductoEnSucursal`: Obtiene el stock de un artículo específico en una sucursal física.
- `listarBonificaciones`: Lista las bonificaciones disponibles.
- `listarCategorias`: Lista las categorías de artículos.
- `listarMarcas`: Lista las marcas de artículos.
- `listarPrecios`: Lista los precios sugeridos de productos.
- `listarRubros`: Lista los rubros de artículos.
- `listarSubRubros`: Lista los subrubros o los filtra por ID.

### Clientes (`clientes`)

- `actualizarCliente`: Actualiza un cliente y devuelve la información actualizada del recurso.
- `buscarClientes`: Busca clientes usando filtros.
- `buscarClientePorCuit`: Busca clientes por CUIT.
- `listarClientes`: Lista todos los clientes registrados.
- `crearCliente`: Crea un cliente nuevo.
- `verDetalleSaldoCliente`: Obtiene la composición detallada del saldo de cuenta corriente de un cliente.
- `listarFacturasCobros`: Obtiene todas las facturas de cobros de un cliente.
- `listarFacturasVenta`: Obtiene todas las facturas de venta de un cliente.
- `listarFacturasVentasPorID`: Obtiene las facturas de venta de un cliente por ID.
- `listarPromocionesComercialesCliente`: Obtiene las promociones comerciales aplicadas a un cliente desde una fecha seleccionada.
- `consultarSaldoCliente`: Obtiene el saldo actual del cliente.
- `buscarContribuyente`: Busca datos de un contribuyente por CUIT o razón social.
- `crearContribuyente`: Crea un cliente contribuyente nuevo.
- `frecuenciasCliente`: Lista las frecuencias de clientes.

### Ventas (`ventas`)

- `listarComprobantesVenta`: Lista comprobantes de venta usando filtros.
- `estadisticaVentaRanking`: Obtiene rankings de venta por clientes, artículos, vendedores o sucursales.
- `verDetallePedidoVenta`: Obtiene un pedido de venta por su ID único.
- `crearPedidoVenta`: Crea un pedido de venta para los artículos seleccionados.
- `listarEstadosPedidosVenta`: Lista los estados disponibles de pedidos de venta.
- `listarPedidosVenta`: Lista pedidos de venta usando filtros.
- `listarPedidosVentaFiltrados`: Lista pedidos de venta con un cuerpo de respuesta más liviano.
- `listarPromociones`: Lista las promociones comerciales disponibles.
- `crearVenta`: Genera una venta con los parámetros enviados.

### Cobros (`cobros`)

- `registrarCobro`: Registra un comprobante de cobro.
- `listarCobros`: Lista cobros usando filtros.

### Compras (`compras`)

- `crearCompra`: Genera una compra.
- `listarCompras`: Lista compras usando filtros.
- `listarComprobantesCompra`: Lista comprobantes de compra usando filtros.
- `crearOrdenCompra`: Genera una orden de compra.
- `verDetalleOrdenCompra`: Obtiene una orden de compra por ID.
- `listarOrdenesCompra`: Lista órdenes de compra usando filtros.
- `crearRemitoCompra`: Crea un remito de compra.

### Proveedores (`proveedores`)

- `buscarProveedor`: Obtiene la información de un proveedor por ID.
- `crearProveedor`: Crea un proveedor.
- `listarProveedores`: Lista todos los proveedores.

### Logistica (`logistica`)

- `listarChoferes`: Lista los choferes disponibles.
- `crearRemitoVenta`: Crea un remito de venta.
- `listarSucursales`: Lista las sucursales físicas.
- `listarTurnosEntrega`: Lista los turnos de entrega disponibles.
- `listarVendedores`: Lista los vendedores disponibles.

### Stock (`stock`)

- `consultarStock`: Lista existencias de artículos usando filtros.
- `crearMovimientoStock`: Crea un ajuste de movimiento de stock.
- `listarUbicacionArticulos`: Lista las ubicaciones de artículos.

### Geografia (`geografia`)

- `listarMunicipios`: Lista municipios, normalmente filtrados por provincia.
- `listarPaises`: Lista los países disponibles.
- `listarProvincias`: Lista provincias, normalmente filtradas por país.

### Extras (`extras`)

- `generarTokenSeguridad`: Genera un token para herramientas externas como Postman.
- `listarConceptos`: Lista conceptos.
- `listarOperadoresMoviles`: Lista operadores móviles.
- `sincronizarImagenes`: Procesa datos binarios de imágenes para uso en WooCommerce.
- `convertirProductosParaWooCommerce`: Genera JSON de productos para WooCommerce a partir de artículos de Centum.
- `verDetalleRegimenEspecial`: Obtiene un régimen especial por ID.
- `listarRegimenesEspeciales`: Lista regímenes especiales.
- `listarTiposComprobante`: Lista tipos de comprobante.
- `verificarCredencialesOperador`: Obtiene datos de un operador móvil usando las credenciales configuradas.

## Requisitos Previos

Para usar o desarrollar este nodo necesita:

- **n8n** 1.75.2 o superior.
- **Node.js** 20.x o superior.
- **Docker** y **Docker Compose** para compilar localmente este repositorio.
- **Acceso a la API de Centum** con credenciales válidas: `centumUrl`, `consumerApiPublicId` y `publicAccessKey`.

## Desarrollo

Este repositorio usa un flujo de build basado en Docker.

### Compilar

```bash
rm -rf dist
docker compose run build
```

### Publicar

Cree un archivo local `.env` con su token de npm:

```bash
NPM_TOKEN=npm_your_token_here
```

Luego publique con Docker:

```bash
rm -rf dist
docker compose build --no-cache
docker compose run publish
```

### Probar en n8n

1. Compile el paquete con Docker.
2. Enlace o copie el paquete en el directorio de nodos comunitarios/custom de n8n.
3. Reinicie n8n.
4. Agregue el nodo `Centum` a un workflow y pruebe con credenciales válidas.

## Soporte

Para problemas o preguntas:

- Abra un **issue** en el [repositorio de GitHub](https://github.com/gauchocode/n8n-nodes-centum).
- Contacte a su proveedor de Centum para soporte relacionado con la API.
- Consulte la [documentación de n8n](https://docs.n8n.io/) para obtener ayuda con la integración de flujos de trabajo.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE). Consulte el archivo `LICENSE` para obtener detalles.
