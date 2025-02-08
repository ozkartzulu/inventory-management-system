import { OrderType, SalesType, TotalVenta } from "./types.server";

export function removeSpace(name: string) {
    return name.toLocaleLowerCase().split(' ').join('_');
}

export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    const day = date.getUTCDate();
    const monthName = date.toLocaleString("es-ES", { month: "long" }); // Mes en texto en español
    const year = date.getUTCFullYear();
    const time = date.toLocaleTimeString("es-ES", { hour12: false }); // Hora en formato 24 horas
  
    return `${day} de ${monthName} del ${year} horas: ${time}`;
}

export const formatDateUnSpace = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    const day = date.getUTCDate();
    const monthName = date.toLocaleString("es-ES", { month: "long" }); // Mes en texto en español
    const year = date.getUTCFullYear();
    const time = date.toLocaleTimeString("es-ES", { hour12: false }); // Hora en formato 24 horas
  
    return `${day}_${monthName}_${year}`;
}

export const capitalizeWords = (name: string): string => {
    return name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");    // Une las palabras nuevamente
}

export function generateRandomDigits(): number {
    return Math.floor(100000 + Math.random() * 900000);
}

export const formatDateBol = (isoDate: string): string => {
    const fecha = new Date(isoDate);

    const formattedDate = fecha.toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Formato 24h
    }).replace(/(\d{2})\/(\d{2})\/(\d{2}), (\d{2}):(\d{2})/, '$1-$2-$3 $4:$5');

    return formattedDate;
}

export const buildSell = (orders: OrderType[], totalVentas: TotalVenta[] ) => {
    orders.forEach( (order) => {
        if(!totalVentas[order.productId]) {
            totalVentas[order.productId] = {
                productId: order.productId,
                quantitySell: order.quantity,
                amountSell: order.price * order.quantity,
                quantityBuy: 0,
                amountBuy: 0,
                product: order.product
            };
        } else {
            totalVentas[order.productId].quantitySell += order.quantity;
            totalVentas[order.productId].amountSell += (order.quantity * order.price);
        } 
    })

    return totalVentas;
}

export const buildBuy = (orders: SalesType[] | null, totalVentas: TotalVenta[] ) => {
    orders?.forEach( (order) => {
        if(!totalVentas[order.productId]) {
            totalVentas[order.productId] = {
                productId: order.productId,
                quantitySell: 0,
                amountSell: 0,
                quantityBuy: order.quantity,
                amountBuy: order.price * order.quantity,
                product: order.product
            };
        } else {
            totalVentas[order.productId].quantityBuy += order.quantity;
            totalVentas[order.productId].amountBuy += (order.quantity * order.price);
        } 
    })

    return totalVentas;
}
    