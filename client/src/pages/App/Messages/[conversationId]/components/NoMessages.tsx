import { useMemo } from 'react';
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import UserAvatar from '@/pages/App/components/UserAvatar';

type NoMessageProps = {
  matchDate: Date;
  name: string;
  profilePic: string;
};

export default function NoMessages({ matchDate, name, profilePic }: NoMessageProps): JSX.Element {
  const timeSinceMatch = useMemo(() => {
    const current = new Date();
    const diff = [
      [differenceInYears(current, matchDate), 'Year'],
      [differenceInMonths(current, matchDate), 'Month'],
      [differenceInWeeks(current, matchDate), 'Week'],
      [differenceInDays(current, matchDate), 'Day'],
      [differenceInHours(current, matchDate), 'Hour'],
      [differenceInMinutes(current, matchDate), 'Minute'],
      [differenceInSeconds(current, matchDate), 'Second'],
    ];
    for (let i = 0; i < diff.length; i++) {
      if (Number(diff[i][0]) > 1) return `${diff[i][0]} ${diff[i][1]}s ago`;
      if (Number(diff[i][0]) === 1) return `${diff[i][0]} ${diff[i][1]} ago`;
    }
    return 'Now';
  }, [matchDate]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <p className="text-black dark:text-white text-lg">
        You matched with <span className="font-bold text-xl">{name}</span>
      </p>
      <p className="text-black dark:text-white text-lg">{timeSinceMatch}</p>
      <div className="w-44 h-44">
        <UserAvatar imageSrc={profilePic} isBlurred={false} />
      </div>
    </div>
  );
}
