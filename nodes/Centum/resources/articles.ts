import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const searchProducts: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const articleName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleName',
		itemIndex,
		'',
	) as string;
	const articleCode = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleCode',
		itemIndex,
		'',
	) as string;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: { Nombre: articleName, Codigo: articleCode },
		});

		return [executeFunctions.helpers.returnJsonArray(response as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error searching for article. Error: ${error}`,
		);
	}
};

const getProductByCode: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const codeRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleCode',
		itemIndex,
	) as string;
	const articleIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleId',
		itemIndex,
	) as string;

	const code = codeRaw.trim();
	const ids = articleIdRaw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

	if (!code && ids.length === 0) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Article ID or code is required.');
	}

	try {
		let articleResponse: any;

		// 1) Priority: search by IDs
		if (ids.length > 0) {
			articleResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body: { Ids: ids },
			});

			const empty =
				!articleResponse || (Array.isArray(articleResponse) && articleResponse.length === 0);

			// 2) Fallback: if no item is found, search by code
			if (empty && code) {
				articleResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
					context: executeFunctions,
					debugItemIndex: itemIndex,
					method: 'POST',
					headers,
					body: { CodigoExacto: code },
				});
			}
		} else {
			// Search by code only
			articleResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body: { CodigoExacto: code },
			});
		}

		return [executeFunctions.helpers.returnJsonArray(articleResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';

		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getStock: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const branchOfficeIds = String(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'branchOfficeIds', itemIndex),
	);
	try {
		const dataArticulosExistencia = await helperFns.apiRequest<any>(
			`${centumUrl}/ArticulosExistencias`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				queryParams: {
					idsSucursalesFisicas: branchOfficeIds,
				},
			},
		);

		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencia.Items as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listAvailableProducts: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const clientId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const documentDate: any = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	);
	const groupId = helperFns.getNodeParameterOrThrow(executeFunctions, 'groupId', itemIndex);
	const completeMigration = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'fullMigration',
		itemIndex,
	);
	const subgroupIds = helperFns.getNodeParameterOrThrow(executeFunctions, 'subgroupIds', itemIndex);
	const formattedDocumentDate = documentDate.replace(/\..+/, '');
	const dateModified = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'dateModified',
		itemIndex,
	);
	const dateModifiedImage = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'dateModifiedImage',
		itemIndex,
	);
	const priceDateModified = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'priceDateModifiedTo',
		itemIndex,
	);
	const ajustesHTTP = helperFns.getHttpSettings.call(executeFunctions, itemIndex);
	const bodyToSend = {
		idCliente: clientId,
		FechaDocumento: formattedDocumentDate,
		incluirAtributosArticulos: true,
		IdsRubro: groupId ? [groupId] : [],
		IdsSubRubro: subgroupIds ? [subgroupIds] : [''],
		fechaModificacionDesde: dateModified ? dateModified : '',
		fechaModificacionImagenesDesde: dateModifiedImage ? dateModifiedImage : '',
		fechaPrecioActualizadoDesde: priceDateModified,
		numeroPagina: ajustesHTTP.pageNumber,
		cantidadPorPagina: ajustesHTTP.itemsPerPage,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body: bodyToSend,
			headers,
			queryParams: { tipoOrdenArticulos: 'Codigo' },
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
						IdsRubro: groupId ? [groupId] : [],
						IdsSubRubro: subgroupIds ? [subgroupIds] : [''],
						NombreGrupoArticulo: groupArticle.Nombre,
						IdGrupoArticulo: groupArticle.IdGrupoArticulo,
					};

					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/Venta`, {
							context: executeFunctions,
							debugItemIndex: itemIndex,
							method: 'POST',
							headers: { ...headers }, // reusar headers de la primera request
							body,
							queryParams: { tipoOrdenArticulos: 'Codigo' },
						});

						if (response.Articulos.Items.length > 0) {
							acc.push(...response.Articulos.Items);
						}
					} catch (error) {
						if (error instanceof NodeApiError) {
							throw error;
						}
						const errorMessage =
							error?.response?.data?.Message || (error as any).message || 'Unknown error';
						throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
					}
				}
				const combinedArrays = [...acc, ...items];
				const filteredArray = Array.from(
					new Map(combinedArrays.map((obj) => [obj.IdArticulo, obj])).values(),
				);

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
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const downloadProductImages: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
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
				binary['data'] = await executeFunctions.helpers.prepareBinaryData(buffer);
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

const listAllProducts: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const ajustesHTTP = helperFns.getHttpSettings.call(executeFunctions, itemIndex);
		const articlesUrl = `${centumUrl}/Articulos/DatosGenerales`;

		const fetchOptions: any = {
			method: 'POST',
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			body: {},
			queryParams: { tipoOrdenArticulos: 'Nombre' },
			pagination: ajustesHTTP.pagination,
			itemsPerPage: ajustesHTTP.itemsPerPage,
			pageInterval: ajustesHTTP.pageInterval,
			pageNumber: ajustesHTTP.pageNumber,
		};
		const paginated = await helperFns.apiPostRequestPaginated<any>(articlesUrl, fetchOptions);
		return [executeFunctions.helpers.returnJsonArray(paginated as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		let errorMessage = 'Unknown error';

		if ((error as any)?.response?.data?.Message) {
			errorMessage = (error as any).response.data.Message;
		} else if (error instanceof Error) {
			errorMessage = (error as any).message;
		}

		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getProductPrice: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const idArticulos = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleId',
		itemIndex,
		'',
	);
	const priceListId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'priceListId', itemIndex),
	);
	const priceDateModifiedFrom = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'priceDateModifiedFrom',
		itemIndex,
	);
	const priceDateModifiedTo = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'priceDateModifiedTo',
		itemIndex,
	);

	const articleIds = String(idArticulos)
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

	if (articleIds.length > 1) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Product price lookup only supports a single article ID.',
		);
	}

	if (!priceListId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Price list ID is required.');
	}

	const requestBody: Record<string, string | number> = {
		IdLista: Number(priceListId),
	};

	if (articleIds.length === 1) {
		const articleIdValue = Number(articleIds[0]);
		requestBody.IdsArticulos = Number.isFinite(articleIdValue) ? articleIdValue : articleIds[0];
	}

	if (priceDateModifiedFrom) {
		requestBody.FechaPrecioActualizadoDesde = String(priceDateModifiedFrom);
	}

	if (priceDateModifiedTo) {
		requestBody.FechaPrecioActualizadoHasta = String(priceDateModifiedTo);
	}

	try {
		const priceResponse = await helperFns.apiRequest<any>(`${centumUrl}/Articulos/FiltrosPrecios`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: requestBody,
		});
		return [executeFunctions.helpers.returnJsonArray(priceResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listProductsByBranch: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const physicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const IdArticulo = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleId',
		itemIndex,
	) as string;
	const articleName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleName',
		itemIndex,
	) as string;
	const groupId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'groupId',
		itemIndex,
	) as string;
	const subgroupIds = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'subgroupIds',
		itemIndex,
	) as string;
	const articleCategoryId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleCategoryId',
		itemIndex,
	) as string;
	const articleBrandId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleBrandId',
		itemIndex,
	) as string;

	// When article filtering is not used, branch plus at least one segmentation field is required
	if (!IdArticulo) {
		if (!physicalBranchId) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Physical branch ID is required when article filtering is not used.',
			);
		}

		const hasSegmentation =
			articleName || groupId || subgroupIds || articleCategoryId || articleBrandId;
		if (!hasSegmentation) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'When article filtering is not used, specify at least one segmentation value: articleName, groupId, subgroupIds, articleCategoryId, or articleBrandId.',
			);
		}
	}

	const queryParams: Record<string, string> = {};

	if (physicalBranchId) queryParams.idsSucursalesFisicas = physicalBranchId;
	if (IdArticulo) queryParams.idsArticulos = IdArticulo;
	if (articleName) queryParams.nombre = articleName;
	if (groupId) queryParams.idRubro = groupId;
	if (subgroupIds) queryParams.idSubRubro = subgroupIds;
	if (articleCategoryId) queryParams.idCategoriaArticulo = articleCategoryId;
	if (articleBrandId) queryParams.idMarcaArticulo = articleBrandId;

	try {
		const dataArticulosExistencias = await helperFns.apiRequest<any>(
			`${centumUrl}/ArticulosSucursalesFisicas`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				queryParams,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getProductInBranch: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const physicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'physicalBranchId', itemIndex),
	);
	const idArticulo = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleId',
		itemIndex,
	) as string;
	const queryParams: {
		IdSucursalFisica?: string;
		idsArticulos: string;
	} = {
		IdSucursalFisica: physicalBranchId,
		idsArticulos: idArticulo,
	};

	if (!physicalBranchId || !idArticulo) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Physical branch ID and article ID are required.',
		);
	}
	try {
		const dataArticulosExistencias = await helperFns.apiRequest<any>(
			`${centumUrl}/ArticulosSucursalesFisicas`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				queryParams,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(dataArticulosExistencias.Items as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listCategories: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const subgroupId = helperFns.getNodeParameterOrThrow(executeFunctions, 'subgroupIds', itemIndex);
	let url = `${centumUrl}/CategoriasArticulo`;

	if (subgroupId) {
		url = `${url}?idSubRubro=${subgroupId}`;
	}

	try {
		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting category list. Error: ${error}`,
		);
	}
};

const listBrands: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/MarcasArticulo`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error en obtener el listado de marcas. \n ${errorMessage}`,
		);
	}
};

const listGroups: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Rubros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listSubgroups: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const groupId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'groupId',
		itemIndex,
	) as string;
	const queryParams: Record<string, string> = {};

	if (groupId) queryParams.idRubro = groupId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/SubRubros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listArticleLocations: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const articleLocationsResponse = await helperFns.apiRequest<any>(
			`${centumUrl}/UbicacionesArticulos`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(articleLocationsResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting article locations: ${errorMessage}`,
		);
	}
};

const getArticleLocationsBySection: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const branchSectionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'branchSectionId',
		itemIndex,
	);

	try {
		const articleLocationsResponse = await helperFns.apiRequest<any>(
			`${centumUrl}/UbicacionesArticulos/${branchSectionId}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(articleLocationsResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting article locations by section: ${errorMessage}`,
		);
	}
};

const convertProductsForWooCommerce: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const data = executeFunctions.getInputData();

	const json = helperFns.createJsonProducts(data as unknown as any[]);

	return [executeFunctions.helpers.returnJsonArray(json as any)];
};

export const articlesHandlers: ResourceHandlerMap = {
	searchProducts: searchProducts,
	getProductByCode: getProductByCode,
	getStock: getStock,
	listAvailableProducts: listAvailableProducts,
	downloadProductImages: downloadProductImages,
	listAllProducts: listAllProducts,
	getProductPrice: getProductPrice,
	listProductsByBranch: listProductsByBranch,
	getProductInBranch: getProductInBranch,
	listCategories: listCategories,
	listBrands: listBrands,
	listGroups: listGroups,
	listSubgroups: listSubgroups,
	listArticleLocations: listArticleLocations,
	getArticleLocationsBySection: getArticleLocationsBySection,
	convertProductsForWooCommerce: convertProductsForWooCommerce,
};
