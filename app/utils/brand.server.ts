import type { registerModel, updateBrand } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';


export async function registerBrand(model: registerModel) {

    const exists = await prisma.model.count({ where: { name: model.name } });
    if (exists) {
      return json({ error: `Ya existe esta marca con este nombre` }, { status: 400 });
    }

    const newModel = await prisma.brand.create({
      data: {
        name: model.name,
        categoryId: model.categoryId,
      },
    });

    if (!newModel) {
      return json(
        {
          error: `Error al crear nueva marca`,
          fields: { name: model.name, categoryId: model.categoryId },
        },
        { status: 400 },
      );
    }

    return redirect('/marcas');
}

export async function getAllBrands() {
  try {
    const models = await prisma.brand.findMany();

    if(!models) {
      return json(
        {
          error: `Ocurrió un error al recuperar todas las marcas.`,
        },
        { status: 400 },
      );
    }

    return models;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas los marcas');
    return null;
  }
}

export async function getBrandsByIdCategory(idCategory: number | undefined) {
	try {
		const models = await prisma.brand.findMany({
			where: {
				categoryId : idCategory
			}
		})

		// if(!models) {
		// 	return json(
		// 		{
		// 			error: `Ocurrió un error al recuperar marcas dado categoria: ${idCategory}.`,
		// 		},
		// 		{ status: 400 },
		// 	);
		// }

		return models;
	} catch (error) {
		console.log(`Ocurrió un error al recuperar marcas dado categoria: ${idCategory}.`);
		return null;
	}
}

export async function updateBrand(brand: updateBrand) {

    const newBrand = await prisma.brand.update({
        where: {
            id: brand.idBrand,
        },
        data: {
            name: brand.name,
        },
    });

    if(!newBrand) {
        return null;
    }

    return { id: newBrand.id, name: brand.name }
}

export async function getBrand(idBrand: number) {
	try {
		const brand = await prisma.brand.findUnique({
            where: {
                id: idBrand,
            }
        });

		if (!brand) {
			return null;
		}

		return brand;
	} catch (error) {
		console.log('Ocurrió un error al recuperar modelo');
		// return null;
	}
}