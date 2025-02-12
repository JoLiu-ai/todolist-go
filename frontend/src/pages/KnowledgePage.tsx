import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, HomeIcon, AcademicCapIcon, TagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api, KnowledgeData } from '../api/client';

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
      <div className="p-8">
        {/* 面包屑导航 */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="flex items-center group">
                  <HomeIcon className="w-4 h-4 text-[#d4b483]" />
                  <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-[#d4b483] transition-colors">
                    首页
                  </span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-[#d4b483]">/</span>
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-4 h-4 text-[#d4b483]" />
                    <span className="ml-2 text-sm font-medium text-[#d4b483]">
                      知识
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow-sm rounded-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-[#2c2c2c]">
              知识列表
            </h2>
            <Link
              to="/knowledge/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加知识
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d4b483] border-t-transparent"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无知识记录，点击右上角按钮添加
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item: KnowledgeData) => (
                <Link
                  key={item.id}
                  to={`/knowledge/${item.id}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#d4b483] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <span className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {truncateText(item.content, 150)}
                    </p>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-2">
                        <TagIcon className="w-4 h-4 text-gray-400" />
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 