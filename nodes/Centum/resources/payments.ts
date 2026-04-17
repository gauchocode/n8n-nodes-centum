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
		if (paymentId) {
			const parsedPaymentId = Number(paymentId);
			if (!Number.isInteger(parsedPaymentId) || parsedPaymentId <= 0) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					'paymentId must be a positive integer.',
				);
			}

			const payment = await helperFns.apiRequest<any>(`${centumUrl}/Cobros/${parsedPaymentId}`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			});

			return [executeFunctions.helpers.returnJsonArray(payment)];
		}

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

export const paymentsHandlers: ResourceHandlerMap = {
	Get: listPayments,
	registerPayment: registerPayment,
};
