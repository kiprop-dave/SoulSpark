import { api } from './base';
import { loggedInUserSchema, LoggedInUser, UserProfile, userProfileSchema } from '@/types';

export const getLoggedInUser = async (): Promise<LoggedInUser | null> => {
  try {
    const { data } = await api.get('auth/me');
    const user = loggedInUserSchema.parse(data);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getUserProfile(id: string, accessToken: string): Promise<UserProfile | null> {
  try {
    const { data } = await api.get(`users/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    const user = userProfileSchema.parse(data);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function createUserProfile(accessToken: string, id: string, profile: UserProfile): Promise<UserProfile | null> {
  console.log(profile);
  try {
    const { data } = await api.post(`users/profile/${id}`, profile, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const user = userProfileSchema.parse(data);

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}
