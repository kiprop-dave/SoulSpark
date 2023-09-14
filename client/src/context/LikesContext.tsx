import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getUserLikesTeaser, LikesTeaserResponse } from '@/api/likes';

type LikesTeaserContextType = {
  likesTeaser: LikesTeaserResponse;
  loading: boolean;
};

const LikesTeaserContext = createContext<LikesTeaserContextType | null>(null);

export function LikesTeaserProvider({ children }: { children: React.ReactNode }) {
  const [likesTeaser, setLikesTeaser] = useState<LikesTeaserResponse>({
    likes: 0,
    latestLike: {
      first_name: '',
      randomImage: '',
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserLikesTeaser(user.accessToken).then((res) => {
        if (res.status === 'success') {
          setLikesTeaser(res.data);
          setLoading(false);
        }
      });
    }
  }, []);

  const value: LikesTeaserContextType = {
    likesTeaser,
    loading,
  };

  return <LikesTeaserContext.Provider value={value}>{children}</LikesTeaserContext.Provider>;
}

export function useLikesTeaser() {
  const context = useContext(LikesTeaserContext);
  if (context === null) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}
