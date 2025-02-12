import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, FilmIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { MediaType, Media, MediaStatus } from '../types/media';

interface CreateMediaPageProps {
  type: MediaType;
}

interface CreateMediaData {
  type: MediaType;
  display_name: {
    primary: string;
    secondary?: string;
  };
  description: {
    primary: string;
  };
  creator?: string;
  status: MediaStatus;
  rating: number;
}

export default function CreateMediaPage({ type }: CreateMediaPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const description = formData.get('description') as string;
      const data: CreateMediaData = {
        type,
        display_name: {
          primary: formData.get('title') as string,
          secondary: formData.get('originalTitle') as string || undefined,
        },
        description: {
          primary: description || '',
        },
        creator: formData.get('creator') as string || undefined,
        status: (formData.get('status') as string || 'wishlist') as MediaStatus,
        rating: Number(formData.get('rating')) || 0,
      };

      const response = await api.media.create(data);
      navigate(`/${type === 'book' ? 'books' : 'movies'}/${response.id}`);
    } catch (err) {
      console.error('创建失败:', err);
      setError(err instanceof Error ? err.message : '创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-6 flex items-center">
            {type === 'book' ? (
              <>
                <BookOpenIcon className="w-6 h-6 mr-2 text-[#d4b483]" />
                添加书籍
              </>
            ) : (
              <>
                <FilmIcon className="w-6 h-6 mr-2 text-[#d4b483]" />
                添加影视
              </>
            )}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                标题
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="originalTitle" className="block text-sm font-medium text-gray-700">
                原始标题（可选）
              </label>
              <input
                type="text"
                name="originalTitle"
                id="originalTitle"
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                描述（可选）
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                {type === 'book' ? '作者' : '导演'}（可选）
              </label>
              <input
                type="text"
                name="creator"
                id="creator"
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <select
                name="status"
                id="status"
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              >
                <option value="wishlist">想{type === 'book' ? '读' : '看'}</option>
                <option value="ongoing">{type === 'book' ? '在读' : '在看'}</option>
                <option value="finished">已完成</option>
                <option value="dropped">已弃</option>
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                评分（0-5）
              </label>
              <input
                type="number"
                name="rating"
                id="rating"
                min="0"
                max="5"
                step="0.5"
                defaultValue="0"
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483] sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b483] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '创建中...' : '创建'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 
