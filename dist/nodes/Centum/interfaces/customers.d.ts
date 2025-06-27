export interface IResponseCustomer {
    Items: Cliente[];
    CantidadTotalItems: number;
    Pagina: null;
}
export interface Cliente {
    IdCliente: number;
    Codigo: string;
    RazonSocial: string;
    CUIT: null | string;
    Direccion: null | string;
    Localidad: null | string;
    CodigoPostal: null | string;
    Provincia: Provincia;
    Pais: Pais;
    Zona: Zona;
    Latitud: null;
    Longitud: null;
    DireccionEntrega: null | string;
    CalleEntrega: null | string;
    NumeroCalleEntrega: null | string;
    LocalEntrega: null | string;
    CallePerpendicular1Entrega: null | string;
    CallePerpendicular2Entrega: null | string;
    LocalidadEntrega: null | string;
    CodigoPostalEntrega: null | string;
    DepartamentoEntrega: DepartamentoEntrega | null;
    ProvinciaEntrega: Provincia | null;
    PaisEntrega: Pais | null;
    ZonaEntrega: Zona | null;
    LatitudEntrega: null;
    LongitudEntrega: null;
    Telefono: null | string;
    TelefonoAlternativo: null | string;
    Fax: null | string;
    Interno: null | string;
    Email: null | string;
    ObservacionesCliente: null | string;
    CondicionIVA: CondicionIVA;
    CondicionVenta: CondicionVenta;
    Vendedor: Vendedor;
    Transporte: Transporte;
    Bonificacion: Bonificacion;
    LimiteCredito: LimiteCredito;
    ClaseCliente: ClaseCliente;
    ConceptoVenta: null;
    FrecuenciaCliente: FrecuenciaCliente;
    VisitaRegularDiaSemanaLunes: boolean;
    VisitaRegularDiaSemanaMartes: boolean;
    VisitaRegularDiaSemanaMiercoles: boolean;
    VisitaRegularDiaSemanaJueves: boolean;
    VisitaRegularDiaSemanaViernes: boolean;
    VisitaRegularDiaSemanaSabado: boolean;
    VisitaRegularDiaSemanaDomingo: boolean;
    PoseeMostradorExclusivo: boolean;
    CanalCliente: CanalCliente;
    CadenaCliente: CadenaCliente;
    UbicacionCliente: UbicacionCliente;
    EdadesPromedioConsumidoresCliente: EdadesPromedioConsumidoresCliente;
    GeneroPromedioConsumidoresCliente: GeneroPromedioConsumidoresCliente;
    DiasAtencionCliente: DiasAtencionCliente;
    HorarioAtencionCliente: HorarioAtencionCliente;
    CigarreraCliente: CigarreraCliente;
    ListaPrecio: ListaPrecio;
    DiasMorosidad: number;
    DiasIncobrables: number;
    EsClienteMassalin: null;
    TipoIncoterm: null;
    ImporteMinimoPedido: null;
    ContactoEnvioComprobanteEmpresa: ContactoEnvioComprobanteEmpresa[];
    Activo: boolean;
    FechaAltaCliente: Date;
    CondicionIIBB: CondicionIIBB;
}
export interface Bonificacion {
    IdBonificacion: number;
    Codigo: BonificacionCodigo;
    Calculada: number;
}
export declare enum BonificacionCodigo {
    The01 = "01 "
}
export interface CadenaCliente {
    IdCadenaCliente: number;
    Codigo: string;
    Nombre: string;
}
export interface CanalCliente {
    IdCanalCliente: number;
    Codigo: CanalClienteCodigo;
    Nombre: CanalClienteNombre;
}
export declare enum CanalClienteCodigo {
    Gcy = "GCY",
    Kio = "KIO",
    Otr = "OTR"
}
export declare enum CanalClienteNombre {
    Grocery = "Grocery",
    Kiosco = "Kiosco",
    Otros = "Otros"
}
export interface CigarreraCliente {
    IdCigarreraCliente: number;
    Codigo: CigarreraClienteCodigo;
    Nombre: CigarreraClienteNombre;
}
export declare enum CigarreraClienteCodigo {
    Msp = "MSP"
}
export declare enum CigarreraClienteNombre {
    MassalinParticulares = "Massalin Particulares"
}
export interface ClaseCliente {
    IdClaseCliente: number;
    Codigo: ClaseClienteCodigo;
    Nombre: ClaseClienteNombre;
}
export declare enum ClaseClienteCodigo {
    ClaseDefecto = "ClaseDefecto"
}
export declare enum ClaseClienteNombre {
    ClaseDefecto = "Clase Defecto"
}
export interface CondicionIIBB {
    IdCondicionIIBB: number;
    Codigo: CondicionIIBBCodigo;
}
export declare enum CondicionIIBBCodigo {
    ConvenioMultilatera = "Convenio Multilatera",
    Exento = "Exento",
    ResponsableInscript = "Responsable Inscript"
}
export interface CondicionIVA {
    IdCondicionIVA: number;
    Codigo: CondicionIVACodigo;
    Nombre: CondicionIVANombre;
}
export declare enum CondicionIVACodigo {
    CF = "CF",
    Exe = "EXE",
    Mtb = "MTB",
    Ri = "RI"
}
export declare enum CondicionIVANombre {
    ConsumidorFinal = "Consumidor Final",
    Exento = "Exento",
    Monotributo = "Monotributo",
    ResponsableInscripto = "Responsable Inscripto"
}
export interface CondicionVenta {
    IdCondicionVenta: number;
    Codigo: CondicionVentaCodigo;
    Nombre: CondicionVentaNombre;
}
export declare enum CondicionVentaCodigo {
    Vta1 = "VTA1"
}
export declare enum CondicionVentaNombre {
    Contado = "Contado"
}
export interface ContactoEnvioComprobanteEmpresa {
    Email: string;
    IdsActividad: number[];
    Celular: string;
}
export interface DepartamentoEntrega {
    IdDepartamento: number;
    Codigo: string;
    Nombre: string;
    Provincia: Provincia;
}
export interface Provincia {
    IdProvincia: number;
    Codigo: string;
    Nombre: ProvinciaNombre;
}
export declare enum ProvinciaNombre {
    BuenosAires = "Buenos Aires",
    CapitalFederal = "Capital Federal",
    Catamarca = "Catamarca",
    Chaco = "Chaco",
    Chubut = "Chubut",
    Cordoba = "Cordoba",
    Corrientes = "Corrientes",
    EntreRios = "Entre Rios",
    Formosa = "Formosa",
    Jujuy = "Jujuy",
    LaPampa = "La Pampa",
    LaRioja = "LA RIOJA",
    Mendoza = "Mendoza",
    Misiones = "Misiones",
    Neuquén = "Neuqu\u00E9n",
    RioNegro = "Rio Negro",
    SANJuan = "San Juan",
    SANLuis = "San Luis",
    Salta = "Salta",
    SantaCruz = "Santa Cruz",
    SantaFé = "Santa F\u00E9",
    SantiagoDelEstero = "Santiago del Estero",
    TierraDelFuego = "Tierra del Fuego",
    Tucumán = "Tucum\u00E1n"
}
export interface DiasAtencionCliente {
    IdDiasAtencionCliente: number;
    Codigo: DiasAtencionClienteCodigo;
    Nombre: DiasAtencionClienteNombre;
}
export declare enum DiasAtencionClienteCodigo {
    LV = "LV",
    Ld = "LD"
}
export declare enum DiasAtencionClienteNombre {
    LunesADomingo = "Lunes a Domingo",
    LunesAViernes = "Lunes a Viernes"
}
export interface EdadesPromedioConsumidoresCliente {
    IdEdadesPromedioConsumidoresCliente: number;
    Codigo: string;
    Nombre: EdadesPromedioConsumidoresClienteNombre;
}
export declare enum EdadesPromedioConsumidoresClienteNombre {
    HayIgualCantidadDeConsumidores = "Hay igual cantidad de consumidores"
}
export interface FrecuenciaCliente {
    IdFrecuenciaCliente: number;
    Nombre: FrecuenciaClienteNombre;
}
export declare enum FrecuenciaClienteNombre {
    FrecuenciaDefecto = "Frecuencia Defecto"
}
export interface GeneroPromedioConsumidoresCliente {
    IdGeneroPromedioConsumidoresCliente: number;
    Codigo: string;
    Nombre: EdadesPromedioConsumidoresClienteNombre;
}
export interface HorarioAtencionCliente {
    IdHorarioAtencionCliente: number;
    Codigo: HorarioAtencionClienteCodigo;
    Nombre: HorarioAtencionClienteNombre;
}
export declare enum HorarioAtencionClienteCodigo {
    D = "D"
}
export declare enum HorarioAtencionClienteNombre {
    Diurno = "Diurno"
}
export interface LimiteCredito {
    IdLimiteCredito: number;
    Nombre: LimiteCreditoNombre;
    Valor: number;
}
export declare enum LimiteCreditoNombre {
    LímiteCredito1 = "L\u00EDmite Credito 1"
}
export interface ListaPrecio {
    IdListaPrecio: number;
    Codigo: ListaPrecioCodigo;
    Descripcion: Descripcion;
    Habilitado: boolean;
    FechaDesde: Date | null;
    FechaHasta: null;
    PorcentajePrecioSugerido: number;
    Moneda: Moneda;
    ListaPrecioAlternativa: null;
}
export declare enum ListaPrecioCodigo {
    Exitoweb = "EXITOWEB",
    Mlclasica = "MLCLASICA",
    Mlenvios = "MLENVIOS",
    Mlpremium = "MLPREMIUM",
    Mostrador = "MOSTRADOR"
}
export declare enum Descripcion {
    MercadolibrePublicacionClasica = "MERCADOLIBRE - PUBLICACION CLASICA",
    MercadolibrePublicacionPremium = "MERCADOLIBRE - PUBLICACION PREMIUM",
    MercadolibrePublicacionesEnviosGratis = "MERCADOLIBRE - PUBLICACIONES ENVIOS GRATIS",
    TiendaOnLineExito = "TIENDA ON LINE EXITO.COM.AR",
    TiendasFisicas = "TIENDAS FISICAS"
}
export interface Moneda {
    IdMoneda: 1;
    Codigo: 'ARS';
    Nombre: 'Peso Argentino';
    Cotizacion: 1;
}
export interface Pais {
    IdPais: number;
    Codigo: 'ARG';
    Nombre: 'Argentina';
}
export interface Transporte {
    IdTransporte: number;
    Codigo: TransporteCodigo;
    RazonSocial: RazonSocial;
    Direccion: null;
    Localidad: null;
    CodigoPostal: null;
    Provincia: Provincia;
    Pais: Pais;
    DireccionEntrega: null;
    LocalidadEntrega: null;
    CodigoPostalEntrega: null;
    ProvinciaEntrega: null;
    PaisEntrega: null;
    ZonaEntrega: null;
    Telefono: string;
    NumeroDocumento: string;
    Email: null;
    TipoDocumento: TipoDocumento;
}
export declare enum TransporteCodigo {
    Tra1 = "TRA1"
}
export declare enum RazonSocial {
    TransporteDefecto = "Transporte Defecto"
}
export interface TipoDocumento {
    IdTipoDocumento: number;
    Codigo: TipoDocumentoCodigo;
    Nombre: TipoDocumentoNombre;
}
export declare enum TipoDocumentoCodigo {
    Dni = "DNI"
}
export declare enum TipoDocumentoNombre {
    DocumentoNacionalDeIdentidad = "Documento Nacional de Identidad"
}
export interface UbicacionCliente {
    IdUbicacionCliente: number;
    Codigo: UbicacionClienteCodigo;
    Nombre: UbicacionClienteNombre;
}
export declare enum UbicacionClienteCodigo {
    Bar = "BAR"
}
export declare enum UbicacionClienteNombre {
    ZonaDeBaresYBoliches = "Zona de Bares y Boliches"
}
export interface Vendedor {
    IdVendedor: number;
    Codigo: VendedorCodigo;
    Nombre: VendedorNombre;
    CUIT: null;
    Direccion: null;
    Localidad: null;
    Telefono: null;
    Mail: null;
    EsSupervisor: boolean;
}
export declare enum VendedorCodigo {
    V01 = "V01",
    V02 = "V02",
    V05 = "V05",
    V06 = "V06",
    V09 = "V09",
    V10 = "V10"
}
export declare enum VendedorNombre {
    AndreaMaidana = "ANDREA MAIDANA",
    DiegoMirandaLamamy = "DIEGO MIRANDA LAMAMY",
    IvanRodriguez = "IVAN RODRIGUEZ",
    JuanManuelValenzuela = "JUAN MANUEL VALENZUELA",
    Mercadolibre = "MERCADOLIBRE",
    The00Exito = "00 Exito"
}
export interface Zona {
    IdZona: number;
    Codigo: CodigoCustomer;
    Nombre: CodigoCustomer;
    Activo: boolean;
    EntregaLunes: boolean;
    EntregaMartes: boolean;
    EntregaMiercoles: boolean;
    EntregaJueves: boolean;
    EntregaViernes: boolean;
    EntregaSabado: boolean;
    EntregaDomingo: boolean;
    DemoraEnHorasFechaEntrega: number;
    CostoEntrega: number;
}
export declare enum CodigoCustomer {
    AGonzalezChavez = "A. GONZALEZ CHAVEZ",
    Alberti = "ALBERTI",
    Avellaneda = "AVELLANEDA",
    Azul = "AZUL",
    BahiaBlanca = "BAHIA BLANCA",
    Berazategui = "BERAZATEGUI",
    Bragado = "BRAGADO",
    Brandsen = "BRANDSEN",
    CapitalFederal = "CAPITAL FEDERAL",
    Chivilcoy = "CHIVILCOY",
    CoronelPringles = "CORONEL PRINGLES",
    CoronelSuarez = "CORONEL SUAREZ",
    Daireaux = "DAIREAUX",
    Dolores = "DOLORES",
    Escobar = "ESCOBAR",
    EstebanEcheverria = "ESTEBAN ECHEVERRIA",
    GeneralRodriguez = "GENERAL RODRIGUEZ",
    GeneralVillegas = "GENERAL VILLEGAS",
    Hurlingham = "HURLINGHAM",
    Ituzaingo = "ITUZAINGO",
    LAMATANZARamos = "LA MATANZA - Ramos",
    LAMATANZASANJusto = "LA MATANZA - San Justo",
    LaPlata = "LA PLATA",
    Lanus = "LANUS",
    Lobos = "LOBOS",
    LomasDeZamora = "LOMAS DE ZAMORA",
    MarcosPaz = "MARCOS PAZ",
    Merlo = "MERLO",
    Moreno = "MORENO",
    Moron = "MORON",
    Pergamino = "PERGAMINO",
    Pila = "PILA",
    Pilar = "PILAR",
    Puan = "PUAN",
    Ramallo = "RAMALLO",
    SANIsidro = "SAN ISIDRO",
    SANMiguel = "SAN MIGUEL",
    SANPedro = "SAN PEDRO",
    Saladillo = "SALADILLO",
    Salliquelo = "SALLIQUELO",
    Tigre = "TIGRE",
    TresDeFebrero = "TRES DE FEBRERO",
    VicenteLopez = "VICENTE LOPEZ",
    Zarate = "ZARATE"
}
