import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

const createStockMovement: ResourceHandler = async (context) => {
	const {
		executeFunctions,
		centumUrl,
		headers,
		centumApiCredentials,
		consumerApiPublicId,
		itemIndex,
	} = context;
	void centumApiCredentials;
	void consumerApiPublicId;

	const physicalBranchId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'physicalBranchId',
		itemIndex,
		'',
	);
	const articleId = helperFns.getNodeParameterOrThrow(executeFunctions, 'articleId', itemIndex);
	const articleLocationId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleLocationId',
		itemIndex,
		0,
	);
	const branchSectionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'branchSectionId',
		itemIndex,
		0,
	);
	const indictmentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'indictmentDate',
		itemIndex,
	) as string;
	const quantity = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'stockAdjustmentQuantity',
		itemIndex,
		0,
	) as number;
	const adjustToZeroFirst = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'adjustToZeroFirst',
		itemIndex,
		false,
	) as boolean;
	const conceptoVariosId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'conceptoVariosId',
		itemIndex,
		1,
	) as number;

	const formattedIndictmentDate = indictmentDate.replace(/\..+/, '');

	if (!articleId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Article ID is required.');
	}

	const item: Record<string, any> = {
		Articulo: {
			IdArticulo: articleId,
		},
		Cantidad: quantity,
	};

	if (articleLocationId) {
		item.UbicacionArticulo = {
			IdUbicacionArticulo: articleLocationId,
		};
	}

	const body: Record<string, any> = {
		AjusteMovimientoStockItems: [item],
		ConceptoVarios: {
			IdConceptoVarios: conceptoVariosId,
		},
		FechaImputacion: formattedIndictmentDate,
	};

	if (physicalBranchId) {
		body.SucursalFisica = {
			IdSucursalFisica: physicalBranchId,
		};
	}

	if (branchSectionId) {
		body.SeccionSucursal = {
			IdSeccionSucursal: branchSectionId,
		};
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/AjustesMovimientoStock?bAjustePrevioACero=${adjustToZeroFirst}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body,
			},
		);
		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const msg =
			error?.response?.data?.Message ||
			(error as any)?.message ||
			'Error creating stock adjustment';
		throw new NodeOperationError(executeFunctions.getNode(), msg);
	}
};

const getStockMovementById: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const adjustmentId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'adjustmentId',
		itemIndex,
		0,
	) as number;

	if (!adjustmentId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Adjustment ID is required.', {
			itemIndex,
		});
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/AjustesMovimientoStock/${adjustmentId}`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'GET',
				headers,
			},
		);

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}

		const errorMessage =
			error?.response?.data?.Message ||
			(error as any)?.message ||
			'Error getting stock adjustment.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

const getStockMovementsByFilters: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const startDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
		'',
	) as string;
	const endDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'endDate',
		itemIndex,
		'',
	) as string;

	const formattedStartDate = String(startDate).split('T')[0];
	const formattedEndDate = String(endDate).split('T')[0];

	if (!formattedStartDate) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'FechaImputacionDesde (Date From) is required.',
			{ itemIndex },
		);
	}

	if (!formattedEndDate) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'FechaImputacionHasta (Date To) is required.',
			{ itemIndex },
		);
	}

	const httpSettings = helperFns.getHttpSettings.call(executeFunctions, itemIndex);
	const body: Record<string, string> = {
		FechaImputacionDesde: formattedStartDate,
		FechaImputacionHasta: formattedEndDate,
	};

	try {
		const response = await helperFns.apiPostRequestPaginated<any>(
			`${centumUrl}/AjustesMovimientoStock/FiltrosAjusteMovimientoStock`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				headers,
				body,
				itemsPerPage: httpSettings.itemsPerPage,
				pageInterval: httpSettings.pageInterval,
				pageNumber: httpSettings.pageNumber,
				pagination: httpSettings.pagination === 'all' ? 'all' : 'custom',
			},
		);

		return [executeFunctions.helpers.returnJsonArray(response)];
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}

		const errorMessage =
			error?.response?.data?.Message ||
			(error as any)?.message ||
			'Error listing stock adjustments.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

export const stockHandlers: ResourceHandlerMap = {
	createStockMovement: createStockMovement,
	getStockMovementById: getStockMovementById,
	getStockMovementsByFilters: getStockMovementsByFilters,
};
