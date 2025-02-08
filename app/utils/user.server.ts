import bcrypt from 'bcryptjs';
import type { RegisterForm } from './types.server';
import { prisma } from './prisma.server';

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