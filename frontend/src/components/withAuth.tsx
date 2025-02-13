import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  message: string = '请先登录'
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ message }} />;
    }

    return <WrappedComponent {...props} />;
  };
} 