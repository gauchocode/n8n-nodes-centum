import { ICredentialType, INodeProperties } from 'n8n-workflow';

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
			description: 'Clave pública usada para generar el token hash en cada request',
		},
		{
			displayName: 'CentumSuiteConsumidorApiPublicaId',
			name: 'consumerApiPublicId',
			type: 'number',
			default: 0,
			description: 'ID público del consumidor enviado en cada request',
		},
		{
			displayName: 'Centum URL',
			name: 'centumUrl',
			type: 'string',
			default: 'https://plataforma1.centum.com.ar:23990/BL2',
			description: 'Base URL de la API de Centum',
		},
	];
	// test: ICredentialTestRequest = {
	//   request: {
	//     baseURL: '={{$credentials?.domain}}',
	//     url: '/bearer',
	//   },
	// };
}
