import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export interface FetchOptions {
  method?: 'GET' | 'POST';
	body?: any,
  headers?: Record<string, string> | (() => Record<string, string>);
  queryParams?: Record<string, string | number | boolean>;
  cantidadItemsPorPagina?: number;
  itemsField?: string;
  numeroPagina?: number;
  context?: IExecuteFunctions;
  pagination?: 'all' | 'default' | 'custom';
}

function safeThrow(context: IExecuteFunctions | undefined, message: string): never {
	if (!context || !context.getNode()) {
		throw new Error(message);
	}
	throw new NodeOperationError(context.getNode(), message);
}

function buildUrl(baseUrl: string, queryParams: Record<string, any> = {}): string {
	const params = new URLSearchParams();
	Object.entries(queryParams).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			params.append(key, value.toString());
		}
	});
	return params.toString() ? `${baseUrl}?${params}` : baseUrl;
}

function extractItems<T>(data: any, itemsField?: string): T[] {
	if (itemsField && data[itemsField] && Array.isArray(data[itemsField])) {
		return data[itemsField];
	}
	if (Array.isArray(data)) {
		return data;
	}
	if (typeof data === 'object') {
		const arrayField = Object.values(data).find(Array.isArray);
		return arrayField || [data];
	}
	safeThrow(undefined, 'Respuesta inválida: no se encontraron items.');
}

// Dentro del apiGetRequest
async function apiGetRequest<T = any>(
  url: string,
  options: FetchOptions = {},
): Promise<T[]> {
  const {
    headers = {},
    queryParams = {},
    cantidadItemsPorPagina,
    itemsField = 'Items',
    numeroPagina,
    pagination = 'all',
    context,
  } = options;

  if (!url.trim()) safeThrow(context, 'El Endpoint es obligatorio.');

  const getHeaders = () => (typeof headers === 'function' ? headers() : headers);

  if (pagination === 'default' || (!cantidadItemsPorPagina && !numeroPagina)) {
    const finalUrl = buildUrl(url, queryParams);
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getHeaders() },
    });

    if (!response.ok) {
      const errorText = await response.text();
      safeThrow(context, `Error GET: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return extractItems<T>(data, itemsField);
  }

  const allItems: T[] = [];
  let currentPage = numeroPagina || 1;
  const itemsPerPage = cantidadItemsPorPagina || 100;

  while (true) {
    const paginatedParams = {
      ...queryParams,
      numeroPagina: currentPage,
      cantidadItemsPorPagina: itemsPerPage,
    };

    const finalUrl = buildUrl(url, paginatedParams);
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getHeaders() }, // <- dinámico
    });

    if (!response.ok) {
      const errorText = await response.text();
      safeThrow(context, `Error GET (pág ${currentPage}): ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const pageItems = extractItems<T>(data, itemsField);

    allItems.push(...pageItems);

    if (pageItems.length < itemsPerPage) break;

    currentPage++;
  }

  return allItems;
}

// POST sin paginación (con validación explícita)
export async function apiPostRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const { headers = {}, body, queryParams = {}, itemsField = 'items', context } = options;

	if (!url || url.trim() === '') {
		safeThrow(context, 'El campo "Endpoint" es obligatorio.');
	}

	if (!body) {
		safeThrow(context, 'El cuerpo (body) de la solicitud POST es obligatorio.');
	}

	const finalUrl = buildUrl(url, queryParams);
	const fetchOptions: RequestInit = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...headers },
		body: JSON.stringify(body),
	};

	const response = await fetch(finalUrl, fetchOptions);
	if (!response.ok) {
		const errorText = await response.text();
		safeThrow(context, `Error en la solicitud POST: ${response.status} - ${errorText}`);
	}

	const data = await response.json();
	return extractItems<T>(data, itemsField);
}

// Método dinámico para GET o POST
export async function apiRequest<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<T[]> {
	const { method = 'GET', context } = options;

	if (!['GET', 'POST'].includes(method)) {
		safeThrow(context, `Método HTTP no soportado: ${method}. Use GET o POST.`);
	}

	if (method === 'GET') {
		return apiGetRequest<T>(url, options);
	}
	return apiPostRequest<T>(url, options);
}
