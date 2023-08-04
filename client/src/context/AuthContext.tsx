import { createContext, useEffect, useState, useContext } from 'react';
import { LoggedInUser } from '@/types';
import { getLoggedInUser } from '@/api/user';

type AuthContextType = {
  user: LoggedInUser | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    getLoggedInUser().then((user) => setUser(user));
  }, []);

  // console.log(user);

  const contextValue = {
    user,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
