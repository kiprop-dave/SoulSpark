import clsx from 'clsx';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Image } from '@/types';
import { useImagesCarousel } from '@/hooks/useImagesCarousel';
import { useState } from 'react';

interface ImagesCarouselProps {
  images: Image[];
}

export function ImagesCarousel({ images }: ImagesCarouselProps): JSX.Element {
  const { currentIndex, nextImage, previousImage, atStart, atEnd } = useImagesCarousel(
    images.length
  );
  const [hovered, setHovered] = useState(false);

  const currentImage = images[currentIndex];

  return (
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
                'bg-white': i === currentIndex,
                'bg-slate-600': i !== currentIndex,
              })}
            />
          );
        })}
      </div>
      <div className="w-full h-full flex items-center absolute top-1">
        <button type="button" className="h-[96%] w-[48%]" onClick={previousImage}>
          <IoChevronBack
            className={clsx('text-3xl', {
              hidden: atStart || !hovered,
            })}
          />
        </button>
        <button
          type="button"
          className="h-[96%] w-[48%] ml-2 flex items-center justify-end"
          onClick={nextImage}
        >
          <IoChevronForward
            className={clsx('text-3xl', {
              hidden: atEnd || !hovered,
            })}
          />
        </button>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <ImageView image={currentImage.url} />
      </div>
    </div>
  );
}

function ImageView({ image }: { image: string }): JSX.Element {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p
        className={clsx('text-2xl', {
          hidden: !loading,
        })}
      >
        Loading...
      </p>
      <img
        onLoad={() => setLoading(false)}
        src={image}
        alt="user image"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
}
