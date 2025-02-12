import { api } from './client';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: number;
  category: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: number;
  category: string;
  due_date: string;
  status?: string;
}

// Re-export the tasks API
export const taskApi = api.tasks; 