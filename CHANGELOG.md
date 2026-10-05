## [Unreleased]

- No unreleased changes yet.

## [1.0.24] - 2026-10-05

### Fixed

- fix(transfers): reference the article in transfer order items via `IdItem`, per the API's `OrdenTraspasoItem_Models` schema (`idItem` + `cantidad`). Both the original flat `IdArticulo` and the nested `Articulo.IdArticulo` shape (1.0.23) were silently discarded by the binder and failed with `OrdenTraspasoItemNoValidoException` ("Debe haber al menos un artículo asignado").

## [1.0.22] - 2026-08-12

- fix(credentials): normalize Centum base URL

## [1.0.21] - 2026-07-31

- fix(node): correct Centum codex identifier
- fix(ventas): preserve sales voucher dates
- fix(credentials): authenticate credential validation

## [1.0.20] - 2026-07-27

- fix(ventas): send credit note reference

## [1.0.19] - 2026-07-22

- fix(suppliers): use lowercase cuit query parameter

## [1.0.18] - 2026-07-08

- fix(cobros): return payment items at root

## [1.0.17] - 2026-07-08

- style(description): fix cobros option casing
- feat(cobros): support paged payment output
- fix(cobros): paginate filtered payments

## [1.0.16] - 2026-07-06

- fix(ventas): support manual and customer bonificacion on create

## [1.0.15] - 2026-06-30

- feat(purchases): improve purchase order pricing and discounts
- style(description): normalize displayName casing to PascalCase

## [1.0.14] - 2026-06-26

- chore(gitignore): ignore opencode config
- fix(helper): expose Centum API error messages
- fix(customers): align cuenta corriente params with Centum API

## [1.0.13] - 2026-06-24

- feat(logistics): add choferes and branch sections resources

## [1.0.12] - 2026-06-23

- feat(node): add division filters and quality analysis fields

## [1.0.11] - 2026-06-19

- fix(description): fix lint errors for displayName casing and dynamic options
- feat(description): align displayName fields with Centum API naming and remove hidden fields

## [1.0.10] - 2026-06-12

- feat(stock): add GetOne/Get operations and improve Create for Ajustes Movimientos Stock

## [1.0.9] - 2026-06-12

- fix(remitos): allow decimal quantities in remitosCompra and remitosVenta
- fix(remitos): make deliveryDate and dueDate optional for remitosCompra and remitosVenta
- fix(remitosVenta): add missing articleIds field for Create operation

## [1.0.8] - 2026-06-12

- feat(transfers): add HoraDocumento support for ordenes traspaso

## [1.0.7] - 2026-06-11

- feat(description): add HoraDocumento input for remitos compra/venta

## [1.0.6] - 2026-06-11

- feat(logistics): add HoraDocumento support for remitos compra/venta

## [1.0.5] - 2026-06-11

- feat(logistics): standardize article inputs, add transport/division support and listTransports handler
- feat(remitos): support branch section on create
- fix(ventas): stop requesting discountId on create

## [1.0.4] - 2026-06-02

- fix(node): correct string default for article ids

## [1.0.3] - 2026-06-02

- refactor(node): standardize article inputs for create operations

## [1.0.2] - 2026-05-29

- fix(remitos): allow notes on sales delivery note creation

## [1.0.1] - 2026-05-27

- fix(node): align dynamic division selector labels
- feat(node): add business group divisions support

## [1.0.0] - 2026-05-27

- fix(node): align Centum ERP node filename and type
- feat(node): rename Centum v2 node display and type
- feat(ventas): expose consulta filters in node description

## [0.1.19] - 2026-05-21

- feat(debug): allow logging request body
- fix(purchases): fallback to Centum price for invalid order prices

## [0.1.18] - 2026-05-19

- fix(logistics): align transport requirements for delivery notes
- fix(purchases): use purchase prices and discounts for create flows

## [0.1.17] - 2026-05-14

- fix(pedidosVenta): use customerId directly in create flow

## [0.1.16] - 2026-05-14

- feat(purchases): add pending purchase order items lookup

## [0.1.15] - 2026-05-14

- refactor(payments): support configurable cobro modes
- refactor(purchases): resolve purchase order articles from DatosGenerales
- fix(logistics): require purchase operator for remitos compra
- refactor(payments): rebuild cobros payload from explicit fields

## [0.1.14] - 2026-05-08

- fix(node): adjust field visibility for create operations
- fix(sales): send discount percentage from bonificaciones
- fix(logistics): populate RemitosCompra article fields from article ID

## [0.1.13] - 2026-05-06

- fix(node): sort transportes resource option
- feat(node): add transportes resource and remitos venta transport support

## [0.1.12] - 2026-05-05

- fix(ventas): calculate cash sale amount automatically

## [0.1.11] - 2026-05-05

- fix(node): sort condiciones venta resource option
- feat(node): add condiciones venta resource and fix articulos GetOne lookup

## [0.1.10] - 2026-05-05

- fix(node): align venta article handling with pedidosVenta

## [0.1.9] - 2026-05-04

- fix(node): remove purchaseId in Compras get

## [0.1.8] - 2026-05-04

- fix(node): show businessName in proveedores Get and remove hardcoded Ventas query params

## [0.1.7] - 2026-05-03

- fix(node): handle missing optional sales query filters

## [0.1.6] - 2026-04-30

- fix(node): use seller id for sales order query

## [0.1.5] - 2026-04-30

- fix(node): tighten purchase order filters and delivery note defaults
- feat(clientes): remove hardcoded create customer relations
- fix(clientes): replace update json body with minimal form

## [0.1.4] - 2026-04-30

- chore(repo): remove spanish CSV
- fix(node): update customer and sales parameter handling
- feat(node): add compras GetOne and align resource operations

## [0.1.3] - 2026-04-17

- fix(node): align Get handlers and UI fields with detail endpoints
- refactor(node): remove duplicate handlers and mappings
- fix(clientes): use GET /Clientes/{id} when customerId is provided
- refactor(node): merge duplicate endpoints and scope displayOptions by resource
- refactor(node): align operation names with Operation New
- Merged endpoints
- fix change on description text and updated readme.md

## [0.1.2] - 2026-04-17

- add single-article input for delivery notes and refine node labels

## [0.1.1] - 2026-04-16

- Fix centum node with n8n rules
- feat(node): localize visible resource and operation labels
- Fixes
- chore(repo): add publish automation and package scanning
- docs(repo): refresh docs, changelog, and node metadata
- refactor(node): update Centum node wiring for renamed modules
- refactor(node): translate Centum resource and interface modules to English
- skill n8n-community-node updated
- refactor(node): rename package metadata and normalize labels
- fix(node): align consultarPrecioProducto payload and docs
- Added simplified option output + node fixes
- Full node refactor
- refactor(node): estabiliza ejecucion y agrega debug options
- Refactor del nodo entero
- Cambios previo al refactor
- Changes in the create client endpoint, list all items and minor fixes
- chore: add Claude Code skills for n8n node and API review
- chore: add Docker build and publish infrastructure
- docs: add AGENTS.md project guide and CLAUDE.md symlink
- chore: fix author name and broaden gitignore pattern for settings.local
- Added files
