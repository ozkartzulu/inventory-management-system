import type { registerVariant } from './types.server';
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
		const variants = await prisma.variant.findMany();

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

export async function getVariantsByIdCategory(idCategory: number) {
	try {
		const variants = await prisma.variant.findMany({
			where: {
				categoryId : idCategory
			}
		})

		if(!variants) {
			return json(
				{
					error: `Ocurrió un error al recuperar variantes dado categoria: ${idCategory}.`,
				},
				{ status: 400 },
			);
		}

		return variants;
	} catch (error) {
		console.log(`Ocurrió un error al recuperar variantes dado categoria: ${idCategory}.`);
		return null;
	}
}
