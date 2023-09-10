import clsx from 'clsx';

type SpinnerProps = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export default function Spinner({ size }: SpinnerProps): JSX.Element {
  return (
    <div
      className={clsx(
        'border-t-red-500 border-l-red-500 border-b-red-500 border-r-white rounded-full animate-spin',
        {
          'h-3 w-3 border-2': size === 'xs',
          'h-[2rem] w-[2rem] border-2': size === 'sm',
          'h-[3rem] w-[3rem] border-4': size === 'md',
          'h-[4rem] w-[4rem] border-8': size === 'lg',
          'h-[5rem] w-[5rem] border-8': size === 'xl',
        }
      )}
    />
  );
}
