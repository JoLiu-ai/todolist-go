import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, HomeIcon, AcademicCapIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { api, KnowledgeData } from '@/api/client';

export default function KnowledgePage() {
  const [items, setItems] = useState([] as KnowledgeData[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const data = await api.knowledge.getAll();
        setItems(data || []);
      } catch (err) {
        console.error('获取知识列表失败:', err);
        setError(err instanceof Error ? err.message : '获取知识列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'programming':
        return '编程';
      case 'life':
        return '生活';
      default:
        return '其他';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'programming':
        return 'bg-blue-100 text-blue-800';
      case 'life':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        {/* 面包屑导航 */}
        <nav className="mb-8 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-[#8b7355] hover:text-[#6b563e] flex items-center transition-colors">
                <HomeIcon className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <div className="flex items-center text-[#8b7355]">
                  <AcademicCapIcon className="h-5 w-5" />
                </div>
              </div>
            </li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-[#e9dcc9] overflow-hidden">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#f7f3eb] rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f7f3eb] rounded-full -z-10"></div>
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-[#2c2c2c] flex items-center">
                    <AcademicCapIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      知识列表
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </h2>
                  <Link
                    to="/knowledge/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    添加知识
                  </Link>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d4b483] border-t-transparent"></div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无知识记录</h3>
                    <p className="mt-1 text-sm text-gray-500">点击右上角按钮添加新知识</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: KnowledgeData) => (
                      <Link
                        key={item.id}
                        to={`/knowledge/${item.id}`}
                        className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-[#e9dcc9] hover:border-[#d4b483] overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-medium text-[#2c2c2c] group-hover:text-[#d4b483] transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap ${getCategoryColor(item.category)}`}>
                              {getCategoryLabel(item.category)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {truncateText(item.content, 150)}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex items-center">
                                <TagIcon className="w-4 h-4 mr-1" />
                                <span>{item.tags.length} 个标签</span>
                              </div>
                            )}
                          </div>

                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f7f3eb] text-[#8b7355] group-hover:bg-[#e9dcc9] transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f7f3eb] text-[#8b7355]">
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 