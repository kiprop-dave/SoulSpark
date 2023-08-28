import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getUserLikesNumber } from '@/api/likes';

type LikesNumberContextType = {
  numberOfLikes: number;
  loading: boolean;
};

const LikesNumberContext = createContext<LikesNumberContextType | null>(null);

export function LikesNumberProvider({ children }: { children: React.ReactNode }) {
  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserLikesNumber(user.accessToken).then((res) => {
        if (res.status === 'success') {
          setNumberOfLikes(res.data.likes);
          setLoading(false);
        }
      });
    }
  }, []);

  const value: LikesNumberContextType = {
    numberOfLikes,
    loading,
  };

  return <LikesNumberContext.Provider value={value}>{children}</LikesNumberContext.Provider>;
}

export function useLikesNumber() {
  const context = useContext(LikesNumberContext);
  if (context === null) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}
