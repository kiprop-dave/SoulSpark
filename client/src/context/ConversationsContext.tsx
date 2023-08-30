import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getConversations, Conversation } from '@/api/conversations';

type ConversationContextType = {
  conversations: Conversation[];
  isLoading: boolean;
};

export const ConversationsContext = createContext<ConversationContextType | null>(null);

export function ConversationsContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { user } = useAuth();
  const [initialConversations, setInitialConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      getConversations(user.accessToken).then((res) => {
        if (res.status === 'success') {
          setInitialConversations(res.data);
          setIsLoading(false);
        }
      });
    }
  }, []);

  console.log(initialConversations);

  const values: ConversationContextType = {
    conversations: initialConversations,
    isLoading,
  };

  return <ConversationsContext.Provider value={values}>{children}</ConversationsContext.Provider>;
}

export function useConversations(): ConversationContextType {
  const context = useContext(ConversationsContext);

  if (context === null) {
    throw new Error('useConversations must be used within a ConversationsContextProvider');
  }

  return context;
}
