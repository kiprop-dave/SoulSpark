import prisma from '../lib/prisma';
import { errorHandler } from '../utils/errorHandler';

type getNumberOfLikesResult =
  | { status: 'success'; data: { likes: number } }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };

export const getNumberOfLikes = async (userId: string): Promise<getNumberOfLikesResult> => {
  try {
    // Get the number of users that like the user but the user doesn't like them back,i.e Ones that have
    // yet to match with the user
    const userLikes = await prisma.user.count({
      where: {
        likes: {
          some: {
            id: userId,
          },
        },
        likedBy: {
          none: {
            id: userId,
          },
        },
      },
    });
    return { status: 'success', data: { likes: userLikes } };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error);
    return { status: 'error', error };
  }
};
