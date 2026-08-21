import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { BookOpenIcon, FilmIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { taskApi, Task, TaskStats } from '../api/tasks';
import { api } from '../api/client';
import { Media } from '../types/media';
import { MediaStats } from '../types/types';

export default function HomePage() {
  const { user } = useAuth();
  const [todayTasks, setTodayTasks] = useState([] as Task[]);
  const [stats, setStats] = useState({
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
  } as TaskStats);
  const [mediaStats, setMediaStats] = useState({
    total_books: 0,
    reading_books: 0,
    total_movies: 0,
    watching_movies: 0,
  } as MediaStats);
  const [recentMedia, setRecentMedia] = useState([] as Media[]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  
  useEffect(() => {
    if (user) {
      void fetchTodayTasks();
      void fetchTaskStats();
      void fetchMediaStats();
      void fetchRecentMedia();
    }
  }, [user]);

  const fetchTodayTasks = async () => {
    try {
      const data = await taskApi.getToday();
      setTodayTasks(data);
    } catch (err) {
      console.error('获取今日任务失败:', err);
    }
  };

  const fetchTaskStats = async () => {
    try {
      const data = await taskApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('获取统计信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaStats = async () => {
    try {
      const response = await api.media.getStats();
      setMediaStats(response);
    } catch (err) {
      console.error('获取媒体统计信息失败:', err);
      setMediaStats({
        total_books: 0,
        reading_books: 0,
        total_movies: 0,
        watching_movies: 0,
      });
    }
  };

  const fetchRecentMedia = async () => {
    try {
      const response = await api.media.getAll({ limit: 3 });
      setRecentMedia(response.items || []);
    } catch (err) {
      console.error('获取最近媒体失败:', err);
      setRecentMedia([]);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="p-8">
        {/* 欢迎信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-[#2c2c2c] mb-4">
              「欢迎回来，<span className="text-[#d4b483] font-medium">{user?.username}</span>」
            </h1>
            <p className="text-[#8b7355] text-lg font-light italic">
              今天是美好的一天，让我们开始记录生活中的点点滴滴吧
            </p>
            <div className="mt-4 w-24 h-0.5 bg-[#d4b483] opacity-30 mx-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧统计卡片 */}
          <div className="lg:col-span-4 space-y-8">
            {/* 任务统计 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="w-4 h-4 mr-2 text-[#d4b483]" />
                任务统计
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <p className="text-3xl font-serif text-[#2c2c2c] mb-1 transition-colors duration-300 group-hover:text-[#d4b483]">{stats.total_tasks}</p>
                  <p className="text-xs text-gray-500">总任务数</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-green-600 mb-1 transition-colors duration-300 group-hover:text-green-500">{stats.completed_tasks}</p>
                  <p className="text-xs text-gray-500">已完成</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-yellow-600 mb-1 transition-colors duration-300 group-hover:text-yellow-500">{stats.pending_tasks}</p>
                  <p className="text-xs text-gray-500">待处理</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-red-600 mb-1 transition-colors duration-300 group-hover:text-red-500">{stats.overdue_tasks}</p>
                  <p className="text-xs text-gray-500">已逾期</p>
                </div>
              </div>
            </div>

            {/* 媒体统计 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                <BookOpenIcon className="w-4 h-4 mr-2 text-[#d4b483]" />
                媒体统计
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <p className="text-3xl font-serif text-[#2c2c2c] mb-1 transition-colors duration-300 group-hover:text-[#d4b483]">{mediaStats.total_books}</p>
                  <p className="text-xs text-gray-500">书籍总数</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-blue-600 mb-1 transition-colors duration-300 group-hover:text-blue-500">{mediaStats.reading_books}</p>
                  <p className="text-xs text-gray-500">正在阅读</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-[#2c2c2c] mb-1 transition-colors duration-300 group-hover:text-[#d4b483]">{mediaStats.total_movies}</p>
                  <p className="text-xs text-gray-500">影视总数</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-serif text-purple-600 mb-1 transition-colors duration-300 group-hover:text-purple-500">{mediaStats.watching_movies}</p>
                  <p className="text-xs text-gray-500">正在观看</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="lg:col-span-8 space-y-8">
            {/* 今日任务 */}
            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif text-[#2c2c2c] flex items-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                  今日任务
                </h2>
                <Link
                  to="/tasks"
                  className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors flex items-center group"
                >
                  查看全部
                  <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-sm text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="text-[#d4b483] animate-pulse text-sm">加载中...</div>
                </div>
              ) : todayTasks.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-gray-500 text-sm">今天还没有任务</div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {todayTasks.slice(0, 3).map((task: Task) => (
                    <div key={task.id} className="py-3 group hover:bg-gray-50 transition-colors duration-300 rounded-md -mx-4 px-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#d4b483] transition-colors duration-300">{task.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description || '无描述'}</p>
                        </div>
                        <Link
                          to={`/tasks/${task.id}`}
                          className="text-xs text-[#d4b483] hover:text-[#c9a978] transition-colors flex items-center group ml-4"
                        >
                          查看
                          <svg className="w-4 h-4 ml-1 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {todayTasks.length > 3 && (
                    <div className="pt-3 text-center">
                      <Link to="/tasks" className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors">
                        查看更多 ({todayTasks.length - 3} 项)
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 最近媒体 */}
            <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif text-[#2c2c2c] flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2 text-[#d4b483]" />
                  最近更新
                </h2>
                <div className="flex space-x-6">
                  <Link to="/books" className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors flex items-center group">
                    书籍
                    <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link to="/movies" className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors flex items-center group">
                    影视
                    <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {recentMedia.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-gray-500 text-sm">
                    还没有添加任何书籍或影视记录
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {recentMedia.map((media: Media) => (
                    <Link
                      key={media.id}
                      to={`/${media.type === 'book' ? 'books' : 'movies'}/${media.id}`}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                    >
                      {media.cover_image ? (
                        <img
                          src={media.cover_image}
                          alt={media.display_name?.primary || media.title || '未命名'}
                          className="w-12 h-16 object-cover rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-300"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-100 rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center">
                          {media.type === 'book' ? (
                            <BookOpenIcon className="w-6 h-6 text-gray-400" />
                          ) : (
                            <FilmIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#d4b483] transition-colors duration-300">
                          {media.display_name?.primary || media.title || '未命名'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {media.creator || '未知创作者'}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 group-hover:bg-[#d4b483] group-hover:text-white transition-colors duration-300">
                            {media.status === 'in_progress'
                              ? media.type === 'book'
                                ? '正在阅读'
                                : '正在观看'
                              : media.status === 'completed'
                              ? '已完成'
                              : media.status === 'plan_to_read'
                              ? media.type === 'book' ? '想读' : '想看'
                              : '已弃置'}
                          </span>
                          {media.rating > 0 && (
                            <span className="text-xs text-yellow-500">
                              {'★'.repeat(media.rating)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 