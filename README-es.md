# Nodo Centum para n8n

![Logo Centum](nodes/Centum/centum.svg)

Este nodo te da acceso directo a la API de Centum sin necesidad de librerías extra: buscá clientes por criterios, creá nuevos registros y automatizá tu gestión de usuarios en un par de clics. Diseñado bajo las guidelines oficiales de n8n, cumple con no tener dependencias externas y se instala en un segundo. Ideal para mantener tus flujos limpios y eficientes.

## Instalación

**Método correcto para nodos comunitarios de n8n:**

1. En tu instancia de n8n, ve a **Settings > Community Nodes**
2. Haz clic en **"Install Node"** 
3. Coloca `n8n-nodes-centum`
4. Confirma la instalación

## Configuración de credenciales

Requiere 3 parámetros en la credencial **Centum API**:

| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|-------------|
| Public Access Key | Contraseña | `a1b2c3d4...` | Sí |
| CentumSuiteConsumidorApiPublicaId | Número | `12345` | Sí |
| Centum URL | Texto | `https://plataformaX.centum.com.ar:23990/BLX` | Sí |

## Operaciones disponibles

**28 endpoints organizados en 5 categorías:**

### 📦 Artículos

- `articulo`: Búsqueda con filtros (rubros, fechas, existencias)
- `articuloPorId`: Consulta por ID/código exacto
- `articulosImagenes`: Descarga y procesamiento de imágenes
- `articulosPrecioPorLista`: Precios según lista de precios
- `articulosSucursalesFisicas`: Consulta de artículos por sucursal física
- `articuloSucursalFisica`: Consulta de artículo específico por sucursal

### 👤 Clientes

- `clienteNuevo`: Creación desde WooCommerce (mapeo automático)
- `nuevoContribuyente`: Alta de contribuyentes con CUIT
- `composicionSaldoCliente`: Estado de cuenta detallado
- `obtenerSaldoCliente`: Consulta de saldo actual
- `clientes`: Listado de clientes con paginación
- `clientesActualizar`: Actualización de datos de clientes
- `clientesBusqueda`: Búsqueda por email/DNI
- `clientesBusquedaPorCuit`: Búsqueda por CUIT

### 📦 Pedidos y Cobros

- `crearPedidoVenta`: Generación de pedidos de venta
- `cobros`: Registro de cobros y pagos
- `obtenerFacturasCobros`: Historial de facturas y cobros
- `obtenerFacturasPedidosVentas`: Historial de pedidos de venta
- `pedidoVentaActividad`: Consulta de actividad de pedidos

### 🌍 Catálogos

- `provinciasLista`: Listado de provincias argentinas
- `departamentosLista`: Departamentos por provincia
- `sucursalesFisicas`: Sucursales disponibles
- `listaPrecios`: Listado de precios
- `promocionesCliente`: Promociones para clientes

### ⚙️ Utilidades

- `generarProductosWoo`: Transformación a formato WooCommerce
- `procesarImagenes`: Sincronización inteligente de imágenes
- `generarToken`: Generación de token de autenticación
- `buscarContribuyente`: Búsqueda de contribuyentes

## Notas técnicas importantes

- **Paginación:** Soporta 3 modos (default/custom/all) en operaciones masivas
- **Mapeo de provincias:** Incluye conversión automática WooCommerce → Centum
- **Manejo de errores:** Todos los endpoints incluyen validación de status HTTP
- **Documentación API:** Disponible en [http://www.centum.com.ar/ApiPublica.pdf](http://www.centum.com.ar/ApiPublica.pdf)

## Contribuir

Si deseas contribuir a este proyecto, por favor revisa nuestro [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) y [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

Este proyecto está licenciado bajo MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
