import prisma from '../lib/prisma';
import { errorHandler } from '../utils/errorHandler';
import { personalInfoSchema } from '../types';
import { z } from 'zod';

const latestLike = personalInfoSchema
  .pick({
    first_name: true,
  })
  .strip();

type LatestLike = z.infer<typeof latestLike>;

type getNumberOfLikesResult =
  | { status: 'success'; data: { likes: number; latestLike: LatestLike } }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };

export const getLikesTeaser = async (userId: string): Promise<getNumberOfLikesResult> => {
  try {
    const userLikes = await prisma.user.findMany({
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
      select: {
        profile: {
          select: {
            first_name: true,
          },
        },
      },
    });

    const likes = userLikes.length;
    if (likes > 0) {
      const latestLiker = latestLike.safeParse(userLikes[0].profile);
      if (latestLiker.success) {
        return { status: 'success', data: { likes, latestLike: latestLiker.data } };
      }
    }

    return {
      status: 'success',
      data: { likes, latestLike: { first_name: '' } },
    };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error, 'error in getLikesTeaser');
    return { status: 'error', error };
  }
};
