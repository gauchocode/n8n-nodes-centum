import { IWoo, INewCustomer, LineItem, INewPedidoVenta, Item, INewCobro, Cliente, IMergeArticulos, IGroupWoo, ShippingLine, CobroId } from '../interfaces';
import { NodeParameterValue } from 'n8n-workflow';
export declare const createHash: (publicAccessKey: string) => string;
export declare const createCustomerJson: (respWoo: IWoo, dni: string) => INewCustomer;
export declare const createOrderSaleJson: (articles: Item[], client: INewCustomer, articlesOrder: LineItem[], shippingSalesOrder: ShippingLine[], cobroId: CobroId) => INewPedidoVenta;
export declare const createChargeJson: (customer: Cliente, articlesOrder: LineItem[], shippingChargeOrder: ShippingLine[]) => INewCobro;
export declare const createJsonProducts: (arrArticles: IMergeArticulos[]) => IGroupWoo;
interface ObjImageData {
    orderNumber: number;
    articleId: number;
    buffer: ArrayBuffer;
    lastModified: string | undefined;
}
export declare function centumGetArticleImages(orderNumber: number, articleId: NodeParameterValue, requestHeaders: {
    consumerApiPublicId: string;
    publicAccessKey: string;
}, requestUrl: string, allImages?: ObjImageData[]): Promise<ObjImageData[] | Error>;
export declare const centumImageName: (name: string, size: string, numberImage: number, fileExtension: string) => string;
export {};
