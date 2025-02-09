import React from 'react';
import { Media } from '../types/media';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/${item.type}s/${item.id}`, {
      state: { backgroundLocation: location }
    });
  };

  return (
    <div
      className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleItemClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleItemClick()}
    >
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {item.type === 'book' ? '作者：' : '导演：'}
          <span className="ml-1">{item.creator}</span>
        </p>
      </div>
      <p className="text-xs text-gray-400">
        {new Date(item.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default MediaListItem; 