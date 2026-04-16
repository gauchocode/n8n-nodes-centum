import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

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
			description: 'Base URL for the Centum API tenant.',
		},
	];

	// Centum authentication requires a short-lived SHA1 token generated from the
	// current timestamp and a random nonce, so the standard credential test can only
	// validate endpoint reachability rather than full credential correctness.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.centumUrl}}',
			url: '/',
			method: 'GET',
		},
	};
}
