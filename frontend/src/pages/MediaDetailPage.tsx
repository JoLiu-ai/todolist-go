import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { Media, MediaType } from '../types/media';

interface MediaDetailPageProps {
  type: MediaType;
}

export default function MediaDetailPage({ type }: MediaDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      if (!id) return;
      
      try {
        const data = await api.media.getById(parseInt(id, 10));
        setMedia(data);
      } catch (err) {
        console.error('获取详情失败:', err);
        setError(err instanceof Error ? err.message : '获取详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  const handleDelete = async () => {
    if (!media || !window.confirm('确定要删除吗？')) return;

    try {
      await api.media.delete(media.id);
      navigate(`/${type === 'book' ? 'books' : 'movies'}`);
    } catch (err) {
      console.error('删除失败:', err);
      setError(err instanceof Error ? err.message : '删除失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d4b483] border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error || !media) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-200">
            {error || '未找到相关内容'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                {type === 'book' ? (
                  <BookOpenIcon className="w-8 h-8 text-[#d4b483] mr-3" />
                ) : (
                  <FilmIcon className="w-8 h-8 text-[#d4b483] mr-3" />
                )}
                <div>
                  <h1 className="text-2xl font-medium text-gray-900">
                    {media.display_name.primary}
                  </h1>
                  {media.display_name.secondary && (
                    <p className="mt-1 text-sm text-gray-500">
                      {media.display_name.secondary}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/${type === 'book' ? 'books' : 'movies'}/${media.id}/edit`)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#d4b483] bg-[#f7f3eb] rounded-sm hover:bg-[#f0e9d8] transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-sm hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  删除
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {type === 'book' ? '作者' : '导演'}
                  </h3>
                  <p className="text-base text-gray-900">
                    {media.creator || '未知'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    状态
                  </h3>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    media.status === 'finished' ? 'bg-green-100 text-green-800' :
                    media.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    media.status === 'wishlist' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {media.status === 'finished' ? '已完成' :
                     media.status === 'ongoing' ? (type === 'book' ? '在读' : '在看') :
                     media.status === 'wishlist' ? (type === 'book' ? '想读' : '想看') :
                     '已弃'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {media.description?.primary && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    简介
                  </h3>
                  <p className="text-base text-gray-900 whitespace-pre-line">
                    {media.description.primary}
                  </p>
                </div>
              )}

              {/* Rating */}
              {media.rating > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    评分
                  </h3>
                  <div className="flex items-center">
                    <span className="text-2xl text-yellow-400">
                      {'⭐️'.repeat(media.rating)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({media.rating}/5)
                    </span>
                  </div>
                </div>
              )}

              {/* Tags */}
              {media.tags && media.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {media.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                {media.start_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      开始时间
                    </h3>
                    <p className="text-base text-gray-900">
                      {new Date(media.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {media.finish_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      完成时间
                    </h3>
                    <p className="text-base text-gray-900">
                      {new Date(media.finish_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 