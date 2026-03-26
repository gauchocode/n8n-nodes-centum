import type { ResourceHandlerMap } from './tipos';

import { articulosHandlers } from './articulos';
import { clientesHandlers } from './clientes';
import { ventasHandlers } from './ventas';
import { cobrosHandlers } from './cobros';
import { comprasHandlers } from './compras';
import { proveedoresHandlers } from './proveedores';
import { logisticaHandlers } from './logistica';
import { stockHandlers } from './stock';
import { geografiaHandlers } from './geografia';
import { extrasHandlers } from './extras';

export const resourceHandlers: ResourceHandlerMap = {
	...articulosHandlers,
	...clientesHandlers,
	...ventasHandlers,
	...cobrosHandlers,
	...comprasHandlers,
	...proveedoresHandlers,
	...logisticaHandlers,
	...stockHandlers,
	...geografiaHandlers,
	...extrasHandlers,
};
