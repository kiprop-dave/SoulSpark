import { Navigate, ToPathOption } from '@tanstack/router';
import { useAuth } from '@/context/AuthContext';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    const location = window.location.pathname as ToPathOption;
    return <Navigate to="/" from={location} />;
  }

  return <>{children}</>;
}
