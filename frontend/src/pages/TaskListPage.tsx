import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { taskApi, Task } from '../api/tasks';

const PRIORITY_LABELS = {
  1: { text: '低', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  2: { text: '中', className: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  3: { text: '高', className: 'bg-red-50 text-red-600 border border-red-200' },
};

const CATEGORY_LABELS: Record<string, { text: string, className: string }> = {
  work: { text: '工作', className: 'bg-purple-50 text-purple-600 border border-purple-200' },
  study: { text: '学习', className: 'bg-green-50 text-green-600 border border-green-200' },
  life: { text: '生活', className: 'bg-indigo-50 text-indigo-600 border border-indigo-200' },
  other: { text: '其他', className: 'bg-gray-50 text-gray-600 border border-gray-200' },
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (taskId: number) => {
    if (!window.confirm('确定要删除这个任务吗？')) {
      return;
    }

    try {
      await taskApi.delete(taskId);
      // 重新获取任务列表
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除任务失败');
    }
  };

  const handleEdit = (taskId: number) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const content = loading ? (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#d4b483] animate-pulse">加载中...</div>
    </div>
  ) : (
    <>
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
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="w-4 h-4 text-[#d4b483]" />
                  <span className="ml-2 text-sm font-medium text-[#d4b483]">任务列表</span>
                </div>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#2c2c2c] relative">
          任务列表
          <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-[#d4b483] opacity-50"></span>
        </h2>
        <Link
          to="/tasks/create"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          创建任务
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm">
          {error}
        </div>
      )}

      {/* 任务列表 */}
      <div className="bg-white shadow-sm rounded-sm">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            暂无任务，点击右上角按钮创建新任务
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map((task: Task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {task.description || '无描述'}
                    </p>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS].className}`}>
                        {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS].text}优先级
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${CATEGORY_LABELS[task.category]?.className || CATEGORY_LABELS.other.className}`}>
                        {CATEGORY_LABELS[task.category]?.text || '未分类'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(task.due_date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => handleEdit(task.id)}
                    >
                      编辑
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-900 transition-colors"
                      onClick={() => handleDelete(task.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <Layout>
      <div className="p-8">
        {content}
      </div>
    </Layout>
  );
} 