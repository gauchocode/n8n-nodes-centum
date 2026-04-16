import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const generateSecurityToken: ResourceHandler = async (context) => {
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
		const tokenGenerado = helperFns.createHash(headers.publicAccessKey);

		return [executeFunctions.helpers.returnJsonArray([{ token: tokenGenerado }])];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listDiscounts: ResourceHandler = async (context) => {
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
		const discounts = await helperFns.apiRequest<any>(`${centumUrl}/Bonificaciones`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray([discounts])];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const statusCode = error?.response?.status;
		const responseData = error?.response?.data;
		const errorMessage =
			responseData?.Message ||
			responseData?.message ||
			(error as any)?.message ||
			'Unknown error while creating the taxpayer customer.';
		const fullMessage = statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage;
		throw new NodeOperationError(executeFunctions.getNode(), fullMessage, {
			description:
				responseData?.Detail || 'An unexpected error occurred while calling the Centum API.',
		});
	}
};

const listConcepts: ResourceHandler = async (context) => {
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

	let url = `${centumUrl}/Conceptos`;

	try {
		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting concept list: ${error}`,
		);
	}
};

const listSpecialTaxRegimes: ResourceHandler = async (context) => {
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
		const dataRegimenesList = await helperFns.apiRequest<any>(`${centumUrl}/RegimenesEspeciales`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(dataRegimenesList)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getSpecialTaxRegimeDetails: ResourceHandler = async (context) => {
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

	const specialTaxRegimeId = helperFns.getNodeParameterOrThrow(executeFunctions, 'id', itemIndex);
	if (!specialTaxRegimeId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Special tax regime ID is required.');
	}

	try {
		const specialTaxRegime = await helperFns.apiRequest<any>(
			`${centumUrl}/RegimenesEspeciales/${specialTaxRegimeId}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(specialTaxRegime)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listVoucherTypes: ResourceHandler = async (context) => {
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
		const voucherTypeList = await helperFns.apiRequest<any>(`${centumUrl}/TiposComprobante`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(voucherTypeList)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listSellers: ResourceHandler = async (context) => {
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
		const sellersResponse = await helperFns.apiRequest<any>(`${centumUrl}/Vendedores`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});
		return [executeFunctions.helpers.returnJsonArray(sellersResponse)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting sellers: ${errorMessage}`,
		);
	}
};

const listMobileOperators: ResourceHandler = async (context) => {
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

	const username = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'username',
		itemIndex,
	) as string;
	const email = helperFns.getNodeParameterOrThrow(executeFunctions, 'email', itemIndex) as string;

	const searchParams = new URLSearchParams();
	if (username) {
		searchParams.set('usuario', username);
	}
	if (email) {
		searchParams.set('email', email);
	}
	const params = searchParams.toString() ? `?${searchParams.toString()}` : '';

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/OperadoresMoviles${params}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			headers,
			method: 'GET',
		});
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (err) {
		const errorMessage = err?.response?.data?.Message || (err as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting mobile operator list.\n${errorMessage}`,
		);
	}
};

const verifyOperatorCredentials: ResourceHandler = async (context) => {
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

	const username = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'username',
		itemIndex,
		'',
	) as string;
	try {
		const mobileOperatorActivity = await helperFns.apiRequest<any>(
			`${centumUrl}/OperadoresMoviles?Usuario=${username}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(mobileOperatorActivity)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

export const extrasHandlers: ResourceHandlerMap = {
	generateSecurityToken: generateSecurityToken,
	listDiscounts: listDiscounts,
	listConcepts: listConcepts,
	listSpecialTaxRegimes: listSpecialTaxRegimes,
	getSpecialTaxRegimeDetails: getSpecialTaxRegimeDetails,
	listVoucherTypes: listVoucherTypes,
	listSellers: listSellers,
	listMobileOperators: listMobileOperators,
	verifyOperatorCredentials: verifyOperatorCredentials,
};
