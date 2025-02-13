import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateTaskPage from '@/pages/CreateTaskPage';
import EditTaskPage from '@/pages/EditTaskPage';
import TaskListPage from '@/pages/TaskListPage';
import TaskDetailPage from '@/pages/TaskDetailPage';
import MediaPage from '@/pages/MediaPage';
import CreateMediaPage from '@/pages/CreateMediaPage';
import MediaDetailPage from '@/pages/MediaDetailPage';
import KnowledgePage from '@/pages/KnowledgePage';
import CreateKnowledgePage from '@/pages/CreateKnowledgePage';
import KnowledgeDetailPage from '@/pages/KnowledgeDetailPage';
import EditKnowledgePage from '@/pages/EditKnowledgePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  // Task routes
  {
    path: '/tasks',
    element: <ProtectedRoute><TaskListPage /></ProtectedRoute>,
  },
  {
    path: '/tasks/create',
    element: <ProtectedRoute><CreateTaskPage /></ProtectedRoute>,
  },
  {
    path: '/tasks/:id',
    element: <ProtectedRoute><TaskDetailPage /></ProtectedRoute>,
  },
  {
    path: '/tasks/:id/edit',
    element: <ProtectedRoute><EditTaskPage /></ProtectedRoute>,
  },
  // Media routes
  {
    path: '/books',
    element: <ProtectedRoute><MediaPage type="book" /></ProtectedRoute>,
  },
  {
    path: '/books/create',
    element: <ProtectedRoute><CreateMediaPage type="book" /></ProtectedRoute>,
  },
  {
    path: '/books/:id',
    element: <ProtectedRoute><MediaDetailPage type="book" /></ProtectedRoute>,
  },
  {
    path: '/movies',
    element: <ProtectedRoute><MediaPage type="movie" /></ProtectedRoute>,
  },
  {
    path: '/movies/create',
    element: <ProtectedRoute><CreateMediaPage type="movie" /></ProtectedRoute>,
  },
  {
    path: '/movies/:id',
    element: <ProtectedRoute><MediaDetailPage type="movie" /></ProtectedRoute>,
  },
  // Knowledge routes
  {
    path: '/knowledge',
    element: <ProtectedRoute><KnowledgePage /></ProtectedRoute>,
  },
  {
    path: '/knowledge/create',
    element: <ProtectedRoute><CreateKnowledgePage /></ProtectedRoute>,
  },
  {
    path: '/knowledge/:id',
    element: <ProtectedRoute><KnowledgeDetailPage /></ProtectedRoute>,
  },
  {
    path: '/knowledge/:id/edit',
    element: <ProtectedRoute><EditKnowledgePage /></ProtectedRoute>,
  },
  // 404 route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router; 
