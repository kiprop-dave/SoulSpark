import { Link, ToPathOption } from '@tanstack/router';
import Logo from '@/assets/logo.svg';
import { useAppRoutes } from '@/hooks/useAppRoutes';
import { PersonalInfo } from '@/types';

interface SidebarHeaderProps {
  personalInfo?: PersonalInfo;
}

export function SideBarHeader({ personalInfo }: SidebarHeaderProps): JSX.Element {
  const { location } = useAppRoutes();

  // Toggles between /app/profile and /app
  const toLocation: ToPathOption = location === '/profile' ? '/app' : '/app/profile';

  return (
    <div className="flex items-center w-full h-[14%] px-4 py-5 bg-gradient-to-tr from-red-500 to-orange-300">
      <Link
        className="flex items-center p-1 rounded-3xl cursor-pointer hover:bg-slate-800"
        to={toLocation}
      >
        <div className="bg-white rounded-full">
          <img
            src={location === '/profile' ? Logo : personalInfo?.images[0].secure_url}
            className="w-8 h-8 rounded-full object-cover"
            alt="display picture"
          />
        </div>
        <div className="ml-2">
          <h1 className="font-bold text-white">{personalInfo?.first_name}</h1>
        </div>
      </Link>
    </div>
  );
}
