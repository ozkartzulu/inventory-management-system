import { redirect, json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { productProp } from "./types.server";
import { InvoiceOrder, InvoiceSales } from "@prisma/client";

export async function registerManyOrders(products: productProp[], invoice: InvoiceOrder, customerId: number) {

    const orders = products.map(item => {
        return {
            quantity: item.quantity,
            price: parseFloat(item.price),
            productId: item.id,
            invoiceOrderId: invoice.id
        }
    })
    const cantOrders = await prisma.order.createMany({
        data: orders
    });

    if(!cantOrders) {
        return null;
    }

    // return redirect(`/factura?customer=${customerId}&invoice=${invoice.id}`);
    return json({ success: true, customerId: customerId, invoiceId: invoice.id });
}


// Detail Sales
export async function registerManyOrdersBuy(products: productProp[], invoice: InvoiceSales, supplierId: number) {

    const orders = products.map(item => {
        return {
            quantity: item.quantity,
            price: parseFloat(item.price),
            productId: item.id,
            invoiceSalesId: invoice.id
        }
    })
    const cantOrders = await prisma.detailSales.createMany({
        data: orders
    });

    if(!cantOrders) {
        return null;
    }

    // return redirect(`/factura?customer=${customerId}&invoice=${invoice.id}`);
    return json({ success: true, supplierId: supplierId, invoiceId: invoice.id });
}