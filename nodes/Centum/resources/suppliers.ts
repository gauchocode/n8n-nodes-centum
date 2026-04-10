import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const searchSupplier: ResourceHandler = async (context) => {
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

	const supplierId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierId', itemIndex),
	);

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/${supplierId}`, {
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
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const createSupplier: ResourceHandler = async (context) => {
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

	const code = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierCode',
		itemIndex,
		'',
	) as string;
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
		'',
	) as string;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex);
	const provinceId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'provinceId', itemIndex),
	);
	const countryId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'countryId', itemIndex),
	);
	const vatConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'vatConditionId',
		itemIndex,
		'',
	) as string;
	const supplierPaymentMethodId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierPaymentMethodId',
		itemIndex,
	);
	const paymentConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'paymentConditionId',
		itemIndex,
	);
	const incomeTaxCategoryId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'incomeTaxCategoryId',
		itemIndex,
	);
	const supplierClassId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierClassId',
		itemIndex,
	);
	const activo = helperFns.getNodeParameterOrThrow(executeFunctions, 'active', itemIndex);
	const purchaseOperatorId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'purchaseOperatorId',
		itemIndex,
	);
	const zoneId = helperFns.getNodeParameterOrThrow(executeFunctions, 'zoneId', itemIndex);
	const supplierDiscountId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'supplierDiscountId',
		itemIndex,
	);

	const body = {
		Codigo: code,
		RazonSocial: businessName,
		CUIT: cuit,
		Provincia: {
			IdProvincia: provinceId,
		},
		Pais: {
			IdPais: countryId,
		},
		CondicionIVA: {
			IdCondicionIVA: vatConditionId,
		},
		FormaPagoProveedor: {
			IdFormaPagoProveedor: supplierPaymentMethodId,
		},
		CondicionPago: {
			IdCondicionPago: paymentConditionId,
		},
		CategoriaImpuestoGanancias: {
			IdCategoriaImpuestoGanancia: incomeTaxCategoryId,
		},
		ClaseProveedor: {
			IdClaseProveedor: supplierClassId,
		},
		OperadorCompra: {
			IdOperadorCompra: purchaseOperatorId,
		},
		Activo: activo,
		Zona: {
			IdZona: zoneId,
		},
		DescuentoProveedor: {
			IdDescuentoProveedor: supplierDiscountId,
		},
	};

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores/`, {
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
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const listSuppliers: ResourceHandler = async (context) => {
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

	const code = helperFns.getNodeParameterOrThrow(executeFunctions, 'supplierCode', itemIndex) as
		| string
		| undefined;
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
	) as string | undefined;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex) as
		| string
		| undefined;
	const activo = helperFns.getNodeParameterOrThrow(executeFunctions, 'active', itemIndex) as
		| boolean
		| undefined;

	// Better filtering function
	const queryParams = Object.fromEntries(
		Object.entries({
			codigo: code,
			razonSocial: businessName,
			Cuit: cuit,
			activo,
		}).filter(([, value]) => {
			// Debug: log each parameter

			// Exclude undefined and null
			if (value === undefined || value === null) return false;

			// Exclude empty strings (after trimming if it's a string)
			if (typeof value === 'string' && value.trim() === '') return false;

			// Include everything else (numbers, booleans, non-empty strings)
			return true;
		}),
	);

	try {
		const suppliers = await helperFns.apiRequest<any>(`${centumUrl}/Proveedores`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
			queryParams,
		});
		return [executeFunctions.helpers.returnJsonArray(suppliers)];
	} catch (err) {
		throw err;
	}
};

export const suppliersHandlers: ResourceHandlerMap = {
	searchSupplier: searchSupplier,
	createSupplier: createSupplier,
	listSuppliers: listSuppliers,
};
