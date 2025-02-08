import type { registerVariant, updateVariant } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';


export async function registerVariant(variant: registerVariant) {

		const exists = await prisma.variant.count({ where: { medida: variant.medida, unit: variant.unit } });
		if (exists) {
			return json({ error: `Ya existe esta variante con este nombre` }, { status: 400 });
		}

		const newVariant = await prisma.variant.create({
			data: {
				medida:variant.medida,
				unit: variant.unit,
				categoryId: variant.categoryId,
			},
		});

		if (!newVariant) {
			return json(
				{
					error: `Sucedió algo al crear variante.`,
					fields: { medida: variant.medida, unit: variant.unit, categoryId: variant.categoryId },
				},
				{ status: 400 },
			);
		}

		return redirect('/variantes');
}

export async function getAllVariants() {
	try {
		const variants = await prisma.variant.findMany({
            include: {
                category: true,
            }
        });

		if(!variants) {
			return json(
				{
					error: `Ocurrió un error al recuperar todas las variantes.`,
				},
				{ status: 400 },
			);
		}

		return variants;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todas las variantes');
		return null;
	}
	
}

export async function getVariantsByIdCategory(idCategory: number | undefined) {
	try {
		const variants = await prisma.variant.findMany({
			where: {
				categoryId : idCategory
			}
		})

		// if(!variants) {
		// 	return json(
		// 		{
		// 			error: `Ocurrió un error al recuperar variantes dado categoria: ${idCategory}.`,
		// 		},
		// 		{ status: 400 },
		// 	);
		// }

		return variants;
	} catch (error) {
		console.log(`Ocurrió un error al recuperar variantes dado categoria: ${idCategory}.`);
		return null;
	}
}

export async function getVariant(idVariant: number) {
	try {
		const variant = await prisma.variant.findUnique({
            where: {
                id: idVariant,
            },
            include: {
                category: true,
            }
        });

		if (!variant) {
			return null;
		}

		return variant;
	} catch (error) {
		console.log('Ocurrió un error al recuperar variante');
		// return null;
	}
}

export async function updateVariant(variant: updateVariant) {

    const newVariant = await prisma.variant.update({
        where: {
            id: variant.idVariant,
        },
        data: {
            medida: variant.medida,
            unit: variant.unit,
            categoryId: variant.categoryId,
        },
    });

    if(!newVariant) {
        return null;
    }

    return { id: newVariant.id, medida: variant.medida, unit: variant.unit, categoryId: variant.categoryId }
}
