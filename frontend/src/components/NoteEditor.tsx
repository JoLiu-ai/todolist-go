import React, { useState, useCallback } from 'react';
import { Media } from '../types/media';

interface NoteEditorProps {
  item: Media;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

const getTagColor = (tag: string) => {
  // Generate a consistent color based on the tag string
  const colors = [
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-green-50 text-green-700 border-green-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-yellow-50 text-yellow-700 border-yellow-200',
    'bg-pink-50 text-pink-700 border-pink-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-red-50 text-red-700 border-red-200',
    'bg-orange-50 text-orange-700 border-orange-200',
  ];
  
  // Use string length and character codes to generate a consistent index
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const NoteEditor: React.FC<NoteEditorProps> = ({
  item,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      await onSubmit(content);
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, onSubmit, onClose]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'from-blue-50 to-blue-100 text-blue-800';
      case 'finished':
        return 'from-green-50 to-green-100 text-green-800';
      case 'wishlist':
        return 'from-yellow-50 to-yellow-100 text-yellow-800';
      case 'dropped':
        return 'from-red-50 to-red-100 text-red-800';
      default:
        return 'from-gray-50 to-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f7f3eb] z-50 overflow-hidden flex">
      {/* Left Panel - Book Info */}
      <div className="w-80 bg-[#f7f3eb] p-8 border-r border-[#e8e1d5] overflow-y-auto">
        <div className="sticky top-0 space-y-8">
          {/* Book Cover */}
          <div className="aspect-[2/3] bg-white/80 rounded-sm overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {item.cover && !imageError ? (
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#f7f3eb] to-[#ebe5d9] p-4">
                <span className="text-4xl mb-3">
                  {item.type === 'book' ? '📚' : '🎬'}
                </span>
                <span className="text-sm text-[#4a4a4a] text-center font-serif italic">
                  {item.title}
                </span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-[#2c2c2c] leading-relaxed">
                {item.title}
              </h2>
              {item.originalTitle && (
                <p className="text-sm text-[#666666] italic font-serif">
                  {item.originalTitle}
                </p>
              )}
            </div>
            <div className="border-t border-[#e8e1d5] pt-4">
              <p className="text-xs text-[#8c8c8c] font-serif uppercase tracking-wider mb-2">Creator</p>
              <button 
                className="font-serif text-[#2c2c2c] hover:text-[#666666] transition-colors flex items-center group"
                onClick={() => {/* TODO: Navigate to creator page */}}
              >
                <span className="text-lg">{item.creator}</span>
                <svg 
                  className="w-4 h-4 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            {item.description && (
              <div className="border-t border-[#e8e1d5] pt-4">
                <p className="text-xs text-[#8c8c8c] font-serif uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm leading-relaxed text-[#4a4a4a] font-serif">{item.description}</p>
              </div>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="border-t border-[#e8e1d5] pt-4">
                <p className="text-xs text-[#8c8c8c] font-serif uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#f7f3eb] text-[#4a4a4a] text-xs font-serif rounded-sm border border-[#e8e1d5] hover:bg-[#ebe5d9] transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="flex-1 flex flex-col h-full bg-[#f7f3eb]">
        {/* Top Bar */}
        <div className="h-20 border-b border-[#e8e1d5] flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-serif text-[#2c2c2c]">Reading Notes</h1>
            <p className="text-sm text-[#8c8c8c] font-serif">
              {content.length} characters
            </p>
          </div>
          <div className="flex items-center space-x-8">
            <button
              className="px-6 py-2 text-[#666666] font-serif hover:text-[#2c2c2c] transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 font-serif border-b transition-all
                ${isSaving || !content.trim() 
                  ? 'text-[#8c8c8c] border-transparent cursor-not-allowed' 
                  : 'text-[#2c2c2c] border-[#2c2c2c] hover:text-[#666666] hover:border-[#666666]'
                }`}
              onClick={handleSubmit}
              disabled={!content.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden p-8">
          <textarea
            className="w-full min-h-[200px] p-8 text-base text-[#2c2c2c] bg-[#fcf9f3] rounded-sm 
              font-serif leading-relaxed resize-vertical focus:outline-none focus:bg-white 
              transition-all duration-300 placeholder:text-[#8c8c8c] placeholder:font-serif
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor; 