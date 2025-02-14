import React from 'react';
import { Link } from 'react-router-dom';
import { Media, MediaType, Note } from '../types/media';

interface MediaCardProps {
  media: Media;
  type: MediaType;
  isDetailView?: boolean;
  notes?: Note[];
  details?: any;
}

export default function MediaCard({ media, type, isDetailView = false, notes = [], details }: MediaCardProps) {
  console.log('[MediaCard] Props:', {
    media,
    type,
    isDetailView,
    title: media.title,
    displayName: media.display_name
  });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', classes: 'bg-green-100 text-green-800' };
      case 'in_progress':
        return { text: type === 'book' ? '在读' : '在看', classes: 'bg-blue-100 text-blue-800' };
      case 'plan_to_read':
        return { text: type === 'book' ? '想读' : '想看', classes: 'bg-yellow-100 text-yellow-800' };
      case 'dropped':
        return { text: '已弃', classes: 'bg-gray-100 text-gray-800' };
      default:
        return { text: '未知', classes: 'bg-gray-100 text-gray-800' };
    }
  };

  const status = getStatusDisplay(media.status);
  const title = media.title || '';
  const description = media.description || '';
  const creator = media.creator || '';
  const rating = media.rating || 0;
  const tags = media.tags || [];
  const progress = media.progress || 0;
  const createdAt = media.created_at ? new Date(media.created_at).toLocaleString() : '';
  const updatedAt = media.updated_at ? new Date(media.updated_at).toLocaleString() : '';

  console.log('Title debug:', {
    title: media.title,
    finalTitle: title,
    mediaData: media
  });

  if (isDetailView) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-medium text-gray-900">
              {title}
            </h1>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${status.classes}`}>
              {status.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {type === 'book' ? '作者' : '导演'}
              </h3>
              <p className="text-base text-gray-900">
                {creator || (type === 'book' ? '未知作者' : '未知导演')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">创建时间</h3>
              <p className="text-sm text-gray-900">{createdAt}</p>
              {createdAt !== updatedAt && updatedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  更新于: {updatedAt}
                </p>
              )}
            </div>
          </div>

          {description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">简介</h3>
              <p className="text-base text-gray-900 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {rating > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">评分</h3>
              <div className="flex items-center">
                <span className="text-2xl text-yellow-400">{'⭐️'.repeat(Math.floor(rating))}</span>
                <span className="ml-2 text-sm text-gray-500">({rating}/5)</span>
              </div>
            </div>
          )}

          {progress > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">进度</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#d4b483] h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">{progress}%</span>
              </div>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
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

          {/* 详情部分 */}
          {details && Object.keys(details).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">详细信息</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="mb-2 last:mb-0">
                    <span className="text-sm font-medium text-gray-500">{key}: </span>
                    <span className="text-sm text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 笔记部分 */}
          {notes && notes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">笔记</h3>
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-line">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/${type === 'book' ? 'books' : 'movies'}/${media.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-gray-900 line-clamp-2">
            {title}
          </h2>
          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${status.classes}`}>
            {status.text}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500">
            {creator || (type === 'book' ? '未知作者' : '未知导演')}
          </div>
          {rating > 0 && (
            <div className="flex items-center text-yellow-400">
              {'⭐️'.repeat(Math.floor(rating))}
              <span className="ml-1 text-gray-500">({rating}/5)</span>
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}