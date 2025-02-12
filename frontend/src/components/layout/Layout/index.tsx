import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <Link to="/" className="layout-logo">
            Cute Todo
          </Link>
          <nav className="layout-nav">
            <Link to="/" className="nav-item">首页</Link>
            <Link to="/tasks" className="nav-item">任务列表</Link>
            <Link to="/tasks/create" className="nav-item">创建任务</Link>
          </nav>
          <div className="layout-actions">
            <Link to="/profile" className="nav-item">个人中心</Link>
            <Link to="/logout" className="nav-item">退出</Link>
          </div>
        </div>
      </header>
      <main className="layout-main">
        <div className="layout-content">
          {children}
        </div>
      </main>
      <footer className="layout-footer">
        <div className="layout-footer-content">
          <p>© 2024 Cute Todo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
