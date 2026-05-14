import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { INewCobro } from '../interfaces';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const buildCobroPayload = ({
	customer,
	paymentMode,
	advanceAmount,
	advanceConceptId,
	advanceDetail,
	cashAmount,
	paymentValueId,
	documentDate,
	postingDate,
	paymentObservation,
	effectiveDetail,
	physicalBranchId,
	divisionCompanyGroupId,
}: {
	customer: any;
	paymentMode: 'advanceOnly' | 'cashOnly' | 'advanceAndCash';
	advanceAmount: number;
	advanceConceptId: number;
	advanceDetail: string;
	cashAmount: number;
	paymentValueId: number;
	documentDate: string;
	postingDate: string;
	paymentObservation: string;
	effectiveDetail: string;
	physicalBranchId: number;
	divisionCompanyGroupId: number;
}): INewCobro => ({
	Cliente: {
		IdCliente: customer.IdCliente,
	},
	Observacion: paymentObservation,
	CobroAnticipos:
		paymentMode === 'advanceOnly' || paymentMode === 'advanceAndCash'
			? [
					{
						ConceptoVarios: {
							IdConceptoVarios: advanceConceptId,
						},
						Cotizacion: 1,
						Detalle: advanceDetail,
						Importe: advanceAmount,
					},
				]
			: [],
	CobroEfectivos:
		paymentMode === 'cashOnly' || paymentMode === 'advanceAndCash'
			? [
					{
						Valor: {
							IdValor: paymentValueId,
						},
						Detalle: effectiveDetail,
						Importe: cashAmount,
						Cotizacion: 1,
						CotizacionMonedaRespectoMonedaCliente: 1,
						FechaAcreditacion: postingDate,
					},
				]
			: [],
	SucursalFisica: {
		IdSucursalFisica: physicalBranchId,
	},
	FechaDocumento: documentDate,
	FechaImputacion: postingDate,
	Anulado: false,
	Nota: '',
	Cotizacion: 1,
	DivisionEmpresaGrupoEconomico: {
		IdDivisionEmpresaGrupoEconomico: divisionCompanyGroupId,
	},
});

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

	const customerId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
		),
	);
	const paymentMode = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'paymentMode',
		itemIndex,
		'advanceAndCash',
	) as 'advanceOnly' | 'cashOnly' | 'advanceAndCash';
	const advanceAmount = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'advanceAmount',
		itemIndex,
	) as number;
	const advanceConceptId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'advanceConceptId',
		itemIndex,
	) as number;
	const advanceDetail = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'advanceDetail',
		itemIndex,
		'',
	) as string;
	const cashAmount = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'cashAmount',
		itemIndex,
	) as number;
	const paymentValueId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'paymentValueId',
		itemIndex,
	) as number;
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const postingDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'postingDate',
		itemIndex,
	) as string;
	const paymentObservation = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'paymentObservation',
		itemIndex,
		'',
	) as string;
	const effectiveDetail = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'effectiveDetail',
		itemIndex,
		'',
	) as string;
	const physicalBranchIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'physicalBranchId',
		itemIndex,
		'',
	);
	const divisionCompanyGroupIdRaw = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'divisionCompanyGroupId',
		itemIndex,
		'',
	);

	if (!['advanceOnly', 'cashOnly', 'advanceAndCash'].includes(paymentMode)) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Invalid paymentMode value.');
	}

	if (
		(paymentMode === 'advanceOnly' || paymentMode === 'advanceAndCash') &&
		(!Number.isFinite(advanceAmount) || advanceAmount <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'advanceAmount must be a number greater than 0.',
		);
	}

	if (!Number.isInteger(customerId) || customerId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'customerId must be a positive integer.',
		);
	}

	if (
		(paymentMode === 'advanceOnly' || paymentMode === 'advanceAndCash') &&
		(!Number.isInteger(advanceConceptId) || advanceConceptId <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'advanceConceptId must be a positive integer.',
		);
	}

	if (
		(paymentMode === 'cashOnly' || paymentMode === 'advanceAndCash') &&
		(!Number.isFinite(cashAmount) || cashAmount <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'cashAmount must be a number greater than 0.',
		);
	}

	if (
		(paymentMode === 'cashOnly' || paymentMode === 'advanceAndCash') &&
		(!Number.isInteger(paymentValueId) || paymentValueId <= 0)
	) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'paymentValueId must be a positive integer.',
		);
	}

	const formattedDocumentDate = String(documentDate);
	const formattedPostingDate = String(postingDate);
	const physicalBranchId = Number(physicalBranchIdRaw);
	const divisionCompanyGroupId = Number(divisionCompanyGroupIdRaw);

	if (!Number.isInteger(physicalBranchId) || physicalBranchId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'physicalBranchId must be a positive integer.',
		);
	}

	if (!Number.isInteger(divisionCompanyGroupId) || divisionCompanyGroupId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'divisionCompanyGroupId must be a positive integer.',
		);
	}

	let resolvedCustomer: any;

	try {
		resolvedCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${customerId}`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
		});

		if (!resolvedCustomer?.IdCliente) {
			throw new NodeOperationError(executeFunctions.getNode(), 'Customer not found.');
		}
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Error getting customer.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}

	const bodyCharge = buildCobroPayload({
		customer: resolvedCustomer,
		paymentMode,
		advanceAmount,
		advanceConceptId,
		advanceDetail,
		cashAmount,
		paymentValueId,
		documentDate: formattedDocumentDate,
		postingDate: formattedPostingDate,
		paymentObservation,
		effectiveDetail,
		physicalBranchId,
		divisionCompanyGroupId,
	});

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
