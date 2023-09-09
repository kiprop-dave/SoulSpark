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
          'h-4 w-4 border-4': size === 'sm',
          'h-5 w-5 border-8': size === 'md',
          'h-6 w-6 border-8': size === 'lg',
          'h-8 w-8 border-8': size === 'xl',
        }
      )}
    />
  );
}
