import { MobileNavbar } from './components/MobileNavbar';
import logo from '@/assets/logo.svg';
import { useUserProfile } from '@/context/UserProfileContext';
import { SideBarHeader } from './components/SidebarHeader';
import { SidebarBody } from './components/SidebarBody';

export function AppPageLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const { userProfile } = useUserProfile();

  // Will fetch user matches and messages here, then pass them down to a sidebar in big screens
  return (
    <div className="w-full h-full flex flex-col justify-between md:flex md:flex-row md:justify-start">
      <header className="md:hidden h-16 flex items-center">
        <img src={logo} alt="logo" className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold text-red-500">SoulSpark</h1>
      </header>
      <aside className="hidden md:block w-1/4 h-full border-r border-r-slate-300">
        <SideBarHeader personalInfo={userProfile?.personalInfo} />
        <SidebarBody />
      </aside>
      <main className="flex flex-col items-center justify-center bg-slate-100 h-full w-full md:w-3/4 overflow-scroll no-scrollbar">
        {children}
      </main>
      <div className="w-full md:hidden block px-3 py-3">
        <MobileNavbar />
      </div>
    </div>
  );
}
