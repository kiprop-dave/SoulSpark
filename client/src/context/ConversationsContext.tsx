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
  conversationsStatus: 'resolved' | 'loading' | 'error';
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
  const [conversationsStatus, setConversationsStatus] = useState<'resolved' | 'loading' | 'error'>(
    'loading'
  );

  const channel = useMemo(() => {
    return user?.id;
  }, [user]);

  const updateConversationWithOrder = (msg: MessagePosted) => {
    setInitialConversations((prev) => {
      let updatedConversation = prev.find((conv) => {
        return conv.id === msg.conversationId;
      });
      if (!updatedConversation) return prev;
      updatedConversation.messages = [msg, ...updatedConversation.messages];
      const filteredConversations = prev.filter((conv) => conv.id !== msg.conversationId);
      filteredConversations.unshift(updatedConversation);
      return filteredConversations;
    });
  };

  useEffect(() => {
    if (user) {
      getConversations(user.accessToken).then((res) => {
        if (res.status === 'success') {
          setInitialConversations(res.data);
          setConversationsStatus('resolved');
        } else {
          setConversationsStatus('error');
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
      updateConversationWithOrder(data);
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
        updateConversationWithOrder(res.data);
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
    conversationsStatus,
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
