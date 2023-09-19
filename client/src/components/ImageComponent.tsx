import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

type ImageComponentProps = {
  imageSrc: string;
  isBlurred: boolean;
  rounded: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'none';
};

export default function ImageComponent({
  imageSrc,
  isBlurred,
  rounded,
}: ImageComponentProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const src = useMemo(() => {
    return imageSrc.split('upload/').join('upload/w_500,f_auto,q_auto/');
  }, [imageSrc]);

  const roundedCn = useMemo(() => {
    return clsx({
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'rounded-2xl': rounded === '2xl',
      'rounded-3xl': rounded === '3xl',
      'rounded-full': rounded === 'full',
      'rounded-none': rounded === 'none',
    });
  }, [rounded]);

  return (
    <div
      className={clsx('w-full h-full flex items-center justify-center', {
        [roundedCn]: roundedCn,
      })}
    >
      <div
        className={clsx('', {
          hidden: !loading,
        })}
      >
        <Spinner size="sm" />
      </div>
      <div
        className={clsx('w-full h-full relative rounded', {
          hidden: loading,
        })}
      >
        <img
          src={src}
          alt="profile image"
          className={clsx('w-full h-full object-cover transition-opacity duration-300', {
            'opacity-0': loading,
            'opacity-100': !loading,
            [roundedCn]: roundedCn,
          })}
          onLoad={() => setLoading(false)}
        />
        <div
          className={clsx('absolute w-full h-full z-50 top-0 rounded', {
            'backdrop-filter backdrop-blur-md': isBlurred,
            [roundedCn]: roundedCn,
          })}
        />
      </div>
    </div>
  );
}
