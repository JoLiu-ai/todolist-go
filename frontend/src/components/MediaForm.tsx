import React, { useState, useEffect } from 'react';
import { Media, MediaType, MediaStatus, Category } from '../types/media';

interface MediaFormProps {
  type: MediaType;
  item?: Media;
  onSubmit: (data: Partial<Media>) => void;
  onCancel: () => void;
  categories: Category[];
}

const MediaForm: React.FC<MediaFormProps> = ({
  type,
  item,
  onSubmit,
  onCancel,
  categories,
}) => {
  const [formData, setFormData] = useState<Partial<Media>>({
    type,
    display_name: {
      primary: ''
    },
    original_name: {
      primary: ''
    },
    creator: '',
    description: {
      primary: ''
    },
    status: 'wishlist' as MediaStatus,
    rating: 0,
    category_id: categories[0]?.id || 0,
    tags: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        display_name: item.display_name || { primary: '' },
        original_name: item.original_name || { primary: '' },
        description: item.description || { primary: '' },
        tags: item.tags || [],
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6 bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">{type === 'book' ? '📚' : '🎬'}</span>
            封面与基本信息
          </h3>

          {/* Cover Image Preview */}
          <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {formData.cover ? (
              <img
                src={formData.cover}
                alt={formData.display_name?.primary}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">{type === 'book' ? '📚' : '🎬'}</span>
                <span className="text-sm">点击下方输入框添加封面图片</span>
              </div>
            )}
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
            <div className="relative">
              <input
                type="url"
                value={formData.cover || ''}
                onChange={e => setFormData({ ...formData, cover: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                placeholder="https://"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔗
              </span>
            </div>
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as MediaStatus })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="wishlist">🔖 想看</option>
                <option value="ongoing">📖 进行中</option>
                <option value="finished">✨ 已完成</option>
                <option value="dropped">📌 已弃</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">评分</label>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: index + 1 })}
                  className={`text-2xl transition-all transform hover:scale-110 ${
                    index < (formData.rating || 0)
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {formData.rating ? `${formData.rating} 星` : '未评分'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 bg-gradient-to-b from-blue-50 to-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">✍️</span>
            详细信息
          </h3>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'book' ? '中文名' : '上映名'}
            </label>
            <input
              type="text"
              value={formData.display_name?.primary || ''}
              onChange={e => setFormData({
                ...formData,
                display_name: {
                  primary: e.target.value
                }
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Original Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'book' ? '原版名称' : '原始片名'}
            </label>
            <input
              type="text"
              value={formData.original_name?.primary || ''}
              onChange={e => setFormData({
                ...formData,
                original_name: {
                  primary: e.target.value
                }
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Creator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'book' ? '作者' : '导演'}
            </label>
            <input
              type="text"
              value={formData.creator || ''}
              onChange={e => setFormData({ ...formData, creator: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={formData.description?.primary || ''}
              onChange={e => setFormData({
                ...formData,
                description: {
                  primary: e.target.value
                }
              })}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={type === 'book' ? '写下你对这本书的简单介绍...' : '写下你对这部作品的简单介绍...'}
            />
          </div>

          {/* Resource Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">资源链接</label>
            <input
              type="url"
              value={formData.resource_link || ''}
              onChange={e => setFormData({ ...formData, resource_link: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入标签后按回车添加"
                  onKeyDown={handleTagInput}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🏷️
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] bg-gray-50 p-2 rounded-lg">
                {formData.tags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800 hover:scale-110 transform transition-transform"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.tags?.length === 0 && (
                  <span className="text-sm text-gray-400">还没有添加标签</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all transform hover:-translate-y-0.5"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow"
        >
          {item ? '保存' : '创建'}
        </button>
      </div>
    </form>
  );
};

export default MediaForm; 