import type { RegisterForm, LoginForm } from './types.server';
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage  } from '@remix-run/node';
import { createUser } from './user.server';
import bcrypt from 'bcryptjs';
import { UserSession } from './types.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
    cookie: {
      name: 'kudos-session',
    //   secure: process.env.NODE_ENV === 'production', // only for production
      secrets: [sessionSecret],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
});

export async function createUserSession(user: UserSession, redirectTo: string) {
    const session = await storage.getSession();
    session.set('userId', user.id);
    session.set('username', user.name);
    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await storage.commitSession(session),
      },
    })
}

export async function register(user: RegisterForm) {
    const exists = await prisma.user.count({ where: { email: user.email } });
    if (exists) {
      return json({ error: `User already exists with that email` }, { status: 400 });
    }

    const newUser = await createUser(user);
    if (!newUser) {
      return json(
        {
          error: `Something went wrong trying to create a new user.`,
          fields: { email: user.email, password: user.password },
        },
        { status: 400 },
      );
    }

    return createUserSession(newUser, '/productos');
}

export async function login({ email, password }: LoginForm) {

    const user = await prisma.user.findUnique({
      where: { email },
    })
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({ error: `Incorrect login` }, { status: 400 });
    }
  
    return createUserSession({id: user.id, name: user.firstName, email: user.email}, '/productos');
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}
  
function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'));
}
  
async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId: number = session.get('userId');

    if (!userId || typeof userId !== 'number') {
        return null;
    } 
    return userId;
}

export async function getUserIdName(request: Request) {
  const session = await getUserSession(request);
  const userId: number = session.get('userId');
  const username = session.get('username');

  if (!userId || !username || typeof userId !== 'number') {
      return null;
  } 
  return {id: userId, name: username};
}
  
export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== 'number') {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true, lastName: true },
        })
        return user;
    } catch {
        throw logout(request)
    }
}
  
export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect('/login', {
        headers: {
        'Set-Cookie': await storage.destroySession(session),
        },
    })
}