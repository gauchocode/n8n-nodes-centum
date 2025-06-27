"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubRubroNombreMerge = exports.SociedadArticuloNombreMerge = exports.RubroNombreMerge = exports.RubroCodigoMerge = exports.CodigoMerge = exports.DetalleMerge = exports.AtributosArticuloNombreMerge = exports.AbreviaturaMerge = void 0;
var AbreviaturaMerge;
(function (AbreviaturaMerge) {
    AbreviaturaMerge["Col"] = "COL";
    AbreviaturaMerge["Med"] = "MED";
})(AbreviaturaMerge = exports.AbreviaturaMerge || (exports.AbreviaturaMerge = {}));
var AtributosArticuloNombreMerge;
(function (AtributosArticuloNombreMerge) {
    AtributosArticuloNombreMerge["Color"] = "COLOR ";
    AtributosArticuloNombreMerge["Medidas"] = "MEDIDAS";
})(AtributosArticuloNombreMerge = exports.AtributosArticuloNombreMerge || (exports.AtributosArticuloNombreMerge = {}));
var DetalleMerge;
(function (DetalleMerge) {
    DetalleMerge["AlfombraRhoneDib"] = "ALFOMBRA RHONE DIB";
    DetalleMerge["Empty"] = "";
    DetalleMerge["R01Sr0108"] = "R01SR0108";
})(DetalleMerge = exports.DetalleMerge || (exports.DetalleMerge = {}));
var CodigoMerge;
(function (CodigoMerge) {
    CodigoMerge["Captor"] = "Captor";
    CodigoMerge["CodigoCaptor"] = "Captor ";
    CodigoMerge["CodigoEnya"] = "Enya";
    CodigoMerge["Dib"] = "Dib";
    CodigoMerge["ElEspartano"] = "El Espartano";
    CodigoMerge["Enya"] = "ENYA";
    CodigoMerge["Exito"] = "Exito";
    CodigoMerge["Francavilla"] = "Francavilla";
    CodigoMerge["Muresco"] = "Muresco";
    CodigoMerge["Rielamericano"] = "Rielamericano";
    CodigoMerge["Wepel"] = "Wepel";
})(CodigoMerge = exports.CodigoMerge || (exports.CodigoMerge = {}));
var RubroCodigoMerge;
(function (RubroCodigoMerge) {
    RubroCodigoMerge["R01"] = "R01";
    RubroCodigoMerge["R02"] = "R02";
    RubroCodigoMerge["R03"] = "R03";
    RubroCodigoMerge["R04"] = "R04";
    RubroCodigoMerge["R05"] = "R05";
    RubroCodigoMerge["R06"] = "R06";
    RubroCodigoMerge["R07"] = "R07";
})(RubroCodigoMerge = exports.RubroCodigoMerge || (exports.RubroCodigoMerge = {}));
var RubroNombreMerge;
(function (RubroNombreMerge) {
    RubroNombreMerge["Alfombras"] = "ALFOMBRAS";
    RubroNombreMerge["Cortinas"] = "CORTINAS";
    RubroNombreMerge["Deco"] = "DECO";
    RubroNombreMerge["EnviosViaticosYEmbalajes"] = "ENVIOS, VIATICOS Y EMBALAJES";
    RubroNombreMerge["ManoDeObra"] = "MANO DE OBRA";
    RubroNombreMerge["Revestimientos"] = "REVESTIMIENTOS";
    RubroNombreMerge["Telas"] = "TELAS";
})(RubroNombreMerge = exports.RubroNombreMerge || (exports.RubroNombreMerge = {}));
var SociedadArticuloNombreMerge;
(function (SociedadArticuloNombreMerge) {
    SociedadArticuloNombreMerge["SociedadDeArt\u00EDculoDefecto"] = "Sociedad de Art\u00EDculo Defecto";
})(SociedadArticuloNombreMerge = exports.SociedadArticuloNombreMerge || (exports.SociedadArticuloNombreMerge = {}));
var SubRubroNombreMerge;
(function (SubRubroNombreMerge) {
    SubRubroNombreMerge["Adhesivos"] = "ADHESIVOS";
    SubRubroNombreMerge["Alfombras"] = "ALFOMBRAS";
    SubRubroNombreMerge["BorlasYComplementos"] = "BORLAS Y COMPLEMENTOS";
    SubRubroNombreMerge["Carpetas"] = "CARPETAS";
    SubRubroNombreMerge["Complementos"] = "COMPLEMENTOS";
    SubRubroNombreMerge["Confecciones"] = "CONFECCIONES ";
    SubRubroNombreMerge["CortinasAmericanas"] = "CORTINAS AMERICANAS ";
    SubRubroNombreMerge["CortinasBandasVerticales"] = "CORTINAS BANDAS VERTICALES";
    SubRubroNombreMerge["CortinasRipplefold"] = "CORTINAS RIPPLEFOLD";
    SubRubroNombreMerge["CortinasRoller"] = "CORTINAS ROLLER";
    SubRubroNombreMerge["CortinasStandard"] = "CORTINAS STANDARD";
    SubRubroNombreMerge["CortinasTradicionalesAMedida"] = "CORTINAS TRADICIONALES A MEDIDA";
    SubRubroNombreMerge["Embalajes"] = "EMBALAJES";
    SubRubroNombreMerge["Envios"] = "ENVIOS";
    SubRubroNombreMerge["InstalacionCortinas"] = "INSTALACION CORTINAS";
    SubRubroNombreMerge["InstalacionRevestimientos"] = "INSTALACION REVESTIMIENTOS";
    SubRubroNombreMerge["InstalacionesVarias"] = "INSTALACIONES VARIAS";
    SubRubroNombreMerge["Papeles"] = "PAPELES";
    SubRubroNombreMerge["Pisos"] = "PISOS";
    SubRubroNombreMerge["Preventivas"] = "PREVENTIVAS";
    SubRubroNombreMerge["RevestimientosDeParedes"] = "REVESTIMIENTOS DE PAREDES";
    SubRubroNombreMerge["RevestimientosVarios"] = "REVESTIMIENTOS VARIOS";
    SubRubroNombreMerge["SistemasYMecanismos"] = "SISTEMAS Y MECANISMOS";
    SubRubroNombreMerge["TelasParaCortinas"] = "TELAS PARA CORTINAS";
    SubRubroNombreMerge["Textiles"] = "TEXTILES";
})(SubRubroNombreMerge = exports.SubRubroNombreMerge || (exports.SubRubroNombreMerge = {}));
//# sourceMappingURL=articulosMerge.js.map