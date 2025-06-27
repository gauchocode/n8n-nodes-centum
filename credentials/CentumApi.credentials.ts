import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class CentumApi implements ICredentialType {
	name = 'centumApi';
	displayName = 'Centum API';
	documentationUrl = 'http://www.centum.com.ar/ApiPublica.pdf';
	properties: INodeProperties[] = [
		{
			displayName: 'Public Access Key',
			name: 'publicAccessKey',
			type: 'string',
			default: '',
		},
		{
			displayName: 'CentumSuiteConsumidorApiPublicaId',
			name: 'consumerApiPublicId',
			type: 'number',
			default: 0,
		},
		{
			displayName: 'Centum URL',
			name: 'centumUrl',
			type: 'string',
			// default: 'https://plataforma1.centum.com.ar:23990/BL2/MirandaDiegoYFacundoSH',
			default: 'https://plataforma1.centum.com.ar:23990/BL2',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				CentumSuiteAccessToken: '={{$credentials.publicAccessKey}}',
				CentumSuiteConsumidorApiPublicaId: '={{credentials.consumerApiPublicId}}',
			},
		},
	};
	// test: ICredentialTestRequest = {
	//   request: {
	//     baseURL: '={{$credentials?.domain}}',
	//     url: '/bearer',
	//   },
	// };
}
