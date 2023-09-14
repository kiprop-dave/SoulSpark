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
  | { status: 'success'; data: { likes: number; latestLike: LatestLike & { randomImage: string } } }
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
            id: true,
          },
        },
      },
    });
    const randomImage = await prisma.digitalAsset.findFirst({
      where: {
        AND: [
          {
            profile: {
              isNot: null,
            },
          },
          {
            profileId: {
              notIn: userLikes.reduce((acc: string[], curr) => {
                if (curr.profile) {
                  acc.push(curr.profile.id);
                }
                return acc;
              }, []),
            },
          },
        ],
      },
      select: {
        secure_url: true,
      },
    });

    const likes = userLikes.length;
    if (likes > 0 && randomImage) {
      const latestLiker = latestLike.safeParse(userLikes[0].profile);
      if (latestLiker.success) {
        return {
          status: 'success',
          data: {
            likes,
            latestLike: {
              first_name: latestLiker.data.first_name,
              randomImage: randomImage.secure_url,
            },
          },
        };
      }
    }

    return {
      status: 'success',
      data: { likes, latestLike: { first_name: '', randomImage: '' } },
    };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error, 'error in getLikesTeaser');
    return { status: 'error', error };
  }
};
