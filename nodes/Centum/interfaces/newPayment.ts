interface CobroCliente {
	IdCliente: number;
}

export interface INewCobro {
	Cliente: CobroCliente;
	CobroAnticipos: CobrosAnticipos[];
	Observacion: string;
	SucursalFisica: SucursalFisica;
	FechaDocumento: string;
	FechaImputacion: string;
	Anulado: boolean;
	Nota: string;
	Cotizacion: number;
	DivisionEmpresaGrupoEconomico: DivisionEmpresaGrupoEconomico;
	CobroEfectivos: CobroEfectivos[];
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
}

interface SucursalFisica {
	IdSucursalFisica: number;
}

interface DivisionEmpresaGrupoEconomico {
	IdDivisionEmpresaGrupoEconomico: number;
}

export interface CobroEfectivos {
	Valor: Valor;
	Detalle?: string;
	Importe: number;
	Cotizacion: 1;
	CotizacionMonedaRespectoMonedaCliente?: number;
	CantidadCuotas?: number;
	PorcentajeCostoServicio?: number;
	PorcentajeCostoFinanciacion?: number;
	PorcentajeCostoImpositivo?: number;
	FechaAcreditacion?: string;
	NumeroCupon?: string;
	DNI?: string;
	NombreApellido?: string;
}

interface Valor {
	IdValor: number;
	Codigo?: null;
	Nombre?: null;
	Moneda?: null;
	Ingresa?: boolean;
	Egresa?: boolean;
	OperaVueltoVentasContado?: boolean;
	SolicitaNumeroCupon?: boolean;
	VisibleVentasContado?: boolean;
	CantidadMaximaCuotas?: number;
	Cuotas?: null;
}
