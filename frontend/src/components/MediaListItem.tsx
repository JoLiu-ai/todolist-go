import React from 'react';
import { Media } from '../types/media';

interface MediaListItemProps {
  item: Media;
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
}

const MediaListItem: React.FC<MediaListItemProps> = ({
  item,
  onViewDetail,
  onEdit,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="bg-[#fcf9f3] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      <div className="flex p-4 gap-4">
        {/* Cover Image */}
        <div 
          className="w-24 flex-shrink-0 bg-white/80 rounded-sm overflow-hidden cursor-pointer"
          onClick={() => onViewDetail(item.id)}
        >
          {item.cover && !imageError ? (
            <img
              src={item.cover}
              alt={item.display_name.primary}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full aspect-[2/3] flex flex-col items-center justify-center bg-gradient-to-b from-[#f7f3eb] to-[#ebe5d9]">
              <span className="text-2xl mb-1">
                {item.type === 'book' ? '📚' : '🎬'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="min-w-0">
              <h3 className="font-serif text-[#2c2c2c] font-medium line-clamp-1 hover:text-[#666666] transition-colors cursor-pointer"
                  onClick={() => onViewDetail(item.id)}>
                {item.display_name.primary}
              </h3>
              {item.display_name.secondary && (
                <p className="text-sm text-[#666666] italic font-serif line-clamp-1">
                  {item.display_name.secondary}
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={() => onViewDetail(item.id)}
                className="p-1.5 text-[#666666] hover:text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-all"
                title="查看详情"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(item.id)}
                className="p-1.5 text-[#666666] hover:text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-all"
                title="编辑"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-[#4a4a4a] font-serif">
              {item.creator || '未知作者/导演'}
            </p>

            <div className="flex items-center gap-3 text-xs font-serif text-[#8c8c8c]">
              <span className="capitalize">{item.status}</span>
              {item.notes && item.notes.length > 0 && (
                <span>{item.notes.length} notes</span>
              )}
              {item.resource_link && (
                <a 
                  href={item.resource_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  资源链接
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaListItem; 