import type {
	IAuthenticate,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { buildCentumHeaders } from '../nodes/Centum/helpers/functions';

export class CentumApi implements ICredentialType {
	name = 'centumApi';
	displayName = 'Centum API';
	documentationUrl = 'https://www.centum.com.ar/ApiPublica.pdf';
	properties: INodeProperties[] = [
		{
			displayName: 'Public Access Key',
			name: 'publicAccessKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Public key used to generate the request access-token hash.',
		},
		{
			displayName: 'Consumer API Public ID',
			name: 'consumerApiPublicId',
			type: 'number',
			default: 0,
			required: true,
			description:
				'Public consumer ID sent with each API request (Centum header: CentumSuiteConsumidorApiPublicaId).',
		},
		{
			displayName: 'Base URL',
			name: 'centumUrl',
			type: 'string',
			default: 'https://plataforma1.centum.com.ar:23990/BL2',
			required: true,
			description:
				'Base URL for the Centum API tenant. Trailing slashes are removed automatically.',
		},
	];

	authenticate: IAuthenticate = async (credentials, requestOptions) => ({
		...requestOptions,
		headers: {
			...requestOptions.headers,
			...buildCentumHeaders(
				credentials.consumerApiPublicId as string | number,
				String(credentials.publicAccessKey),
			),
		},
	});

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.centumUrl}}',
			url: '/Paises',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 401,
					message: 'Invalid Public Access Key or Consumer API Public ID.',
				},
			},
			{
				type: 'responseCode',
				properties: {
					value: 403,
					message: 'The configured Centum API consumer is not authorized.',
				},
			},
			{
				type: 'responseCode',
				properties: {
					value: 404,
					message: 'The Base URL does not point to a valid Centum API tenant.',
				},
			},
		],
	};
}
