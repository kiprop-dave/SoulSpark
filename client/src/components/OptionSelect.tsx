import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface OptionSelectProps {
  option: string;
  selectOption: (property: string, option: string) => void;
  isSelected?: boolean;
  property: string;
  isMulti?: boolean;
}

export default function OptionSelect({
  option,
  selectOption,
  isSelected,
  property,
  isMulti = false,
}: OptionSelectProps): JSX.Element {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (isSelected !== undefined) setSelected(isSelected);
  }, [isSelected]);

  const handleSelect = () => {
    setSelected(!selected);
    if (isMulti) {
      selectOption(property, option);
    } else {
      if (selected) selectOption(property, '');
      else selectOption(property, option);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={clsx(
        'flex items-center justify-center px-2 py-1 rounded-xl border border-slate-300 cursor-pointer text-[6px] h-8',
        {
          'bg-red-500 text-white': selected,
          'text-slate-800': !selected,
        }
      )}
    >
      <p className="text-sm font-bold">{option}</p>
    </div>
  );
}
