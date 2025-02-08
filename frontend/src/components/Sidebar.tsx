import React from 'react';
import { MediaType } from '../types/media';

interface SidebarProps {
  mediaType: MediaType;
  onChangeMediaType: (type: MediaType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mediaType,
  onChangeMediaType,
}) => {
  return (
    <div className="w-64 bg-[#fcf9f3] border-r border-[#e8e1d5] h-full overflow-y-auto p-6">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif text-[#2c2c2c]">Media Library</h1>
        </div>

        {/* Media Type Selector */}
        <div className="space-y-2">
          <h2 className="text-xs font-serif text-[#8c8c8c] uppercase tracking-wider">Media Type</h2>
          <div className="flex flex-col gap-2">
            <button
              className={`px-4 py-2 text-left font-serif rounded-sm transition-colors
                ${mediaType === 'book'
                  ? 'bg-[#2c2c2c] text-white'
                  : 'text-[#2c2c2c] hover:bg-[#ebe5d9]'
                }`}
              onClick={() => onChangeMediaType('book')}
            >
              Books
            </button>
            <button
              className={`px-4 py-2 text-left font-serif rounded-sm transition-colors
                ${mediaType === 'movie'
                  ? 'bg-[#2c2c2c] text-white'
                  : 'text-[#2c2c2c] hover:bg-[#ebe5d9]'
                }`}
              onClick={() => onChangeMediaType('movie')}
            >
              Movies
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <h2 className="text-xs font-serif text-[#8c8c8c] uppercase tracking-wider">Quick Filters</h2>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 text-left font-serif text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-colors">
              Currently Reading
            </button>
            <button className="px-4 py-2 text-left font-serif text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-colors">
              Wishlist
            </button>
            <button className="px-4 py-2 text-left font-serif text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-colors">
              Finished
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif text-[#8c8c8c] uppercase tracking-wider">Categories</h2>
            <button className="text-xs font-serif text-[#666666] hover:text-[#2c2c2c] transition-colors">
              Manage
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {/* TODO: Add dynamic categories */}
            <button className="px-4 py-2 text-left font-serif text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-colors">
              Fiction
            </button>
            <button className="px-4 py-2 text-left font-serif text-[#2c2c2c] hover:bg-[#ebe5d9] rounded-sm transition-colors">
              Non-Fiction
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif text-[#8c8c8c] uppercase tracking-wider">Tags</h2>
            <button className="text-xs font-serif text-[#666666] hover:text-[#2c2c2c] transition-colors">
              Manage
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* TODO: Add dynamic tags */}
            <button className="px-3 py-1 text-sm font-serif text-[#4a4a4a] bg-[#f7f3eb] hover:bg-[#ebe5d9] rounded-sm border border-[#e8e1d5] transition-colors">
              philosophy
            </button>
            <button className="px-3 py-1 text-sm font-serif text-[#4a4a4a] bg-[#f7f3eb] hover:bg-[#ebe5d9] rounded-sm border border-[#e8e1d5] transition-colors">
              history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 