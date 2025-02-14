import { api } from './client';
import type { PersonalNote, CreateNoteRequest, UpdateNoteRequest, NotesResponse } from '@/types/note';

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalNoteRequest {
  title: string;
  content: string;
  category: string;
}

export interface UpdatePersonalNoteRequest {
  title?: string;
  content?: string;
  category?: string;
}

export interface PersonalNoteListResponse {
  notes: PersonalNote[];
  total: number;
}

// Mock data for testing
const mockNotes: PersonalNote[] = [
  {
    id: '1',
    title: '测试笔记 1',
    content: '这是一个测试笔记的内容',
    category: 'brain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '测试笔记 2',
    content: '这是另一个测试笔记的内容',
    category: 'psychology',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const personalNotesApi = {
  getAll: async (): Promise<NotesResponse> => {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  create: async (data: CreateNoteRequest): Promise<PersonalNote> => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  },

  update: async (id: string, data: UpdateNoteRequest): Promise<PersonalNote> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },

  getById: async (id: string): Promise<PersonalNote> => {
    const response = await fetch(`/api/notes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    return response.json();
  },
}; 
