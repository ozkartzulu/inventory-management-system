import type { registerMadein, registerModel } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';
import { Model } from '@prisma/client';


export async function registerMadeins(model: registerMadein) {

    const exists = await prisma.madein.count({ where: { name: model.name } });
    if (exists) {
      return json({ error: `Ya existe esta fabricado con este nombre` }, { status: 400 });
    }

    const newModel = await prisma.madein.create({
      data: {
        name: model.name,
      },
    });

    if (!newModel) {
      return json(
        {
          error: `Error al crear nueva fabricante`,
          fields: { name: model.name },
        },
        { status: 400 },
      );
    }

    return redirect('/fabricados');
}

export async function getAllMadeins() {
  try {
    const models = await prisma.madein.findMany();

    // if(!models) {
    //   return json(
    //     {
    //       error: `Ocurrió un error al recuperar todas los fabricados.`,
    //     },
    //     { status: 400 },
    //   );
    // }

    return models;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas los fabricados');
    return null;
  }
}

/*
export async function getMadeinsByIdCategory(idCategory: number) {
	try {
		const models = await prisma.madein.findMany({
			where: {
				categoryId : idCategory
			}
		})

		if(!models) {
			return json(
				{
					error: `Ocurrió un error al recuperar fabricados dado categoria: ${idCategory}.`,
				},
				{ status: 400 },
			);
		}

		return models;
	} catch (error) {
		console.log(`Ocurrió un error al recuperar fabricados dado categoria: ${idCategory}.`);
		return null;
	}
}
  */