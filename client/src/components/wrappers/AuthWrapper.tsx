import { Navigate } from '@tanstack/router';
import { useAuth } from '@/context/AuthContext';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  } else if (user && !user.filledProfile) {
    return <Navigate to="/fill-profile" />;
  }

  return <>{children}</>;
}