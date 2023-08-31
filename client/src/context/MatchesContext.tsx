/* This file is used to create a context for the user's matches.
 */

import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getMatches } from '@/api/matches';
import { Match } from '@/types';

type MatchesContextType = {
  matches: Match[];
  loadingMatches: boolean;
};

const MatchesContext = createContext<MatchesContextType | null>(null);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getMatches(user.accessToken).then((res) => {
        if (res.status === 'success') {
          setMatches(res.data);
          setLoadingMatches(false);
        }
      });
    }
  }, []);

  const value: MatchesContextType = {
    matches,
    loadingMatches,
  };

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === null) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
}
