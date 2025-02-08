import React, { useState } from 'react';
import Modal from './Modal';

interface Tag {
  id: number;
  name: string;
  count: number;
}

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onAddTag: (name: string) => void;
  onEditTag: (id: number, name: string) => void;
  onDeleteTag: (id: number) => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  isOpen,
  onClose,
  tags,
  onAddTag,
  onEditTag,
  onDeleteTag,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      setNewTagName('');
    }
  };

  const handleEditTag = () => {
    if (editingTag && editingTag.name.trim()) {
      onEditTag(editingTag.id, editingTag.name.trim());
      setEditingTag(null);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.count - a.count);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">标签管理</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* 添加新标签 */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="新标签名称..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              添加
            </button>
          </div>

          {/* 搜索标签 */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="搜索标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* 标签列表 */}
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100"
                >
                  {editingTag?.id === tag.id ? (
                    <div className="flex-1 flex gap-2 mr-2">
                      <input
                        type="text"
                        value={editingTag.name}
                        onChange={(e) =>
                          setEditingTag({ ...editingTag, name: e.target.value })
                        }
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleEditTag()}
                      />
                      <button
                        onClick={handleEditTag}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingTag(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{tag.name}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                          {tag.count}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTag(tag)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-white"
                        >
                          ✏️
                        </button>
                        {tag.count === 0 && (
                          <button
                            onClick={() => onDeleteTag(tag.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-white"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TagManager; 