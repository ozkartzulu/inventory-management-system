import { redirect, json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { productProp } from "./types.server";
import { invoiceorder, invoicesales } from "@prisma/client";

export async function registerManyOrders(products: productProp[], invoice: invoiceorder, customerId: number) {

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
export async function registerManyOrdersBuy(products: productProp[], invoice: invoicesales, supplierId: number) {

    const orders = products.map(item => {
        return {
            quantity: item.quantity,
            price: parseFloat(item.price),
            productId: item.id,
            invoiceSalesId: invoice.id
        }
    })
    const cantOrders = await prisma.detailsales.createMany({
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

export async function getAllOrders() {
	try {
		const orders = await prisma.order.findMany({
			include: {
				product: {
                    include: {
                        category: true
                    }, 
                },
                invoiceorder: {
                    include: {
                        user: {
                            select: {id: true, firstName: true}
                        },
                        customer: {
                            select: {id: true, name: true}
                        }
                    }
                }
			},
		});

		if (!orders) {
			return null;
		}

		return orders;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las ordenes');
		return null;
	}
}

export async function getAllOrdersProduct(startDate: Date, endDate: Date | null) {
    let dateData = {};
    if(endDate) {
        dateData = {
            gte: startDate,
            lte: endDate
        }
        console.log(dateData)
    } else {
        dateData = {
            gte: startDate
        }
        console.log(dateData)
    }
	try {
		const orders = await prisma.order.findMany({
            where: {
                date: dateData
            },
			include: {
				product: {
                    select: {
                        id: true, url: true, name: true
                    }
                },
			},
		});

		if (!orders) {
			return null;
		}

		return orders;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las orders');
		return null;
	}
}

//////////////////////// Detail Sales //////////////////////////

export async function getAllSales() {
	try {
		const orders = await prisma.detailsales.findMany({
			include: {
				product: {
                    include: {
                        category: true
                    }, 
                },
                invoicesales: {
                    include: {
                        user: {
                            select: {id: true, firstName: true}
                        },
                        supplier: {
                            select: {id: true, name: true}
                        }
                    }
                }
			},
		});

		if (!orders) {
			return null;
		}

		return orders;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las detail sales');
		return null;
	}
}

export async function getAllSalesProduct(startDate: Date, endDate: Date | null) {
    let dateData = {};
    if(endDate) {
        dateData = {
            gte: startDate,
            lte: endDate
        }
    } else {
        dateData = {
            gte: startDate
        }
    }
	try {
		const orders = await prisma.detailsales.findMany({
            where: {
                date: dateData
            },
			include: {
				product: {
                    select: {
                        id: true, url: true, name: true
                    }
                },
			},
		});

		if (!orders) {
			return null;
		}

		return orders;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las orders');
		return null;
	}
}