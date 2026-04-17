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

	const newData = helperFns.getNodeParameterOrThrow(executeFunctions, 'jsonBody', itemIndex);
	try {
		const updateCustomer = await helperFns.apiRequest<any>(`${centumUrl}/Clientes/Actualizar`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body: newData,
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

const searchCustomerByCuit: ResourceHandler = searchCustomers;

const listCustomers: ResourceHandler = searchCustomers;

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
					IdVendedor: 2, // Replace this with the full seller payload
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
	const businessName = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'businessName',
		itemIndex,
		'',
	) as string;

	if (!cuit && !businessName) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Provide at least a CUIT or business name to search taxpayers.',
		);
	}

	let url = `${centumUrl}/Clientes/BuscarContribuyente`;
	const queryParams: Record<string, string> = {};

	if (cuit && !businessName) {
		url += `/${cuit}`;
	} else {
		if (cuit) queryParams.Cuit = cuit;
		if (businessName) queryParams.razonSocial = businessName;
	}

	const requestDetails = {
		url,
		headers,
		queryParams,
	};

	try {
		const response = await helperFns.apiRequest<any>(requestDetails.url, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'GET',
			headers: requestDetails.headers,
			queryParams: requestDetails.queryParams,
		});
		if (response.CantidadTotalItems === 1) {
			return [executeFunctions.helpers.returnJsonArray(response.Items as any)];
		}

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

const createTaxpayerCustomer: ResourceHandler = async (context) => {
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

	const bodyJson = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'jsonBody',
		itemIndex,
	) as any;
	const cuit = helperFns.getNodeParameterOrThrow(executeFunctions, 'cuit', itemIndex);

	if (typeof cuit !== 'string' || !/^\d{11}$/.test(cuit)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'CUIT must be a string with 11 numeric digits.',
		);
	}

	const taxpayerCustomerJson = helperFns.createTaxpayerCustomerJson(bodyJson, cuit);

	try {
		const createdCustomer = await helperFns.apiRequest(`${centumUrl}/Clientes`, {
			context: executeFunctions,
			debugItemIndex: itemIndex,
			method: 'POST',
			body: taxpayerCustomerJson,
			headers,
		});

		return [executeFunctions.helpers.returnJsonArray([createdCustomer as any])];
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

const listCustomerCommercialPromotions: ResourceHandler = async (context) => {
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
	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'documentDate',
		itemIndex,
	) as string;
	const weekday = helperFns.getNodeParameterOrThrow(executeFunctions, 'weekday', itemIndex);
	const clientId = Number(clientIdParam);

	if (!documentDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'documentDate is required.');
	}

	const formattedDocumentDate = String(documentDate).split('T')[0];

	try {
		const body = {
			FechaDocumento: formattedDocumentDate,
			IdsCliente: clientId,
			DiaSemana: weekday || '',
		};

		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/PromocionesComerciales/FiltrosPromocionComercial`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);

		if (!response || typeof response !== 'object') {
			throw new NodeOperationError(executeFunctions.getNode(), 'Invalid server response.');
		}

		if (response.Items && Array.isArray(response.Items)) {
			return [executeFunctions.helpers.returnJsonArray(response.Items)];
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
			`Error getting promotions for customer ${clientId}:\n${errorMessage}`,
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
	searchCustomers: searchCustomers,
	searchCustomerByCuit: searchCustomerByCuit,
	listCustomers: listCustomers,
	createCustomer: createCustomer,
	searchTaxpayerCustomer: searchTaxpayerCustomer,
	createTaxpayerCustomer: createTaxpayerCustomer,
	getCustomerBalance: getCustomerBalance,
	getCustomerBalanceDetails: getCustomerBalanceDetails,
	listCustomerCommercialPromotions: listCustomerCommercialPromotions,
	listCustomerFrequencies: listCustomerFrequencies,
};
