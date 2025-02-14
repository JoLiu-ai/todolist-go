import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { api } from '@/api/client';
import { Knowledge } from '@/types/types';
import { withAuth } from '@/components/withAuth';

type CreateKnowledgeFormData = {
  title: string;
  content: string;
  category: string;
  tags?: string[];
};

const initialFormData: CreateKnowledgeFormData = {
  title: '',
  content: '',
  category: 'other',
  tags: [],
};

function CreateKnowledgePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    api.knowledge.create(formData)
      .then(() => {
        navigate('/knowledge');
      })
      .catch((err) => {
        console.error('创建失败:', err);
        setError(err instanceof Error ? err.message : '创建失败，请稍后重试');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (
    e: { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CreateKnowledgeFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData((prev: CreateKnowledgeFormData) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: CreateKnowledgeFormData) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove),
    }));
  };

  const handleTagInputChange = (e: { target: { value: string } }) => {
    setTagInput(e.target.value);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        {/* 面包屑导航 */}
        <nav className="mb-8 flex" aria-label="Breadcrumb">
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
                <Link to="/knowledge" className="flex items-center group">
                  <AcademicCapIcon className="w-4 h-4 text-[#d4b483]" />
                  <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-[#d4b483] transition-colors">
                    知识
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-[#d4b483]">/</span>
                <span className="text-sm font-medium text-[#d4b483]">
                  添加知识
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-[#e9dcc9] p-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#f7f3eb] rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f7f3eb] rounded-full -z-10"></div>
              <h2 className="text-2xl font-serif text-[#2c2c2c] mb-8 flex items-center relative">
                <AcademicCapIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                <span className="relative">
                  添加知识
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                </span>
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    内容
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                  >
                    <option value="technology">技术</option>
                    <option value="life">生活</option>
                    <option value="work">工作</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-sm">
                    {formData.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f7f3eb] text-[#8b7355] hover:bg-[#e9dcc9] transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-[#8b7355] hover:text-[#6b563e] focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleAddTag}
                      className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483] pr-12"
                      placeholder="输入标签后按回车添加"
                    />
                    {tagInput && (
                      <button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim()) {
                            setFormData((prev: CreateKnowledgeFormData) => ({
                              ...prev,
                              tags: [...(prev.tags || []), tagInput.trim()],
                            }));
                            setTagInput('');
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#8b7355] hover:text-[#6b563e] focus:outline-none"
                      >
                        添加
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    按回车或点击添加按钮来添加标签
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    to="/knowledge"
                    className="px-6 py-2.5 text-sm font-medium text-[#8b7355] bg-[#f7f3eb] rounded-lg hover:bg-[#e9dcc9] transition duration-150"
                  >
                    取消
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition duration-150 flex items-center shadow-sm hover:shadow ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {loading ? '创建中...' : '创建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(CreateKnowledgePage, '请先登录后再创建知识');
