import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { taskApi } from '@/api/tasks';
import { withAuth } from '@/components/withAuth';

interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  category: string;
  due_date: string;
}

const TASK_CATEGORIES = [
  { id: 'work', name: '工作' },
  { id: 'study', name: '学习' },
  { id: 'life', name: '生活' },
  { id: 'other', name: '其他' },
] as const;

function CreateTaskPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 1,
    category: 'other' as const,
    due_date: (() => {
      const today = new Date();
      today.setHours(23, 59, 59, 0);
      // 调整时区偏移
      const offset = today.getTimezoneOffset() * 60000;
      return new Date(today.getTime() - offset).toISOString().slice(0, 16);
    })(),
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // 转换日期时间格式为 RFC3339
      const formattedData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : '',
        status: 'pending'  // 添加默认状态
      };

      ;

      await taskApi.create(formattedData);
      navigate('/tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : '创建任务失败，请稍后重试');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 对于 priority 字段，将字符串转换为数字
    const finalValue = name === 'priority' ? parseInt(value, 10) : value;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: finalValue }));
  };

  return (
    <Layout>
      <div className="p-8">
        {/* 面包屑导航 */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="flex items-center">
                  <HomeIcon className="w-4 h-4 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">首页</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/tasks" className="flex items-center">
                    <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-500">任务</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">创建任务</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white shadow-sm rounded-sm p-6">
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-6">创建新任务</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                任务标题
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                任务描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  任务类别
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                >
                  {TASK_CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  优先级
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                >
                  <option value={1}>低</option>
                  <option value={2}>中</option>
                  <option value={3}>高</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                截止日期
              </label>
              <div className="max-w-md">
                <input
                  type="datetime-local"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4b483]"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  请选择截止日期和时间
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to="/tasks"
                className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-sm hover:bg-[#c9a978] transition-colors"
              >
                创建任务
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(CreateTaskPage, '请先登录后再创建任务'); 
