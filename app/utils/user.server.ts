import bcrypt from 'bcryptjs';
import type { RegisterForm } from './types.server';
import { prisma } from './prisma.server';
import { json, redirect } from '@remix-run/node';

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  
  return { id: newUser.id, name: user.firstName, email: user.email }
}

export async function getAllUsers() {
	try {
		const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });

		if (!users) {
			return null;
		}

		return users;
	} catch (error) {
		console.log('Ocurrió un error al recuperar todos los usuarios');
		return null;
	}
}

export async function updateUserPwd(user: {email: string, password: string}) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const exists = await prisma.user.count({ where: { email: user.email } });
    if (!exists) {
        return json({ error: `Email no encontrado`}, { status: 400 })
    }

    const newUser = await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: passwordHash,
        },
    });

    if(!newUser) {
        return json({ error: `La contraseña nueva no pudo ser cambiado`}, { status: 400 })
    }

    return redirect('/login');
}