import { useMemo, useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Message, User } from '@/api/conversations';
import UserAvatar from '@/pages/App/components/UserAvatar';

type ConversationBodyProps = {
  messages: Message[];
  otherUser: User;
};

export default function ConversationBody({
  messages,
  otherUser,
}: ConversationBodyProps): JSX.Element {
  const orderedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages.length]);

  const viewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="w-full h-full flex flex-col gap-2 py-2 overflow-y-scroll no-scrollbar">
      {orderedMessages.map((msg) => {
        return (
          <div
            key={msg.id}
            className={clsx('w-full flex items-center px-2', {
              'justify-start': msg.senderId === otherUser.id,
              'justify-end': msg.senderId !== otherUser.id,
            })}
          >
            <MessageContent message={msg} otherUser={otherUser} />
          </div>
        );
      })}
      <div ref={viewRef} className="w-full h-1" />
    </div>
  );
}

type MessageContentProps = {
  message: Message;
  otherUser: User;
};
function MessageContent({ message, otherUser }: MessageContentProps): JSX.Element {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {message.senderId === otherUser.id && (
        <div className="w-10 h-10 lg:w-12 lg:h-12">
          <UserAvatar imageSrc={otherUser.images[0].secure_url} isBlurred={false} />
        </div>
      )}
      {!!message.text && (
        <div
          className={clsx('max-w-[75%] lg:max-w-[55%] items-center', {
            'flex flex-row-reverse': message.senderId !== otherUser.id,
            'flex flex-row': message.senderId === otherUser.id,
          })}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={clsx('p-2 max-w-[20rem] rounded-t-2xl cursor-default', {
              'ml-2 bg-gray-200 text-black rounded-br-2xl rounded-bl-sm dark:bg-neutral-700 dark:text-white':
                message.senderId === otherUser.id,
              'bg-blue-500 rounded-bl-2xl rounded-br-sm': message.senderId !== otherUser.id,
            })}
          >
            <p>{message.text}</p>
          </div>
          {hovered && (
            <p
              className={clsx('text-xs text-gray-500 dark:text-gray-400', {
                'ml-2': message.senderId === otherUser.id,
                'mr-2': message.senderId !== otherUser.id,
              })}
            >
              {format(message.createdAt, 'dd/MM/yyyy HH:mm')}
            </p>
          )}
        </div>
      )}
      {(!!message.attachment || !!message.gifUrl) && (
        <div className="w-40 h-40 rounded-xl">
          <img
            src={
              !!message.attachment
                ? message.attachment.secure_url
                : !!message.gifUrl
                ? message.gifUrl
                : undefined
            }
            alt="attachment"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      )}
    </>
  );
}
