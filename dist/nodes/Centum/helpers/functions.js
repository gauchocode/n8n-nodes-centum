"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centumImageName = exports.createJsonProducts = exports.createChargeJson = exports.createOrderSaleJson = exports.createCustomerJson = exports.createHash = void 0;
exports.centumGetArticleImages = centumGetArticleImages;
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
const interfaces_1 = require("../interfaces");
const createHash = (publicAccessKey) => {
    const uuid = (0, crypto_1.randomUUID)().replace(/-/gi, '');
    const currentDateFormatted = new Date().toISOString().replace(/\..+/, '');
    const hash = (0, crypto_1.createHash)('sha1');
    hash.update(`${currentDateFormatted} ${uuid} ${publicAccessKey}`);
    const hashedResult = hash.digest('hex');
    return `${currentDateFormatted} ${uuid} ${hashedResult}`;
};
exports.createHash = createHash;
const createCustomerJson = (respWoo, dni) => {
    const customerObj = {
        TarifaServicio: {
            IdTarifaServicio: 1
        },
        CodigoPostal: respWoo.billing.postcode,
        Direccion: respWoo.billing.address_1,
        IdCliente: -1,
        Localidad: respWoo.billing.city,
        RazonSocial: `${respWoo.billing.first_name} ${respWoo.billing.last_name}`,
        Email: respWoo.billing.email || '',
        Provincia: constants_1.constantProvincias.find((prov) => prov.Nombre.toLocaleLowerCase() === respWoo.billing.state.toLocaleLowerCase()) || constants_1.constantProvincias[5],
        Pais: {
            Codigo: 'ARG',
            IdPais: 4657,
            Nombre: 'Argentina',
        },
        DireccionEntrega: respWoo.shipping.address_1,
        Telefono: respWoo.billing.phone,
        CigarreraCliente: {
            Codigo: 'MSP',
            IdCigarreraCliente: 6972,
            Nombre: 'Massalin Particulares',
        },
        Bonificacion: {
            Calculada: 0,
            Codigo: '01',
            IdBonificacion: 6235,
        },
        ClaseCliente: {
            IdClaseCliente: 6087,
            Codigo: 'ClaseDefecto',
            Nombre: 'Clase Defecto',
        },
        CadenaCliente: {
            Codigo: '365',
            IdCadenaCliente: 6920,
            Nombre: '365',
        },
        CondicionVenta: {
            Codigo: 'VTA1',
            IdCondicionVenta: 1,
            Nombre: 'Contado',
        },
        DiasAtencionCliente: {
            Codigo: 'LD',
            IdDiasAtencionCliente: 6969,
            Nombre: 'Lunes a Domingo',
        },
        EdadesPromedioConsumidoresCliente: {
            Codigo: '111',
            IdEdadesPromedioConsumidoresCliente: 6951,
            Nombre: 'Hay igual cantidad de consumidores',
        },
        FrecuenciaCliente: {
            IdFrecuenciaCliente: 6891,
            Nombre: 'Frecuencia Defecto',
        },
        GeneroPromedioConsumidoresCliente: {
            Codigo: '11',
            IdGeneroPromedioConsumidoresCliente: 6964,
            Nombre: 'Hay igual cantidad de consumidores',
        },
        HorarioAtencionCliente: {
            Codigo: 'D',
            IdHorarioAtencionCliente: 6970,
            Nombre: 'Diurno',
        },
        LimiteCredito: {
            IdLimiteCredito: 46002,
            Nombre: 'Límite Credito 1',
            Valor: 1000000,
        },
        Transporte: {
            Codigo: 'TRA1',
            CodigoPostal: null,
            CodigoPostalEntrega: null,
            Direccion: null,
            DireccionEntrega: null,
            Email: null,
            IdTransporte: 1,
            Localidad: null,
            LocalidadEntrega: null,
            NumeroDocumento: '00000000',
            Pais: {
                Codigo: 'ARG',
                IdPais: 4657,
                Nombre: 'Argentina',
            },
            PaisEntrega: null,
            Provincia: {
                Codigo: 'BSAS',
                IdProvincia: 4876,
                Nombre: 'Buenos Aires',
            },
            ProvinciaEntrega: null,
            RazonSocial: 'Transporte Defecto',
            Telefono: '',
            TipoDocumento: {
                Codigo: 'DNI',
                IdTipoDocumento: 6028,
                Nombre: 'Documento Nacional de Identidad',
            },
            ZonaEntrega: null,
        },
        UbicacionCLiente: {
            Codigo: 'BAR',
            IdUbicacionCliente: 6942,
            Nombre: 'Zona de Bares y Boliches',
        },
        CondicionIVA: {
            IdCondicionIVA: 1892,
            Codigo: 'CF',
            Nombre: 'Consumidor Final',
        },
        CUIT: `${dni}`,
        Codigo: `web-${dni}`,
        Vendedor: {
            IdVendedor: 12,
            Codigo: 'V11',
            Nombre: 'EXITOWEB',
            CUIT: null,
            Direccion: null,
            Localidad: null,
            Telefono: null,
            Mail: null,
            EsSupervisor: false,
        },
        CanalCliente: {
            Codigo: 'OTR',
            IdCanalCliente: 6904,
            Nombre: 'Otros',
        },
        Zona: constants_1.constantsZonas.find((zone) => zone.Nombre.toLocaleLowerCase() === respWoo.billing.city.toLocaleLowerCase()) || constants_1.constantsZonas[0],
        ListaPrecio: {
            Codigo: interfaces_1.ListaPrecioCodigo.Exitoweb,
            Descripcion: interfaces_1.Descripcion.TiendaOnLineExito,
            FechaDesde: null,
            FechaHasta: null,
            Habilitado: true,
            IdListaPrecio: 3,
            ListaPrecioAlternativa: null,
            Moneda: {
                Codigo: 'ARS',
                Cotizacion: 1,
                IdMoneda: 1,
                Nombre: 'Peso Argentino',
            },
            PorcentajePrecioSugerido: 0,
        },
    };
    return customerObj;
};
exports.createCustomerJson = createCustomerJson;
const createOrderSaleJson = (articles, client, articlesOrder, shippingSalesOrder, cobroId) => {
    let dbArticle;
    const saleOrderObj = {
        Cliente: client,
        IdCobro: cobroId,
        FechaEntrega: new Date().toISOString(),
        Vendedor: client.Vendedor,
        Bonificacion: client.Bonificacion,
        PedidoVentaArticulos: articlesOrder.map((product) => {
            dbArticle = articles.find((stateArticle) => stateArticle.Codigo === product.sku);
            if (!dbArticle) {
                console.warn(`No se encontró el artículo para SKU ${product.sku}`);
            }
            const metaData = product.meta_data;
            const quantity = product.quantity;
            const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
            const price = isProductQuoter ? Number(product.total || 0) / quantity : Number(product.price || 0);
            const obj = {
                Nombre: product.name,
                Codigo: product.sku,
                Cantidad: quantity,
                CategoriaImpuestoIVA: {
                    Codigo: '5',
                    IdCategoriaImpuestoIVA: 4,
                    Nombre: 'IVA 21.00',
                    Tasa: 21,
                },
                IdArticulo: dbArticle?.IdArticulo || product.product_id,
                CostoReposicion: dbArticle?.CostoReposicion || 0,
                PorcentajeDescuento1: 0,
                PorcentajeDescuento2: 0,
                PorcentajeDescuento3: 0,
                PorcentajeDescuentoMaximo: dbArticle?.PorcentajeDescuentoMaximo || 0,
                Precio: price,
                SegundoControlStock: dbArticle?.SegundoControlStock || 0,
                NumeroTropa: '',
                NumeroSerie: '',
                ImpuestoInterno: dbArticle?.ImpuestoInterno || 0,
                Observaciones: dbArticle?.Observaciones || '',
                ClaseDescuento: {
                    IdClaseDescuento: 0,
                },
            };
            return obj;
        }),
        DivisionEmpresaGrupoEconomico: {
            IdDivisionEmpresaGrupoEconomico: 1,
            NombreDivisionEmpresa: null,
            RazonSocialEmpresaGrupoEconomico: null,
        },
        TiendaOnline: null,
        Observaciones: dbArticle?.Observaciones || '',
        ContieneConjunto: false,
        PorcentajeDescuento: dbArticle?.PorcentajeDescuento || 0,
        TurnoEntrega: {
            IdTurnoEntrega: 6083,
            Nombre: 'Maniana',
        },
    };
    const isShippingAlreadyIncluded = articlesOrder.some(item => item.sku === 'R06SR0601P00010007');
    if (shippingSalesOrder.length > 0 && !isShippingAlreadyIncluded) {
        const shipping = shippingSalesOrder[0];
        const shippingCost = Number(shipping.total || 0);
        if (shippingCost > 0) {
            const shippingItem = {
                Nombre: shipping.method_title || 'Costo de Envío',
                Codigo: 'R06SR0601P00010007',
                Cantidad: 1,
                CategoriaImpuestoIVA: {
                    Codigo: '5',
                    IdCategoriaImpuestoIVA: 4,
                    Nombre: 'IVA 21.00',
                    Tasa: 21,
                },
                IdArticulo: 2126,
                CostoReposicion: 0,
                PorcentajeDescuento1: 0,
                PorcentajeDescuento2: 0,
                PorcentajeDescuento3: 0,
                PorcentajeDescuentoMaximo: 0,
                Precio: shippingCost,
                SegundoControlStock: 0,
                NumeroTropa: '',
                NumeroSerie: '',
                ImpuestoInterno: 0,
                Observaciones: ``,
                ClaseDescuento: {
                    IdClaseDescuento: 0,
                },
            };
            saleOrderObj.PedidoVentaArticulos.push(shippingItem);
        }
    }
    return saleOrderObj;
};
exports.createOrderSaleJson = createOrderSaleJson;
const createChargeJson = (customer, articlesOrder, shippingChargeOrder) => {
    if (shippingChargeOrder.length > 0) {
        const shipping = shippingChargeOrder[0];
        const shippingCost = Number(shipping.total || 0);
        if (shippingCost > 0) {
            const shippingChargeItem = {
                id: shipping.id,
                name: shipping.method_title || 'Costo de Envío',
                total: shipping.total,
                meta_data: shipping.meta_data,
                product_id: 2126,
                variation_id: 0,
                quantity: 1,
                tax_class: '',
                subtotal: '',
                subtotal_tax: '',
                total_tax: '',
                taxes: [],
                sku: 'R06SR0601P00010007',
                price: shippingCost,
                image: {
                    id: 0,
                    src: ""
                },
                parent_name: '',
            };
            articlesOrder.push(shippingChargeItem);
        }
    }
    const chargeJson = {
        Cliente: customer,
        ClienteCuentaCorriente: customer,
        Observacion: '',
        CobroAnticipos: articlesOrder.map((product) => {
            const metaData = product.meta_data;
            const quantity = product.quantity;
            const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
            const price = isProductQuoter ? Number(product.total || 0) : Number(product.price || 0) * quantity;
            const obj = {
                ConceptoVarios: {
                    Activo: false,
                    Clave: null,
                    IdConceptoVarios: 2,
                    Nombre: null,
                    ResumenFondo: null,
                },
                Cotizacion: 1,
                Detalle: '',
                Importe: price,
            };
            return obj;
        }),
        CobroEfectivos: articlesOrder.map((p) => {
            const metaData = p.meta_data;
            const quantity = p.quantity;
            const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
            const price = isProductQuoter ? Number(p.total || 0) : Number(p.price || 0) * quantity;
            const object = {
                Valor: {
                    IdValor: 4,
                    Codigo: null,
                    Nombre: null,
                    Moneda: null,
                    Ingresa: false,
                    Egresa: false,
                    OperaVueltoVentasContado: false,
                    SolicitaNumeroCupon: false,
                    VisibleVentasContado: false,
                    CantidadMaximaCuotas: 0,
                    Cuotas: null,
                },
                Detalle: 'Compra mediante web',
                Importe: price,
                Cotizacion: 1,
                CotizacionMonedaRespectoMonedaCliente: 1,
                CantidadCuotas: 0,
                PorcentajeCostoServicio: 0,
                PorcentajeCostoFinanciacion: 0,
                PorcentajeCostoImpositivo: 0,
                FechaAcreditacion: new Date().toISOString(),
                NumeroCupon: '',
                DNI: '',
                NombreApellido: '',
            };
            return object;
        }),
        SucursalFisica: {
            IdSucursalFisica: 7341,
            Codigo: 'Moron',
            Nombre: 'Moron'
        },
        FechaDocumento: new Date().toISOString(),
        FechaImputacion: new Date().toISOString(),
        Anulado: false,
        Nota: '',
        Moneda: {
            IdMoneda: 1,
            Codigo: 'ARS',
            Nombre: 'Peso Argentino',
            Cotizacion: 1,
        },
        Cotizacion: 1,
        DivisionEmpresaGrupoEconomico: {
            IdDivisionEmpresaGrupoEconomico: 1,
            RazonSocialEmpresaGrupoEconomico: null,
            NombreDivisionEmpresa: null,
        },
        Usuario: null,
        CobroRetenciones: [],
        CobroCheques: [],
        CobroVouchers: [],
        CobroPasarelaPago: [],
    };
    return chargeJson;
};
exports.createChargeJson = createChargeJson;
function getUniqueValues(array, key) {
    const uniqueValues = [];
    const uniqueKeys = new Set();
    for (const obj of array) {
        const value = obj[key];
        if (!uniqueKeys.has(value)) {
            uniqueKeys.add(value);
            uniqueValues.push(obj);
        }
    }
    return uniqueValues;
}
function centumGetArticleAttributes(article) {
    return article.json.AtributosArticulo.map((article) => ({
        name: article.Nombre.trim(),
        value: article.Valor.trim().toLowerCase(),
    }));
}
function centumGetArticleVariations(groupId, arrArticles) {
    const allAttributes = [];
    const articlesWithSameGroupId = arrArticles.filter((article) => article.json.GrupoArticulo !== null && article.json.GrupoArticulo.IdGrupoArticulo === groupId);
    articlesWithSameGroupId.forEach((article) => {
        allAttributes.push(...centumGetArticleAttributes(article));
    });
    const variations = articlesWithSameGroupId.map((article) => ({
        sku: article.json.Codigo,
        regular_price: article.json.Precio,
        enabled: article.json.Habilitado === true && article.json.ActivoWeb === true,
        attributes: centumGetArticleAttributes(article),
        stock: article.json.ExistenciasSucursales,
        dimensions: {
            height: article.json.Alto * 100,
            length: article.json.Largo * 100,
            width: article.json.Ancho * 100,
            weight: article.json.Masa,
        },
        images: article.json.images?.map((image) => image.data.fileName) || [],
        description: article.json.Detalle ?? '',
    }));
    const allUniqueAttributes = getUniqueValues(allAttributes, 'value');
    return [variations, allUniqueAttributes];
}
const createJsonProducts = (arrArticles) => {
    const wooProducts = {
        products: [],
    };
    const articleGroupIds = [];
    for (const article of arrArticles) {
        const obj = {};
        obj.dimensions = {
            height: article.json.Alto * 100,
            length: article.json.Largo * 100,
            width: article.json.Ancho * 100,
            weight: article.json.Masa,
        };
        obj.regular_price = article.json.Precio;
        const description = article.json.Detalle;
        const pattern = /\/{2,}/g;
        const matches = (description.match(pattern) || []).length;
        if (matches > 0) {
            const parts = description.split(pattern);
            obj.short_description = parts[0].replace(/<[^>]+>/g, '');
            obj.description = parts[1].replace(/^<\/\w+>/, '');
        }
        else {
            obj.description = article.json.Detalle;
        }
        obj.categories = [
            {
                id: article.json.Rubro.IdRubro,
                name: article.json.Rubro.Nombre,
                subCategories: [
                    {
                        id: article.json.SubRubro.IdSubRubro,
                        name: article.json.SubRubro.Nombre,
                        category: article.json.CategoriaArticulo?.IdCategoriaArticulo
                            ? {
                                id: article.json.CategoriaArticulo.IdCategoriaArticulo,
                                name: article.json.CategoriaArticulo.Nombre
                            }
                            : undefined
                    }
                ]
            }
        ];
        obj.tags = article.json.Tags;
        if (article.json.GrupoArticulo !== null) {
            if (articleGroupIds.includes(article.json.GrupoArticulo.IdGrupoArticulo)) {
                continue;
            }
            const [variations, allAttributes] = centumGetArticleVariations(article.json.GrupoArticulo.IdGrupoArticulo, arrArticles);
            obj.name = article.json.GrupoArticulo.Nombre;
            obj.type = 'variable';
            obj.variations = variations;
            obj.attributes = allAttributes;
            obj.sku = article.json.GrupoArticulo.IdGrupoArticulo.toString();
            obj.short_description = article.json.GrupoArticulo.Detalle;
            wooProducts.products.push(obj);
            articleGroupIds.push(article.json.GrupoArticulo.IdGrupoArticulo);
        }
        else {
            obj.sku = article.json.Codigo;
            obj.enabled = article.json.Habilitado === true && article.json.ActivoWeb === true;
            obj.name =
                article.json.NombreFantasia.length > 0 ? article.json.NombreFantasia : article.json.Nombre;
            obj.type = 'simple';
            obj.attributes = centumGetArticleAttributes(article);
            obj.stock = article.json.ExistenciasTotal;
            obj.images = article.json.images?.map((image) => image.data.fileName);
            wooProducts.products.push(obj);
        }
    }
    const uniqueArticles = getUniqueValues(wooProducts.products, 'name');
    wooProducts.products = uniqueArticles;
    return wooProducts;
};
exports.createJsonProducts = createJsonProducts;
async function centumGetArticleImages(orderNumber, articleId, requestHeaders, requestUrl, allImages = []) {
    try {
        const url = new URL(`${requestUrl}/${articleId}`);
        url.searchParams.append('numeroOrden', orderNumber.toString());
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                CentumSuiteConsumidorApiPublicaId: requestHeaders.consumerApiPublicId,
                CentumSuiteAccessToken: (0, exports.createHash)(requestHeaders.publicAccessKey),
            },
        });
        if (response.status === 404) {
            return allImages;
        }
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        const lastModified = response.headers.get('last-modified') ?? undefined;
        allImages.push({
            orderNumber,
            articleId: articleId,
            buffer,
            lastModified,
        });
        return await centumGetArticleImages(orderNumber + 1, articleId, requestHeaders, requestUrl, allImages);
    }
    catch (e) {
        console.error(`Error fetching image for article ${articleId}:`, e);
        return e;
    }
}
const centumImageName = (name, size, numberImage, fileExtension) => {
    return `${name.split(' ').join('').replace('.', '').toLocaleLowerCase()}${numberImage}_${size
        .split(' ')
        .join('')
        .replace('.', '_')
        .toLocaleLowerCase()}.${fileExtension}`;
};
exports.centumImageName = centumImageName;
//# sourceMappingURL=functions.js.map