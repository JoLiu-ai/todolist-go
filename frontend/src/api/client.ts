import axios, { AxiosHeaders } from 'axios';
import { Media, MediaType } from '../types/media';
import { Task, TaskStats, CreateTaskData } from './tasks';

// 版本化配置
const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2' // 准备未来版本
} as const;

type ApiVersion = keyof typeof API_VERSIONS;

interface RequestConfig extends Omit<RequestInit, 'headers'> {
  version?: ApiVersion;
  token?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { version = 'v1', token, headers: customHeaders, params, ...customConfig } = config;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'API-Version': version,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.pathname + url.search, {
    ...customConfig,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '请求失败');
  }

  return response.json();
}

// API endpoints
const endpoints = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
  },
  tasks: {
    base: '/api/v1/tasks',
    detail: (id: number | string) => `/api/v1/tasks/${id}`,
    today: '/api/v1/tasks/today',
    stats: '/api/v1/tasks/stats',
  },
  media: {
    base: '/api/v1/media',
    detail: (id: number | string) => `/api/v1/media/${id}`,
    notes: (id: number | string) => `/api/v1/media/${id}/notes`,
  },
} as const;

// 创建可复用的客户端生成器
function createApiClient(version: ApiVersion = 'v1') {
  return {
    get: <T>(endpoint: string, config: RequestConfig = {}) => {
      const token = localStorage.getItem('token') || undefined;
      return request<T>(endpoint, {
        ...config,
        method: 'GET',
        token,
      });
    },

    post: <T>(endpoint: string, data: any, config: RequestConfig = {}) => {
      const token = localStorage.getItem('token') || undefined;
      return request<T>(endpoint, {
        ...config,
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },

    put: <T>(endpoint: string, data: any, config: RequestConfig = {}) => {
      const token = localStorage.getItem('token') || undefined;
      return request<T>(endpoint, {
        ...config,
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      });
    },

    delete: <T>(endpoint: string, config: RequestConfig = {}) => {
      const token = localStorage.getItem('token') || undefined;
      return request<T>(endpoint, {
        ...config,
        method: 'DELETE',
        token,
      });
    },
  };
}

// 添加版本协商逻辑
const getApiVersion = () => {
  const storedVersion = localStorage.getItem('preferred-api-version');
  return (storedVersion || 'v1') as ApiVersion;
};

// 动态客户端
export const dynamicClient = createApiClient(getApiVersion());

export interface GetMediaParams {
  type?: MediaType;
  status?: string;
  category?: number;
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      dynamicClient.post<{ token: string; user: any }>(endpoints.auth.register, data),
    login: (data: { username: string; password: string }) =>
      dynamicClient.post<{ token: string; user: any }>(endpoints.auth.login, data),
  },
  tasks: {
    getAll: () => dynamicClient.get<Task[]>(endpoints.tasks.base),
    getById: (id: number) => dynamicClient.get<Task>(endpoints.tasks.detail(id)),
    create: (data: CreateTaskData) => dynamicClient.post<Task>(endpoints.tasks.base, data),
    update: (id: number, data: Partial<CreateTaskData>) => dynamicClient.put<Task>(endpoints.tasks.detail(id), data),
    delete: (id: number) => dynamicClient.delete<void>(endpoints.tasks.detail(id)),
    getToday: () => dynamicClient.get<Task[]>(endpoints.tasks.today),
    getStats: () => dynamicClient.get<TaskStats>(endpoints.tasks.stats),
  },
  media: {
    getAll: (params: GetMediaParams) => dynamicClient.get<Media[]>(endpoints.media.base, { params }),
    getById: (id: number) => dynamicClient.get<Media>(endpoints.media.detail(id)),
    create: (data: Partial<Media>) => dynamicClient.post<Media>(endpoints.media.base, data),
    update: (id: number, data: Partial<Media>) => dynamicClient.put<Media>(endpoints.media.detail(id), data),
    delete: (id: number) => dynamicClient.delete<void>(endpoints.media.detail(id)),
    getCategories: (params: { type: string }) => dynamicClient.get<Category[]>(`${endpoints.media.base}/categories`, { params }),
    getNotes: (mediaId: number, params: { page: number; pageSize: number }) => 
      dynamicClient.get<NotesResponse>(`${endpoints.media.notes(mediaId)}`, { params }),
    addNote: (mediaId: number, content: string) =>
      dynamicClient.post<Media>(endpoints.media.notes(mediaId), { content }),
    updateNote: (mediaId: number, noteId: number, content: string) =>
      dynamicClient.put<Media>(`${endpoints.media.notes(mediaId)}/${noteId}`, { content }),
    deleteNote: (mediaId: number, noteId: number) =>
      dynamicClient.delete<void>(`${endpoints.media.notes(mediaId)}/${noteId}`),
  },
}; 