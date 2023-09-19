import { z } from 'zod';
import { api } from './base';
import { errorHandler } from './conversations';
import { PossibleMatch, possibleMatchSchema, imageSchema } from '@/types';

const likesTeaserResponseSchema = z.object({
  likes: z.number(),
  latestLike: z.object({
    first_name: z.string(),
    randomImage: z.string(),
  }),
});

export type LikesTeaserResponse = z.infer<typeof likesTeaserResponseSchema>;

type GetUserLikesTeaserResult =
  | { status: 'success'; data: LikesTeaserResponse }
  | { status: 'error'; error: 'Unauthorized' | 'NetworkError' | 'UnknownError' };
export const getUserLikesTeaser = async (token: string): Promise<GetUserLikesTeaserResult> => {
  try {
    const res = await api.get('/likes/teaser', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = likesTeaserResponseSchema.parse(res.data);
    return { status: 'success', data };
  } catch (err) {
    // TODO: Handle error
    return { status: 'error', error: 'UnknownError' };
  }
};

type GetFreeLikesResult =
  | { status: 'success'; data: { secure_url: string }[] }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };
export const getFreeLikes = async (token: string, n: number): Promise<GetFreeLikesResult> => {
  n = n > 10 ? 10 : n;
  try {
    const res = await api.get(`/likes/free?n=${n}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = imageSchema.pick({ secure_url: true }).array().parse(res.data);
    return { status: 'success', data };
  } catch (err) {
    console.error(err);
    return { status: 'error', error: errorHandler(err) };
  }
};

type GetPremiumLikesResult =
  | { status: 'success'; data: PossibleMatch[] }
  | { status: 'error'; error: ReturnType<typeof errorHandler> };
export const getPremiumLikes = async (token: string): Promise<GetPremiumLikesResult> => {
  try {
    const res = await api.get('/likes/premium', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = possibleMatchSchema.array().parse(res.data);
    return { status: 'success', data };
  } catch (err) {
    console.error(err);
    return { status: 'error', error: errorHandler(err) };
  }
};
