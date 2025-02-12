import React, { useState, useEffect } from 'react';
import { Media, MediaType, Category } from '../types/media';
import MediaCard from '@/components/MediaCard';
import MediaListItem from '@/components/MediaListItem';
import MediaForm from '@/components/MediaForm';
import MediaDetail from '@/components/MediaDetail';
import Modal from '@/components/Modal';
import PomodoroTimer from '@/components/PomodoroTimer';
import { useParams } from 'react-router-dom';
import { api } from '@/api/client';

interface MediaItem {
  id: number;
  title: string;
  type: string;
  status: string;
  notes: Note[];
}

interface Note {
  id: number;
  content: string;
}

interface CategoryItem {
  id: number;
  name: string;
  type: string;
}

interface MediaPageProps {
  mediaType: MediaType;
}

export default function MediaPage() {
  const { mediaType } = useParams<{ mediaType: string }>();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (mediaType) {
      fetchMedia();
    }
  }, [mediaType]);

  const fetchMedia = async () => {
    if (!mediaType) return;
    
    try {
      const mediaResponse = await fetch(`${api.media.base}?type=${mediaType}`);
      const mediaData = await mediaResponse.json();
      setItems(mediaData);

      // TODO: Add categories endpoint to API_ENDPOINTS
      const categoriesResponse = await fetch(`${api.media.base}/categories?type=${mediaType}`);
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await fetch(api.media.detail(id));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const item = await response.json();
      setSelectedItem(item);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    const item = items.find((item: MediaItem) => item.id === id);
    if (item) {
      setEditingItem(item);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条记录吗？')) {
      return;
    }

    try {
      await fetch(api.media.detail(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchMedia();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = async (data: Partial<MediaItem>) => {
    try {
      const url = editingItem ? api.media.detail(editingItem.id) : api.media.base;
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save media');
      }

      await fetchMedia();
      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(api.media.notes(selectedItem.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const mediaResponse = await fetch(api.media.detail(selectedItem.id));
      const updatedMedia = await mediaResponse.json();
      setItems(items.map((item: MediaItem) => item.id === selectedItem.id ? updatedMedia : item));
      setSelectedItem(updatedMedia);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async (noteId: number, content: string) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`${api.media.notes(selectedItem.id)}/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedMedia = { ...selectedItem };
      const noteIndex = updatedMedia.notes.findIndex((note: Note) => note.id === noteId);
      if (noteIndex !== -1) {
        updatedMedia.notes[noteIndex].content = content;
        setItems(items.map((item: MediaItem) => item.id === selectedItem.id ? updatedMedia : item));
        setSelectedItem(updatedMedia);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`${api.media.notes(selectedItem.id)}/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      const updatedMedia = { ...selectedItem };
      updatedMedia.notes = updatedMedia.notes.filter((note: Note) => note.id !== noteId);
      setItems(items.map((item: MediaItem) => item.id === selectedItem.id ? updatedMedia : item));
      setSelectedItem(updatedMedia);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {mediaType === 'book' ? 'Books' : 'Movies'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPomodoroOpen(true)}
            className="px-4 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#3c3c3c] transition-colors font-serif flex items-center gap-2"
          >
            <span>🍅</span>
            <span>专注模式</span>
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add New
          </button>
        </div>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={handleAddNew}
        >
          ➕ 添加{mediaType === 'book' ? '书籍' : '影视'}
        </button>
      </div>

      {/* 内容区 */}
      {items.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-4'}>
          {items.map((item) =>
            viewMode === 'grid' ? (
              <MediaCard
                key={item.id}
                item={item}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            ) : (
              <MediaListItem
                key={item.id}
                item={item}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            还没有{mediaType === 'book' ? '书籍' : '影视'}记录，
            快来添加一些吧！
          </p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? '编辑' : '添加'}{mediaType === 'book' ? '书籍' : '影视'}
            </h2>
            <MediaForm
              type={mediaType}
              item={editingItem || undefined}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <Modal onClose={() => setSelectedItem(null)}>
          <MediaDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </Modal>
      )}

      {/* Add PomodoroTimer */}
      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />
    </div>
  );
} 