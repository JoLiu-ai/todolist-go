import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import './styles.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: number;
  category: string;
  dueDate: string;
}

export const TaskListPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: 1,
      title: '完成项目文档',
      description: '编写项目技术文档和用户使用手册',
      status: 'pending',
      priority: 1,
      category: '工作',
      dueDate: '2024-02-20',
    },
    {
      id: 2,
      title: '健身',
      description: '去健身房锻炼1小时',
      status: 'completed',
      priority: 2,
      category: '生活',
      dueDate: '2024-02-19',
    },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="task-list-page">
        <div className="task-list-header">
          <h1>任务列表</h1>
          <Link to="/tasks/create">
            <Button>创建新任务</Button>
          </Link>
        </div>

        <div className="task-list-filters">
          <Input
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-buttons">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              待完成
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              已完成
            </Button>
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-status status-${task.status}`}>
                  {task.status === 'completed' ? '已完成' : '待完成'}
                </span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="task-category">{task.category}</span>
                <span className="task-due-date">截止日期: {task.dueDate}</span>
              </div>
              <div className="task-actions">
                <Link to={`/tasks/${task.id}/edit`}>
                  <Button variant="outline" size="small">编辑</Button>
                </Link>
                <Button variant="text" size="small">删除</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TaskListPage; 