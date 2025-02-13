import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Media, MediaType } from '../types/media';
import MediaCard from '../components/MediaCard';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaDetail } from '../api/media';
import Layout from '../components/Layout';
import { HomeIcon, BookOpenIcon, FilmIcon } from '@heroicons/react/24/outline';

export default function MediaDetailPage() {
  const { type = 'book', id } = useParams<{ type: MediaType; id: string }>();

  const { data: media, isLoading, error } = useQuery({
    queryKey: ['media', type, id],
    queryFn: () => fetchMediaDetail(type, Number(id)),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-4">
              {type === 'book' ? (
                <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300" />
              ) : (
                <FilmIcon className="w-16 h-16 mx-auto text-gray-300" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              找不到该{type === 'book' ? '书籍' : '影视'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              该内容可能已被删除或不存在
            </p>
            <Link
              to={`/${type === 'book' ? 'books' : 'movies'}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
            >
              返回{type === 'book' ? '书架' : '影视'}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!media) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-4">
              {type === 'book' ? (
                <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300" />
              ) : (
                <FilmIcon className="w-16 h-16 mx-auto text-gray-300" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              未找到相关内容
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              该{type === 'book' ? '书籍' : '影视'}可能已被删除或移动
            </p>
            <Link
              to={`/${type === 'book' ? 'books' : 'movies'}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
            >
              返回{type === 'book' ? '书架' : '影视'}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* 面包屑导航 */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-[#d4b483] transition-colors">
                <HomeIcon className="w-5 h-5" />
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to={`/${type === 'book' ? 'books' : 'movies'}`}
                  className="text-gray-500 hover:text-[#d4b483] transition-colors"
                >
                  {type === 'book' ? (
                    <BookOpenIcon className="w-5 h-5" />
                  ) : (
                    <FilmIcon className="w-5 h-5" />
                  )}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">
                  {media.display_name?.primary || media.title || '未命名'}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <MediaCard
          media={media}
          type={type as MediaType}
          isDetailView={true}
        />
      </div>
    </Layout>
  );
} 