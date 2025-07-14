"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centum = void 0;
const api_1 = require("./helpers/api");
const CentumDescription_1 = require("./CentumDescription");
const functions_1 = require("./helpers/functions");
class Centum {
    constructor() {
        this.description = {
            displayName: 'Centum',
            name: 'centum',
            icon: 'file:centum.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consumes Centum API',
            defaults: {
                name: 'Centum',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'centumApi',
                    required: true,
                },
            ],
            properties: [...CentumDescription_1.CentumOperations, ...CentumDescription_1.CentumFields],
        };
    }
    async execute() {
        const centumApiCredentials = await this.getCredentials('centumApi');
        let centumUrl = centumApiCredentials.centumUrl;
        let consumerApiPublicId = centumApiCredentials.consumerApiPublicId;
        const centumSuiteAccessToken = (0, functions_1.createHash)(centumApiCredentials.publicAccessKey);
        const headers = {
            CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
            CentumSuiteAccessToken: centumSuiteAccessToken,
        };
        const resource = this.getNodeParameter('resource', 0);
        switch (resource) {
            case 'activity':
                try {
                    const dataActividad = await (0, api_1.apiRequest)(`${centumUrl}/PedidosVenta/27231`, { headers }, this);
                    return [this.helpers.returnJsonArray(dataActividad)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'article':
                const clientId = this.getNodeParameter('clientId', 0);
                const documentDate = this.getNodeParameter('documentDate', 0);
                const IdsRubro = this.getNodeParameter('idsRubros', 0);
                const completeMigration = this.getNodeParameter('migracionCompleta', 0);
                const IdsSubRubro = this.getNodeParameter('idsSubRubros', 0);
                const formattedDocumentDate = documentDate.replace(/\..+/, '');
                const dateModified = this.getNodeParameter('dateModified', 0);
                const dateModifiedImage = this.getNodeParameter('dateModifiedImage', 0);
                const priceDateModified = this.getNodeParameter('priceDateModified', 0);
                const bodyToSend = {
                    idCliente: clientId,
                    FechaDocumento: formattedDocumentDate,
                    incluirAtributosArticulos: true,
                    IdsRubro: IdsRubro ? [IdsRubro] : [],
                    IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
                    fechaModificacionDesde: dateModified ? dateModified : '',
                    fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : '',
                    fechaPrecioActualizadoDesde: priceDateModified,
                };
                try {
                    const response = await (0, api_1.apiRequest)(`${centumUrl}/Articulos/Venta`, {
                        method: 'POST',
                        body: bodyToSend,
                        headers,
                        queryParams: { tipoOrdenArticulos: 'Codigo' }
                    }, this);
                    if (response.Articulos.Items.length > 0) {
                        const items = response.Articulos.Items;
                        if (!completeMigration) {
                            const acc = [];
                            for (const item of items) {
                                const groupArticle = item.GrupoArticulo;
                                if (!groupArticle)
                                    continue;
                                const centumSuiteAccessToken = (0, functions_1.createHash)(centumApiCredentials.publicAccessKey);
                                const requestHeaders = {
                                    CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
                                    CentumSuiteAccessToken: centumSuiteAccessToken,
                                };
                                const body = {
                                    IdCliente: clientId,
                                    FechaDocumento: formattedDocumentDate,
                                    IncluirAtributosArticulos: true,
                                    IdsRubro: IdsRubro ? [IdsRubro] : [],
                                    IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [''],
                                    NombreGrupoArticulo: groupArticle.Nombre,
                                    IdGrupoArticulo: groupArticle.IdGrupoArticulo
                                };
                                try {
                                    const data = await (0, api_1.apiRequest)(`${centumUrl}/Articulos/Venta`, {
                                        method: 'POST',
                                        headers: requestHeaders,
                                        body,
                                        queryParams: { tipoOrdenArticulos: 'Codigo' },
                                    }, this);
                                    if (data.Articulos.Items.length > 0) {
                                        acc.push(...data.Articulos.Items);
                                    }
                                }
                                catch (error) {
                                    console.log('Error en solicitud de grupo de artículos', { error });
                                }
                            }
                            const combinedArrays = [...acc, ...items];
                            const filteredArray = Array.from(new Map(combinedArrays.map(obj => [obj.IdArticulo, obj])).values());
                            const itemsArray = filteredArray.map((item) => ({
                                ...item,
                                AtributosArticulo: item.Habilitado && item.ActivoWeb ? item.AtributosArticulo : [],
                            }));
                            return [this.helpers.returnJsonArray(itemsArray)];
                        }
                        return [this.helpers.returnJsonArray(items)];
                    }
                    else {
                        return [this.helpers.returnJsonArray({ json: {} })];
                    }
                }
                catch (error) {
                    console.log('Error en solicitud de artículos', error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'stockArticle':
                const branchOfficeIds = String(this.getNodeParameter('branchOfficeIds', 0));
                try {
                    const dataArticulosExistencias = await (0, api_1.apiRequest)(`${centumUrl}/ArticulosExistencias`, {
                        headers,
                        queryParams: {
                            idsSucursalesFisicas: branchOfficeIds,
                        },
                    });
                    return [this.helpers.returnJsonArray(dataArticulosExistencias.Items)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'stockArticleByPhysicalBranch':
                const IdSucursalFisica = this.getNodeParameter('IdSucursalFisica', 0);
                const queryParams = {
                    Codigo: 'R06SR0601P00010007',
                };
                if (IdSucursalFisica) {
                    queryParams.idsSucursalesFisicas = IdSucursalFisica;
                }
                try {
                    const dataArticulosExistencias = await (0, api_1.apiRequest)(`${centumUrl}/ArticulosSucursalesFisicas`, {
                        headers,
                        queryParams,
                    }, this);
                    return [this.helpers.returnJsonArray(dataArticulosExistencias.Items)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'priceArticle':
                const paramsPrice = {
                    Cantidad: this.getNodeParameter('quantity', 0),
                    FechaDocumento: this.getNodeParameter('documentDate', 0),
                };
                try {
                    const dataArticulosPrecios = await (0, api_1.apiRequest)(`${centumUrl}/Articulos/PrecioArticulo`, {
                        method: 'POST',
                        headers,
                        queryParams: paramsPrice,
                        body: {
                            IdArticulo: 1507,
                            Codigo: 'R02SR0206P00070007',
                            CodigoAuxiliar: '',
                            CodigoPropioProveedor: '',
                            Nombre: 'ADHESIVO ACRILICO KEKOL K-645 1 KG',
                            NombreFantasia: '',
                        },
                    }, this);
                    return [this.helpers.returnJsonArray(dataArticulosPrecios)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'articleImg':
                const arrResult = [];
                const inputData = this.getInputData();
                const requestUrl = `${centumUrl}/ArticulosImagenes`;
                for (let i = 0; i < inputData.length; i++) {
                    const element = inputData[i];
                    const dataObj = {
                        idArticulo: element.json.IdArticulo,
                        images: [],
                        infoImages: [],
                    };
                    const allArticleImages = await (0, functions_1.centumGetArticleImages)(1, element.json.IdArticulo, { consumerApiPublicId, publicAccessKey: String(centumApiCredentials.publicAccessKey) }, requestUrl);
                    if (allArticleImages instanceof Error) {
                        console.error(`Failed to download images for article ${element.json.IdArticulo}`, allArticleImages);
                        continue;
                    }
                    if (allArticleImages.length > 0) {
                        for (let j = 0; j < allArticleImages.length; j++) {
                            const binary = {};
                            const dataImage = allArticleImages[j];
                            const buffer = Buffer.from(dataImage.buffer);
                            binary['data'] = await this.helpers.prepareBinaryData(buffer);
                            binary.data.fileName = `${element.json.Codigo}_${j + 1}.${binary.data.fileExtension}`;
                            dataObj.images.push(binary);
                            dataObj.infoImages.push({
                                lastModified: dataImage.lastModified,
                                orderNumber: dataImage.orderNumber,
                            });
                            const existObj = arrResult.find((obj) => obj.idArticulo === element.json.IdArticulo);
                            if (!existObj) {
                                arrResult.push(dataObj);
                            }
                        }
                    }
                    else {
                        dataObj.images = null;
                        arrResult.push(dataObj);
                    }
                }
                return [this.helpers.returnJsonArray(arrResult)];
            case 'processImage':
                const dataImages = this.getNodeParameter('dataImg', 0);
                const db = this.getNodeParameter('lastModifiedImg', 0);
                const result = [];
                for (let i = 0; i < dataImages.length; i++) {
                    const element = dataImages[i];
                    for (let j = 0; j < element.json.images?.length; j++) {
                        const currentData = element.json.images[j];
                        const currentInfoImage = element.json.infoImages[j];
                        const articleInDB = db.find((dbData) => dbData.articleId === element.json.idArticulo);
                        if (!articleInDB) {
                            result.push({ json: {}, binary: currentData });
                        }
                        else {
                            const currentImageInDB = articleInDB.dataImage.find((dataImageDB) => dataImageDB.orderNumber === currentInfoImage.orderNumber);
                            if (currentImageInDB?.lastModified !== currentInfoImage.lastModified) {
                                result.push({ json: {}, binary: currentData });
                            }
                        }
                    }
                }
                if (result.length === 0) {
                    result.push([]);
                }
                return [this.helpers.returnJsonArray(result)];
            case 'customers':
                try {
                    const dataClientes = await (0, api_1.apiRequest)(`${centumUrl}/Clientes`, {
                        headers,
                    }, this);
                    return [this.helpers.returnJsonArray(dataClientes.Items)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'newCustomer':
                const body = this.getNodeParameter('body', 0);
                const customerDNI = this.getNodeParameter('dni', 0);
                const customerBody = (0, functions_1.createCustomerJson)(body, customerDNI);
                try {
                    const newCustomer = await (0, api_1.apiRequest)(`${centumUrl}/Clientes`, {
                        method: 'POST',
                        body: customerBody,
                        headers,
                    }, this);
                    return [this.helpers.returnJsonArray(newCustomer)];
                }
                catch (error) {
                    console.log(error);
                    const obj = {
                        ...error.response.data,
                        IdCliente: -1,
                    };
                    return [this.helpers.returnJsonArray(obj)];
                }
            case 'putCustomer':
                const bodyPut = this.getNodeParameter('body', 0);
                try {
                    const updateCustomer = await (0, api_1.apiRequest)(`${centumUrl}/Clientes/Actualizar`, {
                        method: 'POST',
                        body: bodyPut,
                        headers,
                    }, this);
                    return [this.helpers.returnJsonArray(updateCustomer)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'salesOrder': {
                const customerSalesOrder = this.getNodeParameter('customer', 0);
                const articlesSalesOrder = this.getNodeParameter('article', 0);
                const shippingSalesOrder = this.getNodeParameter('shipping', 0);
                const cobroId = this.getNodeParameter('cobroId', 0);
                const date = new Date().toISOString();
                const formattedDate = date.replace(/\..+/, '');
                try {
                    const arrArticles = await (0, api_1.apiRequest)(`${centumUrl}/Articulos/Venta`, {
                        method: 'POST',
                        headers,
                        body: {
                            idCliente: 1,
                            FechaDocumento: formattedDate,
                            Habilitado: true,
                            ActivoWeb: true,
                        },
                    }, this);
                    const bodyPedidoVenta = (0, functions_1.createOrderSaleJson)(arrArticles.Articulos.Items, customerSalesOrder, articlesSalesOrder, shippingSalesOrder, cobroId);
                    const centumSuiteAccessTokenSalesOrder = (0, functions_1.createHash)(centumApiCredentials.publicAccessKey);
                    const headersSalesOrder = {
                        CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
                        CentumSuiteAccessToken: centumSuiteAccessTokenSalesOrder,
                    };
                    const dataPedidosVenta = await (0, api_1.apiRequest)(`${centumUrl}/PedidosVenta`, {
                        method: 'POST',
                        headers: headersSalesOrder,
                        body: bodyPedidoVenta,
                    }, this);
                    dataPedidosVenta.IdCobro = cobroId;
                    return [this.helpers.returnJsonArray(dataPedidosVenta)];
                }
                catch (error) {
                    console.log('Error creating sales order:', error);
                    return [this.helpers.returnJsonArray([])];
                }
            }
            case 'charge':
                const customerCharge = this.getNodeParameter('customer', 0);
                const articlesCharge = this.getNodeParameter('article', 0);
                const shippingChargeOrder = this.getNodeParameter('shipping', 0);
                const bodyCharge = (0, functions_1.createChargeJson)(customerCharge, articlesCharge, shippingChargeOrder);
                try {
                    const dataCobros = await (0, api_1.apiRequest)(`${centumUrl}/Cobros`, {
                        body: bodyCharge,
                        headers,
                    }, this);
                    return [this.helpers.returnJsonArray(dataCobros)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray([])];
                }
            case 'searchCustomer': {
                const customerEmail = this.getNodeParameter('email', 0, '');
                const dni = this.getNodeParameter('dni', 0, '');
                const cuit = this.getNodeParameter('cuit', 0, '');
                const razonSocial = this.getNodeParameter('razonSocial', 0, '');
                const searches = [
                    {
                        queryParams: customerEmail ? { Email: customerEmail } : {},
                        description: 'email',
                    },
                    {
                        queryParams: dni ? { Codigo: `web-${dni}` } : {},
                        description: 'DNI',
                    },
                    {
                        queryParams: cuit ? { Cuit: cuit } : {},
                        description: 'CUIT',
                    },
                    {
                        queryParams: razonSocial ? { razonSocial } : {},
                        description: 'razón social',
                    },
                ];
                let user = null;
                try {
                    for (const { queryParams, description } of searches) {
                        if (Object.keys(queryParams).length === 0) {
                            console.log(`Skipping search by ${description}: no parameter provided`);
                            continue;
                        }
                        const requestDetails = {
                            url: `${centumUrl}/Clientes`,
                            headers,
                            queryParams,
                        };
                        try {
                            console.log(`[${description}] Request Details:`, JSON.stringify(requestDetails, null, 2));
                            const response = await (0, api_1.apiRequest)(requestDetails.url, {
                                headers: requestDetails.headers,
                                queryParams: requestDetails.queryParams,
                            }, this);
                            console.log(`[${description}] Response:`, JSON.stringify(response, null, 2));
                            if (response.CantidadTotalItems === 1) {
                                user = response;
                                break;
                            }
                        }
                        catch (error) {
                            console.log(`[${description}] Error during API request:`, { error, requestDetails });
                            continue;
                        }
                    }
                    const result = user?.Items || [];
                    return [this.helpers.returnJsonArray(result)];
                }
                catch (error) {
                    console.log('🚨 General error during customer search:', error);
                    return [this.helpers.returnJsonArray([])];
                }
            }
            case 'listBranches':
                try {
                    const dataListBranches = await (0, api_1.apiRequest)(`${centumUrl}/SucursalesFisicas`, {
                        headers,
                    }, this);
                    return [this.helpers.returnJsonArray(dataListBranches)];
                }
                catch (error) {
                    console.log(error);
                    return [this.helpers.returnJsonArray(error.response.data)];
                }
            case 'json':
                const data = this.getInputData();
                const json = (0, functions_1.createJsonProducts)(data);
                return [this.helpers.returnJsonArray(json)];
            case 'productList':
                try {
                    const payload = {
                        "IdCliente": 47924,
                        "FechaDocumento": "2024-05-31",
                        "Habilitado": true,
                        "ActivoWeb": true
                    };
                    const dataProductos = await (0, api_1.apiRequest)(`${centumUrl}/Articulos/Venta`, {
                        method: 'POST',
                        body: payload,
                        headers
                    }, this);
                    const items = dataProductos.Articulos?.Items || [];
                    const formateoObjeto = items.map((item) => ({
                        IdArticulo: item.IdArticulo,
                        Codigo: item.Codigo,
                        Nombre: item.Nombre,
                        NombreFantasia: item.NombreFantasia,
                        Habilitado: item.Habilitado,
                        ActivoWeb: item.ActivoWeb,
                        Precio: item.Precio,
                        FechaUltimaActualizacionPrecio: item.FechaUltimaActualizacionPrecio,
                        StockDisponible: item.StockDisponible,
                        Rubro: item.Rubro ? {
                            IdRubro: item.Rubro.IdRubro,
                            Codigo: item.Rubro.Codigo,
                            Nombre: item.Rubro.Nombre
                        } : null,
                        SubRubro: item.SubRubro ? {
                            IdSubRubro: item.SubRubro.IdSubRubro,
                            Codigo: item.SubRubro.Codigo,
                            Nombre: item.SubRubro.Nombre,
                            IdRubro: item.SubRubro.IdRubro
                        } : null,
                        CategoriaArticulo: item.CategoriaArticulo ? {
                            IdCategoriaArticulo: item.CategoriaArticulo.IdCategoriaArticulo,
                            Codigo: item.CategoriaArticulo.Codigo,
                            Nombre: item.CategoriaArticulo.Nombre,
                            IdSubRubro: item.CategoriaArticulo.IdSubRubro
                        } : null
                    }));
                    return [this.helpers.returnJsonArray(formateoObjeto)];
                }
                catch (error) {
                    return [this.helpers.returnJsonArray([])];
                }
            default:
                return [this.helpers.returnJsonArray([])];
        }
    }
}
exports.Centum = Centum;
//# sourceMappingURL=Centum.node.js.map