import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { Media, MediaType } from '../types/media';

interface MediaStats {
  total_books: number;
  reading_books: number;
  total_movies: number;
  watching_movies: number;
}

interface MediaPageProps {
  type: MediaType;
}

export default function MediaPage({ type }: MediaPageProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await api.media.getAll({ type });
        setItems(data || []);
      } catch (err) {
        console.error('获取媒体列表失败:', err);
        setError(err instanceof Error ? err.message : '获取媒体列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [type]);

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#2c2c2c] flex items-center">
            {type === 'book' ? (
              <>
                <BookOpenIcon className="w-6 h-6 mr-2 text-[#d4b483]" />
                我的书架
              </>
            ) : (
              <>
                <FilmIcon className="w-6 h-6 mr-2 text-[#d4b483]" />
                我的影视
              </>
            )}
          </h2>
          <Link
            to={`/${type === 'book' ? 'books' : 'movies'}/create`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {type === 'book' ? '添加书籍' : '添加影视'}
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d4b483] border-t-transparent"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无{type === 'book' ? '书籍' : '影视'}记录，点击右上角按钮添加
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/${type === 'book' ? 'books' : 'movies'}/${item.id}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
              >
                {/* Media card content */}
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#d4b483] transition-colors mb-2">
                    {item.display_name.primary}
                  </h3>
                  {item.description?.primary && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description.primary}
                    </p>
                  )}
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'finished' ? 'bg-green-100 text-green-800' :
                      item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'wishlist' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'finished' ? '已完成' :
                       item.status === 'ongoing' ? '进行中' :
                       item.status === 'wishlist' ? '想看' : '已弃'}
                    </span>
                    {item.rating > 0 && (
                      <span className="ml-2">⭐️ {item.rating}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 