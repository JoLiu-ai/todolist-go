export type MediaType = 'book' | 'movie';
export type MediaStatus = 'in_progress' | 'completed' | 'plan_to_read' | 'dropped';

export interface Media {
  id: number;
  type: MediaType;
  display_name: {
    primary: string;
    secondary?: string;
  };
  description?: string;
  creator?: string;
  status: MediaStatus;
  rating: number;
  resource_link?: string;
  created_at: string;
  updated_at: string;
  notes?: Note[];
  progress?: number;
  cover_image?: string;
  tags?: string[];
}

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
  category?: string;
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