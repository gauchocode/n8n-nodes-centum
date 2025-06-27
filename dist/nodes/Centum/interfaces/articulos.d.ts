export interface IArticulos {
    Articulos: Articulos;
    PrecioMinimo: number;
    PrecioMaximo: number;
    RubrosCantidadItems: RubrosCantidadItem[];
    SubRubrosCantidadItems: SubRubrosCantidadItem[];
    CategoriasArticuloCantidadItems: CategoriasArticuloCantidadItem[];
    SociedadesArticuloCantidadItems: SociedadesArticuloCantidadItem[];
    MarcasArticuloCantidadItems: MarcasArticuloCantidadItem[];
    AtributosArticuloCantidadItems: AtributosArticuloCantidadItem[];
}
export interface Articulos {
    Items: Item[];
    CantidadTotalItems: number;
    Pagina: null;
}
export interface Item {
    IdArticulo: number;
    Codigo: string;
    CodigoAuxiliar: string;
    CodigoPropioProveedor: string;
    Nombre: string;
    NombreFantasia: NombreFantasia;
    Rubro: Rubro;
    SubRubro: SubRubro;
    CategoriaArticulo: CategoriaArticulo | null;
    SociedadArticulo: SociedadArticulo;
    MarcaArticulo: MarcaArticulo;
    Habilitado: boolean;
    ActivoWeb: boolean;
    ImprimeLista: boolean;
    Ranking: null;
    CategoriaImpuestoIVA: CategoriaImpuestoIVA;
    PorcentajeDescuento: number;
    CostoReposicion: number;
    SegundoControlStock: number;
    UnidadNivel1: number;
    UnidadNivel2: number;
    Masa: number;
    MasaEspecifico: number;
    Volumen: number;
    Alto: number;
    Largo: number;
    Ancho: number;
    EsPesable: boolean;
    InformaTropa: boolean;
    Comision: Comision;
    ImpuestoInterno: number;
    Precio: number;
    PreciosPorCantidad: any[];
    PorcentajeDescuentoMaximo: number;
    PorcentajesDescuentoMaximoPorCantidad: null;
    FechaUltimaActualizacionPrecio: Date | null;
    PrecioAnterior: number;
    DescuentoPromocion: number;
    NoAplicaBonificacionCliente: boolean;
    IdTipoDescuentoPromocion: number;
    IdClaseDescuento: number;
    ExistenciasSucursal: number;
    ExistenciasTotal: number;
    StockComprometido: number;
    StockDisponible: number;
    CantidadPedidosVenta: number;
    CantidadOrdenesCompra: number;
    PoseePrecioPorCantidad: null;
    PoseePorcentajeDescuentoPromocion: null;
    PoseePorcentajeDescuentoPromocionPorUnidades: null;
    PoseePorcentajeDescuentoPromocionPorValores: null;
    TipoRelacionArticulo: null;
    Observaciones: string;
    Detalle: string;
    CumplePoliticaStock: null;
    CantidadArticulosGrupoArticulo: number;
    CantidadImagenesArticulo: number;
    CantidadPrecioSugerido: number;
    NumeroDespacho: string;
    GrupoArticulo: GrupoArticulo | null;
    AtributosArticulo: any[];
    DescuentosPorPromocionPorUnidades: any[];
    DescuentosPorPromocionPorValor: any[];
    Videos: any[];
    PublicacionesTiendasOnline: any[];
    Tags: any[];
    IdArticuloAsociado: number;
    OperadorPlataformaB2B2C: null;
    CodigoBarrasFacturacionElectronica: string;
    UnidadNivelDefectoVentas: number;
    ArticulosCombo: ArticulosCombo[];
    FactorConversion: number;
    UnidadMaximaVenta: number;
    UnidadMinimaVenta: number;
}
export interface ArticulosCombo {
    IdArticulo: number;
    Cantidad: number;
    Descuento: number;
}
export interface CategoriaArticulo {
    IdCategoriaArticulo: number;
    Codigo: string;
    Nombre: string;
}
export interface CategoriaImpuestoIVA {
    IdCategoriaImpuestoIVA: number;
    Codigo: string;
    Nombre: CategoriaImpuestoIVANombre;
    Tasa: number;
}
export declare enum CategoriaImpuestoIVANombre {
    Iva2100 = "IVA 21.00"
}
export interface Comision {
    IdComision: number;
}
export interface GrupoArticulo {
    IdGrupoArticulo: number;
    Nombre: string;
    Detalle: Detalle;
}
export declare enum Detalle {
    AlfombraRhoneDib = "ALFOMBRA RHONE DIB",
    Empty = "",
    R01Sr0108 = "R01SR0108"
}
export interface MarcaArticulo {
    IdMarcaArticulo: number;
    Codigo: Codigo;
    Nombre: Codigo;
}
export declare enum Codigo {
    Captor = "Captor",
    CodigoCaptor = "Captor ",
    CodigoEnya = "Enya",
    Dib = "Dib",
    ElEspartano = "El Espartano",
    Enya = "ENYA",
    Exito = "Exito",
    Francavilla = "Francavilla",
    Muresco = "Muresco",
    Rielamericano = "Rielamericano",
    Wepel = "Wepel"
}
export declare enum NombreFantasia {
    Empty = "",
    Nordic = "NORDIC"
}
export interface Rubro {
    IdRubro: number;
    Codigo: RubroCodigo;
    Nombre: RubroNombre;
}
export declare enum RubroCodigo {
    R01 = "R01",
    R02 = "R02",
    R03 = "R03",
    R04 = "R04",
    R05 = "R05",
    R06 = "R06"
}
export declare enum RubroNombre {
    Alfombras = "ALFOMBRAS",
    Cortinas = "CORTINAS",
    EnviosViaticosYEmbalajes = "ENVIOS, VIATICOS Y EMBALAJES",
    ManoDeObra = "MANO DE OBRA",
    Revestimientos = "REVESTIMIENTOS",
    Telas = "TELAS"
}
export interface SociedadArticulo {
    IdSociedadArticulo: number;
    Codigo: string;
    Nombre: SociedadArticuloNombre;
}
export declare enum SociedadArticuloNombre {
    SociedadDeArtículoDefecto = "Sociedad de Art\u00EDculo Defecto"
}
export interface SubRubro {
    IdSubRubro: number;
    Codigo: SubRubroCodigo;
    Nombre: SubRubroNombre;
}
export declare enum SubRubroCodigo {
    Sr0101 = "SR0101",
    Sr0102 = "SR0102",
    Sr0103 = "SR0103",
    Sr0104 = "SR0104",
    Sr0105 = "SR0105",
    Sr0107 = "SR0107",
    Sr0108 = "SR0108",
    Sr0201 = "SR0201",
    Sr0202 = "SR0202",
    Sr0203 = "SR0203",
    Sr0204 = "SR0204",
    Sr0205 = "SR0205",
    Sr0206 = "SR0206",
    Sr0207 = "SR0207",
    Sr0301 = "SR0301",
    Sr0333 = "SR0333",
    Sr0401 = "SR0401",
    Sr0402 = "SR0402",
    Sr0403 = "SR0403",
    Sr0501 = "SR0501",
    Sr0502 = "SR0502",
    Sr0503 = "SR0503",
    Sr0601 = "SR0601",
    Sr0603 = "SR0603"
}
export declare enum SubRubroNombre {
    Adhesivos = "ADHESIVOS",
    Alfombras = "ALFOMBRAS",
    Carpetas = "CARPETAS",
    Complementos = "COMPLEMENTOS",
    Confecciones = "CONFECCIONES ",
    CortinasAmericanas = "CORTINAS AMERICANAS ",
    CortinasBandasVerticales = "CORTINAS BANDAS VERTICALES",
    CortinasRipplefold = "CORTINAS RIPPLEFOLD",
    CortinasRoller = "CORTINAS ROLLER",
    CortinasStandard = "CORTINAS STANDARD",
    CortinasTradicionalesAMedida = "CORTINAS TRADICIONALES A MEDIDA",
    Embalajes = "EMBALAJES",
    Envios = "ENVIOS",
    InstalacionCortinas = "INSTALACION CORTINAS",
    InstalacionRevestimientos = "INSTALACION REVESTIMIENTOS",
    InstalacionesVarias = "INSTALACIONES VARIAS",
    Papeles = "PAPELES",
    Pisos = "PISOS",
    Preventivas = "PREVENTIVAS",
    RevestimientosDeParedes = "REVESTIMIENTOS DE PAREDES",
    RevestimientosVarios = "REVESTIMIENTOS VARIOS",
    SistemasYMecanismos = "SISTEMAS Y MECANISMOS",
    TelasParaCortinas = "TELAS PARA CORTINAS"
}
export interface AtributosArticuloCantidadItem {
    AtributoArticulo: AtributoArticulo;
    CantidadItems: number;
}
export interface AtributoArticulo {
    IdAtributoArticulo: number;
    Nombre: AtributoArticuloNombre;
    Abreviatura: Abreviatura;
    IdAtributoArticuloValor: number;
    Valor: string;
}
export declare enum Abreviatura {
    Col = "COL",
    Med = "MED"
}
export declare enum AtributoArticuloNombre {
    Color = "COLOR ",
    Medidas = "MEDIDAS"
}
export interface CategoriasArticuloCantidadItem {
    CategoriaArticulo: CategoriaArticulo;
    CantidadItems: number;
}
export interface MarcasArticuloCantidadItem {
    MarcaArticulo: MarcaArticulo;
    CantidadItems: number;
}
export interface RubrosCantidadItem {
    Rubro: Rubro;
    CantidadItems: number;
}
export interface SociedadesArticuloCantidadItem {
    SociedadArticulo: SociedadArticulo;
    CantidadItems: number;
}
export interface SubRubrosCantidadItem {
    SubRubro: SubRubro;
    CantidadItems: number;
}
