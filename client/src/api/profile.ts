import { z } from 'zod';
import { api } from './base';
import { userProfileSchema } from '@/types';
import { errorHandler } from './conversations';

const profileSchema = userProfileSchema.omit({ preferences: true });
export type Profile = z.infer<typeof profileSchema>;

type GetProfileResult = { status: 'success'; data: Profile } | { status: 'error'; error: string };
export async function getProfile(token: string, id: string): Promise<GetProfileResult> {
  try {
    const response = await api.get(`/conversations/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = profileSchema.safeParse(response.data);
    if (result.success) {
      return { status: 'success', data: result.data };
    }
    console.log(result.error);
    return { status: 'error', error: 'unknownError' };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
