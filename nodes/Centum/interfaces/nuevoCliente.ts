import { ListaPrecio } from './clientes';
export interface INewCustomer {
	TarifaServicio: TarifaServicio,
	Bonificacion: BonificacionNewCustomer;
	CadenaCliente: CadenaCliente;
	CanalCliente: CanalCliente;
	CigarreraCliente: CigarreraCliente;
	ClaseCliente: ClaseCliente;
	Codigo: string;
	CodigoPostal?: string;
	CondicionIVA: CondicionIVA;
	CondicionVenta: CondicionVenta;
	CUIT: string;
	DiasAtencionCliente: DiasAtencionCliente;
	Direccion?: string;
	DireccionEntrega?: string;
	EdadesPromedioConsumidoresCliente: EdadesPromedioConsumidoresCliente;
	FrecuenciaCliente: FrecuenciaCliente;
	GeneroPromedioConsumidoresCliente: GeneroPromedioConsumidoresCliente;
	HorarioAtencionCliente: HorarioAtencionCliente;
	IdCliente: number;
	LimiteCredito: LimiteCredito;
	ListaPrecio: ListaPrecio;
	Localidad?: string;
	Pais: Pais;
	Provincia: Provincia;
	RazonSocial: string;
	Telefono?: string;
	Transporte: Transporte;
	UbicacionCliente: UbicacionCliente;
	Vendedor: VendedorNewCustomer;
	Zona: Zona;
	Email: string;
}

interface Provincia {
	IdProvincia: number;
	Codigo: string;
	Nombre: string;
}

interface Pais {
	Codigo: 'ARG';
	IdPais: 4657;
	Nombre: 'Argentina';
}

interface Zona {
	IdZona: number;
	Codigo: string; // Son el nombre de la zona, ej: Avellaneda, Capital Federal, etc.
	Nombre: string; // Son el nombre de la zona, ej: Avellaneda, Capital Federal, etc.
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

export interface IContribuyenteBodyInput {
	RazonSocial: string;
	Email?: string;
	Telefono?: string;
	CodigoPostal: string;
	CondicionIVA: string;
	CondicionIIBB: string;
	CategoriaIIBB: string;
	Localidad: string;
	Provincia: string;
	Direccion: string;
	NroDireccion: string;
	PisoDepartamento?: string;
	NumeroIIBB: string;
	Zona: string;
}

// interface CategoriaIIBB {
// 	IdCategoriaIIBB?: number,
// 	Codigo?: string
// }

type CondicionIVANombre = 'Responsable Inscripto' | 'Monotributo' | 'Exento' | 'Consumidor Final';
interface CondicionIVA {
	IdCondicionIVA?: number; // si opcional
	Codigo?: string; // opcional también
	Nombre: CondicionIVANombre;
}
interface CondicionVenta {
	IdCondicionVenta: 1;
	Codigo: 'VTA1';
	Nombre: 'Contado';
}

export interface VendedorNewCustomer {
	IdVendedor: number;
	Codigo: 'V11';
	Nombre: 'EXITOWEB';
	CUIT: null;
	Direccion: null;
	Localidad: null;
	Telefono: null;
	Mail: null;
	EsSupervisor: boolean;
}

interface Transporte {
	IdTransporte: 1;
	Codigo: 'TRA1';
	RazonSocial: 'Transporte Defecto';
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
	NumeroDocumento: '00000000';
	Email: null;
	TipoDocumento: TipoDocumento;
}

interface TipoDocumento {
	IdTipoDocumento: number;
	Codigo: 'DNI';
	Nombre: 'Documento Nacional de Identidad';
}

export interface BonificacionNewCustomer {
	IdBonificacion: 6235;
	Codigo: '01';
	Calculada: 0;
}

interface LimiteCredito {
	IdLimiteCredito: 46002;
	Nombre: 'Límite Credito 1';
	Valor: 1000000;
}

interface ClaseCliente {
	IdClaseCliente: 6087;
	Codigo: 'ClaseDefecto';
	Nombre: 'Clase Defecto';
}

interface FrecuenciaCliente {
	IdFrecuenciaCliente: 6891;
	Nombre: 'Frecuencia Defecto';
}

interface CanalCliente {
	IdCanalCliente: 6899 | 6897 | 6904 | '';
	Codigo: 'GCY' | 'KIO' | 'OTR';
	Nombre: 'Grocery' | 'Kiosco' | 'Otros';
}

interface CadenaCliente {
	IdCadenaCliente: 6920;
	Codigo: '365';
	Nombre: '365';
}

interface UbicacionCliente {
	IdUbicacionCliente: 6942;
	Codigo: 'BAR';
	Nombre: 'Zona de Bares y Boliches';
}

interface EdadesPromedioConsumidoresCliente {
	IdEdadesPromedioConsumidoresCliente: 6951;
	Codigo: '111';
	Nombre: 'Hay igual cantidad de consumidores';
}

interface GeneroPromedioConsumidoresCliente {
	IdGeneroPromedioConsumidoresCliente: 6964;
	Codigo: '11';
	Nombre: 'Hay igual cantidad de consumidores';
}

interface DiasAtencionCliente {
	IdDiasAtencionCliente: 6969;
	Codigo: 'LV' | 'LD';
	Nombre: 'Lunes a Domingo' | 'Lunes a Viernes';
}

interface HorarioAtencionCliente {
	IdHorarioAtencionCliente: 6970;
	Codigo: 'D';
	Nombre: 'Diurno';
}

interface CigarreraCliente {
	IdCigarreraCliente: 6972;
	Codigo: 'MSP';
	Nombre: 'Massalin Particulares';
}

interface TarifaServicio {
	IdTarifaServicio: 1;
}
