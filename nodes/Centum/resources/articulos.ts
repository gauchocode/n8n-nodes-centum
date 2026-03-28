import { NodeOperationError } from "n8n-workflow";
import * as helperFns from "../helpers/functions";
import type { ResourceHandler, ResourceHandlerMap } from "./tipos";

const buscarProductos: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const nombreArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "nombreArticulo", itemIndex, "") as string;
	const codigoArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "codigoArticulo", itemIndex, "") as string;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body: { Nombre: nombreArticulo, Codigo: codigoArticulo },
		});

		return [executeFunctions.helpers.returnJsonArray(response as any)];
	} catch (error) {
		throw new NodeOperationError(executeFunctions.getNode(), `Hubo un error al buscar el articulo. Error: ${error}`);
	}
};

const buscarProductoPorCodigo: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const codigoRaw = helperFns.getNodeParameterOrThrow(executeFunctions, "codigoArticulo", itemIndex) as string;
	const articleIdRaw = helperFns.getNodeParameterOrThrow(executeFunctions, "articleId", itemIndex) as string;

	const codigo = codigoRaw.trim();
	const ids = articleIdRaw
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

	if (!codigo && ids.length === 0) {
		throw new NodeOperationError(executeFunctions.getNode(), "El id o codigo del articulo es obligatorio");
	}

	try {
		let articulo: any;

		// 1) Prioridad: buscar por IDs
		if (ids.length > 0) {
			articulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: "POST",
				headers,
				body: { Ids: ids },
			});

			const empty = !articulo || (Array.isArray(articulo) && articulo.length === 0);

			// 2) Fallback: si no encontró nada, buscar por código
			if (empty && codigo) {
				articulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
					context: executeFunctions,
					debugItemIndex: itemIndex,
					method: "POST",
					headers,
					body: { CodigoExacto: codigo },
				});
			}
		} else {
			// Solo código
			articulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: "POST",
				headers,
				body: { CodigoExacto: codigo },
			});
		}

		return [executeFunctions.helpers.returnJsonArray(articulo)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";

		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const consultarStock: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const branchOfficeIds = String(helperFns.getNodeParameterOrThrow(executeFunctions, "branchOfficeIds", itemIndex));
	try {
		const dataArticulosExistencia = await helperFns.apiRequest<any>(`${centumUrl}/ArticulosExistencias`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			queryParams: {
				idsSucursalesFisicas: branchOfficeIds,
			},
		});

		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencia.Items as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarProductosDisponibles: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientId = helperFns.getNodeParameterOrThrow(executeFunctions, "clienteId", itemIndex);
	const documentDate: any = helperFns.getNodeParameterOrThrow(executeFunctions, "documentDate", itemIndex);
	const IdsRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "rubroId", itemIndex);
	const completeMigration = helperFns.getNodeParameterOrThrow(executeFunctions, "migracionCompleta", itemIndex);
	const IdsSubRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "idsSubRubros", itemIndex);
	const formattedDocumentDate = documentDate.replace(/\..+/, "");
	const dateModified = helperFns.getNodeParameterOrThrow(executeFunctions, "dateModified", itemIndex);
	const dateModifiedImage = helperFns.getNodeParameterOrThrow(executeFunctions, "dateModifiedImage", itemIndex);
	const priceDateModified = helperFns.getNodeParameterOrThrow(executeFunctions, "priceDateModifiedTo", itemIndex);
	const numeroPagina = helperFns.getNodeParameterOrThrow(executeFunctions, "numeroPagina", itemIndex);
	const cantidadPorPagina = helperFns.getNodeParameterOrThrow(executeFunctions, "cantidadPorPagina", itemIndex);
	const bodyToSend = {
		idCliente: clientId,
		FechaDocumento: formattedDocumentDate,
		incluirAtributosArticulos: true,
		IdsRubro: IdsRubro ? [IdsRubro] : [],
		IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [""],
		fechaModificacionDesde: dateModified ? dateModified : "",
		fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : "",
		fechaPrecioActualizadoDesde: priceDateModified,
		numeroPagina,
		cantidadPorPagina,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			body: bodyToSend,
			headers,
			queryParams: { tipoOrdenArticulos: "Codigo" },
		});

		if (response.Articulos.Items.length > 0) {
			const items = response.Articulos.Items;
			if (!completeMigration) {
				const acc: Array<Record<string, unknown>> = [];
				for (const item of items) {
					const groupArticle = item.GrupoArticulo;
					if (!groupArticle) continue;

					//  const centumSuiteAccessToken = helperFns.createHash(
					//  	centumApiCredentials.publicAccessKey as string,
					//  );
					//  const requestHeaders: any = {
					//  	CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
					//  	CentumSuiteAccessToken: centumSuiteAccessToken,
					//  };

					const body = {
						idCliente: clientId,
						FechaDocumento: formattedDocumentDate,
						incluirAtributosArticulos: true,
						IdsRubro: IdsRubro ? [IdsRubro] : [],
						IdsSubRubro: IdsSubRubro ? [IdsSubRubro] : [""],
						NombreGrupoArticulo: groupArticle.Nombre,
						IdGrupoArticulo: groupArticle.IdGrupoArticulo,
					};

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
							context: executeFunctions,
							debugItemIndex: itemIndex,
							method: "POST",
							headers: { ...headers }, // reusar headers de la primera request
							body,
							queryParams: { tipoOrdenArticulos: "Codigo" },
						});

						if (response.Articulos.Items.length > 0) {
							acc.push(...response.Articulos.Items);
						}
					} catch (error) {
						const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				}
				const combinedArrays = [...acc, ...items];
				const filteredArray = Array.from(new Map(combinedArrays.map((obj) => [obj.IdArticulo, obj])).values());

				const itemsArray = filteredArray.map((item: any) => ({
					...item,
					AtributosArticulo: item.Habilitado && item.ActivoWeb ? item.AtributosArticulo : [],
				}));

				return [executeFunctions.helpers.returnJsonArray(itemsArray as any)];
			}
			return [executeFunctions.helpers.returnJsonArray(items as any)];
		} else {
			return [executeFunctions.helpers.returnJsonArray([{}])];
		}
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const descargarImagenesProductos: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const arrResult: any[] = [];

	const inputData = executeFunctions.getInputData();
	const requestUrl = `${centumUrl}/ArticulosImagenes`;

	for (let i = 0; i < inputData.length; i++) {
		const element = inputData[i];
		const dataObj: { idArticulo: number; images: any[] | null; infoImages: any[] } = {
			idArticulo: element.json.IdArticulo as number,
			images: [],
			infoImages: [],
		};

		const allArticleImages = await helperFns.centumGetArticleImages(
			1,
			element.json.IdArticulo as any,
			{
				consumerApiPublicId: String(consumerApiPublicId),
				publicAccessKey: String(centumApiCredentials.publicAccessKey as string),
			},
			requestUrl,
		);

		if (allArticleImages instanceof Error) {
			continue;
		}

		if (allArticleImages.length > 0) {
			for (let j = 0; j < allArticleImages.length; j++) {
				const binary: any = {};
				const dataImage = allArticleImages[j];
				const buffer = Buffer.from(dataImage.buffer);
				binary["data"] = await executeFunctions.helpers.prepareBinaryData(buffer);
				binary.data.fileName = `${element.json.Codigo}_${j + 1}.${binary.data.fileExtension}`;

				dataObj.images!.push(binary);
				dataObj.infoImages!.push({
					lastModified: dataImage.lastModified,
					orderNumber: dataImage.orderNumber,
				});

				const existObj = arrResult.find((obj) => obj.idArticulo === element.json.IdArticulo);

				if (!existObj) {
					arrResult.push(dataObj);
				}
			}
		} else {
			dataObj.images = null;
			arrResult.push(dataObj);
		}
	}

	return [executeFunctions.helpers.returnJsonArray(arrResult)];
};

const listarTodosLosProductos: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const ajustesHTTP = helperFns.getHttpSettings.call(executeFunctions);
		const articulosURL = `${centumUrl}/Articulos/DatosGenerales`;

		const fetchOptions: any = {
			method: "POST",
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			body: {},
			queryParams: { tipoOrdenArticulos: "Nombre" },
			pagination: ajustesHTTP.pagination,
			cantidadItemsPorPagina: ajustesHTTP.cantidadItemsPorPagina,
			intervaloPagina: ajustesHTTP.intervaloPagina,
			numeroPagina: ajustesHTTP.numeroPagina,
		};
		const paginated = await helperFns.apiPostRequestPaginated<any>(articulosURL, fetchOptions);
		return [executeFunctions.helpers.returnJsonArray(paginated as any)];
	} catch (error) {
		let errorMessage = "Error desconocido";

		if ((error as any)?.response?.data?.Message) {
			errorMessage = (error as any).response.data.Message;
		} else if (error instanceof Error) {
			errorMessage = (error as any).message;
		}

		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const consultarPrecioProducto: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idArticulos = helperFns.getNodeParameterOrThrow(executeFunctions, "articleId", itemIndex);
	const idLista = helperFns.getNodeParameterOrThrow(executeFunctions, "idList", itemIndex);
	const priceDateModifiedFrom = helperFns.getNodeParameterOrThrow(executeFunctions, "priceDateModifiedFrom", itemIndex);
	const priceDateModifiedTo = helperFns.getNodeParameterOrThrow(executeFunctions, "priceDateModifiedTo", itemIndex);


	const idsNum = String(idArticulos)
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

	if (!idLista) {
		throw new NodeOperationError(executeFunctions.getNode(), "El id de la lista es obligatorio.");
	}
	console.log(idLista);
	try {
		const articulo = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/FiltrosPrecios`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "POST",
			headers,
			body: { IdLista: idLista, FechaPrecioActualizadoDesde: priceDateModifiedFrom, FechaPrecioActualizadoHasta: priceDateModifiedTo , IdsArticulos: idsNum },
		});

		return [executeFunctions.helpers.returnJsonArray(articulo)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarProductosPorSucursal: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const IdSucursalFisica = helperFns.getNodeParameterOrThrow(executeFunctions, "idSucursalFisica", itemIndex) as string;
	const IdArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "articleId", itemIndex) as string;
	const NombreArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "nombreArticulo", itemIndex) as string;
	const IdRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "rubroId", itemIndex) as string;
	const IdSubRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "idsSubRubros", itemIndex) as string;
	const IdCategoriaArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "IdCategoriaArticulo", itemIndex) as string;
	const IdMarcaArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "IdMarcaArticulo", itemIndex) as string;

	// Si no filtra por artículo, sucursal + al menos una segmentación son obligatorios
	if (!IdArticulo) {
		if (!IdSucursalFisica) {
			throw new NodeOperationError(executeFunctions.getNode(), "Si no filtra por artículo, el id de la sucursal física es obligatorio");
		}

		const tieneSegmentacion = NombreArticulo || IdRubro || IdSubRubro || IdCategoriaArticulo || IdMarcaArticulo;
		if (!tieneSegmentacion) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				"Si no filtra por artículo, debe especificar al menos una segmentación: Nombre, IdRubro, IdSubRubro, IdCategoriaArticulo o IdMarcaArticulo",
			);
		}
	}

	const queryParams: Record<string, string> = {};

	if (IdSucursalFisica) queryParams.idsSucursalesFisicas = IdSucursalFisica;
	if (IdArticulo) queryParams.idsArticulos = IdArticulo;
	if (NombreArticulo) queryParams.nombre = NombreArticulo;
	if (IdRubro) queryParams.idRubro = IdRubro;
	if (IdSubRubro) queryParams.idSubRubro = IdSubRubro;
	if (IdCategoriaArticulo) queryParams.idCategoriaArticulo = IdCategoriaArticulo;
	if (IdMarcaArticulo) queryParams.idMarcaArticulo = IdMarcaArticulo;

	try {
		const dataArticulosExistencias = await helperFns.apiRequest<any>(`${centumUrl}/ArticulosSucursalesFisicas`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const buscarProductoEnSucursal: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const IdSucursalFisica = helperFns.getNodeParameterOrThrow(executeFunctions, "idSucursalFisica", itemIndex) as string;
	const idArticulo = helperFns.getNodeParameterOrThrow(executeFunctions, "articleId", itemIndex) as string;
	const queryParams: {
		IdSucursalFisica?: string;
		idsArticulos: string;
	} = {
		IdSucursalFisica: IdSucursalFisica,
		idsArticulos: idArticulo,
	};

	if (!IdSucursalFisica || !idArticulo) {
		throw new NodeOperationError(executeFunctions.getNode(), "El id de la sucursal fisica y el id del articulo son obligatorios");
	}
	try {
		const dataArticulosExistencias = await helperFns.apiRequest<any>(`${centumUrl}/ArticulosSucursalesFisicas`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarCategorias: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const subRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "idsSubRubros", itemIndex);
	let url = `${centumUrl}/CategoriasArticulo`;

	if (subRubro) {
		url = `${url}?idSubRubro=${subRubro}`;
	}

	try {
		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		throw new NodeOperationError(executeFunctions.getNode(), `Hubo un error al obtener el listado de categorias. Error: ${error}`);
	}
};

const listarMarcas: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/MarcasArticulo`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error en obtener el listado de marcas. \n ${errorMessage}`);
	}
};

const listarRubros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Rubros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarSubRubros: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idRubro = helperFns.getNodeParameterOrThrow(executeFunctions, "rubroId", itemIndex) as string;
	const queryParams: Record<string, string> = {};

	if (idRubro) queryParams.idRubro = idRubro;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/SubRubros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listarUbicacionArticulos: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const ubicacionArticulos = await helperFns.apiRequest<any>(`${centumUrl}/UbicacionesArticulos`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: "GET",
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(ubicacionArticulos)];
	} catch (error) {
		const errorMessage = error?.response?.data?.Message || (error as any).message || "Error desconocido";
		throw new NodeOperationError(executeFunctions.getNode(), `Error obteniendo las ubicaciones de los articulos: ${errorMessage}`);
	}
};

const convertirProductosParaWooCommerce: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const data = executeFunctions.getInputData();

	const json = helperFns.createJsonProducts(data as unknown as any[]);

	return [executeFunctions.helpers.returnJsonArray(json as any)];
};

const sincronizarImagenes: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId, itemIndex } = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const dataImages = helperFns.getNodeParameterOrThrow(executeFunctions, "dataImg", itemIndex) as {
		json: {
			idArticulo: number;
			images: any[];
			infoImages: { lastModified: string; orderNumber: number }[];
		};
	}[];
	const db = helperFns.getNodeParameterOrThrow(executeFunctions, "lastModifiedImg", itemIndex) as {
		articleId: number;
		dataImage: { orderNumber: number; lastModified: string }[];
	}[];

	const result: any[] = [];

	for (let i = 0; i < dataImages.length; i++) {
		const element = dataImages[i];

		for (let j = 0; j < element.json.images?.length; j++) {
			const currentData = element.json.images[j];
			const currentInfoImage = element.json.infoImages[j];

			const articleInDB = db.find((dbData) => dbData.articleId === element.json.idArticulo);

			if (!articleInDB) {
				result.push({ json: {}, binary: currentData });
			} else {
				const currentImageInDB = articleInDB.dataImage.find((dataImageDB) => dataImageDB.orderNumber === currentInfoImage.orderNumber);

				if (currentImageInDB?.lastModified !== currentInfoImage.lastModified) {
					result.push({ json: {}, binary: currentData });
				}
			}
		}
	}

	if (result.length === 0) {
		result.push({ json: {} });
	}

	return [result];
};

export const articulosHandlers: ResourceHandlerMap = {
	buscarProductos,
	buscarProductoPorCodigo,
	consultarStock,
	listarProductosDisponibles,
	descargarImagenesProductos,
	listarTodosLosProductos,
	consultarPrecioProducto,
	listarProductosPorSucursal,
	buscarProductoEnSucursal,
	listarCategorias,
	listarMarcas,
	listarRubros,
	listarSubRubros,
	listarUbicacionArticulos,
	convertirProductosParaWooCommerce,
	sincronizarImagenes,
};
