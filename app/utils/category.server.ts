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

    return categories;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas las categorías');
    return null;
  }
  
}

export async function getCategoriesMinusCurrent(idCategory: number) {
  try {
    const categories = await prisma.category.findMany({
        where: {
            NOT: {
                id: idCategory
            }
        }
    });

    return categories;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas las categorías');
    return null;
  }
  
}

export async function getCategory(idCategory: number) {
	try {
		const category = await prisma.category.findUnique({
            where: {
                id: idCategory,
            }
        });

		if (!category) {
			return null;
		}

		return category;
	} catch (error) {
		console.log('Ocurrió un error al recuperar cliente');
		return null;
	}
}


export async function updateCategory(category: registerCategory) {

    const newCategory = await prisma.category.update({
        where: {
            id: category.idCategory,
        },
        data: {
            name: category.name,
            description: category.description
        },
    });

    if(!newCategory) {
        return null;
    }

    return { id: newCategory.id, name: category.name, description: category.description }
}