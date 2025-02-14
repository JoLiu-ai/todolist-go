import { api } from './client';

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
  // 获取所有便利签
  getAll: async () => {
    // return api.notes.getAll();
    return Promise.resolve({
      notes: mockNotes,
      total: mockNotes.length,
    });
  },

  // 获取单个便利签
  getById: async (id: string) => {
    // return api.notes.getById(id);
    const note = mockNotes.find(n => n.id === id);
    if (!note) {
      throw new Error('Note not found');
    }
    return Promise.resolve(note);
  },

  // 创建便利签
  create: async (note: CreatePersonalNoteRequest) => {
    // return api.notes.create(note);
    const newNote: PersonalNote = {
      id: String(mockNotes.length + 1),
      ...note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNotes.push(newNote);
    return Promise.resolve(newNote);
  },

  // 更新便利签
  update: async (id: string, note: UpdatePersonalNoteRequest) => {
    // return api.notes.update(id, note);
    const index = mockNotes.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    const updatedNote = {
      ...mockNotes[index],
      ...note,
      updatedAt: new Date().toISOString(),
    };
    mockNotes[index] = updatedNote;
    return Promise.resolve(updatedNote);
  },

  // 删除便利签
  delete: async (id: string) => {
    // return api.notes.delete(id);
    const index = mockNotes.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    mockNotes.splice(index, 1);
    return Promise.resolve();
  },
}; 
