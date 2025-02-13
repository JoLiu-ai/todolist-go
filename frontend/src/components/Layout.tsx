import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FilmIcon, 
  ClipboardDocumentListIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: {
    name: string;
    path: string;
  }[];
  createPath?: string;
}

const navigation: NavItem[] = [
  { name: '首页', path: '/', icon: HomeIcon },
  { 
    name: '书籍', 
    path: '/books', 
    icon: BookOpenIcon,
    children: [
      { name: '全部书籍', path: '/books' },
      { name: '正在阅读', path: '/books?status=ongoing' },
      { name: '已读完', path: '/books?status=finished' },
      { name: '想读', path: '/books?status=wishlist' }
    ],
  },
  { 
    name: '影视', 
    path: '/movies', 
    icon: FilmIcon,
    children: [
      { name: '全部影视', path: '/movies' },
      { name: '正在观看', path: '/movies?status=ongoing' },
      { name: '已看完', path: '/movies?status=finished' },
      { name: '想看', path: '/movies?status=wishlist' }
    ],
  },
  { 
    name: '知识', 
    path: '/knowledge', 
    icon: AcademicCapIcon,
    children: [
      { name: '全部知识', path: '/knowledge' },
      { name: '技术', path: '/knowledge?category=technology' },
      { name: '生活', path: '/knowledge?category=life' },
      { name: '工作', path: '/knowledge?category=work' },
      { name: '其他', path: '/knowledge?category=other' }
    ],
  },
  { 
    name: '任务', 
    path: '/tasks', 
    icon: ClipboardDocumentListIcon,
    children: [
      { name: '全部任务', path: '/tasks' }
    ],
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const MainContent = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="ml-64">
      {children}
    </div>
  );
});

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState([] as string[]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev: string[]) => 
      prev.includes(path) 
        ? prev.filter((p: string) => p !== path)
        : [...prev, path]
    );
  };

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
              const isExpanded = expandedItems.includes(item.path);
              
              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      to={item.path}
                      className={`flex flex-1 items-center px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                        isActive
                          ? 'bg-[#f7f3eb] text-[#d4b483]'
                          : 'text-gray-600 hover:bg-[#f7f3eb] hover:text-[#d4b483]'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#d4b483]' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => toggleExpand(item.path)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* 子菜单 */}
                  {item.children && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname + location.search === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2 text-sm rounded-sm transition-colors ${
                              isChildActive
                                ? 'text-[#d4b483] bg-[#f7f3eb]'
                                : 'text-gray-500 hover:text-[#d4b483] hover:bg-[#f7f3eb]'
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                className="px-3 py-1.5 text-sm font-medium text-[#d4b483] hover:text-white border border-[#d4b483] hover:bg-[#d4b483] rounded-md transition-all duration-300"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
} 