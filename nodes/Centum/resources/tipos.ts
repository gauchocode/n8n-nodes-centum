import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";

export interface CentumHeaders {
	CentumSuiteConsumidorApiPublicaId: string | number;
	publicAccessKey: string;
}

export interface CentumApiCredentials {
	centumUrl: string;
	consumerApiPublicId: string | number;
	publicAccessKey: string;
}

export interface CentumApiListResponse<T> {
	Items: T[];
	CantidadTotalItems?: number;
}

export interface ResourceHandlerContext {
	executeFunctions: IExecuteFunctions;
	centumUrl: string;
	headers: CentumHeaders;
	centumApiCredentials: CentumApiCredentials;
	consumerApiPublicId: string | number;
	itemIndex: number;
}

export type ResourceHandler = (context: ResourceHandlerContext) => Promise<INodeExecutionData[][]>;

export type ResourceHandlerMap = Record<string, ResourceHandler>;
