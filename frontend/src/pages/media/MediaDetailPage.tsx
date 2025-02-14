import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import type { MediaType } from '@/types/media';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMediaDetail, MediaDetailResponse, deleteMedia } from '@/api/media';
import Layout from '@/components/Layout';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FilmIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  StarIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function MediaDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mediaType: MediaType = location.pathname.includes('/movies/') ? 'movie' : 'book';
  const [isDeleting, setIsDeleting] = React.useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');
  };

  const { data, isLoading, error } = useQuery<MediaDetailResponse, Error>({
    queryKey: ['media', mediaType, id],
    queryFn: () => fetchMediaDetail(mediaType, Number(id))
  });

  const handleEdit = () => {
    navigate(`/${mediaType === 'book' ? 'books' : 'movies'}/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;
    
    if (!window.confirm('确定要删除这条记录吗？')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMedia(Number(id));
      queryClient.invalidateQueries({ queryKey: ['media'] });
      navigate(`/${mediaType === 'book' ? 'books' : 'movies'}`);
    } catch (err) {
      console.error('删除失败:', err);
      alert(err instanceof Error ? err.message : '删除失败，请稍后重试');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data?.media) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-4">
              {mediaType === 'book' ? (
                <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300" />
              ) : (
                <FilmIcon className="w-16 h-16 mx-auto text-gray-300" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error ? `加载失败` : `未找到该${mediaType === 'book' ? '书籍' : '影视'}`}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {error ? error.message : `该内容可能已被删除或不存在`}
            </p>
            <Link
              to={`/${mediaType === 'book' ? 'books' : 'movies'}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
            >
              返回{mediaType === 'book' ? '书架' : '影视'}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { media } = data;
  const title = media?.title || '未命名';

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fcf9f3] to-[#f7f3eb] p-8">
        {/* 面包屑导航 */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-[#8b7355] hover:text-[#d4b483] transition-colors">
                <HomeIcon className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <Link
                  to={`/${mediaType === 'book' ? 'books' : 'movies'}`}
                  className="text-[#8b7355] hover:text-[#d4b483] transition-colors"
                >
                  {mediaType === 'book' ? (
                    <BookOpenIcon className="h-5 w-5" />
                  ) : (
                    <FilmIcon className="h-5 w-5" />
                  )}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-[#d4b483] mx-2">/</span>
                <span className="text-[#2c2c2c]">{title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-[#e9dcc9] overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h1 className="text-2xl font-medium text-[#2c2c2c]">{title}</h1>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-[#8b7355] hover:text-[#d4b483] transition-colors rounded-lg hover:bg-[#f7f3eb]"
                    title="编辑"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`p-2 text-[#8b7355] hover:text-red-600 transition-colors rounded-lg hover:bg-[#f7f3eb] ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="删除"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 状态标签 */}
              <div className="mb-8">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  media.status === 'completed' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                  media.status === 'in_progress' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                  media.status === 'plan_to_read' ? 'bg-[#f7f3eb] text-[#8b7355]' :
                  'bg-[#f7f3eb] text-[#8b7355]'
                }`}>
                  {media.status === 'completed' ? '已完成' :
                   media.status === 'in_progress' ? (mediaType === 'book' ? '在读' : '在看') :
                   media.status === 'plan_to_read' ? (mediaType === 'book' ? '想读' : '想看') :
                   '已弃'}
                </span>
              </div>
              
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-[#8b7355]">
                    <CalendarIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                    <span className="text-sm">创建时间: {formatDate(media.created_at)}</span>
                  </div>
                  <div className="flex items-center text-[#8b7355]">
                    <ClockIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                    <span className="text-sm">更新时间: {formatDate(media.updated_at)}</span>
                  </div>
                  <div className="flex items-center text-[#8b7355]">
                    <StarIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                    <span className="text-sm">评分: {media.rating ? `${media.rating} 星` : '未评分'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {media.creator && (
                    <div className="flex items-center text-[#8b7355]">
                      <span className="text-sm">{mediaType === 'book' ? '作者' : '导演'}: {media.creator}</span>
                    </div>
                  )}
                  {media.tags && media.tags.length > 0 && (
                    <div className="flex items-center text-[#8b7355]">
                      <TagIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                      <div className="flex flex-wrap gap-2">
                        {media.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 text-xs font-medium bg-[#f7f3eb] text-[#8b7355] rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {media.resource_link && (
                    <div className="flex items-center text-[#8b7355]">
                      <LinkIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                      <a 
                        href={media.resource_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#d4b483] hover:text-[#c9a978] hover:underline"
                      >
                        资源链接
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 描述 */}
              {media.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-[#2c2c2c] mb-4">描述</h2>
                  <p className="text-[#8b7355] whitespace-pre-wrap">{media.description}</p>
                </div>
              )}

              {/* 笔记列表 */}
              {data.notes && data.notes.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-[#2c2c2c] mb-4">笔记</h2>
                  <div className="space-y-4">
                    {data.notes.map((note, index) => (
                      <div key={index} className="bg-[#f7f3eb] rounded-lg p-4">
                        <p className="text-[#8b7355]">{note.content}</p>
                        {note.created_at && (
                          <p className="text-xs text-[#d4b483] mt-2">
                            {formatDate(note.created_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 进度条 */}
              {media?.progress !== undefined && media.progress > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-[#2c2c2c] mb-4">进度</h2>
                  <div className="flex items-center">
                    <div className="flex-1 bg-[#f7f3eb] rounded-full h-2">
                      <div 
                        className="bg-[#d4b483] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, media.progress || 0)}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm text-[#8b7355]">{media.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 