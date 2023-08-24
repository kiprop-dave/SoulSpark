import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Image } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ImagesCarouselProps {
  images: Image[];
  index: number;
  next: () => void;
  previous: () => void;
  atStart: boolean;
  atEnd: boolean;
}

export function ImagesCarousel({
  images,
  index,
  next,
  previous,
  atStart,
  atEnd,
}: ImagesCarouselProps): JSX.Element {
  const [hovered, setHovered] = useState(false);

  const currentImage = useMemo(() => images[index], [index, images]);

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <div
        className="w-full h-full rounded-lg relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="w-[98%] h-[5px] flex items-center justify-between rounded-sm absolute top-2">
          {images.map((_, i) => {
            return (
              <div
                key={i}
                className={clsx('h-full rounded-sm w-full mx-1', {
                  'bg-white': i === index,
                  'bg-slate-600': i !== index,
                })}
              />
            );
          })}
        </div>
        <div className="w-full h-full flex items-center absolute top-1">
          <button type="button" className="h-[96%] w-[48%]" onClick={previous}>
            <IoChevronBack
              className={clsx('text-3xl', {
                hidden: atStart || !hovered,
              })}
            />
          </button>
          <button
            type="button"
            className="h-[96%] w-[48%] ml-2 flex items-center justify-end"
            onClick={next}
          >
            <IoChevronForward
              className={clsx('text-3xl', {
                hidden: atEnd || !hovered,
              })}
            />
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <ImageView src={currentImage.secure_url} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

function ImageView({ src }: { src: string }): JSX.Element {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImageSrc(src);
  }, [src]);


  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={clsx('w-12 h-12 border-8 border-t-red-500 border-l-red-500 border-b-red-500 border-r-white rounded-full animate-spin', {
          hidden: !loading
        })}
      >
      </div>

      <img src={imageSrc} alt="user image" className={clsx("w-full h-full object-cover rounded-lg transition-opacity duration-300", {
        hidden: loading,
        'opacity-0': loading,
        'opacity-100': !loading
      })}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
