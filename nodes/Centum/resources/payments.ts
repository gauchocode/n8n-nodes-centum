import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const registerPayment: ResourceHandler = async (context) => {
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

	const customerOrder = helperFns.getNodeParameterOrThrow(executeFunctions, 'customer', itemIndex);
	const articleOrder = helperFns.getNodeParameterOrThrow(executeFunctions, 'article', itemIndex);
	const shippingOrder = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'shippingInfo',
		itemIndex,
	);
	const bodyCharge = helperFns.createChargeJson(
		customerOrder as any,
		articleOrder as any[],
		shippingOrder as any[],
	);

	try {
		const dataCobros = await helperFns.apiRequest<any>(`${centumUrl}/Cobros`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body: bodyCharge,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(dataCobros)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listPayments: ResourceHandler = async (context) => {
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

	const customerId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const paymentId = helperFns.getNodeParameterOrThrow(executeFunctions, 'paymentId', itemIndex);
	const fromDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
		'',
	) as string;
	const toDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'endDate',
		itemIndex,
		'',
	) as string;
	const formattedFromDate = String(fromDate).split('T')[0];
	const formattedToDate = String(toDate).split('T')[0];
	if (!customerId && !formattedFromDate && !formattedToDate && !paymentId) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least one filter before running the search.',
		);
	}

	const body = {
		idCliente: customerId,
		fechaDocumentoDesde: formattedFromDate,
		fechaDocumentoHasta: formattedToDate,
		idCobro: paymentId,
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body,
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
			`Error getting payments for customer ${customerId}: ${errorMessage}`,
		);
	}
};

const listPaymentInvoices: ResourceHandler = async (context) => {
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

	const clientIdParam = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const fromDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'startDate', itemIndex);
	const toDate = helperFns.getNodeParameterOrThrow(executeFunctions, 'endDate', itemIndex);
	const formattedFromDate = String(fromDate).split('T')[0];
	const formattedToDate = String(toDate).split('T')[0];

	// Parameter validation
	const clientId = Number(clientIdParam);
	if (isNaN(clientId) || clientId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'customerId must be a positive number.',
		);
	}

	if (!fromDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'startDate is required.');
	}

	if (!toDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'endDate is required.');
	}

	try {
		const body = {
			fechaDocumentoDesde: formattedFromDate,
			fechaDocumentoHasta: formattedToDate,
			IdCliente: clientId,
		};

		const response = await helperFns.apiRequest<any>(`${centumUrl}/Cobros/FiltrosCobro`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body,
		});

		// Validate the response
		if (!response || typeof response !== 'object') {
			throw new NodeOperationError(executeFunctions.getNode(), 'Invalid server response.');
		}

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting payment invoices for customer ${clientId}: ${errorMessage}`,
		);
	}
};

export const paymentsHandlers: ResourceHandlerMap = {
	registerPayment: registerPayment,
	listPayments: listPayments,
	listPaymentInvoices: listPaymentInvoices,
};
