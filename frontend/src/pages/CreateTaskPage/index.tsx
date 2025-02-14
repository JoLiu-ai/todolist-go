import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import './styles.css';

interface TaskForm {
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: string;
}

export const CreateTaskPage: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    category: '',
    priority: '1',
    dueDate: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: 实现创建任务的逻辑
    
    navigate('/tasks');
  };

  const handleChange = (field: keyof TaskForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="create-task-page">
        <div className="page-header">
          <h1>创建新任务</h1>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="任务标题"
              required
              value={form.title}
              onChange={handleChange('title')}
              placeholder="请输入任务标题"
            />
          </div>

          <div className="form-group">
            <label className="form-label">任务描述</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="请输入任务描述"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">分类</label>
              <select
                className="form-select"
                value={form.category}
                onChange={handleChange('category')}
                required
              >
                <option value="">请选择分类</option>
                <option value="work">工作</option>
                <option value="study">学习</option>
                <option value="life">生活</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">优先级</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={handleChange('priority')}
                required
              >
                <option value="1">高</option>
                <option value="2">中</option>
                <option value="3">低</option>
              </select>
            </div>

            <div className="form-group">
              <Input
                type="date"
                label="截止日期"
                required
                value={form.dueDate}
                onChange={handleChange('dueDate')}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => navigate('/tasks')}>
              取消
            </Button>
            <Button type="submit">创建任务</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateTaskPage; 