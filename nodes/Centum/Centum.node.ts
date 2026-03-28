import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from "n8n-workflow";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

import { CentumFields, CentumOperations, HttpOptions } from "./CentumDescription";
import { resourceHandlerGroups } from "./resources";
import type { CentumApiCredentials, CentumHeaders } from "./resources/tipos";

export class Centum implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Centum",
		name: "centum",
		icon: "file:centum.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] ? $parameter["resource"] + ": " + $parameter["operation"] : $parameter["resource"]}}',
		description: "Consumes Centum API",
		defaults: {
			name: "Centum",
		},
		usableAsTool: true,
		inputs: ["main"] as [NodeConnectionType],
		outputs: ["main"] as [NodeConnectionType],
		credentials: [
			{
				name: "centumApi",
				required: true,
			},
		],
		properties: [...CentumOperations, ...CentumFields, ...HttpOptions],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const centumApiCredentials = (await this.getCredentials("centumApi")) as unknown as CentumApiCredentials;
		const centumUrl = String(centumApiCredentials.centumUrl);
		const consumerApiPublicId = centumApiCredentials.consumerApiPublicId as string | number;
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const headers: CentumHeaders = {
			CentumSuiteConsumidorApiPublicaId: consumerApiPublicId,
			publicAccessKey: String(centumApiCredentials.publicAccessKey),
		};

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter("resource", itemIndex) as string;
				const operation = this.getNodeParameter("operation", itemIndex) as string;
				const handler = resourceHandlerGroups[resource]?.[operation];

				if (!handler) {
					throw new NodeOperationError(this.getNode(), `Operación no implementada para ${resource}: ${operation}`, { itemIndex });
				}

				const handlerResult = await handler({
					executeFunctions: this,
					centumUrl,
					headers,
					centumApiCredentials,
					consumerApiPublicId,
					itemIndex,
				});

				returnData.push(...handlerResult[0]);
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}

				const message = error instanceof Error ? error.message : String(error);
				throw new NodeOperationError(this.getNode(), message, { itemIndex });
			}
		}

		return [returnData];
	}
}
