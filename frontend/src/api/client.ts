import axios, { AxiosHeaders } from 'axios';
import { 
  Media, 
  MediaType, 
  Note, 
  MediaListResponse, 
  MediaStats 
} from '../types/media';
import { 
  Category, 
  Knowledge, 
  KnowledgeListResponse, 
  CreateKnowledgeData, 
  NotesResponse 
} from '../types/types';
import { Task, TaskStats, CreateTaskData } from './tasks';
import { API_ENDPOINTS } from './config';

// 版本化配置
const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2' // 准备未来版本
} as const;

type ApiVersion = keyof typeof API_VERSIONS;

interface ApiError extends Error {
  response?: Response;
  data?: any;
}

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

  // 打印认证信息
  ;

  ;
  ;

  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  ;

  const response = await fetch(url.pathname + url.search, {
    ...customConfig,
    headers,
    credentials: 'include',
  });

  ;
  ;

  const data = await response.json().catch(() => {
    console.error('[API Response] Failed to parse JSON response');
    return {};
  });

  ;

  if (!response.ok) {
    console.error('[API Error]', {
      status: response.status,
      statusText: response.statusText,
      data,
      url: url.toString(),
      method: customConfig.method,
      requestHeaders: headers,
      requestBody: customConfig.body,
    });

    let errorMessage = '请求失败';
    if (data.error) {
      errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    } else if (data.message) {
      errorMessage = data.message;
    } else if (Object.keys(data).length > 0) {
      errorMessage = JSON.stringify(data);
    }

    const error = new Error(errorMessage) as ApiError;
    error.response = response;
    error.data = data;
    throw error;
  }

  return data;
}

// API endpoints
const endpoints = API_ENDPOINTS;

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

    patch: <T>(endpoint: string, data: any, config: RequestConfig = {}) => {
      const token = localStorage.getItem('token') || undefined;
      return request<T>(endpoint, {
        ...config,
        method: 'PATCH',
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
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface CreateMediaData extends Partial<Media> {
  title?: string;
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      dynamicClient.post<{ token: string; user: any }>(endpoints.auth.register, data),
    login: (data: { username: string; password: string }) =>
      dynamicClient.post<{ token: string; user: any }>(endpoints.auth.login, data),
    getProfile: () => dynamicClient.get<any>(endpoints.auth.profile),
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
    getAll: (params: GetMediaParams) => dynamicClient.get<MediaListResponse>(endpoints.media.base, { params }),
    getById: async (id: number, config?: RequestConfig) => {
      ;
      const response = await dynamicClient.get<Media>(endpoints.media.detail(id), config);
      ;
      return response;
    },
    getNotes: async (id: number, params?: { page?: number; pageSize?: number }) => {
      ;
      const response = await dynamicClient.get<NotesResponse>(endpoints.media.notes(id), { params });
      ;
      return response;
    },
    create: (data: CreateMediaData) => {
      // 检查必要字段
      if (!data.type) {
        throw new Error('媒体类型(type)是必需的，请选择 book 或 movie');
      }
      const title = data.title?.trim();
      if (!title) {
        throw new Error('标题是必需的');
      }
      if (!data.status) {
        throw new Error('状态(status)是必需的，可选值: in_progress, completed, plan_to_read, dropped');
      }
      if (!['book', 'movie'].includes(data.type)) {
        throw new Error('无效的媒体类型，请选择 book 或 movie');
      }
      if (!['in_progress', 'completed', 'plan_to_read', 'dropped'].includes(data.status)) {
        throw new Error('无效的状态值，可选值: in_progress, completed, plan_to_read, dropped');
      }

      // 转换数据格式以匹配后端期望的结构
      const payload = {
        type: data.type,
        title: title,
        description: data.description || '',
        creator: data.creator || '',
        status: data.status,
        rating: data.rating || 0,
        resource_link: data.resource_link || '',
        cover_image: data.cover_image || '',
        tags: data.tags || [],
        progress: data.progress || 0
      };
      
      console.log('[api.media.create] Request:', {
        url: endpoints.media.base,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        payload,
      });

      return dynamicClient.post<Media>(endpoints.media.base, payload);
    },
    update: async (id: number, data: Partial<Media>) => {
      ;
      const response = await dynamicClient.put<Media>(endpoints.media.detail(id), data);
      ;
      return response;
    },
    delete: (id: number) => dynamicClient.delete<void>(endpoints.media.detail(id)),
    getStats: () => dynamicClient.get<MediaStats>(`${endpoints.media.base}/stats`),
    getCategories: (params: { type: string }) => dynamicClient.get<Category[]>(`${endpoints.media.base}/categories`, { params }),
    addNote: async (mediaId: number, content: string) => {
      ;
      const response = await dynamicClient.post<Media>(endpoints.media.notes(mediaId), { content });
      ;
      return response;
    },
    updateNote: async (mediaId: number, noteId: number, content: string) => {
      ;
      const response = await dynamicClient.put<Media>(`${endpoints.media.notes(mediaId)}/${noteId}`, { content });
      ;
      return response;
    },
    deleteNote: (mediaId: number, noteId: number) => dynamicClient.delete<void>(`${endpoints.media.notes(mediaId)}/${noteId}`),
  },
  knowledge: {
    getAll: (params?: { category?: string }) => dynamicClient.get<KnowledgeListResponse>(endpoints.knowledge.base, { params }),
    getById: (id: number) => dynamicClient.get<Knowledge>(endpoints.knowledge.detail(id)),
    create: (data: CreateKnowledgeData) => dynamicClient.post<Knowledge>(endpoints.knowledge.base, data),
    update: (id: number, data: Partial<CreateKnowledgeData>) => dynamicClient.put<Knowledge>(endpoints.knowledge.detail(id), data),
    delete: (id: number) => dynamicClient.delete<void>(endpoints.knowledge.detail(id)),
  },
}; 