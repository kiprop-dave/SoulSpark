import { useState } from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

type ImageComponentProps = {
  imageSrc: string;
  isBlurred: boolean;
};

export default function ImageComponent({ imageSrc, isBlurred }: ImageComponentProps): JSX.Element {
  const [loading, setLoading] = useState(true);

  return (
    <div className={clsx('w-full h-full flex items-center justify-center')}>
      <div
        className={clsx('', {
          hidden: !loading,
        })}
      >
        <Spinner size="sm" />
      </div>
      <div
        className={clsx('w-full h-full relative', {
          hidden: loading,
        })}
      >
        <img
          src={imageSrc}
          alt="profile image"
          className={clsx('w-full h-full object-cover transition-opacity duration-300', {
            'opacity-0': loading,
            'opacity-100': !loading,
          })}
          onLoad={() => setLoading(false)}
        />
        <div
          className={clsx('absolute w-full h-full z-50 top-0', {
            'backdrop-filter backdrop-blur-md': isBlurred,
          })}
        />
      </div>
    </div>
  );
}
