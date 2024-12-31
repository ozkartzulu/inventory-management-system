import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { RegisterSupplier } from "./types.server";



export const registerSupplier = async (user: RegisterSupplier) => {
    const newUser = await prisma.supplier.create({
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

export async function getAllSuppliers() {
	try {
		const suppliers = await prisma.supplier.findMany();

		if (!suppliers) {
			return null;
		}

		return suppliers;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas los productos');
		return null;
	}
}

export async function getSupplier(idSupplier: number) {
	try {
		const supplier = await prisma.supplier.findUnique({
            where: {
                id: idSupplier,
            }
        });

		if (!supplier) {
			return null;
		}

		return supplier;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas los productos');
		return null;
	}
}

export async function updateSupplier(user: RegisterSupplier) {

	const newUser = await prisma.supplier.update({
        where: {
            id: user.idSupplier,
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

export async function deleteSupplier(idSupplier: number) {
	try {
        const exists = await prisma.supplier.count({ where: { id: idSupplier } });
        if (!exists) {
            return json({ error: `Este proveedor no existe, no se puede eliminar` }, { status: 400 });
        }

		const supplier = await prisma.supplier.delete({
			where: {
				id: idSupplier
			},
		});

		return supplier;
	} catch (error) {
		console.log('Ocurrió un error al eliminar proveedor');
		return null;
	}
}