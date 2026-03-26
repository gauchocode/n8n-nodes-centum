import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface ResourceHandlerContext {
	executeFunctions: IExecuteFunctions;
	centumUrl: string;
	headers: Record<string, any>;
	centumApiCredentials: IDataObject;
	consumerApiPublicId: string | number;
}

export type ResourceHandler = (
	context: ResourceHandlerContext,
) => Promise<INodeExecutionData[][]>;

export type ResourceHandlerMap = Record<string, ResourceHandler>;
