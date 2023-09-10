import { useEffect, useMemo, useState } from 'react';
import { ToPathOption } from '@tanstack/router';
import { IconType } from 'react-icons';
import { PiStarFourFill } from 'react-icons/pi';
import { CgProfile } from 'react-icons/cg';
import { AiFillMessage } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs';

type Route = {
  path: ToPathOption;
  name: string;
  icon: IconType;
  isActive: boolean;
};

// This hook is used to manage the state of the application's routes and makes them type safe
export function useAppRoutes() {
  const [location, setLocation] = useState(() => {
    return window.location.pathname.split('app')[1] ?? '';
  });

  useEffect(() => {
    const path = window.location.pathname.split('app')[1] ?? '';
    if (path !== location) setLocation(path);
  }, [window.location.pathname]);

  const routes: Route[] = useMemo(
    () => [
      {
        path: '/app',
        name: 'Swipe',
        icon: BsPeopleFill,
        isActive: location === '/' || location === '',
      },
      {
        path: '/app/likes',
        name: 'likes',
        icon: PiStarFourFill,
        isActive: location === '/likes',
      },
      {
        path: '/app/messages',
        name: 'Messages',
        icon: AiFillMessage,
        isActive: location.startsWith('/messages'),
      },
      {
        path: '/app/profile',
        name: 'Profile',
        icon: CgProfile,
        isActive: location === '/profile',
      },
    ],
    [location]
  );

  return { routes, location };
}
