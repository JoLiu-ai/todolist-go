import { useLoaderData } from 'react-router-dom';

export default function MediaDetailPage({ type }: { type: 'book' | 'movie' }) {
  const mediaItem = useLoaderData() as Media;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-serif mb-4">{mediaItem.title}</h1>
      <p className="text-lg text-gray-600">
        {type === 'book' ? '作者' : '导演'}：{mediaItem.creator}
      </p>
      {/* 其他详情信息 */}
    </div>
  );
} 