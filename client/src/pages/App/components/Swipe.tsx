import { useRef, useEffect, useState, useMemo } from 'react';
import {
  BiSolidDownArrowSquare,
  BiSolidUpArrowSquare,
  BiSolidLeftArrowSquare,
  BiSolidRightArrowSquare,
  BiSpaceBar,
} from 'react-icons/bi';

interface SwipeProps {}

export function Swipe({}: SwipeProps): JSX.Element {
  const [showControls, setShowControls] = useState<boolean>(true);
  const swipeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const swipe = swipeRef.current;
    if (swipe) {
      swipe.focus();
    }
  }, []);

  const swipeControls = useMemo(
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e.key);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center md:pt-1"
      onKeyDown={handleKeyPress}
      tabIndex={0}
      ref={swipeRef}
    >
      <div className="w-full md:w-[38%] h-full rounded-xl md:h-[92%] md:shadow md:shadow-black">
        Profile
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
            {swipeControls.map(({ icon: Icon, text }, i) => {
              return (
                <div key={i} className="flex items-center gap-1 text-slate-800 h-10">
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
