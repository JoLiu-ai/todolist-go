import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, FilmIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: '首页', path: '/', icon: HomeIcon },
  { name: '书籍', path: '/books', icon: BookOpenIcon },
  { name: '电影', path: '/movies', icon: FilmIcon },
  { name: '任务', path: '/tasks', icon: ClipboardDocumentListIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcf9f3]">
      {/* 左侧导航栏 */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo区域 */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-serif text-[#2c2c2c]">Cute Todo</h1>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 mt-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#f7f3eb] text-[#d4b483]'
                      : 'text-gray-600 hover:bg-[#f7f3eb] hover:text-[#d4b483]'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#d4b483]' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 用户信息 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#d4b483] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
} 