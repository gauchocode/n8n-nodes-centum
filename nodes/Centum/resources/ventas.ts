import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const crearPedidoVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					type ArticuloInput = {
						ID?: number;
						Codigo?: string;
						Cantidad: number;
					};
					const razonSocial = executeFunctions.getNodeParameter("razonSocial", 0) as string;
					const articulosRaw = executeFunctions.getNodeParameter("articulo", 0);
					const codigoCliente = executeFunctions.getNodeParameter("codigoCliente", 0) as string;
					const fechaDocumento = executeFunctions.getNodeParameter("documentDate", 0) as string;
					const formattedDocumentDate = String(fechaDocumento).split("T")[0];
					const bonificacion = executeFunctions.getNodeParameter("idBonificacion", 0);
					const turnoEntrega = executeFunctions.getNodeParameter("turnoEntrega", 0);
					const fechaEntrega = executeFunctions.getNodeParameter("deliveryDate", 0);
					const vendedor = executeFunctions.getNodeParameter("vendedorID", 0);
	
					let articulos: ArticuloInput[];
	
					if (typeof articulosRaw === "string") {
						try {
							const parsed = JSON.parse(articulosRaw);
	
							if (typeof parsed === "object" && !Array.isArray(parsed)) {
								articulos = [parsed] as ArticuloInput[];
							} else if (Array.isArray(parsed)) {
								articulos = parsed as ArticuloInput[];
							} else {
								throw new NodeOperationError(executeFunctions.getNode(), "Formato Inválido");
							}
						} catch (error) {
							throw new NodeOperationError(
								executeFunctions.getNode(),
								'El formato de artículos no es válido. Ejemplos válidos: {"ID": 1271, "Cantidad": 10} o {"Codigo": "ABC123", "Cantidad": 10} o arrays de estos objetos',
							);
						}
					} else if (Array.isArray(articulosRaw)) {
						articulos = articulosRaw as ArticuloInput[];
					} else if (typeof articulosRaw === "object" && articulosRaw !== null) {
						articulos = [articulosRaw as ArticuloInput];
					} else {
						throw new NodeOperationError(executeFunctions.getNode(), `Tipo de dato inesperado: ${typeof articulosRaw}`);
					}
	
					let clientId, queryParams;
	
					if (!razonSocial.trim() && !codigoCliente.trim()) {
						throw new NodeOperationError(executeFunctions.getNode(), "El código o la razón social del cliente es obligatorio.");
					}
	
					if (!Array.isArray(articulos) || articulos.length === 0) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debes enviar al menos un artículo con su cantidad.");
					}
	
					// Validar que cada artículo tenga ID o Codigo
					for (const art of articulos) {
						if (!art.ID && !art.Codigo) {
							throw new NodeOperationError(executeFunctions.getNode(), "Cada artículo debe tener al menos un ID o un Codigo");
						}
					}
	
					if (codigoCliente) queryParams = `codigo=${codigoCliente}`;
					if (razonSocial) queryParams = `razonSocial=${razonSocial}`;
	
					/* 1st Request to get Client ID */
					try {
						const dataCliente = await helperFns.apiRequest<any>(`${centumUrl}/Clientes?${queryParams}`, {
							method: "GET",
							headers,
						});
	
						const cliente = dataCliente?.Items?.[0];
						if (!cliente?.IdCliente) {
							throw new NodeOperationError(executeFunctions.getNode(), "El cliente no fue encontrado");
						}
						clientId = cliente.IdCliente;
					} catch (error) {
						console.log("Error creating sales order:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error al obtener el cliente.";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
	
					/* 2da Request to get articles data */
					const resultados: any[] = [];
	
					for (const articuloInput of articulos) {
						try {
							// Construir el body dinámicamente según si tiene ID o Codigo
							const bodyArticulo: any = {
								IdCliente: clientId,
								FechaDocumento: formattedDocumentDate,
							};
	
							// Usar Ids (plural) si tiene ID, o Codigo (singular) si tiene Codigo
							if (articuloInput.ID) {
								bodyArticulo.Ids = [articuloInput.ID];
							} else if (articuloInput.Codigo) {
								bodyArticulo.Codigo = articuloInput.Codigo;
							}
	
							const dataArticulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
								method: "POST",
								headers,
								body: bodyArticulo,
							});
	
							const items = dataArticulo?.Articulos?.Items ?? [];
							if (items.length > 0) {
								const itemsConCantidad = items.map((item: any) => ({
									...item,
									Cantidad: articuloInput.Cantidad,
								}));
	
								resultados.push(...itemsConCantidad);
							}
	
							const identificador = articuloInput.ID || articuloInput.Codigo;
							console.log(`✔ Artículo ${identificador} procesado correctamente`);
						} catch (error: any) {
							const identificador = articuloInput.ID || articuloInput.Codigo;
							console.log(`❌ Error consultando artículo ${identificador}:`, (error as any).message);
							resultados.push({
								id: articuloInput.ID,
								codigo: articuloInput.Codigo,
								error: (error as any).message || "Error desconocido",
							});
						}
					}
	
					const bodyPedidoVenta = {
						Bonificacion: {
							IdBonificacion: bonificacion,
						},
						PedidoVentaArticulos: resultados,
						any: {
							IdCliente: clientId,
						},
						Vendedor: {
							IdVendedor: vendedor,
						},
						TurnoEntrega: {
							IdTurnoEntrega: turnoEntrega,
						},
						FechaEntrega: fechaEntrega,
					};
	
					try {
						const pedidoVenta = await helperFns.apiRequest<any>(`${centumUrl}/PedidosVenta`, {
							method: "POST",
							headers,
							body: bodyPedidoVenta,
						});
						return [executeFunctions.helpers.returnJsonArray(pedidoVenta)];
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error al crear el pedido de venta.";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const verDetallePedidoVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const pedidoID = executeFunctions.getNodeParameter("id", 0);
					try {
						const dataActividad = await helperFns.apiRequest<any>(`${centumUrl}/PedidosVenta/${pedidoID}`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(dataActividad)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarEstadosPedidosVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/EstadosPedidoVenta?bIncluirTodosEstados=true`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log(error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				
};

const listarPedidosVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idCliente = executeFunctions.getNodeParameter("clienteId", 0) as string;
					const idPedidoDeVenta = executeFunctions.getNodeParameter("ventaId", 0);
					const idSucursal = executeFunctions.getNodeParameter("idSucursalFisica", 0);
					const incluirAnulados = executeFunctions.getNodeParameter("incluirAnulados", 0);
					const idUsuarioCreador = executeFunctions.getNodeParameter("usuarioCreadorId", 0);
					const idTransporte = executeFunctions.getNodeParameter("transporteId", 0);
					const idsEstado = executeFunctions.getNodeParameter("statusId", 0);
					const fechaDesde = executeFunctions.getNodeParameter("startDate", 0, "") as string;
					const fechaHasta = executeFunctions.getNodeParameter("endDate", 0, "") as string;
					const separarFechaDesde = String(fechaDesde).split("T")[0];
					const separarFechaHasta = String(fechaHasta).split("T")[0];
	
					if (!idCliente && !idsEstado && !separarFechaDesde && !separarFechaHasta) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
					}
	
					const body = {
						idCliente,
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						idsEstado,
						idPedidoDeVenta,
						idSucursal,
						incluirAnulados,
						idUsuarioCreador,
						idTransporte,
					};
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/PedidosVenta/FiltrosPedidoVenta`, {
							method: "POST",
							headers,
							body,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de facturas pedidos ventas:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo los pedidos ventas para cliente ${idCliente}: ${errorMessage}`);
					}
				
};

const listarPedidosVentaFiltrados: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idCliente = executeFunctions.getNodeParameter("clienteId", 0);
					const idsEstado = executeFunctions.getNodeParameter("statusId", 0);
					const fechaDesde = executeFunctions.getNodeParameter("startDate", 0, "") as string;
					const fechaHasta = executeFunctions.getNodeParameter("endDate", 0, "") as string;
					const separarFechaDesde = String(fechaDesde).split("T")[0];
					const separarFechaHasta = String(fechaHasta).split("T")[0];
					if (!idCliente && !idsEstado && !separarFechaDesde && !separarFechaHasta) {
						throw new NodeOperationError(executeFunctions.getNode(), "Debes ingresar almenos un parametro para realizar la búsqueda.");
					}
	
					const body = {
						idCliente,
						fechaDocumentoDesde: separarFechaDesde,
						fechaDocumentoHasta: separarFechaHasta,
						idsEstado,
					};
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/PedidosVenta/FiltrosPedidoVentaConsulta`, {
							method: "POST",
							headers,
							body,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de facturas pedidos ventas:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo los pedidos ventas para cliente ${idCliente}: ${errorMessage}`);
					}
				
};

const crearVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const numeroPuntoDeVenta = executeFunctions.getNodeParameter("puntoDeVenta", 0) as number;
					const bonificacion = executeFunctions.getNodeParameter("bonificacion", 0, "") as string;
					const esContado = executeFunctions.getNodeParameter("esContado", 0) as boolean;
					const idCliente = executeFunctions.getNodeParameter("clienteId", 0) as number;
					const condicionVentaId = executeFunctions.getNodeParameter("idCondicionVenta", 0) as number;
					const tipoComprobanteVenta = executeFunctions.getNodeParameter("idTipoComprobante", 0) as number;
					const idVendedor = executeFunctions.getNodeParameter("idVendedor", 0) as number;
					const preciosListaId = executeFunctions.getNodeParameter("idList", 0) as number;
	
					// === articlesCollection como STRING, luego parse ===
					const articlesCollectionRaw = executeFunctions.getNodeParameter("articlesCollection", 0, "") as string;
					let articulosArray: Array<{ ID: string; Cantidad: number }> = [];
					try {
						articulosArray = JSON.parse(articlesCollectionRaw);
						if (!Array.isArray(articulosArray)) {
							throw new NodeOperationError(executeFunctions.getNode(), "El campo articlesCollection debe ser un array JSON válido.");
						}
					} catch (err) {
						throw new NodeOperationError(
							executeFunctions.getNode(),
							`El campo articlesCollection debe ser un JSON string válido. Ejemplo:[{"ID":"1450","Cantidad":2},{"ID":"1451","Cantidad":5}] Error: ${(err as any)?.message ?? String(err)}`,
						);
					}
	
					const fechaDesde = executeFunctions.getNodeParameter("startDate", 0, "") as string;
					const separarFechaDesde = String(fechaDesde).split("T")[0];
	
					// Campos condicionales (pueden no existir si esContado = false)
					const idValorEfectivo = executeFunctions.getNodeParameter("idValorEfectivo", 0, null) as number | null;
					const cotizacionValorEfectivo = executeFunctions.getNodeParameter("cotizacionValorEfectivo", 0, null) as number | null;
					const importeValorEfectivo = executeFunctions.getNodeParameter("importeValorEfectivo", 0, null) as number | null;
					const observacionesValorEfectivo = executeFunctions.getNodeParameter("observacionesValorEfectivo", 0, "") as string;
					const cantidadCuotasValorEfectivo = executeFunctions.getNodeParameter("cantidadCuotasValorEfectivo", 0, null) as number | null;
	
					// Validaciones mínimas
					if (!numeroPuntoDeVenta) throw new NodeOperationError(executeFunctions.getNode(), "El punto de venta es obligatorio.");
					if (!tipoComprobanteVenta) throw new NodeOperationError(executeFunctions.getNode(), "El tipo de comprobante de venta es obligatorio.");
					if (!idCliente) throw new NodeOperationError(executeFunctions.getNode(), "El IdCliente es obligatorio.");
					if (!preciosListaId) throw new NodeOperationError(executeFunctions.getNode(), "El IdListaPrecio es obligatorio.");
					if (!articulosArray?.length) throw new NodeOperationError(executeFunctions.getNode(), "Debes enviar al menos un artículo en articlesCollection.");
	
					// Si es contado, chequeo mínimos requeridos
					if (esContado === true) {
						if (idValorEfectivo == null) throw new NodeOperationError(executeFunctions.getNode(), "IdValor (efectivo) es obligatorio cuando EsContado = true.");
						if (importeValorEfectivo == null) throw new NodeOperationError(executeFunctions.getNode(), "Importe (efectivo) es obligatorio cuando EsContado = true.");
					}
	
					// === Construcción de IDs y mapa de cantidades (misma lógica que Compras) ===
					const ids = articulosArray.map((a) => a.ID);
					const qtyById: Record<string, number> = Object.fromEntries(articulosArray.map((a) => [a.ID, a.Cantidad]));
	
					// 1) Traer info de artículos para venta
					let ventaItemsConCantidad: any[] = [];
					try {
						const bodyArticulosVenta = {
							IdCliente: idCliente,
							FechaDocumento: separarFechaDesde,
							Ids: ids,
						};
	
						let articulosVenta = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
							headers,
							method: "POST",
							body: bodyArticulosVenta,
						});
						const ventaObj = typeof articulosVenta === "string" ? JSON.parse(articulosVenta) : articulosVenta;
	
						const itemsRespuesta: any[] = ventaObj?.Articulos?.Items ?? ventaObj?.VentaArticulos ?? ventaObj?.Items ?? [];
	
						// Agrego Cantidad desde el array original (clave: IdArticulo)
						ventaItemsConCantidad = itemsRespuesta.map((art: any) => ({
							...art,
							Cantidad: qtyById[String(art.IdArticulo)] ?? 0,
						}));
						console.log(ventaItemsConCantidad);
					} catch (error) {
						const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo los artículos de venta.\n${errorMessage}`);
					}
	
					// 2) Armar el cuerpo de la venta
					const bodyVenta: any = {
						NumeroDocumento: { PuntoVenta: Number(numeroPuntoDeVenta) },
						EsContado: Boolean(esContado),
						any: { IdCliente: Number(idCliente) },
						CondicionVenta: { IdCondicionVenta: Number(condicionVentaId) },
						Observaciones: "Venta desde API",
						TipoComprobanteVenta: { IdTipoComprobanteVenta: Number(tipoComprobanteVenta) },
						Vendedor: { IdVendedor: Number(idVendedor) },
						ListaPrecio: { IdListaPrecio: Number(preciosListaId) },
						VentaArticulos: ventaItemsConCantidad,
						PorcentajeDescuento: 0,
					};
	
					// Bonificación opcional
					if (bonificacion) {
						bodyVenta.Bonificacion = { IdBonificacion: bonificacion };
					}
	
					// 3) Solo agrego VentaValoresEfectivos si corresponde y con valores válidos
					if (esContado === true) {
						const cotizacion = !cotizacionValorEfectivo || cotizacionValorEfectivo <= 0 ? 0 : Number(cotizacionValorEfectivo);
						const cuotas = !cantidadCuotasValorEfectivo || cantidadCuotasValorEfectivo <= 0 ? 0 : Number(cantidadCuotasValorEfectivo);
	
						bodyVenta.VentaValoresEfectivos = [
							{
								IdValor: Number(idValorEfectivo),
								Cotizacion: cotizacion,
								Importe: Number(importeValorEfectivo),
								Observaciones: observacionesValorEfectivo || "",
								CantidadCuotas: cuotas,
							},
						];
					}
	
					// 4) POST final
					try {
						const url = `${centumUrl}/Ventas?verificaLimiteCreditoCliente=false&verificaStockNegativo=false&verificaCuotificador=false`;
	
						const response = await helperFns.apiRequest<any>(url, {
							method: "POST",
							headers,
							body: bodyVenta,
						});
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const errorMessage = (error as any)?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error creando la venta.\n${errorMessage}`);
					}
				
};

const listarFacturasVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idCliente = executeFunctions.getNodeParameter("clienteId", 0) as string;
					const idVenta = executeFunctions.getNodeParameter("ventaId", 0);
					const idSucursal = executeFunctions.getNodeParameter("idSucursalFisica", 0);
					const idDivisionEmpresa = executeFunctions.getNodeParameter("divisionEmpresaId", 0);
					const incluirAnulados = executeFunctions.getNodeParameter("incluirAnulados", 0);
					const idUsuarioCreador = executeFunctions.getNodeParameter("usuarioCreadorId", 0);
					const idTransporte = executeFunctions.getNodeParameter("transporteId", 0);
					const idTipoComprobante = executeFunctions.getNodeParameter("idTipoComprobante", 0);
					const idClienteCuentaCorriente = executeFunctions.getNodeParameter("cuentaCorrienteId", 0);
					const idVendedor = executeFunctions.getNodeParameter("idVendedor", 0);
					const idCanalVenta = executeFunctions.getNodeParameter("canalVentaId", 0);
					const desdeSaldoFecha = executeFunctions.getNodeParameter("startDate", 0);
					const hastaSaldoFecha = executeFunctions.getNodeParameter("endDate", 0);
	
					if (!desdeSaldoFecha || !hastaSaldoFecha) {
						throw new NodeOperationError(executeFunctions.getNode(), "Las fechas desde y hasta son requeridas");
					}
	
					const body: Record<string, any> = {
						fechaDocumentoDesde: String(desdeSaldoFecha).split("T")[0],
						fechaDocumentoHasta: String(hastaSaldoFecha).split("T")[0],
					};
	
					idCliente && (body.idCliente = idCliente);
					idVenta && (body.idVenta = idVenta);
					idSucursal && (body.idSucursal = idSucursal);
					idDivisionEmpresa && (body.idDivisionEmpresa = idDivisionEmpresa);
					idUsuarioCreador && (body.idUsuarioCreador = idUsuarioCreador);
					idTransporte && (body.idTransporte = idTransporte);
					idTipoComprobante && (body.idTipoComprobante = idTipoComprobante);
					idClienteCuentaCorriente && (body.idClienteCuentaCorriente = idClienteCuentaCorriente);
					idVendedor && (body.idVendedor = idVendedor);
					idCanalVenta && (body.idCanalVenta = idCanalVenta);
					incluirAnulados && (body.incluirAnulados = incluirAnulados);
	
					const response = await helperFns.apiRequest<any>(`${centumUrl}/Ventas/FiltrosVentaConsulta`, {
						method: "POST",
						headers,
						body,
					});
	
					if (!response || typeof response !== "object") {
						throw new NodeOperationError(executeFunctions.getNode(), "Respuesta inválida del servidor");
					}
	
					return [executeFunctions.helpers.returnJsonArray(response)];
				
};

const listarFacturasVentasPorID: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const ventaIdParam = executeFunctions.getNodeParameter("ventaId", 0);
					const desdeSaldoFecha = executeFunctions.getNodeParameter("startDate", 0);
					const hastaSaldoFecha = executeFunctions.getNodeParameter("endDate", 0);
					const separarFechaDesde = String(desdeSaldoFecha).split("T")[0];
					const separarFechaHasta = String(hastaSaldoFecha).split("T")[0];
	
					// Validación de parámetros
					const ventaId = Number(ventaIdParam);
					if (isNaN(ventaId) || ventaId <= 0) {
						throw new NodeOperationError(executeFunctions.getNode(), "clienteId debe ser un número positivo");
					}
	
					if (!desdeSaldoFecha) {
						throw new NodeOperationError(executeFunctions.getNode(), "priceDateModified (fecha desde) es requerido");
					}
	
					if (!hastaSaldoFecha) {
						throw new NodeOperationError(executeFunctions.getNode(), "priceDateModifiedSince (fecha hasta) es requerido");
					}
	
					try {
						const body = {
							fechaDocumentoDesde: separarFechaDesde,
							fechaDocumentoHasta: separarFechaHasta,
							idVenta: ventaId,
						};
	
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Ventas/FiltrosVenta`, {
							method: "POST",
							headers,
							body,
						});
	
						// Validación de la respuesta
						if (!response || typeof response !== "object") {
							throw new NodeOperationError(executeFunctions.getNode(), "Respuesta inválida del servidor");
						}
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de facturas de ventas:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo facturas de ventas para cliente ${ventaId}: ${errorMessage}`);
					}
				
};

const listarComprobantesVenta: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobanteVenta`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en obtener el listado de comprobantes de compra:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de Comprobantes de Venta: ${errorMessage}`);
					}
				
};

const listarPrecios: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/ListasPrecios`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error al intentar obtener el listado de precios:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo el listado de precios. \n ${errorMessage}`);
					}
				
};

const listarPromociones: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const documentDate = executeFunctions.getNodeParameter("documentDate", 0) as string;
					const formattedDocumentDate = String(documentDate).split("T")[0];
	
					const body = {
						FechaDocumento: formattedDocumentDate,
					};
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`, {
							method: "POST",
							headers,
							body,
						});
	
						if (response.Items && Array.isArray(response.Items)) {
							return [executeFunctions.helpers.returnJsonArray(response.Items)];
						}
	
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de promociones:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo promociones: \n ${errorMessage}`);
					}
				
};

const estadisticaVentaRanking: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const fechaDesdeString = executeFunctions.getNodeParameter("startDate", 0);
					const fechaHastaString = executeFunctions.getNodeParameter("endDate", 0);
					const tipoDeRanking = executeFunctions.getNodeParameter("tipoDeRanking", 0);
					const orderByRanking = executeFunctions.getNodeParameter("ventaRankingOrderBy", 0);
					const orderAsc = executeFunctions.getNodeParameter("orderAsc", 0);
					const cantItems = executeFunctions.getNodeParameter("cantidadDeItems", 0);
					const rubroId = executeFunctions.getNodeParameter("rubroId", 0);
					const idListaPrecio = executeFunctions.getNodeParameter("idList", 0);
	
					const fechaDesde = String(fechaDesdeString).split("T")[0];
					const fechaHasta = String(fechaHastaString).split("T")[0];
	
					let url = `${centumUrl}/EstadisticaVentaRanking/${cantItems}`;
	
					if (fechaDesde && fechaHasta) {
						url += `?fechaDocumentoDesde=${fechaDesde}&fechaDocumentoHasta=${fechaHasta}`;
					} else {
						throw new NodeOperationError(executeFunctions.getNode(), "Ambos periodos de fecha son necesarios.");
					}
	
					if (rubroId) {
						url += `&idsRubro=${rubroId}`;
					}
	
					if (idListaPrecio) {
						url += `&idsListaPrecio=${idListaPrecio}`;
					}
	
					if (tipoDeRanking) {
						if (tipoDeRanking === "esRankingClientes") {
							url += `&${tipoDeRanking}=true`;
						}
						if (tipoDeRanking === "esRankingArticulos") {
							url += `&${tipoDeRanking}=true`;
						}
						if (tipoDeRanking === "esRankingVendedores") {
							url += `&${tipoDeRanking}=true`;
						}
					}
	
					// OrderBy (manteniendo la lógica de ifs actuales)
					if (orderByRanking) {
						if (orderByRanking === "CantidadUnidadNivel0") {
							url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`;
						}
						if (orderByRanking === "CantidadUnidadNivel1") {
							url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`;
						}
						if (orderByRanking === "CantidadUnidadNivel2") {
							url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`;
						}
						if (orderByRanking === "ImporteTotalNeto") {
							url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`;
						}
						if (orderByRanking === "ImporteTotalFinal") {
							url += `&tipoOrdenEstadisticaVentaRanking=${orderByRanking}`;
						}
					}
					if (typeof orderAsc === "boolean") {
						if (!orderByRanking) {
							throw new NodeOperationError(
								executeFunctions.getNode(),
								'Debe especificar "ventaRankingOrderBy" cuando se especifica "orderAsc" (por requerimiento del endpoint EstadisticaVentaRanking).',
							);
						}
						url += `&ordenEstadisticaVentaRankingAscendente=${orderAsc}`;
					}
	
					try {
						const response = await helperFns.apiRequest<any>(`${url}`, {
							method: "GET",
							headers,
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						console.log("Error en solicitud de estadisticas de ventas:", error);
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo las estadisticas de ranking. \n ${errorMessage}`);
					}
				
};

export const ventasHandlers: ResourceHandlerMap = {
	crearPedidoVenta,
	verDetallePedidoVenta,
	listarEstadosPedidosVenta,
	listarPedidosVenta,
	listarPedidosVentaFiltrados,
	crearVenta,
	listarFacturasVenta,
	listarFacturasVentasPorID,
	listarComprobantesVenta,
	listarPrecios,
	listarPromociones,
	estadisticaVentaRanking,
};
