import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import MediaPage from './pages/MediaPage';
import KnowledgePage from './pages/KnowledgePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/tasks',
    element: <ProtectedRoute><TaskListPage /></ProtectedRoute>,
  },
  {
    path: '/media',
    element: <ProtectedRoute><MediaPage /></ProtectedRoute>,
  },
  {
    path: '/knowledge',
    element: <ProtectedRoute><KnowledgePage /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router; 
