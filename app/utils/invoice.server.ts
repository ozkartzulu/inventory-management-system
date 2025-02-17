import { json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { productProp } from "./types.server";
import { registerManyOrders, registerManyOrdersBuy } from "./order.server";



export async function registerInvoice(products: productProp[], customerId: string, userId: number) {
    try {
        const total = products?.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
        const customerNewId = +customerId;
        const invoice = await prisma.invoiceorder.create({
            data: {
                total: total,
                debt: 0,
                customerId: customerNewId,
                userId: userId
            },
        });

        if(!invoice) {
            return null;
        }

        return await registerManyOrders(products, invoice, customerNewId );
        // return { id: invoice.id, date: invoice.date, total: invoice.total, debt: invoice.debt, customerId: invoice.customerId, userId: invoice.userId }
    } catch (error) {
        console.log('Ocurrió un error al guardar factura de venta');
		return json({ success: false, message: "Ocurrió un error al guardar factura de venta" });
    }
}

export async function getInvoice(idInvoice: number) {
	try {
		const invoice = await prisma.invoiceorder.findUnique({
			where: {
				id: idInvoice
			},
		});

		return invoice;
	} catch (error) {
		console.log('Ocurrió un error al recuperar datos de factura');
		return null;
	}
}

export async function setStateInvoice(invoiceId: number, state: boolean) {

    const invoice = await prisma.invoiceorder.update({
        where: {
            id: invoiceId,
        },
        data: {
            state: state,
        },
    });

    if(!invoice) {
        return null;
    }

    return invoice;
}




// invoice Supplier or sales
export async function registerInvoiceBuy(products: productProp[], supplierId: string, userId: number) {
    const total = products?.reduce( (total, row) => total + ( row.quantity * +row.price) , 0 );
    const supplierNewId = +supplierId;
    const invoice = await prisma.invoicesales.create({
        data: {
            total: total,
            debt: 0,
            supplierId: supplierNewId,
            userId: userId
        },
    });

    if(!invoice) {
        return null;
    }

    return await registerManyOrdersBuy(products, invoice, supplierNewId );
    // return { id: invoice.id, date: invoice.date, total: invoice.total, debt: invoice.debt, customerId: invoice.customerId, userId: invoice.userId }
}

export async function getInvoiceBuy(idInvoice: number) {
	try {
		const invoice = await prisma.invoicesales.findUnique({
			where: {
				id: idInvoice
			},
		});

		return invoice;
	} catch (error) {
		console.log('Ocurrió un error al recuperar datos de factura');
		return null;
	}
}

export async function setStateInvoiceBuy(invoiceId: number, state: boolean) {

    const invoice = await prisma.invoicesales.update({
        where: {
            id: invoiceId,
        },
        data: {
            state: state,
        },
    });

    if(!invoice) {
        return null;
    }

    return invoice;
}