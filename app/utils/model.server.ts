import type { registerModel, updateModel } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';


export async function registerModel(model: registerModel) {

    const exists = await prisma.model.count({ where: { name: model.name } });
    if (exists) {
      return json({ error: `Ya existe esta categoría con este nombre` }, { status: 400 });
    }

    const newModel = await prisma.model.create({
      data: {
        name: model.name,
        categoryId: model.categoryId,
      },
    });

    if (!newModel) {
      return json(
        {
          error: `Error al crear nuevo Modelo`,
          fields: { name: model.name, categoryId: model.categoryId },
        },
        { status: 400 },
      );
    }

    return redirect('/modelos');
}

export async function getAllModels() {
  try {
    const models = await prisma.model.findMany();

    if(!models) {
      return json(
        {
          error: `Ocurrió un error al recuperar todas los modelos.`,
        },
        { status: 400 },
      );
    }

    return models;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas los modelos');
    return null;
  }
}

export async function getModelsByIdCategory(idCategory: number | undefined) {
	try {
		const models = await prisma.model.findMany({
			where: {
				categoryId : idCategory
			}
		})

		// if(!models) {
		// 	return json(
		// 		{
		// 			error: `Ocurrió un error al recuperar modelos dado categoria: ${idCategory}.`,
		// 		},
		// 		{ status: 400 },
		// 	);
		// }

		return models;
	} catch (error) {
		console.log(`Ocurrió un error al recuperar modelos dado categoria: ${idCategory}.`);
		return null;
	}
}

export async function getModel(idModel: number) {
	try {
		const model = await prisma.model.findUnique({
            where: {
                id: idModel,
            }
        });

		if (!model) {
			return null;
		}

		return model;
	} catch (error) {
		console.log('Ocurrió un error al recuperar modelo');
		// return null;
	}
}

export async function updateModel(model: updateModel) {

    const newModel = await prisma.model.update({
        where: {
            id: model.idModel,
        },
        data: {
            name: model.name,
        },
    });

    if(!newModel) {
        return null;
    }

    return { id: newModel.id, name: model.name }
}