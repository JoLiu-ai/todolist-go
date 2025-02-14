import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Note, notesApi, UpdateNoteRequest } from '@/api/notes';
import { 
  BeakerIcon,
  HeartIcon,
  SparklesIcon,
  BoltIcon,
  UserGroupIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { value: 'brain', label: '脑科学', icon: BeakerIcon, color: 'text-purple-500' },
  { value: 'psychology', label: '心理学', icon: HeartIcon, color: 'text-pink-500' },
  { value: 'cognitive', label: '认知科学', icon: SparklesIcon, color: 'text-indigo-500' },
  { value: 'productivity', label: '效率管理', icon: BoltIcon, color: 'text-yellow-500' },
  { value: 'habits', label: '习惯养成', icon: UserGroupIcon, color: 'text-green-500' },
  { value: 'emotion', label: '情绪管理', icon: RocketLaunchIcon, color: 'text-orange-500' },
];

export default function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateNoteRequest>({
    title: '',
    content: '',
    category: categories[0].value,
  });

  // 加载便利签数据
  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      
      try {
        const data = await notesApi.getNote(id);
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
        });
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await notesApi.updateNote(id, formData);
      navigate(`/notes/${id}`);
    } catch (err) {
      setError('Failed to update note');
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b483]"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">编辑便利签</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4b483] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4b483] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              内容
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4b483] focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/notes/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
