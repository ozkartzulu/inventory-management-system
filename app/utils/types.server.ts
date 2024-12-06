export type RegisterForm = {
    email: string
    password: string
    firstName: string
    lastName: string
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
    medida: string
    unit: number
    categoryId: number
}

export type registerProduct = {
    name: string
    description: string
    number: number
    madeinId: number
    categoryId: number
    file: string
}