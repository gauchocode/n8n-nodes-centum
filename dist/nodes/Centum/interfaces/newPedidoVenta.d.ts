import { BonificacionNewCustomer, INewCustomer, VendedorNewCustomer } from './newCustomer';
import { CobroId } from './woocommerce';
export interface INewPedidoVenta {
    FechaEntrega: string;
    Cliente: INewCustomer;
    Vendedor: VendedorNewCustomer;
    Bonificacion: BonificacionNewCustomer;
    PedidoVentaArticulos: IArticuloPedidoVenta[];
    SucursalFisica?: SucursalFisica;
    DivisionEmpresaGrupoEconomico: DivisionEmpresaGrupoEconomico;
    TiendaOnline: null;
    Observaciones: string;
    ContieneConjunto: boolean;
    PorcentajeDescuento: number;
    TurnoEntrega: TurnoEntrega;
    IdCobro?: CobroId;
}
export interface IArticuloPedidoVenta {
    IdArticulo: number;
    Codigo: string;
    Nombre: string;
    Cantidad: number;
    SegundoControlStock: number;
    Precio: number;
    PorcentajeDescuento1: number;
    PorcentajeDescuento2: number;
    PorcentajeDescuento3: number;
    PorcentajeDescuentoMaximo: number;
    CostoReposicion: number;
    CategoriaImpuestoIVA: CategoriaImpuestoIVA;
    NumeroTropa: string;
    NumeroSerie: string;
    ImpuestoInterno: number;
    Observaciones: string;
    ClaseDescuento: ClaseDescuento;
}
interface CategoriaImpuestoIVA {
    IdCategoriaImpuestoIVA: 4;
    Codigo: '5';
    Nombre: 'IVA 21.00';
    Tasa: 21;
}
interface DivisionEmpresaGrupoEconomico {
    IdDivisionEmpresaGrupoEconomico: 1;
    RazonSocialEmpresaGrupoEconomico: null;
    NombreDivisionEmpresa: null;
}
interface SucursalFisica {
    IdSucursalFisica: 7341;
    Codigo: 'Moron';
    Nombre: 'Moron';
}
export interface TurnoEntrega {
    IdTurnoEntrega: 6083;
    Nombre: 'Maniana';
}
interface ClaseDescuento {
    IdClaseDescuento: 0;
}
export {};
