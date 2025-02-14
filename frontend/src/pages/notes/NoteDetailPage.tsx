import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import format from 'date-fns/format';
import { Note, notesApi } from '@/api/notes';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      
      try {
        const data = await notesApi.getNote(id);
        setNote(data);
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('确定要删除这个便利签吗？')) {
      return;
    }

    try {
      await notesApi.deleteNote(id);
      navigate('/notes');
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b483]"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Note not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* 标题和操作按钮 */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">{note.title}</h1>
          <div className="flex space-x-2">
            <Link
              to={`/notes/${id}/edit`}
              className="p-2 text-gray-400 hover:text-[#d4b483] transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>创建于 {format(new Date(note.createdAt), 'yyyy-MM-dd HH:mm')}</span>
            <span>更新于 {format(new Date(note.updatedAt), 'yyyy-MM-dd HH:mm')}</span>
          </div>
          <span className={`px-3 py-1 rounded-full ${getCategoryColor(note.category)}`}>
            {note.category}
          </span>
        </div>

        {/* 内容 */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{note.content}</div>
        </div>
      </div>
    </div>
  );
}

// 获取分类对应的颜色
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'brain': 'bg-purple-100 text-purple-500',
    'psychology': 'bg-pink-100 text-pink-500',
    'cognitive': 'bg-indigo-100 text-indigo-500',
    'productivity': 'bg-yellow-100 text-yellow-500',
    'habits': 'bg-green-100 text-green-500',
    'emotion': 'bg-orange-100 text-orange-500',
  };

  return colors[category] || 'bg-gray-100 text-gray-500';
} 