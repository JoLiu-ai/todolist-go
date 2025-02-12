import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import './styles.css';

export const HomePage: FC = () => {
  return (
    <Layout>
      <div className="home-page">
        <section className="hero-section">
          <h1 className="hero-title">欢迎使用 Cute Todo</h1>
          <p className="hero-description">
            一个简单而强大的待办事项管理工具，帮助你更好地组织工作和生活。
          </p>
          <div className="hero-actions">
            <Link to="/tasks/create">
              <Button size="large">创建新任务</Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" size="large">查看所有任务</Button>
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">主要功能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>任务管理</h3>
              <p>轻松创建、编辑和删除任务</p>
            </div>
            <div className="feature-card">
              <h3>分类组织</h3>
              <p>通过分类系统有效组织任务</p>
            </div>
            <div className="feature-card">
              <h3>优先级设置</h3>
              <p>为任务设置优先级，突出重要事项</p>
            </div>
            <div className="feature-card">
              <h3>截止日期</h3>
              <p>设置任务截止日期，避免遗漏</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 