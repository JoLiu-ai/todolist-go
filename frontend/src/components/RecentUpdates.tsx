import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../api/tasks';
import { Media } from '../types/media';
import { ClockIcon, BookOpenIcon, FilmIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface RecentUpdatesProps {
  tasks?: Task[];
  media?: Media[];
}

export default function RecentUpdates({ tasks = [], media = [] }: RecentUpdatesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} 分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours} 小时前`;
    } else if (diffDays < 30) {
      return `${diffDays} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  };

  const allUpdates = [
    ...tasks.map(task => ({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      date: task.updated_at,
      status: task.status,
      priority: task.priority,
      link: `/tasks/${task.id}`,
    })),
    ...media.map(item => ({
      id: `media-${item.id}`,
      type: item.type,
      title: item.display_name.primary,
      date: item.updated_at,
      status: item.status,
      rating: item.rating,
      link: `/${item.type === 'book' ? 'books' : 'movies'}/${item.id}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-[#e9dcc9] p-6">
      <h2 className="text-xl font-serif text-[#2c2c2c] mb-6 flex items-center">
        <ClockIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
        最近更新
      </h2>
      <div className="space-y-4">
        {allUpdates.map(item => (
          <Link
            key={item.id}
            to={item.link}
            className="block bg-white/50 rounded-lg border border-[#e9dcc9] p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {item.type === 'book' ? (
                    <BookOpenIcon className="w-5 h-5 text-[#d4b483]" />
                  ) : item.type === 'movie' ? (
                    <FilmIcon className="w-5 h-5 text-[#d4b483]" />
                  ) : (
                    <ClipboardDocumentListIcon className="w-5 h-5 text-[#d4b483]" />
                  )}
                </div>
                <div>
                  <h3 className="text-[#2c2c2c] font-medium line-clamp-1">{item.title}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    {'priority' in item && (
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        item.priority === 3 ? 'bg-red-100 text-red-800' :
                        item.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority === 3 ? '高' :
                         item.priority === 2 ? '中' : '低'}优先级
                      </span>
                    )}
                    {'rating' in item && item.rating > 0 && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {'⭐️'.repeat(item.rating)}
                      </span>
                    )}
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      item.status === 'completed' || item.status === 'finished' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' || item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'wishlist' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'completed' || item.status === 'finished' ? '已完成' :
                       item.status === 'pending' ? '进行中' :
                       item.status === 'ongoing' ? (item.type === 'book' ? '在读' : '在看') :
                       item.status === 'wishlist' ? (item.type === 'book' ? '想读' : '想看') :
                       '已弃'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 