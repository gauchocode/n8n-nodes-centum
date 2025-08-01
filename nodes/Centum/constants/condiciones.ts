
import { CondicionIIBB, CondicionIIBBCodigo } from '../interfaces';

export const CondicionesIVA = [
	{
		IdCondicionIVA:1892,
		Codigo:"CF",
		Nombre:"Consumidor Final"
	},
	{
		IdCondicionIVA:1893,
		Codigo:"EXE",
		Nombre:"Exento"
	},
	{
		IdCondicionIVA:1894,
		Codigo:"MTB",
		Nombre:"Monotributo"
	},
	{
		IdCondicionIVA:1895,
		Codigo:"RI",
		Nombre:"Responsable Inscripto"
	},
	{
		IdCondicionIVA:1896,
		Codigo:"RNI",
		Nombre:"Responsable No Inscripto"
	},
	{
		IdCondicionIVA:4413,
		Codigo:"EXP",
		Nombre:"Exportacion"
	},
	{
		IdCondicionIVA:6064,
		Codigo:"IMP",
		Nombre:"Importacion"
	},
	{
		IdCondicionIVA:8632,
		Codigo:"SNC",
		Nombre:"Sujeto No Categorizado"
	}
];

// Solamente se est
export const CondicionesIIBB: CondicionIIBB[] = [
	{
		IdCondicionIIBB: 6051,
		Codigo: CondicionIIBBCodigo.ResponsableInscript
	}
];

export const CategoriasIIBB = [
	{
		IdCategoriaIIBB: 6054,
		Codigo: "Cosas Muebles"
	}
]
