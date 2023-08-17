import { Link } from '@tanstack/router';
import clsx from 'clsx';
import { useAppRoutes } from '@/hooks/useAppRoutes';

export function MobileNavbar(): JSX.Element {
  const { routes } = useAppRoutes();

  return (
    <nav className="w-full h-full flex items-center justify-between">
      {routes.map(({ icon: Icon, path, isActive, name }) => {
        return (
          <Link key={path} className="flex items-center justify-center h-full" to={path}>
            <Icon
              className={clsx('w-6 h-6', {
                'text-slate-600': !isActive,
                'text-red-500': isActive,
              })}
            />
            <span className="sr-only">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
