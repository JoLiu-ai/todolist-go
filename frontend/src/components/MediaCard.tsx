import React from 'react';
import { Media } from '../types/media';

interface MediaCardProps {
  item: Media;
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onViewDetail,
  onEdit,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Ensure we have a display name
  const displayName = item.display_name || { primary: '无标题' };
  const originalName = item.original_name;

  // Get title labels based on media type
  const getTitleLabels = () => {
    if (item.type === 'book') {
      return {
        display: '中文名',
        original: '原版名称'
      };
    }
    return {
      display: '上映名',
      original: '原始片名'
    };
  };

  const titleLabels = getTitleLabels();

  return (
    <div className="bg-[#fcf9f3] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Cover Image */}
      <div className="aspect-[2/3] bg-white/80 relative group cursor-pointer" onClick={() => onViewDetail(item.id)}>
        {item.cover && !imageError ? (
          <img
            src={item.cover}
            alt={displayName.primary}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#f7f3eb] to-[#ebe5d9] p-4">
            <span className="text-4xl mb-2">
              {item.type === 'book' ? '📚' : '🎬'}
            </span>
            <span className="text-sm text-[#4a4a4a] text-center font-serif italic">
              {displayName.primary}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <div className="mb-2">
            <p className="text-xs text-[#8c8c8c] font-serif uppercase tracking-wider mb-1">
              {titleLabels.display}
            </p>
            <h3 className="font-serif text-[#2c2c2c] font-medium line-clamp-2 group-hover:text-[#666666] transition-colors">
              {displayName.primary}
            </h3>
            {displayName.secondary && (
              <p className="text-sm text-[#666666] italic font-serif line-clamp-1 mt-0.5">
                {displayName.secondary}
              </p>
            )}
          </div>
          
          {originalName && (
            <div>
              <p className="text-xs text-[#8c8c8c] font-serif uppercase tracking-wider mb-1">
                {titleLabels.original}
              </p>
              <p className="font-serif text-[#2c2c2c] line-clamp-1">
                {originalName.primary}
              </p>
              {originalName.secondary && (
                <p className="text-sm text-[#666666] italic font-serif line-clamp-1 mt-0.5">
                  {originalName.secondary}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#4a4a4a] font-serif line-clamp-1">
            {item.creator || '未知作者/导演'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1">
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

        {/* Status and Notes */}
        <div className="flex items-center justify-between text-xs font-serif text-[#8c8c8c]">
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
  );
};

export default MediaCard; 