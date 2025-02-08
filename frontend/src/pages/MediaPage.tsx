import React, { useState, useEffect } from 'react';
import { Media, MediaType, Category } from '../types/media';
import MediaCard from '../components/MediaCard';
import MediaListItem from '../components/MediaListItem';
import MediaForm from '../components/MediaForm';
import MediaDetail from '../components/MediaDetail';
import Modal from '../components/Modal';
import PomodoroTimer from '../components/PomodoroTimer';

interface MediaPageProps {
  mediaType: MediaType;
}

const MediaPage: React.FC<MediaPageProps> = ({ mediaType }) => {
  const [items, setItems] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Media | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  useEffect(() => {
    fetchMediaData();
  }, [mediaType]);

  useEffect(() => {
    fetchCategories();
  }, [mediaType]);

  const fetchMediaData = async () => {
    try {
      const mediaResponse = await fetch(`/api/v1/media?type=${mediaType}`);
      const mediaData = await mediaResponse.json();
      setItems(mediaData);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await fetch(`/api/v1/categories?type=${mediaType}`);
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/media/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const item = await response.json();
      setSelectedItem(item);
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
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
      await fetch(`/api/v1/media/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== id));
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = async (formData: Partial<Media>) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/v1/media/${editingItem.id}` : '/api/v1/media';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const savedItem = await response.json();
      
      if (editingItem) {
        setItems(items.map(item => item.id === editingItem.id ? savedItem : item));
      } else {
        setItems([...items, savedItem]);
      }
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/v1/media/${selectedItem.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取最新的媒体项数据
      const mediaResponse = await fetch(`/api/v1/media/${selectedItem.id}`);
      if (!mediaResponse.ok) {
        throw new Error(`HTTP error! status: ${mediaResponse.status}`);
      }
      
      const updatedItem = await mediaResponse.json();
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async (noteId: number, content: string) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/v1/media/${selectedItem.id}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const updatedItem = await response.json();
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/v1/media/${selectedItem.id}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const updatedItem = await response.json();
      setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
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
};

export default MediaPage; 