# n8n-nodes-centum

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

Este es un nodo personalizado para [n8n](https://n8n.io/), una plataforma de automatización de flujos de trabajo de código abierto, diseñado para integrarse con la **API de Centum**, un sistema para gestionar clientes, cobros y otros recursos empresariales. El nodo `Centum` simplifica la interacción con los endpoints de la API de Centum, permitiendo operaciones como buscar clientes, crear cobros y más, directamente dentro de sus flujos de trabajo en n8n.

El nodo está construido para ser extensible, permitiendo la fácil adición de nuevas operaciones para satisfacer necesidades específicas de integración con Centum.

## Requiere 3 parametros en la credencial **Centum API**:

| Campo                             | Typo       | Ejemplo                                                     | Requerido |
|-----------------------------------|------------|-------------------------------------------------------------|-----------|
| Public Access Key                 | Password   | a1b2c3d4e5f6g7h8i9j0...                                     | Yes       |
| CentumSuiteConsumidorApiPublicaId | Number     | 12345                                                       | Yes       |
| Centum URL                        | Text (URL) | https://plataformaX.centum.com.ar:23990/BLX                 | Yes       |
|-----------------------------------|------------|-------------------------------------------------------------|-----------|



## Operaciones Disponibles

**42 endpoints organizados en 5 categorías:**

### 📦 Artículos
- `articulo`: Buscar artículos filtrados (categorías, fechas, stock)
- `articuloPorId`: Consulta por ID o código exacto
- `articulosDatosGenerales`: Datos generales de artículos
- `articulosExistencia`: Existencias por sucursal física
- `articulosImagenes`: Descarga y procesamiento de imágenes
- `articulosPrecioPorLista`: Precios por lista de precios
- `articulosSucursalesFisicas`: Artículos agrupados por sucursal física
- `articuloSucursalFisica`: Artículo específico en sucursal
- `categoriasObtener`: Listado de categorías
- `marcasObtener`: Listado de marcas
- `rubrosObtener`: Listado de rubros

### 👤 Clientes
- `clienteNuevo`: Crear nuevo cliente
- `nuevoContribuyente`: Registrar contribuyente con CUIT
- `clientes`: Lista paginada de clientes
- `clientesActualizar`: Actualizar datos de cliente
- `clientesBusqueda`: Buscar cliente por email o DNI
- `clientesBusquedaPorCuit`: Buscar cliente por CUIT
- `buscarContribuyente`: Buscar contribuyente
- `composicionSaldoCliente`: Detalle del estado de cuenta
- `obtenerSaldoCliente`: Consulta de saldo actual

### 💳 Pedidos y Cobros
- `cobros`: Registrar cobro
- `obtenerCobros`: Filtrar cobros
- `obtenerFacturasCobros`: Historial de facturas asociadas a cobros
- `crearPedidoVenta`: Crear pedido de venta
- `obtenerPedidosDeVenta`: Listar pedidos de venta
- `obtenerFacturasPedidosVentas`: Historial de facturas de pedidos de venta
- `obtenerEstadosPedidosDeVenta`: Estados disponibles para pedidos de venta
- `pedidoVentaActividad`: Consultar actividad de pedido de venta
- `generarVentas`: Generar venta
- `generarCompras`: Generar compra
- `obtenerCompras`: Filtrar compras

### 🌍 Catálogos
- `provinciasLista`: Provincias argentinas
- `departamentosLista`: Departamentos por provincia
- `sucursalesFisicas`: Sucursales físicas
- `listaPrecios`: Listas de precios disponibles
- `promocionesCliente`: Promociones comerciales aplicables
- `regimenesEspecialesLista`: Regímenes especiales
- `regimenesEspecialesPorId`: Régimen especial por ID
- `tipoComprobante`: Tipos de comprobante

### ⚙️ Utilidades
- `generarProductosWoo`: Transformar datos al formato de WooCommerce
- `procesarImagenes`: Procesamiento y sincronización de imágenes
- `generarToken`: Generar token de autenticación
- `operadoresMoviles`: Consultar credenciales de operadores móviles

## Requisitos Previos

Para usar este nodo, asegúrese de tener instalado lo siguiente en su máquina de desarrollo:

- **n8n**: Versión 1.75.2 o superior (se recomienda la versión más reciente para compatibilidad).
- **Node.js**: Versión 20.x o superior.
- **npm**: Requerido para instalar y construir el plugin.
- **Git**: Para clonar el repositorio.
- **Acceso a la API de Centum**: Credenciales válidas (`centumUrl`, `consumerApiPublicId`, `publicAccessKey`) proporcionadas por su proveedor de Centum.

Recomendado: Siga la guía de n8n para [configurar su entorno de desarrollo](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Uso de este starter

Estos son los pasos básicos para trabajar con el starter. Para obtener una guía detallada sobre cómo crear y publicar nodos, consulte la [documentación](https://docs.n8n.io/integrations/creating-nodes/).

1.  [Genere un nuevo repositorio](https://github.com/n8n-io/n8n-nodes-starter/generate) a partir de este repositorio plantilla.
2.  git clone https://github.com//.git
3.  Ejecute npm i para instalar las dependencias.
4.  Abra el proyecto en su editor.
5.  Explore los ejemplos en /nodes y /credentials. Modifique los ejemplos o reemplácelos con sus propios nodos.
6.  Actualice el package.json con sus datos.
7.  Ejecute npm run lint para verificar errores o npm run lintfix para corregir errores automáticamente cuando sea posible.
8.  Pruebe su nodo localmente. Consulte [Ejecutar su nodo localmente](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) para obtener orientación.
9.  Reemplace este README con la documentación de su nodo. Use la [PLANTILLA README](/broobe/n8n/n8n-nodes-blocky-nodes/-/blob/main/README_TEMPLATE.md) para comenzar.
10.  Actualice el archivo LICENSE con sus datos.
11.  [Publique](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) su paquete en npm.

## Soporte

Para problemas o preguntas:
- Abra un **issue** en el [repositorio de GitHub](https://github.com/your-username/n8n-nodes-centum).
- Contacte a su proveedor de Centum para soporte relacionado con la API.
- Consulte la [documentación de n8n](https://docs.n8n.io/) para obtener ayuda con la integración de flujos de trabajo.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE). Consulte el archivo `LICENSE` para obtener detalles.
