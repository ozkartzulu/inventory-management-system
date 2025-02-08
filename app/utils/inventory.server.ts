import { json } from '@remix-run/node';
import { prisma } from './prisma.server';


export async function getAllInventories() {
	try {
		const inventories = await prisma.inventary.findMany({});

		if (!inventories) {
			return null;
		}

		return inventories;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas los productos');
		return null;
	}
}

export async function getAllInventoriesProduct() {
	try {
		const inventories = await prisma.inventary.findMany({
			include: {
				product: {
                    select: {
                        id: true, url: true, name: true
                    }
                },
			},
		});

		if (!inventories) {
			return null;
		}

		return inventories;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las inventarios');
		return null;
	}
}