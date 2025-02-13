export type MediaType = 'book' | 'movie';
export type MediaStatus = 'in_progress' | 'completed' | 'plan_to_read' | 'dropped';

export interface Media {
  id: number;
  type: MediaType;
  title?: string;  // 用于创建时的标题
  display_name: {
    primary: string;
    secondary?: string;
  };
  description?: string;
  creator?: string;
  status: MediaStatus;
  rating: number;
  resource_link?: string;
  cover_image?: string;
  tags?: string[];
  progress?: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  notes?: Note[];
  book?: BookDetails;
  movie?: MovieDetails;
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  media_id: number;
}

export interface Category {
  id: number;
  name: string;
  count: number;
}

export interface MediaListResponse {
  items: Media[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MediaStats {
  total_books: number;
  total_movies: number;
  reading_books: number;
  watching_movies: number;
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