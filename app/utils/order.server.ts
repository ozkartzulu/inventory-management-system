import { redirect, json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { productCart } from "./types.server";
import { InvoiceOrder } from "@prisma/client";

export async function registerManyOrders(products: productCart[], invoice: InvoiceOrder, customerId: number) {

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