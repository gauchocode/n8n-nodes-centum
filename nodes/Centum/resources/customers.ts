import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const updateCustomer: ResourceHandler = async (context) => {
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

	const customerIdParam = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex),
	);
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
		'',
	) as string;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex, '') as string;
	const provinceId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'provinceId', itemIndex, ''),
	);
	const countryId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'countryId', itemIndex, ''),
	);
	const zoneId = helperFns.getNodeParameterOrThrow(executeFunctions, 'zoneId', itemIndex, 0);
	const vatConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'vatConditionId',
		itemIndex,
		0,
	);
	const salesConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesConditionId',
		itemIndex,
		0,
	);
	const discountId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'discountId', itemIndex, ''),
	);

	const customerId = Number(customerIdParam);
	if (!Number.isInteger(customerId) || customerId <= 0) {
		throw new NodeOperationError(executeFunctions.getNode(), 'customerId must be a positive integer.');
	}

	const body: Record<string, unknown> = {
		IdCliente: customerId,
	};

	if (businessName) {
		body.RazonSocial = businessName;
	}

	if (cuit) {
		body.CUIT = cuit;
	}

	if (provinceId) {
		body.Provincia = { IdProvincia: provinceId };
	}

	if (countryId) {
		body.Pais = { IdPais: countryId };
	}

	if (Number(zoneId) > 0) {
		body.Zona = { IdZona: zoneId };
	}

	if (Number(vatConditionId) > 0) {
		body.CondicionIVA = { IdCondicionIVA: vatConditionId };
	}

	if (Number(salesConditionId) > 0) {
		body.CondicionVenta = { IdCondicionVenta: salesConditionId };
	}

	if (discountId) {
		body.Bonificacion = { IdBonificacion: discountId };
	}

	try {
		const updateCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray(updateCustomer)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(
			executeFunctions.getNode(),
			helperFns.getErrorMessage(error, 'Error updating customer'),
		);
	}
};

const searchCustomers: ResourceHandler = async (context) => {
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

	const customerCode = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'customerCode',
		itemIndex,
		'',
	) as string;
	const customerIdParam = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'customerId', itemIndex, ''),
	);
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex, '') as string;
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
		'',
	) as string;

	const queryParams: Record<string, string> = {};
	if (cuit) queryParams.Cuit = cuit;
	if (customerCode) queryParams.codigo = customerCode;
	if (businessName) queryParams.RazonSocial = businessName;

	try {
		if (customerIdParam) {
			const customerId = Number(customerIdParam);
			if (!Number.isInteger(customerId) || customerId <= 0) {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					'customerId must be a positive integer.',
				);
			}

			const customer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/${customerId}`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			});

			return [executeFunctions.helpers.returnJsonArray(customer)];
		}

		const ajustesHTTP = helperFns.getHttpSettings.call(executeFunctions, itemIndex);
		const pagination = ajustesHTTP.pagination ?? 'custom';
		const startingPage = ajustesHTTP.pageNumber ?? 1;
		const itemsPerPage = ajustesHTTP.itemsPerPage ?? 100;
		const pageInterval = ajustesHTTP.pageInterval ?? 1000;
		const customers: any[] = [];
		let currentPage = startingPage;

		while (true) {
			const response = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
				queryParams: {
					...queryParams,
					numeroPagina: currentPage,
					cantidadItemsPorPagina: itemsPerPage,
				},
			});

			const pageItems = Array.isArray(response?.Items) ? response.Items : [];
			customers.push(...pageItems);

			if (pagination !== 'all') {
				break;
			}

			const totalItems = Number(response?.CantidadTotalItems ?? 0);
			const reachedEnd =
				pageItems.length === 0 ||
				pageItems.length < itemsPerPage ||
				(totalItems > 0 && customers.length >= totalItems);

			if (reachedEnd) {
				break;
			}

			await new Promise((resolve) => setTimeout(resolve, pageInterval));
			currentPage += 1;
		}

		return [executeFunctions.helpers.returnJsonArray(customers as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const createCustomer: ResourceHandler = async (context) => {
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

	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
	);
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex);
	const provinceId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'provinceId', itemIndex),
	);
	const countryId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'countryId', itemIndex),
	);
	const zoneId = helperFns.getNodeParameterOrThrow(executeFunctions, 'zoneId', itemIndex);
	const vatConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'vatConditionId',
		itemIndex,
	);
	const salesConditionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'salesConditionId',
		itemIndex,
	);
	const discountId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'discountId', itemIndex),
	);

	try {
		const createdCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			headers,
			body: {
				RazonSocial: businessName,
				CUIT: cuit,
				Provincia: {
					IdProvincia: provinceId,
				},
				Pais: {
					IdPais: countryId,
				},
				Zona: {
					IdZona: zoneId,
				},
				CondicionIVA: {
					IdCondicionIVA: vatConditionId,
				},
				CondicionVenta: {
					IdCondicionVenta: salesConditionId,
				},
				Vendedor: {
					IdVendedor: 2,
				},
				Transporte: {
					IdTransporte: 1,
				},
				Bonificacion: {
					IdBonificacion: discountId,
				},
				LimiteCredito: {
					IdLimiteCredito: 46002,
				},
				ClaseCliente: {
					IdClaseCliente: 6087,
				},
				FrecuenciaCliente: {
					IdFrecuenciaCliente: 6891,
				},
				CanalCliente: {
					IdCanalCliente: 6904,
				},
				CadenaCliente: {
					IdCadenaCliente: 6920,
				},
				UbicacionCliente: {
					IdUbicacionCliente: 6942,
				},
				EdadesPromedioConsumidoresCliente: {
					IdEdadesPromedioConsumidoresCliente: 6951,
				},
				GeneroPromedioConsumidoresCliente: {
					IdGeneroPromedioConsumidoresCliente: 6964,
				},
				DiasAtencionCliente: {
					IdDiasAtencionCliente: 6969,
				},
				HorarioAtencionCliente: {
					IdHorarioAtencionCliente: 6970,
				},
				CigarreraCliente: {
					IdCigarreraCliente: 6972,
				},
			},
		});
		return [executeFunctions.helpers.returnJsonArray(createdCustomer)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Failed to create customer: ${String(error)}`,
		);
	}
};

const searchTaxpayerCustomer: ResourceHandler = async (context) => {
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

	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex, '') as string;

	if (!/^\d{11}$/.test(cuit)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'CUIT must be a string with 11 numeric digits.',
		);
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/Clientes/BuscarContribuyente/${cuit}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);

		return [executeFunctions.helpers.returnJsonArray(response as any)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

const getCustomerBalance: ResourceHandler = async (context) => {
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
	const balanceFromDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'priceDateModifiedTo',
		itemIndex,
	);
	const dueDateUntil = String(balanceFromDate).split('T')[0];

	// Parameter validation
	const clientId = Number(clientIdParam);
	if (isNaN(clientId) || clientId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'customerId must be a positive number.',
		);
	}

	try {
		let url = `${centumUrl}/SaldosCuentasCorrientes/${clientId}`;
		if (dueDateUntil) {
			url += `?fechaVencimientoHasta=${dueDateUntil}`;
		}

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
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Error getting balance for customer ${clientId}: ${errorMessage}`,
		);
	}
};

const getCustomerBalanceDetails: ResourceHandler = async (context) => {
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
	const balanceDateUntil = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'priceDateModifiedTo',
		itemIndex,
	);
	const formattedBalanceDateUntil = String(balanceDateUntil).split('T')[0];

	// Parameter validation
	const clientId = Number(clientIdParam);
	if (isNaN(clientId) || clientId <= 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'customerId must be a positive number.',
		);
	}

	try {
		let url = `${centumUrl}/SaldosCuentasCorrientes/Composicion/${clientId}`;
		if (formattedBalanceDateUntil) {
			url += `?fechaVencimientoHasta=${formattedBalanceDateUntil}`;
		}

		const response = await helperFns.apiRequest<any>(url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers,
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
			`Error getting balance breakdown for customer ${clientId}: ${errorMessage}`,
		);
	}
};

const listCustomerFrequencies: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	try {
		const listCustomerFrequencies = await helperFns.apiRequest<any>(
			`${centumUrl}/FrecuenciasCliente`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
			},
		);

		return [executeFunctions.helpers.returnJsonArray(listCustomerFrequencies)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage =
			error?.response?.data?.Message || (error as any).message || 'Unknown error';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage);
	}
};

export const customersHandlers: ResourceHandlerMap = {
	Get: searchCustomers,
	updateCustomer: updateCustomer,
	createCustomer: createCustomer,
	searchTaxpayerCustomer: searchTaxpayerCustomer,
	getCustomerBalance: getCustomerBalance,
	getCustomerBalanceDetails: getCustomerBalanceDetails,
	listCustomerFrequencies: listCustomerFrequencies,
};
