declare module 'react';
declare module 'react/jsx-runtime';

interface MediaListItemProps {
  item: Media;
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
}

interface MediaDetailProps {
  item: Media;
  onClose: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddNote: (content: string) => Promise<void>;
  onEditNote: (noteId: number, content: string) => Promise<void>;
  onDeleteNote: (noteId: number) => Promise<void>;
}

interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  pageSize: number;
} 