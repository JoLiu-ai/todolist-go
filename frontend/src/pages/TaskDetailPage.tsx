import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, PencilIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { taskApi, Task } from '../api/tasks';
import { useAuth } from '../contexts/AuthContext';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: '请先登录' } });
      return;
    }

    const fetchTask = async () => {
      try {
        if (!id) return;
        const data = await taskApi.getById(parseInt(id));
        setTask(data);
      } catch (err) {
        console.error('获取任务详情失败:', err);
        setError(err instanceof Error ? err.message : '获取任务详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isAuthenticated, navigate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '无截止日期';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-[#d4b483] animate-pulse">加载中...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-red-600">任务不存在</div>
        </div>
      </Layout>
    );
  }

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
                  <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-[#d4b483] transition-colors">首页</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-[#d4b483]">/</span>
                  <Link to="/tasks" className="flex items-center group">
                    <ClipboardDocumentListIcon className="w-4 h-4 text-[#d4b483]" />
                    <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-[#d4b483] transition-colors">任务</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-[#d4b483]">/</span>
                  <span className="text-sm font-medium text-[#d4b483]">任务详情</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm border border-red-200">
            {error}
          </div>
        )}

        {/* 任务详情卡片 */}
        <div className="bg-white shadow-sm rounded-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-serif text-[#2c2c2c] mb-2">{task.title}</h2>
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status === 'completed' ? '已完成' :
                 task.status === 'pending' ? '进行中' : '未开始'}
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="flex items-center px-4 py-2 text-sm font-medium text-[#d4b483] border border-[#d4b483] rounded-sm hover:bg-[#d4b483] hover:text-white transition-colors"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                编辑任务
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">任务描述</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{task.description || '无描述'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">优先级</h3>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                  task.priority === 3 ? 'bg-red-100 text-red-800' :
                  task.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority === 3 ? '高' :
                   task.priority === 2 ? '中' : '低'}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">类别</h3>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                  task.category === 'work' ? 'bg-blue-100 text-blue-800' :
                  task.category === 'study' ? 'bg-purple-100 text-purple-800' :
                  task.category === 'life' ? 'bg-pink-100 text-pink-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.category === 'work' ? '工作' :
                   task.category === 'study' ? '学习' :
                   task.category === 'life' ? '生活' : '其他'}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">截止日期</h3>
                <span className="text-gray-900">{formatDate(task.due_date)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">创建时间</h3>
                <span className="text-gray-900">{formatDate(task.created_at)}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">最后更新</h3>
                <span className="text-gray-900">{formatDate(task.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 