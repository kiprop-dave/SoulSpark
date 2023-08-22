import { useRef, useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import {
  BiSolidDownArrowSquare,
  BiSolidUpArrowSquare,
  BiSolidLeftArrowSquare,
  BiSolidRightArrowSquare,
  BiSpaceBar,
} from 'react-icons/bi';
import { ImCross } from 'react-icons/im';
import { AiFillHeart } from 'react-icons/ai';
import { usePossibleMatches } from '@/context/PossibleMatchesContext';
import { useImagesCarousel } from '@/hooks/useImagesCarousel';
import { ImagesCarousel } from './ImagesCarousel';
import { NameAge } from './UserInfo';

interface SwipeProps {}

export function Swipe({}: SwipeProps): JSX.Element {
  const [showControls, setShowControls] = useState<boolean>(true);
  //const [isMatch, setIsMatch] = useState<boolean>(false);
  const swipeRef = useRef<HTMLDivElement | null>(null);
  const { next, possibleMatches, atEnd, index } = usePossibleMatches();

  const currentMatch = useMemo(() => possibleMatches[index], [index, possibleMatches]);

  const {
    currentIndex,
    nextImage,
    previousImage,
    atStart,
    atEnd: end,
    reset,
  } = useImagesCarousel(currentMatch?.profile.personalInfo.images?.length || 0);

  useEffect(() => {
    const swipe = swipeRef.current;
    if (swipe) {
      swipe.focus();
    }
  }, []);

  const keyboardControls = useMemo(
    () => [
      {
        icon: BiSolidLeftArrowSquare,
        text: 'Nope',
      },
      {
        icon: BiSolidRightArrowSquare,
        text: 'Like',
      },
      {
        icon: BiSolidUpArrowSquare,
        text: 'Open Profile',
      },
      {
        icon: BiSolidDownArrowSquare,
        text: 'Close Profile',
      },
      {
        icon: BiSpaceBar,
        text: 'Next Photo',
      },
    ],
    []
  );

  const dislikeHandler = () => {
    next({ action: 'dislike', userId: currentMatch.userId });
  };

  const likeHandler = () => {
    next({ action: 'like', userId: currentMatch.userId });
    reset();
  };

  const clickControls = useMemo(
    () => [
      {
        icon: ImCross,
        color: 'red',
        text: 'dislike',
        onClick: () => dislikeHandler(),
      },
      {
        icon: AiFillHeart,
        color: 'green',
        text: 'like',
        onClick: () => likeHandler(),
      },
    ],
    [index, possibleMatches]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //Prevent native handlers from firing
    e.preventDefault();

    switch (e.key) {
      case 'ArrowLeft':
        //Swipe left;
        dislikeHandler();
        break;
      case 'ArrowRight':
        //Swipe right;
        likeHandler();
        break;
      case 'ArrowUp':
        //Open profile;
        break;
      case 'ArrowDown':
        //Close profile;
        break;
      case ' ':
        //Next photo;

        break;
      default:
        break;
    }
  };

  if (atEnd)
    return <div className="w-full h-full flex items-center justify-center">No more matches</div>;

  return (
    <div
      className="w-full h-full flex flex-col items-center md:pt-1"
      onKeyDown={handleKeyPress}
      tabIndex={0}
      ref={swipeRef}
    >
      <div className="w-full md:w-[38%] h-full rounded-xl md:h-[92%] md:shadow-lg md:shadow-slate-300 dark:bg-neutral-800 dark:shadow-black">
        <div className="w-full h-[85%] relative">
          <ImagesCarousel
            images={currentMatch.profile.personalInfo.images}
            index={currentIndex}
            next={nextImage}
            previous={previousImage}
            atStart={atStart}
            atEnd={end}
          />
          <div className="absolute bottom-3 left-2">
            <NameAge
              first_name={currentMatch.profile.personalInfo.first_name}
              dateOfBirth={currentMatch.profile.personalInfo.dateOfBirth}
            />
          </div>
        </div>
        <div className="w-full h-[15%] rounded-b-xl bg-neutral-950 flex items-center justify-evenly">
          {clickControls.map(({ icon: Icon, text, color, onClick }, i) => {
            return (
              <button
                key={i}
                type="button"
                onClick={() => onClick()}
                className={clsx(`text-3xl border rounded-full p-4`, {
                  'border-red-500 text-red-500': color === 'red',
                  'border-green-500 text-green-500': color === 'green',
                })}
              >
                <p className="sr-only">{text}</p>
                <Icon
                  className={clsx('transform transition-transform hover:scale-110', {
                    'text-red-500': color === 'red',
                    'text-green-500': color === 'green',
                  })}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center w-full h-10 mt-auto">
        <button
          type="button"
          onClick={() => setShowControls(!showControls)}
          className="bg-slate-700 text-white font-semibold text-sm px-3 py-1 rounded-2xl hover:bg-slate-900 w-16"
        >
          {showControls === true ? 'Hide' : 'Show'}
        </button>
        {showControls && (
          <div className="flex items-center gap-4 ml-2">
            {keyboardControls.map(({ icon: Icon, text }, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center gap-1 text-slate-800 h-10 dark:text-slate-300"
                >
                  <Icon />
                  <p className="font-semibold tracking-wider">{text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
