import { IProvincias } from '../interfaces/provincias'

export const constantProvincias = [
	{
		IdProvincia: 4667,
		Codigo: 'SFE',
		Nombre: 'Santa Fé',
	},
	{
		IdProvincia: 4705,
		Codigo: 'CORDB',
		Nombre: 'Cordoba',
	},
	{
		IdProvincia: 4706,
		Codigo: 'CAPFED',
		Nombre: 'Capital Federal',
	},
	{
		IdProvincia: 4708,
		Codigo: 'LP',
		Nombre: 'La Plata',
	},
	{
		IdProvincia: 4827,
		Codigo: 'E.RIOS',
		Nombre: 'Entre Rios',
	},
	{
		IdProvincia: 4876,
		Codigo: 'BSAS',
		Nombre: 'Buenos Aires',
	},
	{
		IdProvincia: 4953,
		Codigo: 'S.LUIS',
		Nombre: 'San Luis',
	},
	{
		IdProvincia: 4957,
		Codigo: 'LAPAMPA',
		Nombre: 'La Pampa',
	},
	{
		IdProvincia: 4968,
		Codigo: 'MENDOZA',
		Nombre: 'Mendoza',
	},
	{
		IdProvincia: 5183,
		Codigo: 'CORRI',
		Nombre: 'Corrientes',
	},
	{
		IdProvincia: 5184,
		Codigo: 'T.FUEGO',
		Nombre: 'Tierra del Fuego',
	},
	{
		IdProvincia: 6025,
		Codigo: 'RN',
		Nombre: 'Rio Negro',
	},
	{
		IdProvincia: 6026,
		Codigo: '1',
		Nombre: 'Chubut',
	},
	{
		IdProvincia: 6027,
		Codigo: 'SANTA CRUZ',
		Nombre: 'Santa Cruz',
	},
	{
		IdProvincia: 6068,
		Codigo: 'l.rioja',
		Nombre: 'LA RIOJA',
	},
	{
		IdProvincia: 6069,
		Codigo: 'Catamarca',
		Nombre: 'Catamarca',
	},
	{
		IdProvincia: 6070,
		Codigo: 'Chaco',
		Nombre: 'Chaco',
	},
	{
		IdProvincia: 6071,
		Codigo: 'Formosa',
		Nombre: 'Formosa',
	},
	{
		IdProvincia: 6072,
		Codigo: 'Jujuy',
		Nombre: 'Jujuy',
	},
	{
		IdProvincia: 6073,
		Codigo: 'Misiones',
		Nombre: 'Misiones',
	},
	{
		IdProvincia: 6074,
		Codigo: 'Neuquén',
		Nombre: 'Neuquén',
	},
	{
		IdProvincia: 6075,
		Codigo: 'Salta',
		Nombre: 'Salta',
	},
	{
		IdProvincia: 6076,
		Codigo: 'San Juan',
		Nombre: 'San Juan',
	},
	{
		IdProvincia: 6077,
		Codigo: 'Santiago del Estero',
		Nombre: 'Santiago del Estero',
	},
	{
		IdProvincia: 6078,
		Codigo: 'Tucumán',
		Nombre: 'Tucumán',
	},
];

export const wooToCentumProvinciaMap: Record<string, IProvincias> = {
  C: constantProvincias.find(p => p.Nombre.toLowerCase().includes('capital'))!,
  B: constantProvincias.find(p => p.Nombre.toLowerCase().includes('buenos'))!,
  K: constantProvincias.find(p => p.Nombre.toLowerCase().includes('catamarca'))!,
  H: constantProvincias.find(p => p.Nombre.toLowerCase().includes('chaco'))!,
  U: constantProvincias.find(p => p.Nombre.toLowerCase().includes('chubut'))!,
  X: constantProvincias.find(p => p.Nombre.toLowerCase().includes('cordoba'))!,
  W: constantProvincias.find(p => p.Nombre.toLowerCase().includes('corrientes'))!,
  E: constantProvincias.find(p => p.Nombre.toLowerCase().includes('entr'))!,
  P: constantProvincias.find(p => p.Nombre.toLowerCase().includes('formosa'))!,
  Y: constantProvincias.find(p => p.Nombre.toLowerCase().includes('jujuy'))!,
  L: constantProvincias.find(p => p.Nombre.toLowerCase().includes('pampa'))!,
  F: constantProvincias.find(p => p.Nombre.toLowerCase().includes('rioja'))!,
  M: constantProvincias.find(p => p.Nombre.toLowerCase().includes('mendoza'))!,
  N: constantProvincias.find(p => p.Nombre.toLowerCase().includes('misiones'))!,
  Q: constantProvincias.find(p => p.Nombre.toLowerCase().includes('neuqu'))!,
  R: constantProvincias.find(p => p.Nombre.toLowerCase().includes('río negro'))!,
  A: constantProvincias.find(p => p.Nombre.toLowerCase().includes('salta'))!,
  J: constantProvincias.find(p => p.Nombre.toLowerCase().includes('san juan'))!,
  D: constantProvincias.find(p => p.Nombre.toLowerCase().includes('san luis'))!,
  Z: constantProvincias.find(p => p.Nombre.toLowerCase().includes('santa cruz'))!,
  S: constantProvincias.find(p => p.Nombre.toLowerCase().includes('santa fe'))!,
  G: constantProvincias.find(p => p.Nombre.toLowerCase().includes('santiago'))!,
  V: constantProvincias.find(p => p.Nombre.toLowerCase().includes('fuego'))!,
  T: constantProvincias.find(p => p.Nombre.toLowerCase().includes('tucum'))!,
};
