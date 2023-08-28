import { z } from 'zod';
import { api } from './base';

const likesNumberResponseSchema = z.object({
  likes: z.number(),
});

type LikesNumberResponse = z.infer<typeof likesNumberResponseSchema>;

type GetUserLikesNumberResult =
  | { status: 'success'; data: LikesNumberResponse }
  | { status: 'error'; error: 'Unauthorized' | 'NetworkError' | 'UnknownError' };
export const getUserLikesNumber = async (token: string): Promise<GetUserLikesNumberResult> => {
  try {
    const res = await api.get('/likes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = likesNumberResponseSchema.parse(res.data);
    return { status: 'success', data };
  } catch (err) {
    // TODO: Handle error
    return { status: 'error', error: 'UnknownError' };
  }
};
