export interface RESPONSEDATA {
    statuscode : 200 | 400 | 500,
    success:boolean,
    message:string
    error?:any;
}

export interface CATEGORYDATA {
    itemCategoryCode:string;
    totalqty:number;
    itemscount:number;
    products: PRODUCTS[]
}

export type PRODUCTS = {
    "@odata.etag": string;
    "id": string;
    "number": string;
    "displayName": string;
    "displayName2": string
    "type": string;
    "itemCategoryId": string,
    "itemCategoryCode": string,
    "blocked": boolean,
    "gtin": string,
    "inventory": number,
    "unitPrice": string | number,
    "priceIncludesTax": boolean,
    "unitCost": string | number,
    "taxGroupId": string,
    "taxGroupCode": string,
    "baseUnitOfMeasureId": string,
    "baseUnitOfMeasureCode": string,
    "generalProductPostingGroupId": string,
    "generalProductPostingGroupCode": string,
    "inventoryPostingGroupId": string,
    "inventoryPostingGroupCode": string,
    "lastModifiedDateTime": string
}