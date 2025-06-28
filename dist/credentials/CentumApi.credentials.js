"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentumApi = void 0;
class CentumApi {
    constructor() {
        this.name = 'centumApi';
        this.displayName = 'Centum API';
        this.documentationUrl = 'http://www.centum.com.ar/ApiPublica.pdf';
        this.properties = [
            {
                displayName: 'Public Access Key',
                name: 'publicAccessKey',
                type: 'string',
                typeOptions: { password: true },
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
                default: 'https://plataforma1.centum.com.ar:23990/BL2',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    CentumSuiteAccessToken: '={{$credentials.publicAccessKey}}',
                    CentumSuiteConsumidorApiPublicaId: '={{credentials.consumerApiPublicId}}',
                },
            },
        };
    }
}
exports.CentumApi = CentumApi;
//# sourceMappingURL=CentumApi.credentials.js.map