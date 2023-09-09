import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Profile, getProfile } from '@/api/profile';

type useProfileInput =
  | { profileStatus: 'filled'; profile: Profile }
  | { profileStatus: 'NotFilled'; id: string };

type useProfileResult =
  | { status: 'ready'; profile: Profile }
  | { status: 'NotReady'; profile: null }
  | { status: 'error'; profile: null; error: string };
export const useUserProfile = (input: useProfileInput) => {
  const [profile, setProfile] = useState<useProfileResult>({ status: 'NotReady', profile: null });
  const { user } = useAuth();

  useEffect(() => {
    if (input.profileStatus === 'filled') {
      setProfile({ status: 'ready', profile: input.profile });
    } else {
      getProfile(user?.accessToken!, input.id).then((result) => {
        if (result.status === 'success') {
          setProfile({ status: 'ready', profile: result.data });
        }
      });
    }
  }, [input]);

  return { profile };
};
