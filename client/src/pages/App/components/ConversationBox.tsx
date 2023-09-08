import { useMemo } from 'react';
import clsx from 'clsx';
import { Link } from '@tanstack/router';
import { format, differenceInHours } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Conversation } from '@/api/conversations';
import UserAvatar from './UserAvatar';

type ConversationBoxProps = {
  conversation: Conversation;
};

export default function ConversationBox({ conversation }: ConversationBoxProps): JSX.Element {
  const { user } = useAuth();
  const otherUser = conversation.participants.find((u) => u.id !== user?.id)!;
  const latestMessage = conversation.messages.at(0)!;

  const unseenMessages = useMemo(() => {
    return conversation.messages.reduce((acc, curr) => {
      if (curr.seenBy.includes(user?.id!)) return acc;
      return acc + 1;
    }, 0);
  }, [conversation, user?.id]);

  const date =
    differenceInHours(new Date(), new Date(latestMessage.createdAt)) > 24
      ? format(new Date(latestMessage.createdAt), 'dd/MM/yyyy')
      : format(new Date(latestMessage.createdAt), 'HH:mm');

  return (
    <Link
      to="/app/messages/$conversationId"
      params={{ conversationId: conversation.id }}
      from="/app/messages"
      className="w-full h-full flex items-center justify-center py-1"
    >
      <div className="h-14 w-14">
        <UserAvatar imageSrc={otherUser.images[0].secure_url} isBlurred={false} />
      </div>
      <div className="flex-1 h-full ml-2 overflow-hidden">
        <div className="h-1/2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
            {otherUser.first_name}
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm">{date}</p>
        </div>
        <div className="h-1/2 flex items-center overflow-hidden justify-between">
          <div className="w-5/6 h-full">
            <p className="text-slate-500 dark:text-gray-400 truncate">
              {latestMessage.senderId === user?.id ? 'You: ' : ''}
              {!!latestMessage.text
                ? latestMessage.text
                : !!latestMessage.attachment
                ? 'Sent an image'
                : 'Sent a gif'}
            </p>
          </div>
          <div className="flex-1 h-full flex items-center justify-end pr-2">
            <div
              className={clsx('w-5 h-5 rounded-full bg-red-500 flex items-center justify-center', {
                hidden: unseenMessages === 0,
              })}
            >
              <p className="text-xs text-white">{unseenMessages}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
