import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Media, MediaType } from '../types/media';
import MediaCard from '../components/MediaCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMediaList, deleteMedia } from '../api/media';
import { PlusIcon, BookOpenIcon, FilmIcon, TrashIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';

export default function MediaPage() {
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/movies') ? 'movie' : 'book';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['media', mediaType],
    queryFn: () => fetchMediaList({ type: mediaType }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });

  const handleDeleteAll = async () => {
    if (!data?.items || data.items.length === 0 || !window.confirm('确定要删除所有影视记录吗？此操作不可恢复。')) {
      return;
    }

    setIsDeleting(true);
    try {
      for (const media of data.items) {
        await deleteMutation.mutateAsync(media.id);
      }
      alert('所有影视记录已删除');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-red-500">加载失败</div>
        </div>
      </Layout>
    );
  }

  const mediaList = data?.items || [];

  return (
    <Layout>
      <div className="p-6">
        {/* 头部区域 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif text-[#2c2c2c] flex items-center">
            {mediaType === 'book' ? (
              <>
                <BookOpenIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                我的书架
              </>
            ) : (
              <>
                <FilmIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                我的影视
              </>
            )}
          </h1>
          <div className="flex gap-2">
            {mediaType === 'movie' && data?.items && data.items.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-5 h-5 mr-1" />
                {isDeleting ? '正在删除...' : '删除全部'}
              </button>
            )}
            <Link
              to={`/${mediaType === 'book' ? 'books' : 'movies'}/create`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              添加{mediaType === 'book' ? '书籍' : '影视'}
            </Link>
          </div>
        </div>

        {mediaList.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              {mediaType === 'book' ? (
                <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300" />
              ) : (
                <FilmIcon className="w-16 h-16 mx-auto text-gray-300" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有{mediaType === 'book' ? '书籍' : '影视'}记录
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              开始记录你的{mediaType === 'book' ? '阅读' : '观影'}之旅吧
            </p>
            <Link
              to={`/${mediaType === 'book' ? 'books' : 'movies'}/create`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              添加{mediaType === 'book' ? '书籍' : '影视'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaList.map((media: Media) => (
              <MediaCard
                key={media.id}
                media={media}
                type={mediaType as MediaType}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 