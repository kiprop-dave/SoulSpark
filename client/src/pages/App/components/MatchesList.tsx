import { useState } from 'react';
import clsx from 'clsx';
import { Link } from '@tanstack/router';
import { useLikesTeaser } from '@/context/LikesContext';
import { useMatches } from '@/context/MatchesContext';
import { Match as MatchType } from '@/types';
import ImageComponent from '@/components/ImageComponent';

export function MatchesList(): JSX.Element {
  const { likesTeaser, loading } = useLikesTeaser();
  const { likes, latestLike } = likesTeaser;
  const { matches } = useMatches();

  if (likes === 0 && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full md:h-[92%]">
        <p className="text-xl font-bold text-center text-gray-500">
          No new matches yet. <br />
          Keep swiping!
        </p>
      </div>
    );
  }
  return (
    <section className="flex gap-4 p-2 w-full overflow-scroll no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 lg:gap-6 md:h-[92%]">
      <Link
        to="/app/likes"
        from="/app/messages"
        className={clsx(
          'flex items-center justify-center p-1 ring ring-orange-400 h-32 rounded relative min-w-[6rem] md:w-auto',
          {
            hidden: loading || likes === 0,
          }
        )}
      >
        <div className="absolute top-0 h-full w-full">
          <ImageComponent imageSrc={latestLike.randomImage} isBlurred={true} />
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner bg-orange-400 z-50">
          <span className="text-xl font-bold">{likes}</span>
        </div>
        <div className="absolute flex bottom-1 left-2 z-50">
          <p className="text-sm font-bold text-center text-white">
            {likes === 1 ? `${likes} Like` : `${likes} Likes`}
          </p>
        </div>
      </Link>
      {matches.map((match, i) => {
        return <Match key={i} match={match} />;
      })}
    </section>
  );
}

interface MatchProps {
  match: MatchType;
}

function Match({ match }: MatchProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const image = match.profile.personalInfo.images[0].secure_url;
  const to = match.conversationId;

  return (
    <Link
      to="/app/messages/$conversationId"
      from="/app/messages"
      params={{ conversationId: to }}
      preload="intent" // start loading when the user hovers over the link
      className="flex flex-col items-center justify-center w-12 h-32 rounded min-w-[5rem] md:w-auto transform transition-transform hover:scale-105"
    >
      <div
        className={clsx(
          'w-5 h-5 border-4 border-t-red-500 border-l-red-500 border-b-red-500 border-r-white rounded-full animate-spin',
          {
            hidden: !loading,
          }
        )}
      />
      <img
        src={image}
        alt="profile image"
        className={clsx('w-full h-full object-cover rounded-lg transition-opacity duration-300', {
          hidden: loading,
          'opacity-0': loading,
          'opacity-100': !loading,
        })}
        onLoad={() => setLoading(false)}
      />
    </Link>
  );
}
