// Media/MediaType/MediaStatus 以 types/media.ts 为唯一定义来源，
// 这里导入供本文件内部引用，并再导出以兼容旧的 '@/types/types' 引用路径，
// 避免出现两份不一致的 Media。
import type { Media, MediaType, MediaStatus } from './media';
export type { Media, MediaType, MediaStatus };

export interface Category {
  id: number;
  name: string;
  type: MediaType;
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NotesResponse {
  items: Note[];
  total: number;
  page: number;
  size: number;
}

export interface Knowledge {
  id: number;
  title: string;
  content: string;
  type?: string;
  category?: string;
  tags?: string[];
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeData {
  title: string;
  content: string;
  category?: string;
}

export interface KnowledgeListResponse {
  items: Knowledge[];
  total: number;
  page: number;
  size: number;
}

export interface MediaListResponse {
  items: Media[];
  total: number;
  page: number;
  size: number;
}

export interface MediaStats {
  total_books: number;
  reading_books: number;
  total_movies: number;
  watching_movies: number;
} 