import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateTaskPage from '@/pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskListPage from '@/pages/TaskListPage';
import TaskDetailPage from '@/pages/TaskDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    element: <TaskListPage />,
  },
  {
    path: '/tasks/create',
    element: <CreateTaskPage />,
  },
  {
    path: '/tasks/:id',
    element: <TaskDetailPage />,
  },
  {
    path: '/tasks/:id/edit',
    element: <EditTaskPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router; 