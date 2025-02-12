import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, FilmIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { taskApi, Task, TaskStats } from '../api/tasks';

export default function HomePage() {
  const { user } = useAuth();
  const [todayTasks, setTodayTasks] = useState([] as Task[]);
  const [stats, setStats] = useState({
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
  } as TaskStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchTodayTasks();
      fetchTaskStats();
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

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="p-8">
        {/* 欢迎信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-2">欢迎回来，{user.username}</h2>
          <p className="text-gray-600">
            今天是美好的一天，让我们开始记录生活中的点点滴滴吧。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">总任务数</h3>
            <p className="text-3xl font-serif text-[#2c2c2c]">{stats.total_tasks}</p>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">已完成</h3>
            <p className="text-3xl font-serif text-green-600">{stats.completed_tasks}</p>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">待处理</h3>
            <p className="text-3xl font-serif text-yellow-600">{stats.pending_tasks}</p>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">已逾期</h3>
            <p className="text-3xl font-serif text-red-600">{stats.overdue_tasks}</p>
          </div>
        </div>

        {/* 今日任务 */}
        <div className="bg-white shadow-sm rounded-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-[#2c2c2c]">今日任务</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : todayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              今天还没有任务，点击下方按钮创建新任务
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todayTasks.map((task: Task) => (
                <div key={task.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description || '无描述'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-sm text-[#d4b483] hover:text-[#c9a978]"
                      >
                        查看详情
                      </Link>
                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        编辑
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAccessCard
            title="添加新书籍"
            description="记录你正在阅读或想要阅读的书籍"
            icon={BookOpenIcon}
            path="/books/new"
          />
          <QuickAccessCard
            title="添加新电影"
            description="记录你看过或想看的电影"
            icon={FilmIcon}
            path="/movies/new"
          />
          <QuickAccessCard
            title="创建新任务"
            description="添加和管理你的待办事项"
            icon={ClipboardDocumentListIcon}
            path="/tasks/create"
          />
        </div>
      </div>
    </Layout>
  );
}

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

function QuickAccessCard({ title, description, icon: Icon, path }: QuickAccessCardProps) {
  return (
    <Link
      to={path}
      className="block p-6 bg-[#f7f3eb] rounded-sm hover:bg-[#f0e9db] transition-colors"
    >
      <Icon className="w-8 h-8 text-[#d4b483] mb-4" />
      <h3 className="text-lg font-serif text-[#2c2c2c] mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
} 