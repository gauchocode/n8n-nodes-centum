import { Cliente, Moneda } from './clientes';

export interface INewCobro {
	Cliente: Cliente;
	CobroAnticipos: CobrosAnticipos[];
	Observacion: string;
	ClienteCuentaCorriente: Cliente;
	SucursalFisica: SucursalFisica;
	FechaDocumento: string;
	FechaImputacion: string;
	Anulado: boolean;
	Nota: string;
	Moneda: Moneda;
	Cotizacion: number;
	DivisionEmpresaGrupoEconomico: DivisionEmpresaGrupoEconomico;
	Usuario: null;
	CobroEfectivos: CobroEfectivos[];
	CobroRetenciones: [];
	CobroCheques: [];
	CobroVouchers: [];
	CobroPasarelaPago: [];
	NumeroPedido?: number;
}

export interface CobrosAnticipos {
	ConceptoVarios: ConceptoVarios;
	Cotizacion: 1;
	Importe: number;
	Detalle: string;
}

export interface ConceptoVarios {
	IdConceptoVarios: number;
	Clave: null;
	Nombre: null;
	Activo: false;
	ResumenFondo: null;
}

interface SucursalFisica {
	IdSucursalFisica: number;
	Codigo: string;
	Nombre: string;
}

interface DivisionEmpresaGrupoEconomico {
	IdDivisionEmpresaGrupoEconomico: number;
	RazonSocialEmpresaGrupoEconomico: null;
	NombreDivisionEmpresa: null;
}

export interface CobroEfectivos {
	Valor: Valor;
	Detalle: string;
	Importe: number;
	Cotizacion: 1;
	CotizacionMonedaRespectoMonedaCliente: number;
	CantidadCuotas: number;
	PorcentajeCostoServicio: number;
	PorcentajeCostoFinanciacion: number;
	PorcentajeCostoImpositivo: number;
	FechaAcreditacion: string;
	NumeroCupon: string;
	DNI: string;
	NombreApellido: string;
}

interface Valor {
	IdValor: number;
	Codigo: null;
	Nombre: null;
	Moneda: null;
	Ingresa: boolean;
	Egresa: boolean;
	OperaVueltoVentasContado: boolean;
	SolicitaNumeroCupon: boolean;
	VisibleVentasContado: boolean;
	CantidadMaximaCuotas: number;
	Cuotas: null;
}
