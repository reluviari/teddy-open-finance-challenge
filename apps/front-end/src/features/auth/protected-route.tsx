import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-context';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login?expired=true" replace />;
  }

  return <Outlet />;
}
