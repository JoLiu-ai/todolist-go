import React, { useState, useEffect } from 'react';
import { Media, MediaType, Category } from '../types/media';
import MediaCard from './MediaCard';
import MediaListItem from './MediaListItem';
import MediaForm from './MediaForm';
import MediaDetail from './MediaDetail';
import Modal from './Modal';
import PomodoroTimer from './PomodoroTimer';
import { useParams } from 'react-router-dom';
import { api } from '@/api/client';

interface MediaPageProps {
  mediaType: MediaType;
}

const MediaPage: React.FC<MediaPageProps> = ({ mediaType }) => {
  const [items, setItems] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<Media | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Media | undefined>(undefined);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [mediaType]);

  const fetchMedia = async () => {
    try {
      const mediaData = await api.media.getAll({ type: mediaType });
      setItems(mediaData);

      // TODO: Add categories endpoint to API
      const categoriesData = await api.media.getCategories({ type: mediaType });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const item = await api.media.getById(id);
      setSelectedItem(item);
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个项目吗？')) {
      return;
    }

    try {
      await api.media.delete(id);
      setItems(items.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(undefined);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const handleSubmit = async (data: Partial<Media>) => {
    try {
      let updatedItem;
      if (editingItem) {
        updatedItem = await api.media.update(editingItem.id, data);
        setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
      } else {
        updatedItem = await api.media.create(data);
        setItems([...items, updatedItem]);
      }
      setShowForm(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedItem) return;

    try {
      await api.media.addNote(selectedItem.id, content);
      const updatedItem = await api.media.getById(selectedItem.id);
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async (noteId: number, content: string) => {
    if (!selectedItem) return;

    try {
      await api.media.updateNote(selectedItem.id, noteId, content);
      const updatedItem = await api.media.getById(selectedItem.id);
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!selectedItem) return;

    try {
      await api.media.deleteNote(selectedItem.id, noteId);
      const updatedItem = await api.media.getById(selectedItem.id);
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddNoteClick = () => {
    // 实现添加笔记的逻辑
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('grid')}
          >
            网格视图
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('list')}
          >
            列表视图
          </button>
        </div>
        <button
          className="inline-flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow font-serif"
          onClick={handleAddNew}
        >
          <span className="mr-2">✨</span>
          添加{mediaType === 'book' ? '书籍' : '影视'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          还没有任何{mediaType === 'book' ? '书籍' : '影视'}记录，
          <button
            className="text-blue-500 hover:underline"
            onClick={handleAddNew}
          >
            立即添加
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          {items.map(item => (
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
          ))}
        </div>
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <MediaForm
            type={mediaType}
            item={editingItem}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {selectedItem && (
        <Modal onClose={() => setSelectedItem(undefined)}>
          <MediaDetail
            item={selectedItem}
            onClose={() => setSelectedItem(undefined)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </Modal>
      )}

      {selectedItem && selectedItem.notes && selectedItem.notes.length > 0 ? (
        <div className="space-y-4">
          {selectedItem.notes.map(note => (
            <div key={note.id} className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">{note.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-[#4a4a4a] font-serif">暂无笔记</p>
          <p className="text-sm text-[#8c8c8c] font-serif mt-2">
            点击上方按钮开始写下你的第一条笔记吧
          </p>
          <button
            onClick={handleAddNoteClick}
            className="mt-6 inline-flex items-center px-4 py-2 text-sm font-serif text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span className="mr-2">✏️</span>
            开始写笔记
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaPage; 