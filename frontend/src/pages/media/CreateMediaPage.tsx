import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, HomeIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { api } from '@/api/client';
import { MediaType, MediaStatus } from '@/types/media';
import { withAuth } from '@/components/withAuth';

interface CreateMediaPageProps {
  type: MediaType;
}

interface CreateMediaData {
  type: MediaType;
  title: string;
  display_name: {
    primary: string;
    secondary?: string;
  };
  description: string;
  creator?: string;
  status: MediaStatus;
  rating: number;
  resource_link?: string;
}

function CreateMediaPage({ type }: CreateMediaPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const data: CreateMediaData = {
        type,
        title,
        display_name: {
          primary: title,
        },
        description: formData.get('description') as string || '',
        creator: formData.get('creator') as string || undefined,
        status: (formData.get('status') as string || 'plan_to_read') as MediaStatus,
        rating: Number(formData.get('rating')) || 0,
        resource_link: formData.get('resource_link') as string || undefined,
      };

      const response = await api.media.create(data);
      navigate(`/${type === 'book' ? 'books' : 'movies'}/${response.id}`);
    } catch (err) {
      console.error('创建失败:', err);
      setError(err instanceof Error ? err.message : '创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout children={
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
                <Link 
                  to={`/${type === 'book' ? 'books' : 'movies'}`} 
                  className="text-[#8b7355] hover:text-[#6b563e] flex items-center transition-colors"
                >
                  {type === 'book' ? <BookOpenIcon className="h-5 w-5" /> : <FilmIcon className="h-5 w-5" />}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <span className="text-[#6b563e]">添加{type === 'book' ? '书籍' : '影视'}</span>
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
                {type === 'book' ? (
                  <>
                    <BookOpenIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      添加新书籍
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </>
                ) : (
                  <>
                    <FilmIcon className="w-7 h-7 mr-3 text-[#d4b483]" />
                    <span className="relative">
                      添加新影视
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4b483] opacity-30"></span>
                    </span>
                  </>
                )}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="group">
                      <label htmlFor="title" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                        标题 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm"
                        placeholder={`请输入${type === 'book' ? '书籍' : '影视'}标题`}
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="creator" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                        {type === 'book' ? '作者' : '导演'}
                      </label>
                      <input
                        type="text"
                        name="creator"
                        id="creator"
                        className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm"
                        placeholder={type === 'book' ? '作者姓名' : '导演姓名'}
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="group">
                      <label htmlFor="status" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                        状态 <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        id="status"
                        className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm"
                      >
                        <option value="plan_to_read">想{type === 'book' ? '读' : '看'}</option>
                        <option value="in_progress">{type === 'book' ? '在读' : '在看'}</option>
                        <option value="completed">已完成</option>
                        <option value="dropped">已弃</option>
                      </select>
                    </div>

                    <div className="group">
                      <label htmlFor="rating" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                        评分
                      </label>
                      <div className="relative">
                        <select
                          name="rating"
                          id="rating"
                          defaultValue="0"
                          className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm appearance-none"
                        >
                          <option value="0">未评分</option>
                          <option value="0.5">0.5 分 - 不推荐</option>
                          <option value="1">1.0 分 - 很差</option>
                          <option value="1.5">1.5 分 - 较差</option>
                          <option value="2">2.0 分 - 一般</option>
                          <option value="2.5">2.5 分 - 还行</option>
                          <option value="3">3.0 分 - 不错</option>
                          <option value="3.5">3.5 分 - 推荐</option>
                          <option value="4">4.0 分 - 很好</option>
                          <option value="4.5">4.5 分 - 非常好</option>
                          <option value="5">5.0 分 - 完美</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-[#d4b483]">⭐️</span>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="resource_link" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                        资源链接
                      </label>
                      <input
                        type="url"
                        name="resource_link"
                        id="resource_link"
                        className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm"
                        placeholder={type === 'book' ? '豆瓣链接/在线阅读地址' : '豆瓣链接/在线观看地址'}
                      />
                      <p className="mt-1 text-sm text-[#8b7355]">可以填写豆瓣链接或其他在线{type === 'book' ? '阅读' : '观看'}地址</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="description" className="block text-base font-medium text-[#6b563e] mb-2 group-hover:text-[#8b7355] transition-colors">
                    描述
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#e9dcc9] focus:ring-[#d4b483] focus:border-[#d4b483] hover:border-[#d4b483] transition duration-150 shadow-sm"
                    placeholder={`请输入${type === 'book' ? '书籍' : '影视'}描述`}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    to={`/${type === 'book' ? 'books' : 'movies'}`}
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
    } />
  );
}

export default withAuth(CreateMediaPage, '请先登录后再添加内容'); 
