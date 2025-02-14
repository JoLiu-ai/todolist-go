import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon, PencilIcon, TrashIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { api, KnowledgeData } from '@/api/client';

export default function KnowledgeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<KnowledgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchKnowledge = async () => {
      if (!id) return;
      
      try {
        const data = await api.knowledge.getById(Number(id));
        setItem(data);
      } catch (err) {
        console.error('获取知识详情失败:', err);
        setError(err instanceof Error ? err.message : '获取知识详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [id]);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/knowledge/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || deleting) return;
    
    setDeleting(true);
    try {
      await api.knowledge.delete(Number(id));
      navigate('/knowledge');
    } catch (err) {
      console.error('删除失败:', err);
      setError(err instanceof Error ? err.message : '删除失败，请稍后重试');
      setDeleting(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const categories = {
      'technology': '技术',
      'life': '生活',
      'work': '工作',
      'other': '其他'
    };
    return categories[category as keyof typeof categories] || '其他';
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      'technology': 'bg-blue-50 text-blue-700 border-blue-200',
      'life': 'bg-green-50 text-green-700 border-green-200',
      'work': 'bg-purple-50 text-purple-700 border-purple-200',
      'other': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d4b483] border-t-transparent"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                {error}
              </div>
              <Link
                to="/knowledge"
                className="text-[#d4b483] hover:text-[#c9a978] transition-colors"
              >
                返回知识列表
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">未找到知识内容</h3>
              <p className="mt-1 text-sm text-gray-500">该内容可能已被删除或移动</p>
              <div className="mt-6">
                <Link
                  to="/knowledge"
                  className="text-[#d4b483] hover:text-[#c9a978] transition-colors"
                >
                  返回知识列表
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        <div className="max-w-4xl mx-auto">
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
                  <Link to="/knowledge" className="text-[#8b7355] hover:text-[#6b563e] flex items-center transition-colors">
                    <AcademicCapIcon className="h-5 w-5" />
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-[#d4b483] mx-2">/</span>
                  <span className="text-[#6b563e]">知识详情</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-[#e9dcc9] overflow-hidden">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#f7f3eb] rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f7f3eb] rounded-full -z-10"></div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-serif text-[#2c2c2c]">
                    {item.title}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEdit}
                      className="p-2 text-[#8b7355] hover:text-[#d4b483] transition-colors"
                      title="编辑"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`p-2 text-[#8b7355] hover:text-red-600 transition-colors ${
                        deleting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="删除"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(item.category || 'other')}`}>
                    {getCategoryLabel(item.category || 'other')}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    {item.created_at !== item.updated_at && (
                      <span className="ml-2">
                        (更新于 {new Date(item.updated_at).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <TagIcon className="w-4 h-4 mr-1" />
                      <span>标签</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f7f3eb] text-[#8b7355] hover:bg-[#e9dcc9] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-600">
                  {item.content.split('\n').map((paragraph: string, index: number) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
