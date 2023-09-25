/* This file is used to create a context for the user's matches.
 */

import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getMatches } from '@/api/matches';
import { Match } from '@/types';
import { pusherClient } from '@/lib/pusher';

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

  const addMatch = (match: Match) => {
    setMatches((prevMatches) => [...prevMatches, match]);
  };

  // Used to remove a match from the list of matches. This happens when the user starts a new conversation with the match.
  // const removeMatch = (matchId: string) => {
  //   setMatches((prevMatches) => prevMatches.filter((match) => match.userId !== matchId));
  // };

  useEffect(() => {
    if (user) {
      const channel = pusherClient.subscribe('matches');
      channel.bind(`new-match-${user.id}`, (data: Match) => {
        addMatch(data);
      });

      return () => {
        pusherClient.unsubscribe('matches');
        channel.unbind_all();
      };
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
