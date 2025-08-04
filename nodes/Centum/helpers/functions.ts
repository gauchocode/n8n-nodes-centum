import { randomUUID, createHash as cryptoCreateHash } from 'crypto';
import { constantProvincias, wooToCentumProvinciaMap, constantsZonas, CondicionesIVA, CondicionesIIBB, CategoriasIIBB } from '../constants';

import {
	IWoo,
	INewCustomer,
	LineItem,
	INewPedidoVenta,
	IArticuloPedidoVenta,
	ListaPrecioCodigo,
	Descripcion,
	Item,
	INewCobro,
	CobrosAnticipos,
	Cliente,
	CobroEfectivos,
	IMergeArticulos,
	IGroupWoo,
	IWooArticle,
	ShippingLine, CobroId,
	IContribuyenteBodyInput,
	CondicionIIBBCodigo,
	IProvincias
} from '../interfaces';
import { NodeParameterValue, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export const createHash = (publicAccessKey: string): string => {
	const uuid = randomUUID().replace(/-/gi, '');
	//yyyy-MM-ddTHH:mm:ss
	const currentDateFormatted = new Date().toISOString().replace(/\..+/, '');

	const hash = cryptoCreateHash('sha1');
	hash.update(`${currentDateFormatted} ${uuid} ${publicAccessKey}`);
	const hashedResult = hash.digest('hex');

	return `${currentDateFormatted} ${uuid} ${hashedResult}`;
};

export const createCustomerJson = (respWoo: IWoo, dni: string) => {
	const customerObj: INewCustomer = {
		TarifaServicio:{
			IdTarifaServicio:1
		},
		CodigoPostal: respWoo.billing.postcode,
		Direccion: respWoo.billing.address_1,
		IdCliente: -1,
		Localidad: respWoo.billing.city,
		RazonSocial: `${respWoo.billing.first_name} ${respWoo.billing.last_name}`,
		Email: respWoo.billing.email || '',
		Provincia:
			constantProvincias.find(
				(prov) => prov.Nombre.toLocaleLowerCase() === respWoo.billing.state.toLocaleLowerCase(),
			) || constantProvincias[5],
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
			constantsZonas.find(
				(zone) => zone.Nombre.toLocaleLowerCase() === respWoo.billing.city.toLocaleLowerCase(),
			) || constantsZonas[0],
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

	console.log(respWoo)
	return customerObj;
};

function getProvinciaCentumFromWoo(wooCode: string): IProvincias | null {
  return wooToCentumProvinciaMap[wooCode] ?? null;
}

export const createContribuyenteJson = (
	body: IContribuyenteBodyInput,
	cuit: string
)  => {
	const provinciaCentum = getProvinciaCentumFromWoo(body.Provincia ?? '') ??
		constantProvincias.find(
			(prov) => prov.Nombre.toLowerCase() === (body.Provincia ?? '').toLowerCase()
		) ??
		constantProvincias[5]; // fallback a Buenos Aires

		const cuitStr = String(cuit)
		const fullAddress = `${body.Direccion} ${body.NroDireccion}${body.PisoDepartamento ? ' ' + body.PisoDepartamento : ''}`;

		console.log(fullAddress);
	return {
		IdCliente: -1,
		CUIT: cuit,
    Codigo: `web-${cuitStr.slice(2, 10)}`,
    RazonSocial: body.RazonSocial,
    Email: body.Email || '',
    Telefono: body.Telefono || '',
    CodigoPostal: body.CodigoPostal,
    Localidad: body.Localidad,
		Direccion: fullAddress,
    Provincia: provinciaCentum,
    Zona: constantsZonas[0],
    Pais: {
      Codigo: 'ARG',
      IdPais: 4657,
      Nombre: 'Argentina',
    },
    CondicionIVA:
      CondicionesIVA.find(
        (condicion) => condicion.Nombre.toLocaleLowerCase() === (body.CondicionIVA ?? 'Responsable Inscripto').toLocaleLowerCase()
      ) || {
        IdCondicionIVA: 1895,
        Codigo: 'RI',
        Nombre: 'Responsable Inscripto',
      },
    CondicionIIBB:
      CondicionesIIBB.find(
        (condicion) => condicion.Codigo.toLocaleLowerCase() === (body.CondicionIIBB ?? 'Responsable Inscript').toLocaleLowerCase()
      ) || {
        IdCondicionIIBB: 6051,
        Codigo: 'Responsable Inscript' as CondicionIIBBCodigo
      },
		CategoriaIIBB:
		CategoriasIIBB.find(
			(categoria) => categoria.Codigo.toLowerCase() ===  (body.CategoriaIIBB ?? 'Cosas Muebles').toLocaleLowerCase()
		)|| {
        IdCondicionIIBB: 6054,
        Codigo: 'Cosas Muebles'
      }
		,
    NumeroIIBB: body.NumeroIIBB,
    DireccionEntrega: fullAddress,
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
};


export const createOrderSaleJson = (
	articles: Item[],
	client: INewCustomer,
	articlesOrder: LineItem[],
	shippingSalesOrder: ShippingLine[],
	idCobro: CobroId
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

			if (!dbArticle) {
				console.warn(`No se encontró el artículo para SKU ${product.sku}`);
			}

			const metaData = product.meta_data;
			const quantity = product.quantity;

			const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
			const price = isProductQuoter ? Number(product.total || 0) / quantity : Number(product.price || 0);


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


	//Verificar si el envío ya existe en el pedido. Si existe, ignora, si no, agrega.
	const isShippingAlreadyIncluded = articlesOrder.some(item => item.sku === 'R06SR0601P00010007');
	// Agregar costo de envío como artículo extra si existe & tiene precio
	if (shippingSalesOrder.length > 0 && !isShippingAlreadyIncluded) {
		const shipping = shippingSalesOrder[0]; // WooCommerce generalmente solo tiene uno
		const shippingCost = Number(shipping.total || 0);
		if (shippingCost > 0) {
			const shippingItem: IArticuloPedidoVenta = {
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
export const createChargeJson = (customer: Cliente, articlesOrder: LineItem[], 	shippingChargeOrder: ShippingLine[]) => {
	if (shippingChargeOrder.length > 0) {
		const shipping = shippingChargeOrder[0]; // WooCommerce generalmente solo tiene uno
		const shippingCost = Number(shipping.total || 0);
		if (shippingCost > 0) {
			const shippingChargeItem: LineItem = {
				id: shipping.id,
				name: shipping.method_title || 'Costo de Envío',
				total: shipping.total,
				meta_data: shipping.meta_data,
				product_id: 2126, // Tob Note: ID Del articulo extraido de dataArticulosExistencias
				variation_id: 0,
				quantity: 1,
				tax_class: '',
				subtotal: '',
				subtotal_tax: '',
				total_tax: '',
				taxes: [],
				sku: 'R06SR0601P00010007',	// Tob Note: SKU del envio extraido de centum
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
	const chargeJson: INewCobro = {
		Cliente: customer,
		ClienteCuentaCorriente: customer,
		Observacion: '',
		CobroAnticipos: articlesOrder.map((product) => {
			const metaData = product.meta_data;
			const quantity = product.quantity;

			const isProductQuoter = metaData.some((meta) => meta.key === 'blocky_woo_product_quoter');
			const price = isProductQuoter ? Number(product.total || 0) : Number(product.price || 0) * quantity;

			const obj: CobrosAnticipos = {
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
			const object: CobroEfectivos = {
				Valor: {
					IdValor: 4,
					// 1: Efectivo | 2: Cheques Terceros | 3: Transferencia a Banco Galicia |
					// 4: Tarjeta Credito Visa | 5: Tarjeta Debito Visa Electron | 6: Tarjeta Debito Maestro Master
					// 7: Tarjeta Credito Master | 8: Tarjeta Credito Amex | 9: Mercadopago | 10: Tarjeta Credito Cabal | 11: Todopago | 12: E-cheq Galicia
					// 13: Cheque Fisico Banco Galicia | 14: Efectivo USD
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
		SucursalFisica:  {
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

function centumGetArticleVariations(groupId: number, arrArticles: any) {
	const allAttributes: any = [];
	const articlesWithSameGroupId = arrArticles.filter(
		(article: { json: { GrupoArticulo: { IdGrupoArticulo: number } | null } }) =>
			article.json.GrupoArticulo !== null && article.json.GrupoArticulo.IdGrupoArticulo === groupId,
	);

	articlesWithSameGroupId.forEach((article: { json: { AtributosArticulo: any[] } }) => {
		allAttributes.push(...centumGetArticleAttributes(article));
	});

	const variations = articlesWithSameGroupId.map((article: { json: any }) => ({
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
		images: article.json.images?.map((image: any) => image.data.fileName) || [],
		description: article.json.Detalle ?? '',
	}));

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
		// Nueva validación para continuar si el articulo no es json
		if (!article?.json) {
			console.warn('Artículo sin propiedad json:', article);
			continue;
		}

		obj.dimensions = {
			height: article.json.Alto * 100,
			length: article.json.Largo * 100,
			width: article.json.Ancho * 100,
			weight: article.json.Masa,
		};
		obj.regular_price = article.json.Precio;
		// Actualización de description para no hacer match sobre undefined
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
		// fin actualización

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
								name:  article.json.CategoriaArticulo.Nombre // PVC
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
			const [variations, allAttributes] = centumGetArticleVariations(
				article.json.GrupoArticulo.IdGrupoArticulo,
				arrArticles,
			);

			obj.name = article.json.GrupoArticulo.Nombre;
			obj.type = 'variable';
			obj.variations = variations;
			obj.attributes = allAttributes;
			obj.sku = article.json.GrupoArticulo.IdGrupoArticulo.toString();
			obj.short_description = article.json.GrupoArticulo.Detalle; /* [MRF 2024-09-11] - adding short description based on GrupoArticulo.Detalle */
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
		console.error(`Error fetching image for article ${articleId}:`, e);
		return e;
	}
}


export const centumImageName = (
	name: string,
	size: string,
	numberImage: number,
	fileExtension: string,
) => {
	return `${name.split(' ').join('').replace('.', '').toLocaleLowerCase()}${numberImage}_${size
		.split(' ')
		.join('')
		.replace('.', '_')
		.toLocaleLowerCase()}.${fileExtension}`;
};

export function getEndpoint(this: IExecuteFunctions): string {
	const endpoint = this.getNodeParameter('endpoint', 0) as string;

	if (!endpoint?.trim()) {
		throw new NodeOperationError(this.getNode(), 'El campo "Endpoint" es obligatorio.');
	}

	return endpoint;
}

export interface HttpSettings {
	method?: 'GET' | 'POST';
	pagination: 'all' | 'default' | 'custom';
	cantidadItemsPorPagina?: number;
}

export function buildCentumHeaders(consumerId: string, publicKey: string): Record<string, string> {
  return {
    CentumSuiteConsumidorApiPublicaId: consumerId,
    CentumSuiteAccessToken: createHash(publicKey),
  };
}

export function getHttpSettings(this: IExecuteFunctions): HttpSettings & { intervaloPagina?: number } {
	const httpSettings = this.getNodeParameter('httpSettings', 0, {}) as HttpSettings & { intervaloPagina?: number };
	console.log('http settings: ', httpSettings)
	// Validación simple por si alguien lo borra desde el editor del nodo
	// if (!httpSettings.method || !['GET', 'POST'].includes(httpSettings.method)) {
	// 	throw new NodeOperationError(this.getNode(), 'El campo "Método HTTP" es obligatorio y debe ser GET o POST.');
	// }

	if (!httpSettings.pagination || !['all', 'default', 'custom'].includes(httpSettings.pagination)) {
		throw new NodeOperationError(this.getNode(), 'El campo "Paginación" es obligatorio y debe tener un valor válido.');
	}

	if (httpSettings.pagination === 'custom' && (!httpSettings.cantidadItemsPorPagina || httpSettings.cantidadItemsPorPagina < 1)) {
		throw new NodeOperationError(this.getNode(), 'Debe especificar la cantidad de ítems por página en modo personalizado.');
	}

	return httpSettings;
}

export interface FetchOptions {
	method?: 'GET' | 'POST';
	headers?: Record<string, string>;
	queryParams?: Record<string, string | number | boolean>;
	body?: any; // <-- explícito
	cantidadItemsPorPagina?: number;
	itemsField?: string;
	intervaloPagina?: number;
	numeroPagina?: number;
	context?: IExecuteFunctions;
	pagination?: 'all' | 'default'| 'custom';
	responseType?: 'json' | 'arraybuffer';
}

function safeThrow(context: IExecuteFunctions | undefined, message: string): never {
	if (!context || !context.getNode()) {
		throw new Error(message);
	}
	throw new NodeOperationError(context.getNode(), message);
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
	safeThrow(undefined, 'Respuesta inválida: no se encontraron items.');
}

export async function apiGetRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const {
		headers = {},
		method = 'GET',
		queryParams = {},
		cantidadItemsPorPagina,
		itemsField = 'items',
		numeroPagina,
		context,
		pagination = 'all',
		intervaloPagina,
	} = options;

	console.log('options getRequest: ', options)
	if (!url.trim()) safeThrow(context, 'El Endpoint es obligatorio.');

	if( !options.method || options.method === 'POST') safeThrow(context, 'Se está intentando hacer una solicitud GET sin un metodo asignado o se asignó el metodo equivocado.');
	// const fetchOptions: RequestInit = {
	// 	method,
	// 	headers: { 'Content-Type': 'application/json', ...headers },
	// };

	// // Sin paginación (aún en desarrollo actualmente se usa otro metodo)
	// if (pagination === 'default' || (!cantidadItemsPorPagina && !numeroPagina)) {
	// 	const finalUrl = buildUrl(url, queryParams);
	// 	const response = await fetch(finalUrl, fetchOptions);

	// 	if (!response.ok) {
	// 		const errorText = await response.text();
	// 		safeThrow(context, `Error GET: ${response.status} - ${errorText}`);
	// 	}

	// 	const data = await response.json();
	// 	return extractItems<T>(data, itemsField);
	// }

	console.log('apiGetRequest => options:  ', options)
	const allItems: T[] = [];
	let currentPage = numeroPagina || 1;
	const itemsPerPage = pagination === 'all' ? 1000 : cantidadItemsPorPagina || 100;
	const intervaloMs = pagination === 'all' ? 200 : intervaloPagina ?? 1000;

	while (true) {
		const totalStart = Date.now();
		const paginatedParams = {
			...queryParams,
			numeroPagina: currentPage,
			cantidadItemsPorPagina: itemsPerPage,
		};

		const finalUrl = buildUrl(url, paginatedParams);
		const requestHeaders = buildCentumHeaders(headers.CentumSuiteConsumidorApiPublicaId, headers.publicAccessKey);

		const response = await fetch(finalUrl, {
			method,
			headers: {...requestHeaders}
		});

		if (!response.ok) {
			const errorText = await response.text();
			safeThrow(context, `Error GET (pág ${currentPage}): ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		const pageItems = extractItems<T>(data, itemsField);
		allItems.push(...pageItems);

		const processingDuration = Date.now() - totalStart;
		const nextPage = pageItems.length >= itemsPerPage;

		const logMsg = `[paginación] página: ${currentPage} - Items recibidos: ${pageItems.length} (sincronia: ${processingDuration}ms${nextPage ? '  espera ' + intervaloMs + 'ms' : ''})`;
		context?.logger ? context.logger.info(logMsg) : console.log(logMsg);

		if (!nextPage) break;

		await new Promise((resolve) => setTimeout(resolve, intervaloMs));
		currentPage++;
	}

	return allItems;
}


// POST sin paginación (con validación explícita)
export async function apiPostRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const { headers = {}, body, queryParams = {}, itemsField = 'Items', context } = options;

	if (!url || url.trim() === '') {
		safeThrow(context, 'El campo "Endpoint" es obligatorio.');
	}

	if( !options.method || options.method === 'GET'){
		safeThrow(context, 'Se está intentando hacer una solicitud POST sin un metodo asignado o se asignó el metodo equivocado.');
	}

	if (!body) {
		safeThrow(context, 'El cuerpo (body) de la solicitud POST es obligatorio.');
	}
	const requestHeaders = buildCentumHeaders(headers.CentumSuiteConsumidorApiPublicaId, headers.publicAccessKey);


	const finalUrl = buildUrl(url, queryParams);
	const fetchOptions: RequestInit = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...requestHeaders},
		body: JSON.stringify(body),
	};

	const response = await fetch(finalUrl, fetchOptions);
	if (!response.ok) {
		const errorText = await response.text();
		safeThrow(context, `Error en la solicitud POST: ${response.status} - ${errorText}`);
	}
			console.log(`apiPostRequest(): fetch method: `, response)

	const data = await response.json();
	return [data];
}

//-----------------------------------------------------------------------

	export async function apiRequest<T>(
		url: string,
		options: FetchOptions = {},
		context?: IExecuteFunctions,
	): Promise<T> {
		// Por defecto las peticiones se hacen con el método GET y respuesta en formato JSON
		const { method = 'GET', headers = {}, body, queryParams, responseType } = options;
		// console.log(options)
		let finalUrl = buildUrl(url, queryParams)

		console.log('fetch url: ',finalUrl)
		const requestHeaders = buildCentumHeaders(headers.CentumSuiteConsumidorApiPublicaId, headers.publicAccessKey);
		const fetchOptions: RequestInit = {
			method,
			headers: {...requestHeaders},
		};

		if (body) {
			if (typeof body !== 'object') {
				throw new Error('El body debe ser un objeto válido y no una cadena');
			}

			fetchOptions.body = JSON.stringify(body);
		}

		console.log('FETCH OPTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<')
		console.log(fetchOptions);
		try {

			const response = await fetch(finalUrl, fetchOptions);
			console.log(`apiRequest(): fetch method:${method}`, response)
			if (!response.ok) {
				const errorText = await response.text();
				const error = new Error(`Request failed with status ${response.status}: ${errorText}`);
				if (context) {
					console.log( "status:", response.status, errorText);
					context.logger.error(error.message, { status: response.status, errorText });
				}
				throw error;
			}

			if (responseType === 'arraybuffer') {
				return await response.arrayBuffer() as any;
			}

			return await response.json() as T;
		} catch (error) {

			if (context) {
				console.log('API request failed', error );
				context.logger.error('API request failed', { error });
			}
			throw error;
		}
	}



// // Método dinámico para GET o POST
// export async function apiRequest<T = any>(
// 	url: string,
// 	options: FetchOptions = {},
// ): Promise<T[]> {
// 	const { method = 'GET', context } = options;

// 	if (!['GET', 'POST'].includes(method)) {
// 		safeThrow(context, `Método HTTP no soportado: ${method}. Use GET o POST.`);
// 	}

// 	if (method === 'GET') {
// 		return apiGetRequest<T>(url, options);
// 	}
// 	return apiPostRequest<T>(url, options);
// }

