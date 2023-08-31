import clsx from 'clsx';
import { Link } from '@tanstack/router';
import { useLikesTeaser } from '@/context/LikesContext';
import UserAvatar from './UserAvatar';

interface MessageListProps {}

export function MessagesList({}: MessageListProps): JSX.Element {
  const { likesTeaser, loading } = useLikesTeaser();
  const { likes, latestLike } = likesTeaser;
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
          <UserAvatar isBlurred={true} />
        </div>
        <div className="h-2/3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
            {latestLike.first_name}
            <span className="font-semibold text-sm ml-2 p-1 bg-red-500 text-black">Likes you</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Match Now!</p>
        </div>
      </Link>
      {new Array(10).fill(0).map((_, i) => {
        return (
          <div key={i} className="w-full border-b border-b-slate-300 h-20 dark:border-b-gray-700">
            Conversation {i}
          </div>
        );
      })}
    </section>
  );
}
