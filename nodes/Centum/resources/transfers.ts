import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './types';

type TransferArticleInput = {
	IdArticulo?: number | string;
	ID?: number | string;
	Cantidad?: number;
	Quantity?: number;
};

function normalizeTransferArticles(
	executeFunctions: Parameters<ResourceHandler>[0]['executeFunctions'],
	itemIndex: number,
	rawArticles: unknown,
): Array<{ IdArticulo: number; Cantidad: number }> {
	const parsedArticles =
		typeof rawArticles === 'string'
			? (JSON.parse(rawArticles) as TransferArticleInput[])
			: (rawArticles as TransferArticleInput[]);

	if (!Array.isArray(parsedArticles) || parsedArticles.length === 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'transferArticles must be a non-empty JSON array.',
			{ itemIndex },
		);
	}

	return parsedArticles.map((article, index) => {
		const articleId = Number(article.IdArticulo ?? article.ID);
		const quantity = Number(article.Cantidad ?? article.Quantity);

		if (!Number.isFinite(articleId) || articleId <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`transferArticles[${index}] must include a valid IdArticulo.`,
				{ itemIndex },
			);
		}

		if (!Number.isFinite(quantity) || quantity <= 0) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				`transferArticles[${index}] must include a Cantidad greater than zero.`,
				{ itemIndex },
			);
		}

		return {
			IdArticulo: articleId,
			Cantidad: quantity,
		};
	});
}

function getTransferOrderId(
	executeFunctions: Parameters<ResourceHandler>[0]['executeFunctions'],
	itemIndex: number,
): number {
	const transferOrderId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferOrderId', itemIndex, 0),
	);

	if (!Number.isFinite(transferOrderId) || transferOrderId <= 0) {
		throw new NodeOperationError(executeFunctions.getNode(), 'transferOrderId must be a positive number.', {
			itemIndex,
		});
	}

	return transferOrderId;
}

const createTransferOrder: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const documentDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'transferDocumentDate',
		itemIndex,
	) as string;
	const documentLetter = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'transferDocumentLetter',
		itemIndex,
	) as string;
	const pointOfSale = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferPointOfSale', itemIndex),
	);
	const documentNumber = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferDocumentNumber', itemIndex),
	);
	const originPhysicalBranchId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'originPhysicalBranchId', itemIndex),
		),
	);
	const destinationPhysicalBranchId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'destinationPhysicalBranchId', itemIndex),
		),
	);
	const originBranchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'originBranchSectionId', itemIndex),
	);
	const destinationBranchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'destinationBranchSectionId', itemIndex),
	);
	const transferConceptId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferConceptId', itemIndex),
	);
	const transferTransportId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferTransportId', itemIndex, 0),
	);
	const driverId = Number(
		helperFns.getResourceLocatorValue(
			helperFns.getNodeParameterOrThrow(executeFunctions, 'driverId', itemIndex),
		),
	);
	const rawArticles = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'transferArticles',
		itemIndex,
	);
	const qualityAnalysisNumber = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'qualityAnalysisNumber',
		itemIndex,
		'',
	) as string;

	const formattedDocumentDate = String(documentDate).replace(/\..+/, '');
	const documentTime =
		(helperFns.getNodeParameterOrThrow(executeFunctions, 'transferDocumentTime', itemIndex, '') as string) ??
		'';
	const transferArticles = normalizeTransferArticles(executeFunctions, itemIndex, rawArticles);

	const body: Record<string, unknown> = {
		FechaDocumento: formattedDocumentDate,
		SucursalFisicaDesde: {
			IdSucursalFisica: originPhysicalBranchId,
		},
		SeccionSucursalDesde: {
			IdSeccionSucursal: originBranchSectionId,
		},
		SucursalFisicaHacia: {
			IdSucursalFisica: destinationPhysicalBranchId,
		},
		SeccionSucursalHacia: {
			IdSeccionSucursal: destinationBranchSectionId,
		},
		ConceptoVarios: {
			IdConceptoVarios: transferConceptId,
		},
		Transporte: {
			IdTransporte: transferTransportId,
		},
		Chofer: {
			IdChofer: driverId,
		},
		NumeroDocumento: {
			LetraDocumento: documentLetter,
			PuntoVenta: pointOfSale,
			Numero: documentNumber,
		},
		OrdenTraspasoItems: transferArticles,
	};

	if (documentTime) {
		body.HoraDocumento = documentTime;
	}

	if (qualityAnalysisNumber.trim()) {
		body.NumeroAnalisisCalidad = qualityAnalysisNumber.trim();
	}

	try {
		const response = await helperFns.apiRequest<any>(`${centumUrl}/OrdenesTraspaso`, {
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
			error?.response?.data?.Message || (error as any)?.message || 'Error creating transfer order.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

const listTransferOrders: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;

	const startDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'startDate',
		itemIndex,
	) as string;
	const endDate = helperFns.getNodeParameterOrThrow(
		executeFunctions,
		'endDate',
		itemIndex,
		'',
	) as string;
	const transferOrderId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferOrderId', itemIndex, 0),
	);
	const originPhysicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'originPhysicalBranchId', itemIndex, ''),
	);
	const destinationPhysicalBranchId = helperFns.getResourceLocatorValue(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'destinationPhysicalBranchId', itemIndex, ''),
	);
	const originBranchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'originBranchSectionId', itemIndex, 0),
	);
	const destinationBranchSectionId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'destinationBranchSectionId', itemIndex, 0),
	);
	const transferStatusId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferStatusId', itemIndex, 0),
	);
	const transferConceptId = Number(
		helperFns.getNodeParameterOrThrow(executeFunctions, 'transferConceptId', itemIndex, 0),
	);

	const formattedStartDate = String(startDate).split('T')[0];
	const formattedEndDate = String(endDate).split('T')[0];

	if (!formattedStartDate) {
		throw new NodeOperationError(executeFunctions.getNode(), 'startDate is required.', {
			itemIndex,
		});
	}

	const httpSettings = helperFns.getHttpSettings.call(executeFunctions, itemIndex);
	const body: Record<string, string | number> = {
		fechaDesde: formattedStartDate,
	};

	if (formattedEndDate) body.fechaHasta = formattedEndDate;
	if (transferOrderId > 0) body.idOrdenTraspaso = transferOrderId;
	if (originPhysicalBranchId) body.idSucursalDesde = Number(originPhysicalBranchId);
	if (destinationPhysicalBranchId) body.idSucursalHasta = Number(destinationPhysicalBranchId);
	if (originBranchSectionId > 0) body.IdSeccionSucursalDesde = originBranchSectionId;
	if (destinationBranchSectionId > 0) body.IdSeccionSucursalHasta = destinationBranchSectionId;
	if (transferStatusId > 0) body.idEstadoOrdenTraspado = transferStatusId;
	if (transferConceptId > 0) body.idConceptoVario = transferConceptId;

	try {
		const response = await helperFns.apiPostRequestPaginated<any>(
			`${centumUrl}/OrdenesTraspaso/FiltrosOrdenTraspaso`,
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
			error?.response?.data?.Message || (error as any)?.message || 'Error listing transfer orders.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

const getTransferOrderDetails: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;
	const transferOrderId = getTransferOrderId(executeFunctions, itemIndex);

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/OrdenesTraspaso/${transferOrderId}`,
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
			error?.response?.data?.Message || (error as any)?.message || 'Error getting transfer order.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

const dispatchTransferOrder: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;
	const transferOrderId = getTransferOrderId(executeFunctions, itemIndex);

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/OrdenesTraspaso/Despachar/${transferOrderId}`,
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
			error?.response?.data?.Message || (error as any)?.message || 'Error dispatching transfer order.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

const finalizeTransferOrder: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, itemIndex } = context;
	const transferOrderId = getTransferOrderId(executeFunctions, itemIndex);

	try {
		const response = await helperFns.apiRequest<any>(
			`${centumUrl}/OrdenesTraspaso/Efectivizar/${transferOrderId}`,
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
			error?.response?.data?.Message || (error as any)?.message || 'Error finalizing transfer order.';
		throw new NodeOperationError(executeFunctions.getNode(), errorMessage, { itemIndex });
	}
};

export const transferHandlers: ResourceHandlerMap = {
	createTransferOrder,
	listTransferOrders,
	getTransferOrderDetails,
	dispatchTransferOrder,
	finalizeTransferOrder,
};
