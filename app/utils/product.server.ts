import type { registerProduct } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';


export async function registerProduct(product: registerProduct) {

    const exists = await prisma.product.count({ where: { name: product.name } });
    if (exists) {
      return json({ error: `Ya existe este producto con este nombre` }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        number: product.number,
        madeinId: product.madeinId,
        categoryId: product.categoryId,
        url: product.file,
      },
    });

    if (!newProduct) {
      return json(
        {
          error: `Hubo un error al crear producto.`,
          fields: { name: product.name, description: product.description, number: product.number, madeinId: product.madeinId, categoryId: product.categoryId, file: product.file },
        },
        { status: 400 },
      );
    }

    return redirect('/productos');
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany();

    if(!products) {
      return json(
        {
          error: `Ocurrió un error al recuperar todas los productos.`,
        },
        { status: 400 },
      );
    }

    return products;
  } catch (error) {
    console.log('Ocurrió un error al recuperar todas los productos');
    return null;
  }
  
}

export function getPathRelative(absolutePath:string) {
   const publicFolder = "public";

   const publicIndex = absolutePath.indexOf(publicFolder);
 
   if (publicIndex === -1) {
     throw new Error("La ruta no contiene la carpeta 'public'.");
   }

   const relativePath = absolutePath.substring(publicIndex + publicFolder.length);
 
   return relativePath.replace(/\\/g, "/");
}
