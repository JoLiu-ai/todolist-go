import axios from 'axios';
import { Media, MediaType } from '../types/media';

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const mediaApi = {
  getAll: async (params: GetMediaParams) => {
    const response = await client.get<ApiResponse<Media[]>>('/media', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await client.get<ApiResponse<Media>>(`/media/${id}`);
    return response.data;
  },

  create: async (data: Partial<Media>) => {
    const response = await client.post<ApiResponse<Media>>('/media', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Media>) => {
    const response = await client.put<ApiResponse<Media>>(`/media/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await client.delete<ApiResponse<void>>(`/media/${id}`);
    return response.data;
  },

  addNote: async (mediaId: number, content: string) => {
    const response = await client.post<ApiResponse<Media>>(`/media/${mediaId}/notes`, { content });
    return response.data;
  },

  updateNote: async (mediaId: number, noteId: number, content: string) => {
    const response = await client.put<ApiResponse<Media>>(`/media/${mediaId}/notes/${noteId}`, { content });
    return response.data;
  },

  deleteNote: async (mediaId: number, noteId: number) => {
    const response = await client.delete<ApiResponse<Media>>(`/media/${mediaId}/notes/${noteId}`);
    return response.data;
  },
}; 