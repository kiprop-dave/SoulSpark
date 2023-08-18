import { useState } from 'react';
import clsx from 'clsx';
import { useAppRoutes } from '@/hooks/useAppRoutes';
import { MatchesList } from './MatchesList';
import { MessagesList } from './MessagesList';
import { Settings } from './Settings';

interface SidebarBodyProps { }

type SidebarTab = 'Matches' | 'Messages';

export function SidebarBody({ }: SidebarBodyProps): JSX.Element {
  const { location } = useAppRoutes();

  return (
    <div className="w-full h-[86%] bg-white dark:bg-neutral-800">
      {location === '/profile' || location === '/settings' ? (
        <ProfileSettings />
      ) : (
        <MatchesMessages />
      )}
    </div>
  );
}

interface MatchesMessagesProps { }
function MatchesMessages({ }: MatchesMessagesProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Matches');

  return (
    <>
      <div className="w-full h-[8%] flex items-center">
        <button
          type="button"
          className="w-1/3 h-full flex items-center justify-center"
          onClick={() => setActiveTab('Matches')}
        >
          <span
            className={clsx('font-semibold text-sm dark:text-white', {
              'border-b-2 border-b-red-500': activeTab === 'Matches',
            })}
          >
            Matches
          </span>
        </button>
        <button
          type="button"
          className="w-1/3 h-full flex items-center justify-center ml-4"
          onClick={() => setActiveTab('Messages')}
        >
          <span
            className={clsx('font-semibold text-sm dark:text-white', {
              'border-b-2 border-b-red-500': activeTab === 'Messages',
            })}
          >
            Messages
          </span>
        </button>
      </div>
      {activeTab === 'Matches' ? <MatchesList /> : <MessagesList />}
    </>
  );
}

interface ProfileSettingsProps { }
function ProfileSettings({ }: ProfileSettingsProps): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col bg-slate-100 dark:bg-neutral-950">
      <Settings />
    </div>
  );
}
