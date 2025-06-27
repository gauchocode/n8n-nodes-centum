"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodigoCustomer = exports.VendedorNombre = exports.VendedorCodigo = exports.UbicacionClienteNombre = exports.UbicacionClienteCodigo = exports.TipoDocumentoNombre = exports.TipoDocumentoCodigo = exports.RazonSocial = exports.TransporteCodigo = exports.Descripcion = exports.ListaPrecioCodigo = exports.LimiteCreditoNombre = exports.HorarioAtencionClienteNombre = exports.HorarioAtencionClienteCodigo = exports.FrecuenciaClienteNombre = exports.EdadesPromedioConsumidoresClienteNombre = exports.DiasAtencionClienteNombre = exports.DiasAtencionClienteCodigo = exports.ProvinciaNombre = exports.CondicionVentaNombre = exports.CondicionVentaCodigo = exports.CondicionIVANombre = exports.CondicionIVACodigo = exports.CondicionIIBBCodigo = exports.ClaseClienteNombre = exports.ClaseClienteCodigo = exports.CigarreraClienteNombre = exports.CigarreraClienteCodigo = exports.CanalClienteNombre = exports.CanalClienteCodigo = exports.BonificacionCodigo = void 0;
var BonificacionCodigo;
(function (BonificacionCodigo) {
    BonificacionCodigo["The01"] = "01 ";
})(BonificacionCodigo = exports.BonificacionCodigo || (exports.BonificacionCodigo = {}));
var CanalClienteCodigo;
(function (CanalClienteCodigo) {
    CanalClienteCodigo["Gcy"] = "GCY";
    CanalClienteCodigo["Kio"] = "KIO";
    CanalClienteCodigo["Otr"] = "OTR";
})(CanalClienteCodigo = exports.CanalClienteCodigo || (exports.CanalClienteCodigo = {}));
var CanalClienteNombre;
(function (CanalClienteNombre) {
    CanalClienteNombre["Grocery"] = "Grocery";
    CanalClienteNombre["Kiosco"] = "Kiosco";
    CanalClienteNombre["Otros"] = "Otros";
})(CanalClienteNombre = exports.CanalClienteNombre || (exports.CanalClienteNombre = {}));
var CigarreraClienteCodigo;
(function (CigarreraClienteCodigo) {
    CigarreraClienteCodigo["Msp"] = "MSP";
})(CigarreraClienteCodigo = exports.CigarreraClienteCodigo || (exports.CigarreraClienteCodigo = {}));
var CigarreraClienteNombre;
(function (CigarreraClienteNombre) {
    CigarreraClienteNombre["MassalinParticulares"] = "Massalin Particulares";
})(CigarreraClienteNombre = exports.CigarreraClienteNombre || (exports.CigarreraClienteNombre = {}));
var ClaseClienteCodigo;
(function (ClaseClienteCodigo) {
    ClaseClienteCodigo["ClaseDefecto"] = "ClaseDefecto";
})(ClaseClienteCodigo = exports.ClaseClienteCodigo || (exports.ClaseClienteCodigo = {}));
var ClaseClienteNombre;
(function (ClaseClienteNombre) {
    ClaseClienteNombre["ClaseDefecto"] = "Clase Defecto";
})(ClaseClienteNombre = exports.ClaseClienteNombre || (exports.ClaseClienteNombre = {}));
var CondicionIIBBCodigo;
(function (CondicionIIBBCodigo) {
    CondicionIIBBCodigo["ConvenioMultilatera"] = "Convenio Multilatera";
    CondicionIIBBCodigo["Exento"] = "Exento";
    CondicionIIBBCodigo["ResponsableInscript"] = "Responsable Inscript";
})(CondicionIIBBCodigo = exports.CondicionIIBBCodigo || (exports.CondicionIIBBCodigo = {}));
var CondicionIVACodigo;
(function (CondicionIVACodigo) {
    CondicionIVACodigo["CF"] = "CF";
    CondicionIVACodigo["Exe"] = "EXE";
    CondicionIVACodigo["Mtb"] = "MTB";
    CondicionIVACodigo["Ri"] = "RI";
})(CondicionIVACodigo = exports.CondicionIVACodigo || (exports.CondicionIVACodigo = {}));
var CondicionIVANombre;
(function (CondicionIVANombre) {
    CondicionIVANombre["ConsumidorFinal"] = "Consumidor Final";
    CondicionIVANombre["Exento"] = "Exento";
    CondicionIVANombre["Monotributo"] = "Monotributo";
    CondicionIVANombre["ResponsableInscripto"] = "Responsable Inscripto";
})(CondicionIVANombre = exports.CondicionIVANombre || (exports.CondicionIVANombre = {}));
var CondicionVentaCodigo;
(function (CondicionVentaCodigo) {
    CondicionVentaCodigo["Vta1"] = "VTA1";
})(CondicionVentaCodigo = exports.CondicionVentaCodigo || (exports.CondicionVentaCodigo = {}));
var CondicionVentaNombre;
(function (CondicionVentaNombre) {
    CondicionVentaNombre["Contado"] = "Contado";
})(CondicionVentaNombre = exports.CondicionVentaNombre || (exports.CondicionVentaNombre = {}));
var ProvinciaNombre;
(function (ProvinciaNombre) {
    ProvinciaNombre["BuenosAires"] = "Buenos Aires";
    ProvinciaNombre["CapitalFederal"] = "Capital Federal";
    ProvinciaNombre["Catamarca"] = "Catamarca";
    ProvinciaNombre["Chaco"] = "Chaco";
    ProvinciaNombre["Chubut"] = "Chubut";
    ProvinciaNombre["Cordoba"] = "Cordoba";
    ProvinciaNombre["Corrientes"] = "Corrientes";
    ProvinciaNombre["EntreRios"] = "Entre Rios";
    ProvinciaNombre["Formosa"] = "Formosa";
    ProvinciaNombre["Jujuy"] = "Jujuy";
    ProvinciaNombre["LaPampa"] = "La Pampa";
    ProvinciaNombre["LaRioja"] = "LA RIOJA";
    ProvinciaNombre["Mendoza"] = "Mendoza";
    ProvinciaNombre["Misiones"] = "Misiones";
    ProvinciaNombre["Neuqu\u00E9n"] = "Neuqu\u00E9n";
    ProvinciaNombre["RioNegro"] = "Rio Negro";
    ProvinciaNombre["SANJuan"] = "San Juan";
    ProvinciaNombre["SANLuis"] = "San Luis";
    ProvinciaNombre["Salta"] = "Salta";
    ProvinciaNombre["SantaCruz"] = "Santa Cruz";
    ProvinciaNombre["SantaF\u00E9"] = "Santa F\u00E9";
    ProvinciaNombre["SantiagoDelEstero"] = "Santiago del Estero";
    ProvinciaNombre["TierraDelFuego"] = "Tierra del Fuego";
    ProvinciaNombre["Tucum\u00E1n"] = "Tucum\u00E1n";
})(ProvinciaNombre = exports.ProvinciaNombre || (exports.ProvinciaNombre = {}));
var DiasAtencionClienteCodigo;
(function (DiasAtencionClienteCodigo) {
    DiasAtencionClienteCodigo["LV"] = "LV";
    DiasAtencionClienteCodigo["Ld"] = "LD";
})(DiasAtencionClienteCodigo = exports.DiasAtencionClienteCodigo || (exports.DiasAtencionClienteCodigo = {}));
var DiasAtencionClienteNombre;
(function (DiasAtencionClienteNombre) {
    DiasAtencionClienteNombre["LunesADomingo"] = "Lunes a Domingo";
    DiasAtencionClienteNombre["LunesAViernes"] = "Lunes a Viernes";
})(DiasAtencionClienteNombre = exports.DiasAtencionClienteNombre || (exports.DiasAtencionClienteNombre = {}));
var EdadesPromedioConsumidoresClienteNombre;
(function (EdadesPromedioConsumidoresClienteNombre) {
    EdadesPromedioConsumidoresClienteNombre["HayIgualCantidadDeConsumidores"] = "Hay igual cantidad de consumidores";
})(EdadesPromedioConsumidoresClienteNombre = exports.EdadesPromedioConsumidoresClienteNombre || (exports.EdadesPromedioConsumidoresClienteNombre = {}));
var FrecuenciaClienteNombre;
(function (FrecuenciaClienteNombre) {
    FrecuenciaClienteNombre["FrecuenciaDefecto"] = "Frecuencia Defecto";
})(FrecuenciaClienteNombre = exports.FrecuenciaClienteNombre || (exports.FrecuenciaClienteNombre = {}));
var HorarioAtencionClienteCodigo;
(function (HorarioAtencionClienteCodigo) {
    HorarioAtencionClienteCodigo["D"] = "D";
})(HorarioAtencionClienteCodigo = exports.HorarioAtencionClienteCodigo || (exports.HorarioAtencionClienteCodigo = {}));
var HorarioAtencionClienteNombre;
(function (HorarioAtencionClienteNombre) {
    HorarioAtencionClienteNombre["Diurno"] = "Diurno";
})(HorarioAtencionClienteNombre = exports.HorarioAtencionClienteNombre || (exports.HorarioAtencionClienteNombre = {}));
var LimiteCreditoNombre;
(function (LimiteCreditoNombre) {
    LimiteCreditoNombre["L\u00EDmiteCredito1"] = "L\u00EDmite Credito 1";
})(LimiteCreditoNombre = exports.LimiteCreditoNombre || (exports.LimiteCreditoNombre = {}));
var ListaPrecioCodigo;
(function (ListaPrecioCodigo) {
    ListaPrecioCodigo["Exitoweb"] = "EXITOWEB";
    ListaPrecioCodigo["Mlclasica"] = "MLCLASICA";
    ListaPrecioCodigo["Mlenvios"] = "MLENVIOS";
    ListaPrecioCodigo["Mlpremium"] = "MLPREMIUM";
    ListaPrecioCodigo["Mostrador"] = "MOSTRADOR";
})(ListaPrecioCodigo = exports.ListaPrecioCodigo || (exports.ListaPrecioCodigo = {}));
var Descripcion;
(function (Descripcion) {
    Descripcion["MercadolibrePublicacionClasica"] = "MERCADOLIBRE - PUBLICACION CLASICA";
    Descripcion["MercadolibrePublicacionPremium"] = "MERCADOLIBRE - PUBLICACION PREMIUM";
    Descripcion["MercadolibrePublicacionesEnviosGratis"] = "MERCADOLIBRE - PUBLICACIONES ENVIOS GRATIS";
    Descripcion["TiendaOnLineExito"] = "TIENDA ON LINE EXITO.COM.AR";
    Descripcion["TiendasFisicas"] = "TIENDAS FISICAS";
})(Descripcion = exports.Descripcion || (exports.Descripcion = {}));
var TransporteCodigo;
(function (TransporteCodigo) {
    TransporteCodigo["Tra1"] = "TRA1";
})(TransporteCodigo = exports.TransporteCodigo || (exports.TransporteCodigo = {}));
var RazonSocial;
(function (RazonSocial) {
    RazonSocial["TransporteDefecto"] = "Transporte Defecto";
})(RazonSocial = exports.RazonSocial || (exports.RazonSocial = {}));
var TipoDocumentoCodigo;
(function (TipoDocumentoCodigo) {
    TipoDocumentoCodigo["Dni"] = "DNI";
})(TipoDocumentoCodigo = exports.TipoDocumentoCodigo || (exports.TipoDocumentoCodigo = {}));
var TipoDocumentoNombre;
(function (TipoDocumentoNombre) {
    TipoDocumentoNombre["DocumentoNacionalDeIdentidad"] = "Documento Nacional de Identidad";
})(TipoDocumentoNombre = exports.TipoDocumentoNombre || (exports.TipoDocumentoNombre = {}));
var UbicacionClienteCodigo;
(function (UbicacionClienteCodigo) {
    UbicacionClienteCodigo["Bar"] = "BAR";
})(UbicacionClienteCodigo = exports.UbicacionClienteCodigo || (exports.UbicacionClienteCodigo = {}));
var UbicacionClienteNombre;
(function (UbicacionClienteNombre) {
    UbicacionClienteNombre["ZonaDeBaresYBoliches"] = "Zona de Bares y Boliches";
})(UbicacionClienteNombre = exports.UbicacionClienteNombre || (exports.UbicacionClienteNombre = {}));
var VendedorCodigo;
(function (VendedorCodigo) {
    VendedorCodigo["V01"] = "V01";
    VendedorCodigo["V02"] = "V02";
    VendedorCodigo["V05"] = "V05";
    VendedorCodigo["V06"] = "V06";
    VendedorCodigo["V09"] = "V09";
    VendedorCodigo["V10"] = "V10";
})(VendedorCodigo = exports.VendedorCodigo || (exports.VendedorCodigo = {}));
var VendedorNombre;
(function (VendedorNombre) {
    VendedorNombre["AndreaMaidana"] = "ANDREA MAIDANA";
    VendedorNombre["DiegoMirandaLamamy"] = "DIEGO MIRANDA LAMAMY";
    VendedorNombre["IvanRodriguez"] = "IVAN RODRIGUEZ";
    VendedorNombre["JuanManuelValenzuela"] = "JUAN MANUEL VALENZUELA";
    VendedorNombre["Mercadolibre"] = "MERCADOLIBRE";
    VendedorNombre["The00Exito"] = "00 Exito";
})(VendedorNombre = exports.VendedorNombre || (exports.VendedorNombre = {}));
var CodigoCustomer;
(function (CodigoCustomer) {
    CodigoCustomer["AGonzalezChavez"] = "A. GONZALEZ CHAVEZ";
    CodigoCustomer["Alberti"] = "ALBERTI";
    CodigoCustomer["Avellaneda"] = "AVELLANEDA";
    CodigoCustomer["Azul"] = "AZUL";
    CodigoCustomer["BahiaBlanca"] = "BAHIA BLANCA";
    CodigoCustomer["Berazategui"] = "BERAZATEGUI";
    CodigoCustomer["Bragado"] = "BRAGADO";
    CodigoCustomer["Brandsen"] = "BRANDSEN";
    CodigoCustomer["CapitalFederal"] = "CAPITAL FEDERAL";
    CodigoCustomer["Chivilcoy"] = "CHIVILCOY";
    CodigoCustomer["CoronelPringles"] = "CORONEL PRINGLES";
    CodigoCustomer["CoronelSuarez"] = "CORONEL SUAREZ";
    CodigoCustomer["Daireaux"] = "DAIREAUX";
    CodigoCustomer["Dolores"] = "DOLORES";
    CodigoCustomer["Escobar"] = "ESCOBAR";
    CodigoCustomer["EstebanEcheverria"] = "ESTEBAN ECHEVERRIA";
    CodigoCustomer["GeneralRodriguez"] = "GENERAL RODRIGUEZ";
    CodigoCustomer["GeneralVillegas"] = "GENERAL VILLEGAS";
    CodigoCustomer["Hurlingham"] = "HURLINGHAM";
    CodigoCustomer["Ituzaingo"] = "ITUZAINGO";
    CodigoCustomer["LAMATANZARamos"] = "LA MATANZA - Ramos";
    CodigoCustomer["LAMATANZASANJusto"] = "LA MATANZA - San Justo";
    CodigoCustomer["LaPlata"] = "LA PLATA";
    CodigoCustomer["Lanus"] = "LANUS";
    CodigoCustomer["Lobos"] = "LOBOS";
    CodigoCustomer["LomasDeZamora"] = "LOMAS DE ZAMORA";
    CodigoCustomer["MarcosPaz"] = "MARCOS PAZ";
    CodigoCustomer["Merlo"] = "MERLO";
    CodigoCustomer["Moreno"] = "MORENO";
    CodigoCustomer["Moron"] = "MORON";
    CodigoCustomer["Pergamino"] = "PERGAMINO";
    CodigoCustomer["Pila"] = "PILA";
    CodigoCustomer["Pilar"] = "PILAR";
    CodigoCustomer["Puan"] = "PUAN";
    CodigoCustomer["Ramallo"] = "RAMALLO";
    CodigoCustomer["SANIsidro"] = "SAN ISIDRO";
    CodigoCustomer["SANMiguel"] = "SAN MIGUEL";
    CodigoCustomer["SANPedro"] = "SAN PEDRO";
    CodigoCustomer["Saladillo"] = "SALADILLO";
    CodigoCustomer["Salliquelo"] = "SALLIQUELO";
    CodigoCustomer["Tigre"] = "TIGRE";
    CodigoCustomer["TresDeFebrero"] = "TRES DE FEBRERO";
    CodigoCustomer["VicenteLopez"] = "VICENTE LOPEZ";
    CodigoCustomer["Zarate"] = "ZARATE";
})(CodigoCustomer = exports.CodigoCustomer || (exports.CodigoCustomer = {}));
//# sourceMappingURL=customers.js.map