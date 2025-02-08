import React from 'react';
import { Media, Note } from '../types/media';

interface NoteDetailProps {
  item: Media;
  note: Note;
  onClose: () => void;
  onEdit: () => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({
  item,
  note,
  onClose,
  onEdit,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-[#f7f3eb] z-50 overflow-hidden flex">
      {/* Left Panel - Book Info */}
      <div className="w-80 bg-[#f7f3eb] p-8 border-r border-[#e8e1d5] overflow-y-auto">
        <div className="sticky top-0 space-y-8">
          {/* Book Cover */}
          <div className="aspect-[2/3] bg-white/80 rounded-sm overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {item.cover ? (
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
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
          </div>
        </div>
      </div>

      {/* Right Panel - Note Content */}
      <div className="flex-1 flex flex-col h-full bg-[#f7f3eb]">
        {/* Top Bar */}
        <div className="h-20 border-b border-[#e8e1d5] flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-serif text-[#2c2c2c]">Reading Notes</h1>
            <p className="text-sm text-[#8c8c8c] font-serif">
              {formatDate(note.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-8">
            <button
              className="px-6 py-2 text-[#666666] font-serif hover:text-[#2c2c2c] transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-6 py-2 font-serif border-b border-[#2c2c2c] text-[#2c2c2c] hover:text-[#666666] hover:border-[#666666] transition-colors"
              onClick={onEdit}
            >
              Edit Note
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#fcf9f3] rounded-sm p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="prose prose-stone prose-lg font-serif">
                {note.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-[#2c2c2c] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail; 