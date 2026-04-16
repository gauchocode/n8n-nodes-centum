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
	void itemIndex;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

	const physicalBranchId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'physicalBranchId',
		itemIndex,
	);
	const articleId = helperFns.getNodeParameterOrThrow(executeFunctions, 'articleId', itemIndex);
	const articleLocationId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'articleLocationId',
		itemIndex,
	);
	const branchSectionId = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'branchSectionId',
		itemIndex,
	);
	const indictmentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'indictmentDate',
		itemIndex,
	) as string;
	const formattedIndictmentDate = indictmentDate.replace(/\..+/, '');

	if (!articleId) {
		throw new NodeOperationError(executeFunctions.getNode(), 'Article ID is required.');
	}

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/AjustesMovimientoStock?bAjustePrevioACero=false`,
			{
				context: executeFunctions,
				debugItemIndex: itemIndex,
				method: 'POST',
				headers,
				body: {
					AjusteMovimientoStockItems: [
						{
							Articulo: {
								IdArticulo: articleId,
							},
							UbicacionArticulo: {
								IdUbicacionArticulo: articleLocationId,
							},
						},
					],
					SucursalFisica: {
						IdSucursalFisica: physicalBranchId,
					},
					SeccionSucursal: {
						IdSeccionSucursal: branchSectionId,
					},
					ConceptoVarios: {
						IdConceptoVarios: 1,
					},
					FechaImputacion: formattedIndictmentDate,
				},
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

export const stockHandlers: ResourceHandlerMap = {
	createStockMovement: createStockMovement,
};
