import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api, KnowledgeData } from '../api/client';

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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-sm">
              {error}
            </div>
            <Link
              to="/knowledge"
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回知识列表
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4 text-gray-600">
              未找到知识内容
            </div>
            <Link
              to="/knowledge"
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回知识列表
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <HomeIcon className="w-5 h-5" />
            </Link>
            <span className="text-gray-500">/</span>
            <Link to="/knowledge" className="text-gray-500 hover:text-gray-700">
              <AcademicCapIcon className="w-5 h-5" />
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900">知识详情</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
              title="编辑"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`p-2 text-gray-500 hover:text-red-600 transition-colors ${
                deleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="删除"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-sm">
          <div className="p-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">
              {item.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>{getCategoryLabel(item.category || 'other')}</span>
              <span>·</span>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
              {item.created_at !== item.updated_at && (
                <>
                  <span>·</span>
                  <span>
                    更新于 {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-sm max-w-none">
              {item.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
