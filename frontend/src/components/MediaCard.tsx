import { Link } from 'react-router-dom';
import { Media, MediaType } from '../types/media';

interface MediaCardProps {
  media: Media;
  type: MediaType;
  isDetailView?: boolean;
}

export default function MediaCard({ media, type, isDetailView = false }: MediaCardProps) {
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

  if (isDetailView) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-medium text-gray-900">
            {media.display_name?.primary || media.title || '未命名'}
          </h1>
          {media.display_name?.secondary && (
            <p className="text-sm text-gray-500">
              {media.display_name.secondary}
            </p>
          )}
          
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">状态</h3>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${status.classes}`}>
                {status.text}
              </span>
            </div>
          </div>

          {media.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">简介</h3>
              <p className="text-base text-gray-900 whitespace-pre-line">
                {media.description}
              </p>
            </div>
          )}

          {media.rating > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">评分</h3>
              <div className="flex items-center">
                <span className="text-2xl text-yellow-400">{'⭐️'.repeat(media.rating)}</span>
                <span className="ml-2 text-sm text-gray-500">({media.rating}/5)</span>
              </div>
            </div>
          )}

          {media.tags && media.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
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
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/${type === 'book' ? 'books' : 'movies'}/${media.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
    >
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#d4b483] transition-colors mb-2">
          {media.display_name?.primary || media.title || '未命名'}
        </h3>
        {media.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {media.description}
          </p>
        )}
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className={`px-2 py-1 rounded-full text-xs ${status.classes}`}>
            {status.text}
          </span>
          {media.rating > 0 && (
            <span className="ml-2">⭐️ {media.rating}</span>
          )}
        </div>
      </div>
    </Link>
  );
} 