export type MediaType = 'book' | 'movie';
export type MediaStatus = 'ongoing' | 'finished' | 'wishlist' | 'dropped';

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  type: MediaType;
}

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  type: MediaType;
  display_name: {
    primary: string;    // 显示名称（如中文名）
    secondary?: string; // 次要显示名称（如英文名）
  };
  original_name?: {
    primary: string;    // 原始名称（如原版名称）
    secondary?: string; // 原始次要名称
  };
  description?: {
    primary: string;    // 主要语言描述
    secondary?: string; // 次要语言描述
  };
  creator?: string;     // 作者/导演（可选）
  cover?: string;       // 封面图片
  resource_link?: string; // 资源链接
  status: MediaStatus;
  rating: number;
  comment?: {
    primary: string;    // 主要语言评论
    secondary?: string; // 次要语言评论
  };
  start_date?: string;
  finish_date?: string;
  tags?: string[];
  category_id: number;
  category?: Category;
  notes?: Note[];
  created_at: string;
  updated_at: string;
}

export interface BookDetails {
  id: number;
  media_id: number;
  isbn?: string;
  publisher?: string;
  publish_date?: string;
  pages?: number;
  current_page?: number;
}

export interface MovieDetails {
  id: number;
  media_id: number;
  duration?: number;
  release_date?: string;
  country?: string;
  language?: string;
}

export interface Book extends Media {
  type: 'book';
  details?: BookDetails;
}

export interface Movie extends Media {
  type: 'movie';
  details?: MovieDetails;
} 