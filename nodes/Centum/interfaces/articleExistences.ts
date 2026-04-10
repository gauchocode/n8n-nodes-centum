
export interface IArticulosExistencias {
	Items: ItemExistencia[];
	CantidadTotalItems: number;
	Pagina: null;
}

export interface ItemExistencia {
	IdArticulo: number;
	ExistenciasSucursales: number;
	ExistenciasTotal: number;
	CantidadPedidosVenta: number;
	CantidadOrdenesCompra: number;
	StockComprometido: number;
}
