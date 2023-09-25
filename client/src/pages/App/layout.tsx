import { MobileNavbar } from './components/MobileNavbar';
import { useUserProfile } from '@/context/UserProfileContext';
import { LikesTeaserProvider } from '@/context/LikesContext';
import { MatchesProvider } from '@/context/MatchesContext';
import { ConversationsContextProvider } from '@/context/ConversationsContext';
import { SideBarHeader } from './components/SidebarHeader';
import { SidebarBody } from './components/SidebarBody';

export default function AppPageLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const { userProfile } = useUserProfile();

  return (
    <LikesTeaserProvider>
      <MatchesProvider>
        <ConversationsContextProvider>
          <div className="w-full h-full flex flex-col justify-between md:flex md:flex-row md:justify-start">
            <aside className="hidden md:block md:w-1/3 lg:w-1/4 h-full bg-slate-100 dark:bg-neutral-950 border-r border-r-slate-300 dark:border-r-gray-700">
              <SideBarHeader personalInfo={userProfile?.personalInfo} />
              <SidebarBody />
            </aside>
            <main className="flex flex-col items-center justify-center bg-slate-100 dark:bg-neutral-950 h-full w-full md:w-2/3 lg:w-3/4 overflow-scroll no-scrollbar">
              {children}
            </main>
            <div className="w-full md:hidden block px-3 py-3 dark:bg-neutral-950">
              <MobileNavbar />
            </div>
          </div>
        </ConversationsContextProvider>
      </MatchesProvider>
    </LikesTeaserProvider>
  );
}
