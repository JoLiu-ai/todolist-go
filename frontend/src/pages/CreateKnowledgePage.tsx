import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { CreateKnowledgeData } from '../types/types';
import { withAuth } from '@/components/withAuth';

type CreateKnowledgeFormData = Omit<CreateKnowledgeData, 'id' | 'created_at' | 'updated_at'>;

const initialFormData: CreateKnowledgeFormData = {
  title: '',
  content: '',
  category: 'technology'
};

function CreateKnowledgePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.knowledge.create(formData);
      navigate('/knowledge');
    } catch (error) {
      console.error('Failed to create knowledge:', error);
      setError(error instanceof Error ? error.message : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CreateKnowledgeFormData) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout children={
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <HomeIcon className="w-5 h-5" />
            </Link>
            <span className="text-gray-500">/</span>
            <Link to="/knowledge" className="text-gray-500 hover:text-gray-700">
              <AcademicCapIcon className="w-5 h-5" />
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900">创建知识</span>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-6">记录新知识</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483] focus:ring-1 focus:ring-[#d4b483]"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483] focus:ring-1 focus:ring-[#d4b483]"
              >
                <option value="technology">技术</option>
                <option value="life">生活</option>
                <option value="work">工作</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483] focus:ring-1 focus:ring-[#d4b483]"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to="/knowledge"
                className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow-md ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '创建中...' : '创建知识'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(CreateKnowledgePage, '请先登录后再创建知识');
