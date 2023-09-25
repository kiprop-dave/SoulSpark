import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from '@tanstack/router';
//import clsx from 'clsx';
import { AiFillHeart } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import { BsFilter } from 'react-icons/bs';
import { Image, PossibleMatch } from '@/types';
import { getPremiumLikes, getFreeLikes } from '@/api/likes';
import { useLikesTeaser } from '@/context/LikesContext';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import Teaser from './components/Teaser';

type LikesProfile =
  | { accountType: 'Free'; images: Pick<Image, 'secure_url'>[] }
  | { accountType: 'Premium'; likes: PossibleMatch[] };

export default function LikesPage(): JSX.Element {
  const {
    likesTeaser: { likes },
    loading,
  } = useLikesTeaser();
  const { user } = useAuth();
  const [_, setFilterModalOpen] = useState(false);
  const [likesProfiles, setLikesProfiles] = useState<LikesProfile>({
    accountType: 'Free',
    images: [],
  });
  const intersectionRef = useRef<HTMLDivElement>(null);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (loading || !user) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('intersecting');
      }
    });
  };

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(handleIntersection, options);

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (likes === 0) return;
    if (user?.accountType === 'Premium') {
      getPremiumLikes(user!.accessToken).then((res) => {
        if (res.status === 'success') {
          setLikesProfiles({ accountType: 'Premium', likes: res.data });
        }
      });
    } else if (user?.accountType === 'Free') {
      getFreeLikes(user!.accessToken, likes).then((res) => {
        if (res.status === 'success') {
          setLikesProfiles({ accountType: 'Free', images: res.data });
        }
      });
    }
  }, [likes, user?.accountType]);

  const freeImages = useMemo(() => {
    if (likesProfiles.accountType === 'Free') {
      return likesProfiles.images;
    }
    return [];
  }, [likesProfiles]);

  // const premiumProfiles = useMemo(() => {
  //   if (likesProfiles.accountType === 'Premium') {
  //     return likesProfiles.likes;
  //   }
  //   return [];
  // }, [likesProfiles]);

  const passionFilters = useMemo(() => ['Anime', 'Movies & TV', 'Gaming', 'Sports', 'Music'], []);

  const profileFilters = useMemo(() => ['Has Bio', 'Profile Verified'], []);

  return (
    <section className="w-full h-full flex flex-col items-center bg-white dark:bg-neutral-800 relative">
      <div className="w-full h-[8%] md:h-[14%] border-b border-slate-300 dark:border-gray-700 p-1 md:p-4">
        <div className="w-2/3 ml-auto md:w-full h-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <AiFillHeart className="text-red-500 text-3xl" />
            <p className="text-black dark:text-white text-xl md:text-2xl font-semibold">
              {`${likes} Like${likes > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link to="/app/messages" from="/app/likes" className="mr-2 md:hidden">
            <ImCross className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </Link>
          <div className="hidden md:block mr-2 w-8 h-8 rounded-full p-1 border-2 border-slate-700 dark:border-slate-300 cursor-pointer">
            <Link to="/app/messages" from="/app/likes">
              <ImCross className="w-full h-full text-slate-700 dark:text-slate-300 transform transition-transform duration-200 hover:rotate-90" />
            </Link>
          </div>
        </div>
      </div>
      {likes > 0 ? (
        <div className="w-full md:w-5/6 flex-grow flex flex-col items-center gap-2 overflow-y-scroll no-scrollbar px-2 py-4 md:px-6">
          <div className="w-full h-8 overflow-x-scroll no-scrollbar flex items-center gap-2">
            <Pick onClick={() => setFilterModalOpen(true)}>
              <BsFilter className="w-5 h-5" />
            </Pick>
            {[...passionFilters, ...profileFilters].map((passion, i) => {
              return (
                <Pick key={`${i}${passion}`} onClick={() => {}}>
                  {passion}
                </Pick>
              );
            })}
          </div>
          {user?.accountType === 'Free' && (
            <div className="w-full h-48 flex-grow gap-2 flex flex-col items-center">
              <p className="text-sm md:text-xl font-semibold text-black dark:text-white cursor-default">
                Upgrade to premium to see people who already liked you
              </p>
              <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3">
                {freeImages.map((img, i) => {
                  return <Teaser image={img} key={`${i}${img.secure_url}`} />;
                })}
              </div>
              <div ref={intersectionRef} className="pb-2 w-full h-2 border border-green-900" />
              <button
                type="button"
                onClick={() => {}}
                className="z-50 absolute bottom-4 flex items-center justify-center px-6 py-4 font-semibold h-12 rounded-full bg-red-500 text-white left-1/2 transform -translate-x-1/2"
              >
                See Who Likes You
              </button>
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="w-full flex-grow flex items-center justify-center">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="w-full flex-grow flex items-center justify-center">
          <p className="text-black dark:text-white text-xl font-semibold">
            You have no likes yet. Keep swiping!
          </p>
        </div>
      )}
    </section>
  );
}

type PickProps = {
  children?: React.ReactNode;
  onClick: () => void;
};
function Pick({ onClick, children }: PickProps): JSX.Element {
  return (
    <button
      onClick={() => onClick()}
      type="button"
      className="h-full flex items-center whitespace-nowrap px-4 py-2 rounded-full border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300"
    >
      {children}
    </button>
  );
}
