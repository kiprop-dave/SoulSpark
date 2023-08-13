import { Prisma, User } from '@prisma/client';
import prisma from '../lib/prisma';
import { GoogleUserInfo, UserCredentials } from '../types';

type UserInfo = GoogleUserInfo;

type CreateUserResult =
  | { status: 'success' }
  | { status: 'failed'; message: 'Conflict' }
  | { status: 'failed'; message: 'Error' };
type GetUserResult =
  | { status: 'success'; user: User }
  | { status: 'failed'; message: 'Not found' }
  | { status: 'failed'; message: 'Error' };

export async function createUser(details: UserCredentials): Promise<CreateUserResult> {
  try {
    await prisma.user.create({
      data: {
        email: details.email,
        password: details.password,
      },
    });
    return { status: 'success' };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { status: 'failed', message: 'Conflict' };
      }
    }
    return { status: 'failed', message: 'Error' };
  }
}

export async function getUserByEmail(email: string): Promise<GetUserResult> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user === null) {
      return { status: 'failed', message: 'Not found' };
    }
    return { status: 'success', user: user };
  } catch (err) {
    return { status: 'failed', message: 'Error' };
  }
}

export async function createAcccount(userInfo: UserInfo, provider: 'Google' | 'Facebook') {
  try {
    const exists = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          providerId: userInfo.id,
          provider: provider,
        },
      },
      include: {
        user: true,
      },
    });
    if (exists) {
      return { id: exists.user.id, email: exists.user.email };
    }
    const newUser = await prisma.user.create({
      data: {
        email: userInfo.email,
        emailVerified: userInfo.verified_email,
        Account: {
          create: {
            provider: provider,
            providerId: userInfo.id,
          },
        },
      },
    });
    return { id: newUser.id, email: newUser.email };
  } catch (err) {
    console.log(err);
    throw new Error('Error creating user');
  }
}
