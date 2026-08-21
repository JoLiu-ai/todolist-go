import axios, { AxiosHeaders } from 'axios';
import { 
  Media, 
  MediaType, 
  Category, 
  Note, 
  Knowledge, 
  KnowledgeListResponse, 
  CreateKnowledgeData, 
  MediaListResponse, 
  MediaStats, 
  NotesResponse 
} from '../types/types';
import { Task, TaskStats, CreateTaskData } from './tasks';
import { API_ENDPOINTS } from './config';

// 已登录用户信息，与后端 /auth 接口返回的 user 字段对应。
export interface User {
  id: number;
  email: string;
  username?: string | null;
}

// 知识条目对外别名，供页面按语义引用。
export type KnowledgeData = Knowledge;

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
  console.log('[API Request] Auth Token:', token);

  console.log(`[API Request] ${config.method || 'GET'} ${endpoint}`);
  console.log('[API Request] Headers:', headers);

  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  console.log('[API Request] URL:', url.toString());

  const response = await fetch(url.pathname + url.search, {
    ...customConfig,
    headers,
    credentials: 'include',
  });

  console.log(`[API Response] Status: ${response.status}`);
  console.log('[API Response] Headers:', Object.fromEntries(response.headers.entries()));

  const data = await response.json().catch(() => {
    console.error('[API Response] Failed to parse JSON response');
    return {};
  });

  console.log('[API Response] Data:', data);

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
    register: (data: { username?: string; email: string; password: string }) =>
      dynamicClient.post<{ token: string; user: User }>(endpoints.auth.register, data),
    login: (data: { username: string; password: string }) =>
      dynamicClient.post<{ token: string; user: User }>(endpoints.auth.login, data),
    getProfile: () => dynamicClient.get<User>(endpoints.auth.profile),
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
    getById: (id: number) => dynamicClient.get<Media>(endpoints.media.detail(id)),
    create: (data: CreateMediaData) => {
      // 检查必要字段
      if (!data.type) {
        throw new Error('媒体类型(type)是必需的，请选择 book 或 movie');
      }
      const title = data.title?.trim() || data.display_name?.primary?.trim();
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
        title: title,  // 使用已验证的title
        desc_text: data.description || '',  // 数据库字段
        display_name: {
          primary: title,  // 使用已验证的title
          secondary: data.display_name?.secondary?.trim() || ''
        },
        description: {
          primary: data.description || '',
          secondary: ''
        },
        creator: data.creator || '',
        status: data.status,
        rating: data.rating || 0,
        resource_link: data.resource_link || '',
        cover_image: data.cover_image || '',
        tags: data.tags || [],
        progress: data.progress || 0
      };
      
      // 打印完整的请求信息
      console.log('[Media Create] Request:', {
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
    update: (id: number, data: Partial<Media>) => dynamicClient.put<Media>(endpoints.media.detail(id), data),
    delete: (id: number) => dynamicClient.delete<void>(endpoints.media.detail(id)),
    getStats: () => dynamicClient.get<MediaStats>(`${endpoints.media.base}/stats`),
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
  knowledge: {
    getAll: (params?: { category?: string }) => dynamicClient.get<KnowledgeListResponse>(endpoints.knowledge.base, { params }),
    getById: (id: number) => dynamicClient.get<Knowledge>(endpoints.knowledge.detail(id)),
    create: (data: CreateKnowledgeData) => dynamicClient.post<Knowledge>(endpoints.knowledge.base, data),
    update: (id: number, data: Partial<CreateKnowledgeData>) => dynamicClient.put<Knowledge>(endpoints.knowledge.detail(id), data),
    delete: (id: number) => dynamicClient.delete<void>(endpoints.knowledge.detail(id)),
  },
}; 