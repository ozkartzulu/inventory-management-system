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

    // register inventory
    products.forEach(async product => {
        const existProduct = await prisma.inventary.count({ where: { productId: product.id } });
        if(existProduct) {
            await prisma.inventary.update({
                where: {
                    productId: product.id,
                },
                data: {
                    productsSold: {
                        increment: product.quantity,
                    },
                    sales: {
                        increment: product.quantity * parseFloat(product.price),
                    }
                }
            })
        } else {
            console.log('No existe el producto'+ product.name +' en inventario no se actualizó datos');
        }
    })

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

    // register inventory
    products.forEach(async product => {
        const existProduct = await prisma.inventary.count({ where: { productId: product.id } });
        if(!existProduct) {
            await prisma.inventary.create({
                data: {
                    productId: product.id,
                    productsBought: product.quantity,
                    productsSold: 0,
                    purchases: product.quantity * parseFloat(product.price),
                    sales: 0
                }
            })
        } else {
            // if exist product, update the values
            await prisma.inventary.update({
                where: {
                    productId: product.id,
                },
                data: {
                    productsBought: {
                        increment: product.quantity,
                    },
                    purchases: {
                        increment: product.quantity * parseFloat(product.price),
                    }
                }
            })
        }
    })

    // return redirect(`/factura?customer=${customerId}&invoice=${invoice.id}`);
    return json({ success: true, supplierId: supplierId, invoiceId: invoice.id });
}