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
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);

  const currentImage = useMemo(() => images[index], [index, images]);

  useEffect(() => {
    let objectUrl: string | null = null;
    fetch(currentImage.url).then((res) =>
      res.blob().then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        setLoading(false);
      })
    );

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentImage.url]);

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
          <ImageView src={imageSrc} loading={loading} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

function ImageView({ src, loading }: { src: string; loading: boolean }): JSX.Element {
  console.log(loading);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p
        className={clsx('text-2xl', {
          hidden: !loading,
        })}
      >
        Loading...
      </p>
      {!loading && src.length > 0 && (
        <img src={src} alt="user image" className="w-full h-full object-cover rounded-lg" />
      )}
    </div>
  );
}
