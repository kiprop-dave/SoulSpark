import { IoChevronBack } from 'react-icons/io5';
import clsx from 'clsx';

type CenterTabProps = {
  nextStep: () => void;
  prevStep: () => void;
};

type FirstTabProps = {
  nextStep: () => void;
};

type LastTabProps = {
  prevStep: () => void;
};

type ProfileNavigationProps = CenterTabProps | FirstTabProps | LastTabProps;

export default function ProfileNavigation(props: ProfileNavigationProps): JSX.Element {
  return (
    <div
      className={clsx('w-full flex items-center', {
        'justify-start': 'prevStep' in props,
        'justify-end': !('prevStep' in props),
        'justify-between': 'prevStep' in props && 'nextStep' in props,
      })}
    >
      {'prevStep' in props && (
        <button
          onClick={() => props.prevStep()}
          type="button"
          className="flex items-center justify-center w-[40px] h-[40px] rounded-sm border border-slate-300"
        >
          <IoChevronBack className="w-6 h-6 text-red-500" />
        </button>
      )}
      {'nextStep' in props && (
        <button onClick={() => props.nextStep()} className="text-red-500 font-bold" type="button">
          Skip
        </button>
      )}
    </div>
  );
}
