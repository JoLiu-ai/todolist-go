// API 基础配置
export const API_PREFIX = '/api/v1';

// API endpoints configuration
export const API_ENDPOINTS = {
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    profile: `${API_PREFIX}/auth/profile`,
  },
  tasks: {
    base: `${API_PREFIX}/tasks`,
    detail: (id: number | string) => `${API_PREFIX}/tasks/${id}`,
    today: `${API_PREFIX}/tasks/today`,
    stats: `${API_PREFIX}/tasks/stats`,
  },
  media: {
    base: `${API_PREFIX}/media`,
    detail: (id: number | string) => `${API_PREFIX}/media/${id}`,
    notes: (id: number | string) => `${API_PREFIX}/media/${id}/notes`,
  },
  knowledge: {
    base: `${API_PREFIX}/knowledge`,
    detail: (id: number | string) => `${API_PREFIX}/knowledge/${id}`,
  },
} as const; 