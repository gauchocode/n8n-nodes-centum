import { IExecuteFunctions } from 'n8n-workflow';
interface FetchOptions {
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: any;
    queryParams?: Record<string, string | number | boolean>;
    responseType?: 'json' | 'arraybuffer';
}
export declare function apiRequest<T>(url: string, options?: FetchOptions, context?: IExecuteFunctions): Promise<T>;
export {};
