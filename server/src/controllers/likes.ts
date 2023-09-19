import prisma from '../lib/prisma';
import { errorHandler } from '../utils/errorHandler';
import {
  personalInfoSchema,
  basicInfoSchema,
  otherInfoSchema,
  PossibleMatch,
  Image,
  imageSchema,
  possibleMatchSchema,
} from '../types';
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

type GetPremiumLikesResult =
  | { status: 'success'; data: PossibleMatch[] }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };
export const getPremiumLikes = async (userId: string): Promise<GetPremiumLikesResult> => {
  try {
    const queryRes = await prisma.user.findMany({
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
        id: true,
        profile: {
          include: {
            images: true,
          },
        },
      },
    });
    const likes = queryRes.reduce((acc: PossibleMatch[], curr) => {
      const personal = personalInfoSchema.safeParse(curr.profile);
      const basic = basicInfoSchema.safeParse(curr.profile);
      const other = otherInfoSchema.safeParse(curr.profile);
      if (personal.success) {
        acc.push({
          userId: curr.id,
          profile: {
            personalInfo: personal.data,
            basicInfo: basic.success ? basic.data : undefined,
            otherInfo: other.success ? other.data : undefined,
          },
        });
      }
      return acc;
    }, []);
    return { status: 'success', data: likes };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error, 'error in getPremiumLikes');
    return { status: 'error', error };
  }
};

type GetFreeLikesResult =
  | { status: 'success'; data: { secure_url: string }[] }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };
export const getFreeLikes = async (userId: string, n: number): Promise<GetFreeLikesResult> => {
  try {
    const queryRes = await prisma.digitalAsset.findMany({
      where: {
        profile: {
          isNot: null,
        },
        profileId: {
          not: userId,
        },
        format: {
          equals: 'jpg',
        },
      },
      select: {
        secure_url: true,
      },
      take: n,
    });
    return { status: 'success', data: queryRes };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error, 'error in getFreeLikes');
    return { status: 'error', error };
  }
};
