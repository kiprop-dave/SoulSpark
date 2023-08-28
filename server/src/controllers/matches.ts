import { z } from 'zod';
import prisma from '../lib/prisma';
import { errorHandler } from '../utils/errorHandler';
import { PossibleMatch, personalInfoSchema, basicInfoSchema, otherInfoSchema } from '../types';

type PossibleError = 'notFound' | 'unknown';

const userPreferenceSchema = z.object({
  age: z.object({
    min: z.number(),
    max: z.number(),
  }),
  attraction: z.union([z.literal('Man'), z.literal('Woman'), z.literal('Other'), z.literal('All')]),
});

type UserPreferences = z.infer<typeof userPreferenceSchema>;
const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        minimumAge: true,
        maximumAge: true,
        attraction: true,
      },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    const result = userPreferenceSchema.safeParse({
      age: {
        min: profile.minimumAge,
        max: profile.maximumAge,
      },
      attraction: profile.attraction,
    });
    if (!result.success) {
      throw new Error('Profile not found');
    }
    return result.data;
  } catch (err) {
    console.error(err, 'error in getUserPreferences');
    throw err;
  }
};

type GetPossibleMatchesResult =
  | { status: 'success'; data: PossibleMatch[] }
  | { status: 'error'; error: PossibleError };
export const getPossibleMatches = async (userId: string): Promise<GetPossibleMatchesResult> => {
  try {
    const { age, attraction } = await getUserPreferences(userId);
    const earliestBirthDate = new Date().setFullYear(new Date().getFullYear() - age.max);
    const latestBirthDate = new Date().setFullYear(new Date().getFullYear() - age.min);
    const attractedTo = attraction === 'Man' ? 'Male' : attraction === 'Woman' ? 'Female' : 'Other';
    const possibleMatches = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
        likedBy: {
          none: {
            id: userId,
          },
        },
        dislikedBy: {
          none: {
            id: userId,
          },
        },
        profile: {
          dateOfBirth: {
            gte: new Date(earliestBirthDate),
            lte: new Date(latestBirthDate),
          },
          gender: attractedTo,
        },
      },
      include: {
        profile: {
          include: {
            images: true,
          },
        },
      },
    });
    const possibleMatchesWithProfile = possibleMatches
      .map((possibleMatch) => {
        const personalInfo = personalInfoSchema.safeParse(possibleMatch.profile);
        const basicInfo = basicInfoSchema.optional().safeParse(possibleMatch.profile);
        const otherInfo = otherInfoSchema.optional().safeParse(possibleMatch.profile);
        if (personalInfo.success) {
          return {
            userId: possibleMatch.id,
            profile: {
              personalInfo: personalInfo.data,
              basicInfo: basicInfo.success ? basicInfo.data : undefined,
              otherInfo: otherInfo.success ? otherInfo.data : undefined,
            },
          };
        } else {
          return null;
        }
      })
      .filter((p) => p !== null) as PossibleMatch[];
    //console.log(possibleMatchesWithProfile);

    return { status: 'success', data: possibleMatchesWithProfile };
  } catch (err) {
    console.error(err, 'error in getPossibleMatches');
    return { status: 'error', error: 'unknown' };
  }
};

type LikeUserResult =
  | { status: 'success'; isMatch: boolean, conversationId?: string, matchedAt?: Date }
  | { status: 'error'; error: PossibleError };
export const likeUser = async (userId: string, matchId: string): Promise<LikeUserResult> => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        likes: {
          connect: {
            id: matchId,
          },
        },
      },
    });
    const match = await prisma.user.findUnique({
      where: {
        id: matchId,
        likes: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (match) {
      // Create a conversation
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: userId },
              { id: matchId }
            ]
          }
        }
      })
      return { status: 'success', isMatch: true, conversationId: conversation.id, matchedAt: conversation.createdAt };
    } else {
      return { status: 'success', isMatch: false };
    }
  } catch (err) {
    console.error(err, 'error in likeUser');
    return { status: 'error', error: 'unknown' };
  }
};

type DislikeUserResult = { status: 'success' } | { status: 'error'; error: PossibleError };
export const dislikeUser = async (userId: string, matchId: string): Promise<DislikeUserResult> => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        dislikes: {
          connect: {
            id: matchId,
          },
        },
      },
    });
    return { status: 'success' };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in dislikeUser');
    return { status: 'error', error: 'unknown' };
  }
};

type GetMatchesResult =
  | { status: 'success'; data: PossibleMatch[] }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };
export const getMatches = async (userId: string): Promise<GetMatchesResult> => {
  try {
    // Finds all users that have liked the current user and that the current user has liked
    const matches = await prisma.user.findMany({
      where: {
        likes: {
          some: {
            id: userId,
          },
        },
        likedBy: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        profile: {
          include: {
            images: true,
          },
        },
      },
    });

    const validatedData = matches.reduce((acc: PossibleMatch[], match) => {
      const personalInfo = personalInfoSchema.safeParse(match.profile);
      const basicInfo = basicInfoSchema.optional().safeParse(match.profile);
      const otherInfo = otherInfoSchema.optional().safeParse(match.profile);
      if (personalInfo.success) {
        acc.push({
          userId: match.id,
          profile: {
            personalInfo: personalInfo.data,
            basicInfo: basicInfo.success ? basicInfo.data : undefined,
            otherInfo: otherInfo.success ? otherInfo.data : undefined,
          },
        });
      }
      return acc;
    }, []);

    return { status: 'success', data: validatedData };
  } catch (err) {
    const error = errorHandler(err);
    console.log(error.type, error.message, 'error in getMatches');
    return { status: 'error', error };
  }
};
