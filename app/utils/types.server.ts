export type RegisterForm = {
    email: string
    password: string
    firstName: string
    lastName: string
}

export type RegisterSupplier = {
    idSupplier?: number
    name: string
    phone: number
    address: string
}

export type RegisterCustomer = {
    idCustomer?: number
    name: string
    phone: number
    address: string
}

export type LoginForm = {
    email: string
    password: string
}

export type UserSession = {
    id: number
    name: string
    email?: string
}

export type registerCategory = {
    idCategory?: number
    name: string
    description: string
}

export type registerModel = {
    name: string
    categoryId: number
}

export type updateModel = {
    idModel: number
    name: string
}

export type updateBrand = {
    idBrand: number
    name: string
}

export type updateMadein = {
    idMadein: number
    name: string
}

export type updateVariant = {
    idVariant: number
    unit: number
    medida: string
    categoryId: number
}

export type registerMadein = {
    name: string
}

export type registerVariant = {
    unit: number
    medida: string
    categoryId: number
}

export type registerProduct = {
    idProduct?: number
    name: string
    description: string
    number: number
    url: string
    type: number
    categoryId: number
    madeinId: number
    brandId: number
    modelId: number
    variantId: number
}

export type productProp = {
    id: number,
    name: string,
    url: string,
    quantity: number,
    price: string,
    stock: number,
    type: number,
}


// orders
export type TotalVenta = {
    productId: number;
    quantitySell: number;
    amountSell: number;
    quantityBuy: number;
    amountBuy: number;
    product: {id: number, url: string, name: string};
}

export type OrderType = {
    id: number;
    quantity: number;
    price: number;
    date: Date;
    productId: number;
    invoiceOrderId: number;
    product: {id: number, url: string, name: string};
}

export type SalesType = {
    id: number;
    quantity: number;
    price: number;
    date: Date;
    productId: number;
    invoiceSalesId: number;
    product: {id: number, url: string, name: string};
}

// context
export type productCart = {
    sell: {
        id: number;
        name: string;
        url: string;
        quantity: number;
        price: string;
        stock: number;
        type: number;
    }[],
    buy: {
        id: number;
        name: string;
        url: string;
        quantity: number;
        price: string;
        stock: number;
        type: number;
    }[]
}