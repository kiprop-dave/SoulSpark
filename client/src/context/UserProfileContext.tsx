import { createContext, useEffect, useState, useContext } from 'react';
import { getUserProfile } from '@/api/user';
import { useAuth } from './AuthContext';
import { UserProfile, LoggedInUser } from '@/types';

type UserProfileContextType = {
  userProfile: UserProfile | null;
  updateProfile: (profile: UserProfile) => void;
  user: LoggedInUser | null;
  loading: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserProfile(user.id, user.accessToken)
        .then((res) => {
          setUserProfile(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const value = {
    userProfile,
    updateProfile,
    user,
    loading,
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === null) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
