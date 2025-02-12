import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current token:', token);
  console.log('ProtectedRoute - Current location:', location);

  if (!token) {
    console.log('ProtectedRoute - No token, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Token exists, rendering children');
  return <>{children}</>;
} 