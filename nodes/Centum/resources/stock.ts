import { NodeOperationError } from 'n8n-workflow';
import * as helperFns from '../helpers/functions';
import type { ResourceHandler, ResourceHandlerMap } from './tipos';

const crearMovimientoStock: ResourceHandler = async (context) => {
	const { executeFunctions, centumUrl, headers, centumApiCredentials, consumerApiPublicId } = context;
	void centumUrl;
	void headers;
	void centumApiCredentials;
	void consumerApiPublicId;

					const idSucursalFisica = executeFunctions.getNodeParameter("idSucursalFisica", 0);
					const articleId = executeFunctions.getNodeParameter("articleId", 0);
					const fechaImputacion = executeFunctions.getNodeParameter("indictmentDate", 0) as string;
					const fechaImputacionFormateada = fechaImputacion.replace(/\..+/, "");
	
					// const ubicacionArticle = executeFunctions.getNodeParameter('', 0);
	
					if (!articleId) {
						throw new NodeOperationError(executeFunctions.getNode(), "El ID del articulo es obligatorio.");
					}
	
					try {
						const response = await helperFns.apiRequest<any>(`${centumUrl}/AjustesMovimientoStock?bAjustePrevioACero=false`, {
							method: "POST",
							headers,
							body: {
								AjusteMovimientoStockItems: [
									{
										Articulo: {
											IdArticulo: articleId,
										},
									},
								],
								SucursalFisica: {
									IdSucursalFisica: idSucursalFisica,
								},
								ConceptoVarios: {
									IdConceptoVarios: 1,
								},
								FechaImputacion: fechaImputacionFormateada,
							},
						});
						return [executeFunctions.helpers.returnJsonArray(response)];
					} catch (error) {
						const msg = error?.response?.data?.Message || (error as any)?.message || "Error creando el ajuste de stock";
						throw new NodeOperationError(executeFunctions.getNode(), msg);
					}
				
};

export const stockHandlers: ResourceHandlerMap = {
	crearMovimientoStock,
};
