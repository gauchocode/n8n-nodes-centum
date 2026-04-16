import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const listMunicipalities: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const provinceId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'provinceId', itemIndex, ''),
	);

	try {
		const queryParams: Record<string, string | number | boolean> = {};

		if (provinceId) {
			queryParams.idProvincia = provinceId;
		}

		const departments = await helperFns.apiRequest<any[]>(`${centumUrl}/Departamentos`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(departments.map((d) => ({ ...d })))];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listCountries: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Paises`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: 'GET',
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting country list: ${errorMessage}`,
		);
	}
};

const listProvinces: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const countryId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'countryId', itemIndex, ''),
	);

	try {
		const queryParams: Record<string, string | number | boolean> = {};

		if (countryId) {
			queryParams.idPais = countryId;
		}

		const provinces = await helperFns.apiRequest<any[]>(`${centumUrl}/Provincias`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
			queryParams,
		});

		return [executeFunctions.helpers.returnJsonArray(provinces.map((p) => ({ ...p })))];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

export const geographyHandlers: ResourceHandlerMap = {
	listMunicipalities: listMunicipalities,
	listCountries: listCountries,
	listProvinces: listProvinces,
};
