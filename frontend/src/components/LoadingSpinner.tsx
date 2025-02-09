import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-[#ebe5d9] rounded-full"></div>
        <div className="absolute inset-0 border-2 border-[#d4b483] rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
      </div>
      <span className="sr-only">加载中...</span>
    </div>
  );
};

export default LoadingSpinner;
