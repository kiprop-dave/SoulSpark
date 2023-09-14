import { z } from 'zod';
import { api } from './base';

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
