import { Media, MediaType, MediaListResponse, MediaStats } from '../types/types';
import { api } from './client';

interface MediaListParams {
  type?: MediaType;
  status?: string;
  limit?: number;
}

export async function fetchMediaList({ type, status, limit }: MediaListParams): Promise<MediaListResponse> {
  return api.media.getAll({ type, status, limit });
}

export async function fetchMediaDetail(type: MediaType, id: number): Promise<Media> {
  return api.media.getById(id);
}

export async function fetchMediaStats(): Promise<MediaStats> {
  return api.media.getStats();
}

export async function deleteMedia(id: number): Promise<void> {
  return api.media.delete(id);
} 