import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { HeaderProps } from './types';
import { Button } from '../../common/Button';

export const Header: FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="layout-header">
      <Link to="/" className="header-logo">
        <span>Cute Todo</span>
      </Link>

      <div className="header-nav">
        {username ? (
          <div className="header-user">
            <span className="header-username">{username}</span>
            <Button
              variant="text"
              size="small"
              onClick={onLogout}
            >
              退出
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="small">
              登录
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header; 