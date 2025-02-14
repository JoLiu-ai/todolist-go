import { Media, MediaType, MediaListResponse, MediaStats, Note } from '../types/media';
import { api } from './client';

interface MediaListParams {
  type?: MediaType;
  status?: string;
  limit?: number;
}

export interface MediaDetailResponse {
  media: Media;
  notes: Note[];
  details: any;
}

export async function fetchMediaList({ type, status, limit }: MediaListParams): Promise<MediaListResponse> {
  const response = await api.media.getAll({ type, status, limit });
  return {
    items: response.items,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize
  };
}

export async function fetchMediaDetail(type: MediaType, id: number): Promise<MediaDetailResponse> {
  const response = await api.media.getById(id, { 
    params: { type },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  // 确保返回的数据结构符合 MediaDetailResponse 类型
  if ('media' in response) {
    const typedResponse = response as { media: Media; notes?: Note[]; details?: any };
    return {
      media: typedResponse.media,
      notes: typedResponse.notes || [],
      details: typedResponse.details || {}
    };
  }
  
  // 如果后端直接返回了 Media 对象，则包装成 MediaDetailResponse
  return {
    media: response as Media,
    notes: [],
    details: {}
  };
}

export async function fetchMediaStats(): Promise<MediaStats> {
  return api.media.getStats();
}

export async function deleteMedia(id: number): Promise<void> {
  return api.media.delete(id);
}

export async function updateMedia(id: number, data: Partial<Media>): Promise<Media> {
  const response = await api.media.update(id, data);
  return response;
} 