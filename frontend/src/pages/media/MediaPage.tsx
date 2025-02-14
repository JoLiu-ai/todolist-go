import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { api } from '@/api/client';
import { Media, MediaType } from '@/types/media';

interface MediaPageProps {
  type: MediaType;
}

export default function MediaPage({ type }: MediaPageProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError('');
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get('status');
        
        const response = await api.media.getAll({ type, status: status || undefined });
        
        if (mounted) {
          let processedItems: Media[] = [];
          if (Array.isArray(response)) {
            processedItems = response;
          } else if ('items' in response && Array.isArray(response.items)) {
            processedItems = response.items;
          }
          setItems(processedItems);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : '获取列表失败，请稍后重试');
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMedia();

    return () => {
      mounted = false;
    };
  }, [type, location.search]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-[#e9dcc9]">
            <h3 className="text-sm text-[#8b7355] mb-2">{type === 'book' ? '在读' : '在看'}</h3>
            <p className="text-3xl font-medium text-[#d4b483]">
              {items.filter(item => item.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-[#e9dcc9]">
            <h3 className="text-sm text-[#8b7355] mb-2">本月完成</h3>
            <p className="text-3xl font-medium text-[#d4b483]">
              {items.filter(item => item.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-[#e9dcc9]">
            <h3 className="text-sm text-[#8b7355] mb-2">总数</h3>
            <p className="text-3xl font-medium text-[#d4b483]">{items.length}</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            {type === 'book' ? (
              <BookOpenIcon className="w-6 h-6 text-[#d4b483] mr-2" />
            ) : (
              <FilmIcon className="w-6 h-6 text-[#d4b483] mr-2" />
            )}
            <h2 className="text-xl font-medium text-[#2c2c2c]">
              {type === 'book' ? '书籍列表' : '影视列表'}
            </h2>
          </div>
          <Link
            to={`/${type === 'book' ? 'books' : 'movies'}/create`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            添加{type === 'book' ? '书籍' : '影视'}
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d4b483] border-t-transparent"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              {type === 'book' ? (
                <BookOpenIcon className="w-12 h-12 mx-auto text-[#d4b483]" />
              ) : (
                <FilmIcon className="w-12 h-12 mx-auto text-[#d4b483]" />
              )}
            </div>
            <p className="text-[#8b7355]">
              暂无{type === 'book' ? '书籍' : '影视'}记录，点击添加按钮开始创建！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <Link
                key={item.id}
                to={`/${type === 'book' ? 'books' : 'movies'}/${item.id}`}
                className="block bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-[#e9dcc9]"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#2c2c2c] group-hover:text-[#d4b483] transition-colors">
                      {item.title}
                    </h3>
                    <span className={`ml-2 px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.status === 'completed' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                      item.status === 'in_progress' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                      item.status === 'plan_to_read' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                      'bg-[#f7f3eb] text-[#8b7355]'
                    }`}>
                      {item.status === 'completed' ? '已完成' :
                       item.status === 'in_progress' ? (type === 'book' ? '在读' : '在看') :
                       item.status === 'plan_to_read' ? (type === 'book' ? '想读' : '想看') :
                       '已弃'}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-[#8b7355] mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-[#8b7355]">
                      {item.creator || (type === 'book' ? '未知作者' : '未知导演')}
                    </div>
                    {item.rating > 0 && (
                      <div className="flex items-center text-yellow-400">
                        {'⭐️'.repeat(Math.floor(item.rating))}
                        <span className="ml-1 text-[#8b7355]">({item.rating})</span>
                      </div>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-[#f7f3eb] text-[#8b7355] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium bg-[#f7f3eb] text-[#8b7355] rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 