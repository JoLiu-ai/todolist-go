export type NoteCategory = 'brain' | 'psychology' | 'cognitive' | 'productivity' | 'habits' | 'emotion';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'brain' | 'psychology' | 'cognitive' | 'productivity' | 'habits' | 'emotion';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  category?: NoteCategory;
  tags?: string[];
}

export interface NoteListResponse {
  notes: Note[];
  total: number;
}

export interface NoteFilters {
  category?: NoteCategory;
  search?: string;
  sortBy?: 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
} 