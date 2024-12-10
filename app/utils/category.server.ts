import type { registerCategory } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';


export async function registerCategory(category: registerCategory) {

    const exists = await prisma.category.count({ where: { name: category.name } });
    if (exists) {
      return json({ error: `Ya existe esta categoría con este nombre` }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });

    if (!newCategory) {
      return json(
        {
          error: `Something went wrong trying to create a new user.`,
          fields: { name: category.name, description: category.description },
        },
        { status: 400 },
      );
    }

    return redirect('/categorias');
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany();

    // if(!categories) {
    //   return json(
    //     {
    //       error: `Ocurrió un error al recuperar todas las categorías.`,
    //     },
    //     { status: 400 },
    //   );
    // }

    return categories;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas las categorías');
    return null;
  }
  
}
