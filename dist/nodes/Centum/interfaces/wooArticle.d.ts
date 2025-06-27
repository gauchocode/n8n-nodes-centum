export interface IGroupWoo {
    products: IWooArticle[];
}
export interface IWooArticle {
    [key: string]: any;
    categories: string[];
    tags: string[];
    description: string;
    dimensions: IWooDimensions;
    images: string[];
    name: string;
    regular_price: number;
    short_description: string;
    attributes: IWooAttributes[];
    type: 'simple' | 'variable';
    variations: IWooVariation[];
    idGrupoArticulo: number;
}
export interface IWooVariation {
    sku: string;
    regular_price: number;
    attributes: IWooAttributes[];
}
export interface IWooDimensions {
    height: number;
    length: number;
    width: number;
}
export interface IWooAttributes {
    name: string;
    value: string;
}
