import { useMemo } from 'react';
import clsx from 'clsx';
import { Link } from '@tanstack/router';
import { useLikesTeaser } from '@/context/LikesContext';
import { useConversations } from '@/context/ConversationsContext';
import UserAvatar from './UserAvatar';
import ConversationBox from './ConversationBox';

interface MessageListProps {}

export function MessagesList({}: MessageListProps): JSX.Element {
  const { likesTeaser, loading } = useLikesTeaser();
  const { likes, latestLike } = likesTeaser;
  const { conversations } = useConversations();

  const realConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      return conversation.messages.length > 0;
    });
  }, [conversations]);

  return (
    <section className="h-[92%] overflow-y-scroll no-scrollbar p-2">
      <Link
        to="/app/likes"
        from="/app/messages"
        className={clsx(
          'w-full flex items-center gap-4 border-b border-b-slate-300 h-20 dark:border-b-gray-700',
          {
            hidden: loading || likes === 0,
          }
        )}
      >
        <div className="w-14 h-14">
          <UserAvatar isBlurred={true} imageSrc={latestLike.randomImage} />
        </div>
        <div className="h-2/3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
            {latestLike.first_name}
            <span className="font-semibold text-sm ml-2 p-1 bg-red-500 text-black">Likes you</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Match Now!</p>
        </div>
      </Link>
      {realConversations.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full md:h-[92%]">
          <p className="text-xl font-bold text-center text-gray-500">
            No new messages yet. <br />
            Start a conversation with one of your matches or keep swiping!
          </p>
        </div>
      )}
      {realConversations.map((conv, i) => {
        return (
          <div key={i} className="w-full border-b border-b-slate-300 h-16 dark:border-b-gray-700">
            <ConversationBox conversation={conv} />
          </div>
        );
      })}
    </section>
  );
}
