import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { RegisterCustomer } from "./types.server";



export const registerCustomer = async (user: RegisterCustomer) => {
    const newUser = await prisma.customer.create({
        data: {
            name: user.name,
            phone: user.phone,
            address: user.address,
        },
    });

    if(!newUser) {
        return null;
    }

    return { id: newUser.id, name: user.name, phone: user.phone, address: user.address }
}

export async function getAllCustomers() {
	try {
		const customers = await prisma.customer.findMany();

		if (!customers) {
			return null;
		}

		return customers;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todos los clientes');
		return null;
	}
}

export async function getCustomer(idCustomer: number) {
	try {
		const customer = await prisma.customer.findUnique({
            where: {
                id: idCustomer,
            }
        });

		if (!customer) {
			return null;
		}

		return customer;
	} catch (error) {
		console.log('Ocurrió un error al recuperar cliente');
		return null;
	}
}

export async function updateCustomer(user: RegisterCustomer) {

	const newUser = await prisma.customer.update({
        where: {
            id: user.idCustomer,
        },
        data: {
            name: user.name,
            phone: user.phone,
            address: user.address,
        },
    });

    if(!newUser) {
        return null;
    }

    return { id: newUser.id, name: user.name, phone: user.phone, address: user.address }
}

export async function deleteCustomer(idCustomer: number) {
	try {
        const exists = await prisma.customer.count({ where: { id: idCustomer } });
        if (!exists) {
            return json({ error: `Este cliente no existe, no se puede eliminar` }, { status: 400 });
        }

		const customer = await prisma.customer.delete({
			where: {
				id: idCustomer
			},
		});

		return customer;
	} catch (error) {
		console.log('Ocurrió un error al eliminar cliente');
		return null;
	}
}