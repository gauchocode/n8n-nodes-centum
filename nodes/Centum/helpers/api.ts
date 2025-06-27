import { IExecuteFunctions } from 'n8n-core';

interface FetchOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string | number | boolean>;
  responseType?: 'json' | 'arraybuffer';
}

export async function apiRequest<T>(
  url: string,
  options: FetchOptions = {},
  context?: IExecuteFunctions,
): Promise<T> {
	// Por defecto las peticiones se hacen con el método GET y respuesta en formato JSON
  const { method = 'GET', headers = {}, body, queryParams, responseType = 'json' } = options;

  let finalUrl = url;
  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    finalUrl += finalUrl.includes('?') ? `&${params.toString()}` : `?${params.toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(finalUrl, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Request failed with status ${response.status}: ${errorText}`);
      if (context) {
				console.log( "status:", response.status, errorText);
        // context.logger.error(error.message, { status: response.status, errorText });
      }
      throw error;
    }

    if (responseType === 'arraybuffer') {
      return await response.arrayBuffer() as any;
    }

    return await response.json() as T;
  } catch (error) {
    if (context) {
			console.log('API request failed', error );
      // context.logger.error('API request failed', { error });
    }
    throw error;
  }
}
