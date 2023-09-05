import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  getConversations,
  Conversation,
  postMessage,
  PostMessageInput,
  MessagePosted,
  markMessagesSeen,
} from '@/api/conversations';
import { pusherClient } from '@/lib/pusher';

type ConversationContextType = {
  conversations: Conversation[];
  isLoading: boolean;
  sendMessage: (conversationId: string, message: PostMessageInput) => void;
  markMessagesAsSeen: (conversationId: string) => void;
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

  const channel = useMemo(() => {
    return user?.id;
  }, [user]);

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

  useEffect(() => {
    if (!channel) return;
    pusherClient.subscribe(`private-user-${channel}`);

    const newConversationHandler = (data: Conversation) => {
      setInitialConversations((prev) => {
        return [data, ...prev];
      });
    };

    const newMessageHandler = (data: MessagePosted) => {
      setInitialConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation.id === data.conversationId) {
            return {
              ...conversation,
              messages: [data, ...conversation.messages],
            };
          }
          return conversation;
        });
      });
    };

    const deleteConversationHandler = (id: string) => {
      setInitialConversations((prev) => {
        return prev.filter((conversation) => conversation.id !== id);
      });
    };

    pusherClient.bind('new-conversation', newConversationHandler);
    pusherClient.bind('new-message', newMessageHandler);
    pusherClient.bind('delete-conversation', deleteConversationHandler);

    return () => {
      pusherClient.unbind('new-conversation', newConversationHandler);
      pusherClient.unbind('new-message', newMessageHandler);
      pusherClient.unbind('delete-conversation', deleteConversationHandler);
      pusherClient.unsubscribe(channel);
    };
  }, [channel]);

  const sendMessage = (conversationId: string, message: PostMessageInput) => {
    if (!user) return;
    postMessage(user.accessToken, conversationId, message).then((res) => {
      //TODO:Create some form of optimistic update
      if (res.status === 'success') {
        setInitialConversations((prev) => {
          return prev.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: [res.data, ...conversation.messages],
              };
            }
            return conversation;
          });
        });
      }
    });
  };

  const markMessagesAsSeen = (conversationId: string) => {
    if (!user) return;
    const conversation = initialConversations.find(
      (conversation) => conversation.id === conversationId
    );
    if (!conversation) return;
    const messages = conversation.messages
      .filter((msg) => !msg.seenBy.includes(user.id))
      .map((msg) => msg.id);
    if (messages.length === 0) return;
    markMessagesSeen(user.accessToken, messages).then((res) => {
      if (res.status === 'success') {
        setInitialConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.seenBy.includes(user.id) ? msg : { ...msg, seenBy: [...msg.seenBy, user.id] }
                ),
              };
            }
            return conv;
          })
        );
      }
    });
  };

  const values: ConversationContextType = {
    conversations: initialConversations,
    isLoading,
    sendMessage,
    markMessagesAsSeen,
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
