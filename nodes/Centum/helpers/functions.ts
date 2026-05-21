import { randomUUID, createHash as cryptoCreateHash } from 'crypto';
import { setTimeout as delay } from 'node:timers/promises';
import {
	provinceConstants,
	zoneConstants,
} from '../constants';

import {
	IWoo,
	INewCustomer,
	LineItem,
	INewPedidoVenta,
	IArticuloPedidoVenta,
	ListaPrecioCodigo,
	Descripcion,
	Item,
	IMergeArticulos,
	IGroupWoo,
	IWooArticle,
	ShippingLine,
	CobroId,
} from '../interfaces';
import {
	NodeParameterValue,
	IExecuteFunctions,
	NodeApiError,
	NodeOperationError,
	NodeParameterValueType,
} from 'n8n-workflow';
import type { CentumHeaders } from '../resources/types';

type PurchaseArticleLookup = {
	IdArticulo?: number;
	Codigo?: string;
	Nombre?: string;
	CategoriaImpuestoIVA?: {
		IdCategoriaImpuestoIVA?: number;
		Codigo?: string;
		Nombre?: string;
		Tasa?: number;
	};
	PrecioListaCompra?: number;
	DescuentoItem1?: number;
	DescuentoItem2?: number;
	DescuentoItem3?: number;
};

export type ResolvedPurchaseArticle = {
	IdArticulo: number;
	Codigo: string;
	Nombre: string;
	CategoriaImpuestoIVA: {
		IdCategoriaImpuestoIVA: number;
		Codigo?: string;
		Nombre?: string;
		Tasa?: number;
	};
	Precio: number;
	PorcentajeDescuento1: number;
	PorcentajeDescuento2: number;
	PorcentajeDescuento3: number;
};

export const createHash = (publicAccessKey: string): string => {
	const uuid = randomUUID().replace(/-/gi, '');
	//yyyy-MM-ddTHH:mm:ss
	const currentDateFormatted = new Date().toISOString().replace(/\..+/, '');

	const hash = cryptoCreateHash('sha1');
	hash.update(`${currentDateFormatted} ${uuid} ${publicAccessKey}`);
	const hashedResult = hash.digest('hex');

	return `${currentDateFormatted} ${uuid} ${hashedResult}`;
};

export const resolvePurchaseArticles = async (
	context: IExecuteFunctions,
	centumUrl: string,
	headers: CentumHeaders,
	itemIndex: number,
	articleIds: number[],
): Promise<Map<number, ResolvedPurchaseArticle>> => {
	const uniqueIds = [...new Set(articleIds.filter((articleId) => Number.isFinite(articleId)))];

	if (uniqueIds.length === 0) {
		return new Map();
	}

	const response = await apiRequest<any>(`${centumUrl}/Articulos/DatosGenerales`, {
		context,
		debugItemIndex: itemIndex,
		method: 'POST',
		headers,
		body: {
			Ids: uniqueIds,
		},
	});

	const responseItems: PurchaseArticleLookup[] = Array.isArray(response)
		? response
		: Array.isArray(response?.Articulos?.Items)
			? response.Articulos.Items
			: [];
	const articlesById = new Map<number, ResolvedPurchaseArticle>();

	for (const articleId of uniqueIds) {
		const resolvedRaw = responseItems.find(
			(item: PurchaseArticleLookup) => Number(item.IdArticulo) === articleId,
		);

		if (!resolvedRaw) {
			throw new NodeOperationError(
				context.getNode(),
				`Article ${articleId} was not found in Centum.`,
				{ itemIndex },
			);
		}

		const resolvedArticle: ResolvedPurchaseArticle = {
			IdArticulo: Number(resolvedRaw.IdArticulo),
			Codigo: String(resolvedRaw.Codigo ?? '').trim(),
			Nombre: String(resolvedRaw.Nombre ?? '').trim(),
			CategoriaImpuestoIVA: {
				IdCategoriaImpuestoIVA: Number(resolvedRaw.CategoriaImpuestoIVA?.IdCategoriaImpuestoIVA),
				Codigo:
					typeof resolvedRaw.CategoriaImpuestoIVA?.Codigo === 'string'
						? resolvedRaw.CategoriaImpuestoIVA.Codigo
						: undefined,
				Nombre:
					typeof resolvedRaw.CategoriaImpuestoIVA?.Nombre === 'string'
						? resolvedRaw.CategoriaImpuestoIVA.Nombre
						: undefined,
				Tasa:
					typeof resolvedRaw.CategoriaImpuestoIVA?.Tasa === 'number'
						? resolvedRaw.CategoriaImpuestoIVA.Tasa
						: undefined,
			},
			Precio: Number(resolvedRaw.PrecioListaCompra ?? 0),
			PorcentajeDescuento1: Number(resolvedRaw.DescuentoItem1 ?? 0),
			PorcentajeDescuento2: Number(resolvedRaw.DescuentoItem2 ?? 0),
			PorcentajeDescuento3: Number(resolvedRaw.DescuentoItem3 ?? 0),
		};

		if (!resolvedArticle.Codigo) {
			throw new NodeOperationError(
				context.getNode(),
				`Article ${articleId} does not include a valid Codigo in Centum.`,
				{ itemIndex },
			);
		}

		if (!resolvedArticle.Nombre) {
			throw new NodeOperationError(
				context.getNode(),
				`Article ${articleId} does not include a valid Nombre in Centum.`,
				{ itemIndex },
			);
		}

		if (!Number.isFinite(resolvedArticle.CategoriaImpuestoIVA.IdCategoriaImpuestoIVA)) {
			throw new NodeOperationError(
				context.getNode(),
				`Article ${articleId} does not include CategoriaImpuestoIVA in Centum.`,
				{ itemIndex },
			);
		}

		articlesById.set(articleId, resolvedArticle);
	}

	return articlesById;
};

export const createCustomerJson = (respWoo: IWoo, dni: string) => {
	const customerObj: INewCustomer = {
		TarifaServicio: {
			IdTarifaServicio: 1,
		},
		CodigoPostal: respWoo.billing.postcode,
		Direccion: respWoo.billing.address_1,
		IdCliente: -1,
		Localidad: respWoo.billing.city,
		RazonSocial: `${respWoo.billing.first_name} ${respWoo.billing.last_name}`,
		Email: respWoo.billing.email || '',
		Provincia:
			provinceConstants.find(
				(prov) => prov.Nombre.toLocaleLowerCase() === respWoo.billing.state.toLocaleLowerCase(),
			) || provinceConstants[5],
		Pais: {
			Codigo: 'ARG',
			IdPais: 4657,
			Nombre: 'Argentina',
		},
		Telefono: respWoo.billing.phone,
		DireccionEntrega: respWoo.shipping.address_1,
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
		UbicacionCliente: {
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
		Zona:
			zoneConstants.find(
				(zone) => zone.Nombre.toLocaleLowerCase() === respWoo.billing.city.toLocaleLowerCase(),
			) || zoneConstants[0],
		ListaPrecio: {
			Codigo: ListaPrecioCodigo.Exitoweb,
			Descripcion: Descripcion.TiendaOnLineExito,
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

export const createOrderSaleJson = (
	articles: Item[],
	client: INewCustomer,
	articlesOrder: LineItem[],
	shippingSalesOrder: ShippingLine[],
	idCobro: CobroId,
) => {
	let dbArticle: Item | undefined;
	const saleOrderObj: INewPedidoVenta = {
		Cliente: client,
		IdCobro: idCobro,
		FechaEntrega: new Date().toISOString(),
		Vendedor: client.Vendedor,
		Bonificacion: client.Bonificacion,
		PedidoVentaArticulos: articlesOrder.map((product) => {
			dbArticle = articles.find((stateArticle) => stateArticle.Codigo === product.sku);

			const metaData = product.meta_data;
			const quantity = product.quantity;

			const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
			const price = isProductQuoter
				? Number(product.total || 0) / quantity
				: Number(product.price || 0);

			const obj: IArticuloPedidoVenta = {
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
				//Precio: isProductQuoter ? Number(product.total) / quantity : product.price,
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
		}) as IArticuloPedidoVenta[],
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
			Nombre: 'Morning',
		},
	};

	// Check whether the shipping line already exists in the order. If it does, skip it.
	const isShippingAlreadyIncluded = articlesOrder.some((item) => item.sku === 'R06SR0601P00010007');
	// Add shipping cost as an extra article when it exists and has a positive price
	if (shippingSalesOrder.length > 0 && !isShippingAlreadyIncluded) {
		const shipping = shippingSalesOrder[0]; // WooCommerce usually only has one entry
		const shippingCost = Number(shipping.total || 0);
		if (shippingCost > 0) {
			const shippingItem: IArticuloPedidoVenta = {
				Nombre: shipping.method_title || 'Shipping Cost',
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

function getUniqueValues(array: IWooArticle[], key: string): IWooArticle[] {
	const uniqueValues: IWooArticle[] = [];
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

function centumGetArticleAttributes(article: { json: { AtributosArticulo: any[] } }) {
	return article.json.AtributosArticulo.map((article: any) => ({
		name: article.Nombre.trim(),
		value: article.Valor.trim().toLowerCase(),
	}));
}

// function centumGetArticleVariations(groupId: number, arrArticles: any) {
// 	const allAttributes: any = [];
// 	const articlesWithSameGroupId = arrArticles.filter(
// 		(article: { json: { GrupoArticulo: { IdGrupoArticulo: number } | null } }) =>
// 			article.json.GrupoArticulo !== null && article.json.GrupoArticulo.IdGrupoArticulo === groupId,
// 	);

// 	articlesWithSameGroupId.forEach((article: { json: { AtributosArticulo: any[] } }) => {
// 		allAttributes.push(...centumGetArticleAttributes(article));
// 	});

// 	const variations = articlesWithSameGroupId.map((article: { json: any }) => ({
// 		sku: article.json.Codigo,
// 		regular_price: article.json.Precio,
// 		enabled: article.json.Habilitado === true && article.json.ActivoWeb === true,
// 		attributes: centumGetArticleAttributes(article),
// 		stock: article.json.ExistenciasSucursales,
// 		dimensions: {
// 			height: article.json.Alto * 100,
// 			length: article.json.Largo * 100,
// 			width: article.json.Ancho * 100,
// 			weight: article.json.Masa,
// 		},
// 		images: article.json.images?.map((image: any) => image.data.fileName) || [],
// 		description: article.json.Detalle ?? '',
// 	}));

// 	const allUniqueAttributes = getUniqueValues(allAttributes, 'value');

// 	return [variations, allUniqueAttributes];
// }

function centumGetArticleVariations(groupId: number, arrArticles: any) {
	const allAttributes: any = [];
	const articlesWithSameGroupId = arrArticles.filter(
		(article: { json: { GrupoArticulo: { IdGrupoArticulo: number } | null } }) =>
			article.json.GrupoArticulo !== null && article.json.GrupoArticulo.IdGrupoArticulo === groupId,
	);

	articlesWithSameGroupId.forEach((article: { json: { AtributosArticulo: any[] } }) => {
		allAttributes.push(...centumGetArticleAttributes(article));
	});

	const variations = articlesWithSameGroupId.map((article: { json: any }) => {
		const regular = Number(article.json.Precio);
		const variation: any = {
			sku: article.json.Codigo,
			regular_price: regular,
			enabled: article.json.Habilitado === true && article.json.ActivoWeb === true,
			attributes: centumGetArticleAttributes(article),
			stock: article.json.ExistenciasSucursales,
			dimensions: {
				height: article.json.Alto * 100,
				length: article.json.Largo * 100,
				width: article.json.Ancho * 100,
				weight: article.json.Masa,
			},
			images: article.json.images?.map((image: any) => image.data.fileName) || [],
			description: article.json.Detalle ?? '',
		};

		// Set sale_price only when the property exists and the value is valid (< regular)
		if (article.json.DescuentoPromocion != null) {
			const desc = Math.abs(Number(article.json.DescuentoPromocion));
			const sale = regular - desc;
			if (Number.isFinite(sale) && sale > 0 && sale < regular) {
				variation.sale_price = sale;
			}
		}

		return variation;
	});

	const allUniqueAttributes = getUniqueValues(allAttributes, 'value');

	return [variations, allUniqueAttributes];
}

export const createJsonProducts = (arrArticles: IMergeArticulos[]) => {
	const wooProducts: IGroupWoo = {
		products: [],
	};

	const articleGroupIds: any[] = [];

	for (const article of arrArticles) {
		const obj: any = {};
		// Skip entries that do not include a JSON payload
		if (!article?.json) {
			continue;
		}

		obj.dimensions = {
			height: article.json.Alto * 100,
			length: article.json.Largo * 100,
			width: article.json.Ancho * 100,
			weight: article.json.Masa,
		};

		if (article.json.DescuentoPromocion) {
			obj.sale_price = article.json.Precio - Math.abs(article.json.DescuentoPromocion);
		}
		obj.regular_price = article.json.Precio;

		// Normalize description so matching logic does not run on undefined
		const description = article?.json?.Detalle || '';

		const pattern = /\/{2,}/g;
		const matches = (description.match(pattern) || []).length;

		if (matches > 0) {
			const parts = description.split(pattern);
			obj.short_description = parts[0].replace(/<[^>]+>/g, '');
			obj.description = parts[1].replace(/^<\/\w+>/, '');
		} else {
			obj.description = description;
		}
		// End normalization

		// obj.categories = [
		// 	{
		// 		id: article.json.Rubro.IdRubro,
		// 		name: article.json.Rubro.Nombre,
		// 		subCategories: [
		// 			{
		// 				id: article.json.SubRubro.IdSubRubro,
		// 				name: article.json.SubRubro.Nombre,
		// 				category: {
		// 					id: article.json.CategoriaArticulo?.IdCategoriaArticulo,
		// 					// name: article.json.SubRubro.Nombre + article.json.CategoriaArticulo?.Nombre ?  " " + article.json.CategoriaArticulo?.Nombre : "",
		// 					// name:  article.json.CategoriaArticulo?.Nombre ?  "" + article.json.CategoriaArticulo?.Nombre : "",
		//
		// 				},
		// 			},
		// 		],
		//
		// 	},
		// ];
		obj.categories = [
			{
				id: article.json.Rubro.IdRubro,
				name: article.json.Rubro.Nombre,
				subCategories: [
					{
						id: article.json.SubRubro.IdSubRubro,
						name: article.json.SubRubro.Nombre,
						category: article.json.CategoriaArticulo?.IdCategoriaArticulo // Verificar que primero exista el objecto, y despues armarlo
							? {
									id: article.json.CategoriaArticulo.IdCategoriaArticulo,
									// name: article.json.SubRubro.Nombre +  article.json.CategoriaArticulo.Nombre || CORTINAS AMERICANAS PVC
									name: article.json.CategoriaArticulo.Nombre, // PVC
								}
							: undefined,
					},
				],
			},
		];

		obj.tags = article.json.Tags;

		if (article.json.GrupoArticulo !== null) {
			if (articleGroupIds.includes(article.json.GrupoArticulo.IdGrupoArticulo)) {
				continue;
			}
			const [variations, allAttributes] = centumGetArticleVariations(
				article.json.GrupoArticulo.IdGrupoArticulo,
				arrArticles,
			);

			obj.name = article.json.GrupoArticulo.Nombre;
			obj.type = 'variable';
			obj.variations = variations;
			obj.attributes = allAttributes;
			obj.sku = article.json.GrupoArticulo.IdGrupoArticulo.toString();
			obj.short_description =
				article.json.GrupoArticulo.Detalle; /* [MRF 2024-09-11] - adding short description based on GrupoArticulo.Detalle */
			// obj.description = article.json.GrupoArticulo.Detalle; /* [MRF 2024-09-11] - long description was assigned in a previous step */

			wooProducts.products.push(obj);

			articleGroupIds.push(article.json.GrupoArticulo.IdGrupoArticulo);
		} else {
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

interface ObjImageData {
	orderNumber: number;
	articleId: number;
	buffer: ArrayBuffer;
	lastModified: string | undefined;
}

export async function centumGetArticleImages(
	orderNumber: number,
	articleId: NodeParameterValue,
	requestHeaders: { consumerApiPublicId: string; publicAccessKey: string },
	requestUrl: string,
	allImages: ObjImageData[] = [],
): Promise<ObjImageData[] | Error> {
	try {
		const url = new URL(`${requestUrl}/${articleId}`);
		url.searchParams.append('numeroOrden', orderNumber.toString());

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				CentumSuiteConsumidorApiPublicaId: requestHeaders.consumerApiPublicId,
				CentumSuiteAccessToken: createHash(requestHeaders.publicAccessKey),
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
			articleId: articleId as number,
			buffer,
			lastModified,
		});

		return await centumGetArticleImages(
			orderNumber + 1,
			articleId,
			requestHeaders,
			requestUrl,
			allImages,
		);
	} catch (e: any) {
		return e;
	}
}

export const centumImageName = (
	name: string,
	size: string,
	numberImage: number,
	fileExtension: string,
) => {
	return `${name.split(' ').join('').replace('.', '').toLocaleLowerCase()}${numberImage}_${size.split(' ').join('').replace('.', '_').toLocaleLowerCase()}.${fileExtension}`;
};

export interface HttpSettings {
	method?: 'GET' | 'POST';
	pagination: 'all' | 'default' | 'custom';
	itemsPerPage?: number;
}

interface DebugSettings {
	enableDebugLogging?: boolean;
	debugEndpointContains?: string;
	includeRequestBody?: boolean;
}

export function buildCentumHeaders(
	consumerId: string | number,
	publicKey: string,
): Record<string, string> {
	return {
		CentumSuiteConsumidorApiPublicaId: String(consumerId),
		CentumSuiteAccessToken: createHash(publicKey),
	};
}

export function getResourceLocatorValue(value: unknown): string {
	if (value === undefined || value === null) {
		return '';
	}

	if (typeof value === 'string' || typeof value === 'number') {
		return String(value);
	}

	if (typeof value === 'object' && 'value' in value) {
		const locatorValue = (value as { value?: unknown }).value;
		return locatorValue === undefined || locatorValue === null ? '' : String(locatorValue);
	}

	return '';
}

export function getHttpSettings(
	this: IExecuteFunctions,
	itemIndex = 0,
): HttpSettings & { pageInterval?: number; pageNumber?: number } {
	const httpSettings = this.getNodeParameter('httpSettings', itemIndex, {}) as HttpSettings & {
		pageInterval?: number;
		pageNumber?: number;
	};

	return httpSettings;
}

export function getDebugSettings(this: IExecuteFunctions, itemIndex = 0): DebugSettings {
	return this.getNodeParameter('debugSettings', itemIndex, {}) as DebugSettings;
}

export function getNodeParameterOrThrow<T = NodeParameterValueType | object>(
	executeFunctions: IExecuteFunctions,
	name: string,
	itemIndex: number,
	defaultValue?: T,
): T {
	try {
		if (arguments.length >= 4) {
			return executeFunctions.getNodeParameter(name, itemIndex, defaultValue as T) as T;
		}

		return executeFunctions.getNodeParameter(name, itemIndex) as T;
	} catch (error) {
		let resource = '';
		let operation = '';

		try {
			resource = String(executeFunctions.getNodeParameter('resource', itemIndex, ''));
		} catch {}

		try {
			operation = String(executeFunctions.getNodeParameter('operation', itemIndex, ''));
		} catch {}

		const scope = [resource, operation].filter(Boolean).join('/');
		const location = scope ? ` in ${scope}` : '';
		const detail = getErrorMessage(error, 'Could not get parameter');

		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Could not get parameter "${name}"${location} (item ${itemIndex + 1}). ${detail}`,
			{ itemIndex },
		);
	}
}

export interface FetchOptions {
	method?: 'GET' | 'POST';
	headers?: CentumHeaders;
	queryParams?: Record<string, object | NodeParameterValueType>;
	body?: object | NodeParameterValueType;
	itemsPerPage?: number;
	itemsField?: string;
	pageInterval?: number;
	pageNumber?: number;
	context?: IExecuteFunctions;
	debugItemIndex?: number;
	pagination?: 'all' | 'default' | 'custom';
	responseType?: 'json' | 'arraybuffer';
}

interface ApiErrorBody {
	message?: string;
	Message?: string;
	detail?: string;
	Detail?: string;
}

function redactHeaders(headers: Record<string, unknown>): Record<string, unknown> {
	const redacted = { ...headers };
	for (const key of Object.keys(redacted)) {
		const normalizedKey = key.toLowerCase();
		if (
			normalizedKey.includes('token') ||
			normalizedKey.includes('key') ||
			normalizedKey.includes('authorization')
		) {
			redacted[key] = '[redacted]';
		}
	}
	return redacted;
}

function logDebugMessage(
	context: IExecuteFunctions | undefined,
	message: string,
	data: unknown,
): void {
	let serializedData = '';

	if (data !== undefined) {
		try {
			serializedData = ` ${typeof data === 'string' ? data : JSON.stringify(data)}`;
		} catch {
			serializedData = ' [unserializable debug payload]';
		}
	}

	context?.logger?.info?.(`${message}${serializedData}`);
}

function logDebugErrorRequestBody(
	context: IExecuteFunctions | undefined,
	url: string,
	method: string,
	body: unknown,
): void {
	if (body === undefined) {
		return;
	}

	logDebugMessage(context, '[Centum debug] Error request body', {
		url,
		method,
		body,
	});
}

function getDebugConfig(
	context: IExecuteFunctions | undefined,
	finalUrl: string,
	itemIndex = 0,
): { shouldDebug: boolean } {
	const debugSettings = context ? getDebugSettings.call(context, itemIndex) : {};
	const debugEndpointFilter = debugSettings.debugEndpointContains?.trim() ?? '';
	const shouldDebug =
		debugSettings.enableDebugLogging === true &&
		(!debugEndpointFilter || finalUrl.includes(debugEndpointFilter));

	return { shouldDebug };
}

export function safeThrow(context: IExecuteFunctions | undefined, message: string): never {
	if (context) {
		throw new NodeOperationError(context.getNode(), message);
	} else {
		throw new Error(message);
	}
}

export function safeThrowWithItemIndex(
	context: IExecuteFunctions | undefined,
	message: string,
	itemIndex?: number,
): never {
	if (context) {
		throw new NodeOperationError(context.getNode(), message, {
			...(itemIndex === undefined ? {} : { itemIndex }),
		});
	}

	throw new Error(message);
}

export function safeThrowApi(
	context: IExecuteFunctions | undefined,
	message: string,
	description?: string,
	httpCode?: number,
	itemIndex?: number,
): never {
	if (context) {
		throw new NodeApiError(
			context.getNode(),
			{
				message,
				description,
				httpCode,
			} as never,
			{
				message,
				description,
				...(itemIndex === undefined ? {} : { itemIndex }),
			},
		);
	}

	throw new Error(description ? `${message} ${description}` : message);
}

export function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	if (typeof error === 'object' && error !== null) {
		const maybeError = error as {
			message?: string;
			response?: { data?: ApiErrorBody };
		};
		return (
			maybeError.response?.data?.Message ??
			maybeError.response?.data?.message ??
			maybeError.message ??
			fallback
		);
	}

	return fallback;
}

export function getErrorDescription(error: unknown): string | undefined {
	if (typeof error !== 'object' || error === null) {
		return undefined;
	}

	const maybeError = error as {
		description?: string;
		response?: { data?: ApiErrorBody };
	};

	return (
		maybeError.response?.data?.Detail ?? maybeError.response?.data?.detail ?? maybeError.description
	);
}

function buildUrl(baseUrl: string, queryParams: Record<string, any> = {}): string {
	const params = new URLSearchParams();
	Object.entries(queryParams).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			params.append(key, value.toString());
		}
	});
	return params.toString() ? `${baseUrl}?${params}` : baseUrl;
}

function extractItems<T>(data: any, itemsField?: string): T[] {
	if (data == null) {
		safeThrow(undefined, 'Invalid response: no items were found.');
	}

	if (itemsField && data[itemsField] && Array.isArray(data[itemsField])) {
		return data[itemsField];
	}
	if (Array.isArray(data)) {
		return data;
	}
	if (typeof data === 'object') {
		const arrayField = Object.values(data).find(Array.isArray);
		return arrayField || [data];
	}
	safeThrow(undefined, 'Invalid response: no items were found.');
}

export async function apiGetRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const {
		headers = {} as CentumHeaders,
		method = 'GET',
		queryParams = {},
		itemsPerPage,
		itemsField = 'Items',
		pageNumber,
		context,
		pagination = 'all',
		debugItemIndex,
		// pageInterval,
	} = options;

	if (!url.trim()) safeThrowWithItemIndex(context, 'Endpoint is required.', debugItemIndex);

	if (method === 'POST')
		safeThrowWithItemIndex(
			context,
			'A GET request was attempted without the correct method being assigned.',
			debugItemIndex,
		);

	const finalUrl = buildUrl(url, queryParams); // Without pagination parameters
	const requestHeaders = buildCentumHeaders(
		headers.CentumSuiteConsumidorApiPublicaId,
		headers.publicAccessKey,
	);
	const { shouldDebug } = getDebugConfig(context, finalUrl, options.debugItemIndex ?? 0);

	if (shouldDebug) {
		logDebugMessage(context, '[Centum debug] Request', {
			url: finalUrl,
			method,
			headers: redactHeaders(requestHeaders),
			hasBody: false,
		});
	}

	const response = await fetch(finalUrl, {
		method,
		headers: { ...requestHeaders },
	});

	const responseText = await response.text();

	if (shouldDebug) {
		logDebugMessage(context, '[Centum debug] Response', {
			url: finalUrl,
			status: response.status,
			statusText: response.statusText,
			contentType: response.headers.get('content-type') || '',
			bodyLength: responseText.length,
			body: responseText,
		});
	}

	if (!response.ok) {
		safeThrowApi(
			context,
			`GET request failed with status ${response.status}`,
			responseText || response.statusText,
			response.status,
			debugItemIndex,
		);
	}

	const data = responseText.trim() ? JSON.parse(responseText) : {};
	const allItems = extractItems<T>(data, itemsField);

	// Return all items when pagination is disabled or set to 'all'
	if (pagination === 'all' || !itemsPerPage) {
		return allItems;
	}

	// Internal pagination: split the array into chunks
	const requestedItemsPerPage = itemsPerPage;
	const startIndex = ((pageNumber || 1) - 1) * requestedItemsPerPage;
	const endIndex = startIndex + requestedItemsPerPage;

	return allItems.slice(startIndex, endIndex);
}

// POST without pagination, with explicit validation
export async function apiPostRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const {
		headers = {} as CentumHeaders,
		body,
		queryParams = {},
		context,
		method = 'POST',
		debugItemIndex,
	} = options;

	if (!url || url.trim() === '') {
		safeThrowWithItemIndex(context, 'The "Endpoint" field is required.', debugItemIndex);
	}

	if (method === 'GET') {
		safeThrowWithItemIndex(
			context,
			'A POST request was attempted without the correct method being assigned.',
			debugItemIndex,
		);
	}

	if (!body) {
		safeThrowWithItemIndex(context, 'The POST request body is required.', debugItemIndex);
	}
	const requestHeaders = buildCentumHeaders(
		headers.CentumSuiteConsumidorApiPublicaId,
		headers.publicAccessKey,
	);

	const finalUrl = buildUrl(url, queryParams);
	const { shouldDebug } = getDebugConfig(context, finalUrl, options.debugItemIndex ?? 0);
	const fetchOptions: RequestInit = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...requestHeaders },
		body: JSON.stringify(body),
	};

	if (shouldDebug) {
		const debugSettings = context ? getDebugSettings.call(context, options.debugItemIndex ?? 0) : {};
		logDebugMessage(context, '[Centum debug] Request', {
			url: finalUrl,
			method: 'POST',
			headers: redactHeaders(fetchOptions.headers as Record<string, unknown>),
			hasBody: true,
			bodyLength: String(fetchOptions.body).length,
			...(debugSettings.includeRequestBody ? { body } : {}),
		});
	}

	const response = await fetch(finalUrl, fetchOptions);
	const responseText = await response.text();

	if (shouldDebug) {
		logDebugMessage(context, '[Centum debug] Response', {
			url: finalUrl,
			status: response.status,
			statusText: response.statusText,
			contentType: response.headers.get('content-type') || '',
			bodyLength: responseText.length,
			body: responseText,
		});
	}

	if (!response.ok) {
		if (shouldDebug) {
			logDebugErrorRequestBody(context, finalUrl, 'POST', body);
		}

		safeThrowApi(
			context,
			`POST request failed with status ${response.status}`,
			responseText || response.statusText,
			response.status,
			debugItemIndex,
		);
	}

	const data = responseText.trim() ? JSON.parse(responseText) : {};
	return [data];
}

// POST paginado (igual que GET pero usando body)
export async function apiPostRequestPaginated<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const {
		headers = {} as CentumHeaders,
		method = 'POST',
		body,
		queryParams = {},
		itemsPerPage,
		itemsField = 'Items',
		pageNumber,
		context,
		pagination = 'all',
		pageInterval,
	} = options;

	if (!url || url.trim() === '') {
		safeThrowWithItemIndex(context, 'The "Endpoint" field is required.', options.debugItemIndex);
	}
	if (method === 'GET') {
		safeThrowWithItemIndex(
			context,
			'A POST request was attempted without the correct method being assigned.',
			options.debugItemIndex,
		);
	}
	if (!body) {
		safeThrowWithItemIndex(context, 'The POST request body is required.', options.debugItemIndex);
	}

	const requestHeaders = buildCentumHeaders(
		headers.CentumSuiteConsumidorApiPublicaId,
		headers.publicAccessKey,
	);
	const allItems: T[] = [];
	let currentPage = pageNumber || 1;
	const requestedItemsPerPage = pagination === 'all' ? 1000 : itemsPerPage || 100;
	const intervalMs = pagination === 'all' ? 1000 : (pageInterval ?? 1000);

	while (true) {
		const totalStart = Date.now();
		const paginatedParams = {
			...queryParams,
			numeroPagina: currentPage,
			cantidadItemsPorPagina: requestedItemsPerPage,
		};
		const finalUrl = buildUrl(url, paginatedParams);
		const { shouldDebug } = getDebugConfig(context, finalUrl, options.debugItemIndex ?? 0);
		const fetchOptions: RequestInit = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...requestHeaders },
			body: JSON.stringify(body),
		};
		if (shouldDebug) {
			const debugSettings = context ? getDebugSettings.call(context, options.debugItemIndex ?? 0) : {};
			logDebugMessage(context, '[Centum debug] Request', {
				url: finalUrl,
				method: 'POST',
				headers: redactHeaders(fetchOptions.headers as Record<string, unknown>),
				hasBody: true,
				bodyLength: String(fetchOptions.body).length,
				...(debugSettings.includeRequestBody ? { body } : {}),
			});
		}
		const response = await fetch(finalUrl, fetchOptions);
		const responseText = await response.text();
		if (shouldDebug) {
			logDebugMessage(context, '[Centum debug] Response', {
				url: finalUrl,
				status: response.status,
				statusText: response.statusText,
				contentType: response.headers.get('content-type') || '',
				bodyLength: responseText.length,
				body: responseText,
			});
		}
		if (!response.ok) {
			if (shouldDebug) {
				logDebugErrorRequestBody(context, finalUrl, 'POST', body);
			}

			safeThrowApi(
				context,
				`POST error on page ${currentPage} with status ${response.status}`,
				responseText || response.statusText,
				response.status,
				options.debugItemIndex,
			);
		}
		const data = responseText.trim() ? JSON.parse(responseText) : {};
		const pageItems = extractItems<T>(data, itemsField);
		allItems.push(...pageItems);
		const processingDuration = Date.now() - totalStart;
		const nextPage = pageItems.length >= requestedItemsPerPage;
		void processingDuration;
		if (!nextPage) break;
		await delay(intervalMs);
		currentPage++;
	}
	return allItems;
}

//-----------------------------------------------------------------------

// export async function apiRequest<T>(
// 	url: string,
// 	options: FetchOptions = {},
// 	context?: IExecuteFunctions,
// ): Promise<T> {
// 	// Requests default to the GET method and JSON response format
// 	const { method = 'GET', headers = {}, body, queryParams, responseType } = options;
// 	// console.log(options)
// 	let finalUrl = buildUrl(url, queryParams)

// 	console.log('fetch url: ',finalUrl)
// 	const requestHeaders = buildCentumHeaders(headers.CentumSuiteConsumidorApiPublicaId, headers.publicAccessKey);
// 	const fetchOptions: RequestInit = {
// 		method,
// 		headers: {...requestHeaders},
// 	};

// 	if (body) {
// 		if (typeof body !== 'object') {
// 			throw new Error('The body must be a valid object and not a string');
// 		}

// 		fetchOptions.body = JSON.stringify(body);
// 	}

// 	console.log('FETCH OPTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<')
// 	console.log(fetchOptions);
// 	try {

// 		const response = await fetch(finalUrl, fetchOptions);
// 		console.log(`apiRequest(): fetch method:${method}`, response)
// 		if (!response.ok) {
// 			const errorText = await response.text();
// 			const error = new Error(`Request failed with status ${response.status}: ${errorText}`);
// 			if (context) {
// 				console.log( "status:", response.status, errorText);
// 				context.logger.error(error.message, { status: response.status, errorText });
// 			}
// 			throw error;
// 		}

// 		if (responseType === 'arraybuffer') {
// 			return await response.arrayBuffer() as any;
// 		}

// 		return await response.json() as T;
// 	} catch (error) {

// 		if (context) {
// 			console.log('API request failed', error );
// 			context.logger.error('API request failed', { error });
// 		}
// 		throw error;
// 	}
// }

export async function apiRequest<T>(
	url: string,
	options: FetchOptions = {},
	context?: IExecuteFunctions,
): Promise<T> {
	const effectiveContext = options.context ?? context;
	const {
		method = 'GET',
		headers = {} as CentumHeaders,
		body,
		queryParams,
		responseType,
	} = options;

	const finalUrl = buildUrl(url, queryParams);
	const requestHeaders = buildCentumHeaders(
		headers.CentumSuiteConsumidorApiPublicaId,
		headers.publicAccessKey,
	);
	const { shouldDebug } = getDebugConfig(effectiveContext, finalUrl, options.debugItemIndex ?? 0);

	const fetchOptions: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...requestHeaders,
		},
	};

	if (body) {
		if (typeof body !== 'object') {
			safeThrowWithItemIndex(
				effectiveContext,
				'The body must be a valid object (not a string or another type).',
				options.debugItemIndex,
			);
		}
		fetchOptions.body = JSON.stringify(body);
	}

	if (shouldDebug) {
		const debugSettings = effectiveContext
			? getDebugSettings.call(effectiveContext, options.debugItemIndex ?? 0)
			: {};
		logDebugMessage(effectiveContext, '[Centum debug] Request', {
			url: finalUrl,
			method,
			headers: redactHeaders((fetchOptions.headers ?? {}) as Record<string, unknown>),
			hasBody: Boolean(fetchOptions.body),
			bodyLength: fetchOptions.body ? String(fetchOptions.body).length : 0,
			...(debugSettings.includeRequestBody && body !== undefined ? { body } : {}),
		});
	}

	try {
		const response = await fetch(finalUrl, fetchOptions);

		if (responseType === 'arraybuffer') {
			if (!response.ok) {
				const errorText = await response.text();

				if (shouldDebug) {
					logDebugErrorRequestBody(effectiveContext, finalUrl, method, body);
				}

				safeThrowApi(
					effectiveContext,
					`Request failed with status ${response.status}`,
					errorText || response.statusText,
					response.status,
					options.debugItemIndex,
				);
			}

			return (await response.arrayBuffer()) as any;
		}

		const rawText = await response.text();

		if (shouldDebug) {
			logDebugMessage(effectiveContext, '[Centum debug] Response', {
				url: finalUrl,
				status: response.status,
				statusText: response.statusText,
				contentType: response.headers.get('content-type') || '',
				bodyLength: rawText.length,
				body: rawText,
			});
		}

		if (!response.ok) {
			const contentType = response.headers.get('content-type') || '';
			const status = response.status;

			if (shouldDebug) {
				logDebugErrorRequestBody(effectiveContext, finalUrl, method, body);
			}

			let errorData: ApiErrorBody | string = rawText;
			if (contentType.includes('application/json')) {
				try {
					errorData = JSON.parse(rawText) as ApiErrorBody;
				} catch {
					errorData = rawText;
				}
			}

			const messageText =
				typeof errorData === 'object'
					? errorData.message || errorData.Message || 'No message in response body'
					: rawText || 'Empty response body';

			const descriptionText =
				typeof errorData === 'object'
					? errorData.detail || errorData.Detail || 'No additional details'
					: 'Plain text response without JSON';

			safeThrowApi(
				effectiveContext,
				`Request failed with status ${status}: ${messageText}`,
				descriptionText,
				status,
				options.debugItemIndex,
			);
		}

		if (!rawText.trim()) {
			return {} as T;
		}

		return JSON.parse(rawText) as T;
	} catch (error) {
		if (effectiveContext) {
			effectiveContext.logger?.error?.('API request failed', { error });
		}

		safeThrowApi(
			effectiveContext,
			'Centum API request failed',
			getErrorMessage(error, 'Unknown fetch error'),
			undefined,
			options.debugItemIndex,
		);
	}
}
