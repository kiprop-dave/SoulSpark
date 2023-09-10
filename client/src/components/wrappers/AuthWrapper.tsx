import { Navigate, ToPathOption } from '@tanstack/router';
import { useAuth } from '@/context/AuthContext';
import Spinner from '../Spinner';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, authenticating } = useAuth();

  if (authenticating) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-neutral-900 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    const location = window.location.pathname as ToPathOption;
    return <Navigate to="/" from={location} />;
  }

  return <>{children}</>;
}
