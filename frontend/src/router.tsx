import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CreateTaskPage from '@/pages/tasks/CreateTaskPage';
import EditTaskPage from '@/pages/tasks/EditTaskPage';
import TaskListPage from '@/pages/tasks/TaskListPage';
import TaskDetailPage from '@/pages/tasks/TaskDetailPage';
import MediaPage from '@/pages/media/MediaPage';
import CreateMediaPage from '@/pages/media/CreateMediaPage';
import MediaDetailPage from '@/pages/media/MediaDetailPage';
import KnowledgePage from '@/pages/knowledge/KnowledgePage';
import CreateKnowledgePage from '@/pages/knowledge/CreateKnowledgePage';
import KnowledgeDetailPage from '@/pages/knowledge/KnowledgeDetailPage';
import EditKnowledgePage from '@/pages/knowledge/EditKnowledgePage';
import MonthlyPlanPage from '@/pages/plans/MonthlyPlanPage';
import WeeklyPlanPage from '@/pages/plans/WeeklyPlanPage';
import DailyPlanPage from '@/pages/plans/DailyPlanPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react';
import NotesPage from './pages/notes/NotesPage';

const withProtection = (element: React.ReactNode) => (
  <ProtectedRoute children={element} />
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: withProtection(<HomePage />),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // Plan routes
  {
    path: '/plans/monthly',
    element: withProtection(<MonthlyPlanPage />),
  },
  {
    path: '/plans/weekly',
    element: withProtection(<WeeklyPlanPage />),
  },
  {
    path: '/plans/daily',
    element: withProtection(<DailyPlanPage />),
  },
  // Task routes
  {
    path: '/tasks',
    element: withProtection(<TaskListPage />),
  },
  {
    path: '/tasks/create',
    element: withProtection(<CreateTaskPage />),
  },
  {
    path: '/tasks/:id',
    element: withProtection(<TaskDetailPage />),
  },
  {
    path: '/tasks/:id/edit',
    element: withProtection(<EditTaskPage />),
  },
  // Media routes
  {
    path: '/books',
    element: withProtection(<MediaPage type="book" />),
  },
  {
    path: '/books/create',
    element: withProtection(<CreateMediaPage type="book" />),
  },
  {
    path: '/books/:id',
    element: withProtection(<MediaDetailPage type="book" />),
  },
  {
    path: '/movies',
    element: withProtection(<MediaPage type="movie" />),
  },
  {
    path: '/movies/create',
    element: withProtection(<CreateMediaPage type="movie" />),
  },
  {
    path: '/movies/:id',
    element: withProtection(<MediaDetailPage type="movie" />),
  },
  // Knowledge routes
  {
    path: '/knowledge',
    element: withProtection(<KnowledgePage />),
  },
  {
    path: '/knowledge/create',
    element: withProtection(<CreateKnowledgePage />),
  },
  {
    path: '/knowledge/:id',
    element: withProtection(<KnowledgeDetailPage />),
  },
  {
    path: '/knowledge/:id/edit',
    element: withProtection(<EditKnowledgePage />),
  },
  {
    path: '/notes',
    element: withProtection(<NotesPage />),
  },
  // 404 route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router; 
