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
    name: string
    description: string
}

export type registerModel = {
    name: string
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
    categoryId: number
    madeinId: number
    brandId: number
    modelId: number
    variantId: number
}