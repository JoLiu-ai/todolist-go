import { api } from './client';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: number;
  category: string;
  dueDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
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

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: number;
  category: string;
  dueDate: string;
  status?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: number;
  category?: string;
  dueDate?: string;
  status?: string;
}

// Re-export the tasks API
export const taskApi = {
  getAll: async (): Promise<TasksResponse> => {
    const response = await fetch('/api/v1/tasks', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  getById: async (id: number): Promise<Task> => {
    const response = await fetch(`/api/v1/tasks/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch task');
    }
    return response.json();
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await fetch('/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to create task');
    }
    return response.json();
  },

  update: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await fetch(`/api/v1/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to update task');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to delete task');
    }
  },
}; 