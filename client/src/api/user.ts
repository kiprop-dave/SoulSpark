import { AxiosError } from 'axios';
import { api } from './base';
import {
  loggedInUserSchema,
  LoggedInUser,
  UserProfile,
  userProfileSchema,
  Credentials,
} from '@/types';

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

type LoginResult = { status: 'success'; user: LoggedInUser } | { status: 'error'; error: string };

export async function loginWithCredentials(cred: Credentials): Promise<LoginResult> {
  try {
    const { data } = await api.post('auth/login', cred);
    const user = loggedInUserSchema.parse(data);
    return { status: 'success', user };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'Invalid credentials' };
      } else if (err.response?.status === 500) {
        return { status: 'error', error: 'Internal server error' };
      }
    }
    console.error(err);
    return { status: 'error', error: 'unknown error' };
  }
}

export async function signupWithCredentials(cred: Credentials): Promise<void> {
  try {
    await api.post('auth/register', cred);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

type LogoutResult = { status: 'success' } | { status: 'error'; error: string };
export async function logout(): Promise<LogoutResult> {
  try {
    await api.post('auth/logout');
    return { status: 'success' };
  } catch (err) {
    console.error(err);
    return { status: 'error', error: 'unknown error' };
  }
}

export async function getUserProfile(id: string, accessToken: string): Promise<UserProfile | null> {
  try {
    const { data } = await api.get(`users/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = userProfileSchema.parse(data);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createUserProfile(
  accessToken: string,
  id: string,
  profile: UserProfile
): Promise<UserProfile | null> {
  try {
    const { data } = await api.post(`users/profile/${id}`, profile, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // A bug here,TODO: fix it, the shape of data different on the server side
    const user = userProfileSchema.parse(data);

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}
