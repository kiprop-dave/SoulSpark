import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getPossibleMatches, likeMatch, dislikeMatch } from '@/api/matches';
import { PossibleMatch } from '@/types';

type UserAction = { action: 'like' | 'dislike'; userId: string };

type PossibleMatchesContextType = {
  possibleMatches: PossibleMatch[];
  index: number;
  atEnd: boolean;
  next: (action: UserAction) => void;
};

export const PossibleMatchesContext = createContext<PossibleMatchesContextType | null>(null);

export const PossibleMatchesProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { user } = useAuth();
  const [possibleMatches, setPossibleMatches] = useState<PossibleMatch[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [_, setIsMatch] = useState<boolean>(false);

  // TODO:Add a way to reset the index and array of possible matches
  useEffect(() => {
    if (possibleMatches.length - index <= 3) {
      // The user is running out of possible matches, so we need to fetch more. This is done in the background before the user reaches the end of the list
      // User is guaranteed to be defined here since this context is called as a child of AuthContext
      if (!user) return;
      getPossibleMatches(user.accessToken).then((matches) => {
        if (matches.status === 'success') {
          setPossibleMatches((prev) => [...prev, ...matches.data]);
        }
      });
    } else {
      return;
    }
  }, [index]);

  const atEnd = possibleMatches.length === index;

  const next = (action: UserAction) => {
    if (!user) return;
    if (action.action === 'like') {
      // Send a request to the server to like the user
      likeMatch(user.accessToken, action.userId).then((result) => {
        if (result.status === 'success') {
          setIsMatch(result.data.isMatch);
        }
      });
    } else {
      // Send a request to the server to dislike the user
      // We don't care about the result of this request since it doesn't affect the UI. The server handles all the logic
      dislikeMatch(user?.accessToken!, action.userId);
    }
    setIndex((prev) => prev + 1);
  };

  const values: PossibleMatchesContextType = {
    possibleMatches,
    index,
    atEnd,
    next,
  };

  return (
    <PossibleMatchesContext.Provider value={values}>{children}</PossibleMatchesContext.Provider>
  );
};

export const usePossibleMatches = () => {
  const context = useContext(PossibleMatchesContext);
  if (context === null) {
    throw new Error('usePossibleMatches must be used within a PossibleMatchesProvider');
  }
  return context;
};
