import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FilmIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ClockIcon,
  ListBulletIcon,
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  SparklesIcon,
  BoltIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

type IconComponent = (props: { className?: string }) => JSX.Element;

interface LayoutProps {
  children?: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: IconComponent;
  subItems?: NavItem[];
  color?: string;
}

const navigation: NavItem[] = [
  { name: '首页', path: '/', icon: HomeIcon },
  { name: '任务', path: '/tasks', icon: ListBulletIcon },
  { name: '便利签', path: '/notes', icon: DocumentTextIcon },
  { name: '知识', path: '/knowledge', icon: AcademicCapIcon },
  { name: '书籍', path: '/books', icon: BookOpenIcon },
  { name: '影视', path: '/movies', icon: FilmIcon },
  { 
    name: '计划', 
    path: '/plans', 
    icon: ClipboardDocumentListIcon,
    subItems: [
      { name: '月度计划', path: '/plans/monthly', icon: CalendarIcon },
      { name: '周计划', path: '/plans/weekly', icon: CalendarDaysIcon },
      { name: '日计划', path: '/plans/daily', icon: ClockIcon },
    ]
  },
];

const noteCategories = [
  { name: '脑科学', path: '/notes/brain', icon: BeakerIcon, color: 'text-purple-500' },
  { name: '心理学', path: '/notes/psychology', icon: HeartIcon, color: 'text-pink-500' },
  { name: '认知科学', path: '/notes/cognitive', icon: SparklesIcon, color: 'text-indigo-500' },
  { name: '效率管理', path: '/notes/productivity', icon: BoltIcon, color: 'text-yellow-500' },
  { name: '习惯养成', path: '/notes/habits', icon: UserGroupIcon, color: 'text-green-500' },
  { name: '情绪管理', path: '/notes/emotion', icon: RocketLaunchIcon, color: 'text-orange-500' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const [showCategories, setShowCategories] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [showSort, setShowSort] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const isNotesPage = location.pathname.startsWith('/notes');

  // 处理新建便利签
  const handleCreateNote = () => {
    navigate('/notes/create');
  };

  // 处理搜索面板
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setShowFilter(false);
    setShowSort(false);
  };

  // 处理筛选面板
  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    setShowSearch(false);
    setShowSort(false);
  };

  // 处理排序面板
  const handleSortClick = () => {
    setShowSort(!showSort);
    setShowSearch(false);
    setShowFilter(false);
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理排序
  const handleSort = (type: 'date' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] flex">
      {/* 左侧导航栏 */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo区域 */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Link to="/" className="text-xl font-serif text-[#2c2c2c] hover:text-[#d4b483] transition-colors">
              Cute Todo
            </Link>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 mt-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItem === item.name;
              
              return (
                <div key={item.name}>
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                        isActive
                          ? 'bg-[#f7f3eb] text-[#d4b483]'
                          : 'text-gray-600 hover:bg-[#f7f3eb] hover:text-[#d4b483]'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#d4b483]' : 'text-gray-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
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
                  )}
                  
                  {/* 子菜单 */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm rounded-sm transition-colors ${
                              isSubActive
                                ? `${subItem.color || 'text-[#d4b483]'} bg-[#f7f3eb]`
                                : `${subItem.color || 'text-gray-600'} hover:bg-[#f7f3eb]`
                            }`}
                          >
                            <subItem.icon className={`w-4 h-4 mr-3 ${
                              isSubActive ? (subItem.color || 'text-[#d4b483]') : (subItem.color || 'text-gray-400')
                            }`} />
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <span className="flex items-center px-2 py-2 text-[#8b7355]">
                  <span className="text-xl font-serif">Welcome</span>
                </span>
              </div>
              
              {/* 用户信息和登录/登出 */}
              <div className="flex items-center">
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    {user ? (
                      <>
                        <button
                          type="button"
                          className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b483]"
                          id="user-menu-button"
                        >
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User avatar"
                          />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700">{user.username}</span>
                          <button
                            className="text-sm text-gray-500 hover:text-[#d4b483] transition-colors"
                            onClick={logout}
                          >
                            登出
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="text-sm text-gray-500 hover:text-[#d4b483] transition-colors"
                      >
                        登录
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex">
          {/* 主要内容 */}
          <div className={`flex-1 ${isNotesPage ? 'mr-64' : ''}`}>
            {children}
          </div>

          {/* 右侧便利签分类 */}
          {isNotesPage && (
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-sm overflow-y-auto">
              <div className="p-4">
                {/* 功能按钮区 */}
                <div className="mb-6 space-y-2">
                  <button
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#d4b483] rounded-lg hover:bg-[#c9a978] transition-colors shadow-sm hover:shadow"
                    onClick={handleCreateNote}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    新建便利签
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium ${
                        showSearch ? 'text-white bg-[#d4b483]' : 'text-[#8b7355] bg-[#f7f3eb]'
                      } rounded-lg hover:bg-[#c9a978] hover:text-white transition-colors`}
                      onClick={handleSearchClick}
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium ${
                        showFilter ? 'text-white bg-[#d4b483]' : 'text-[#8b7355] bg-[#f7f3eb]'
                      } rounded-lg hover:bg-[#c9a978] hover:text-white transition-colors`}
                      onClick={handleFilterClick}
                    >
                      <FunnelIcon className="w-4 h-4" />
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium ${
                        showSort ? 'text-white bg-[#d4b483]' : 'text-[#8b7355] bg-[#f7f3eb]'
                      } rounded-lg hover:bg-[#c9a978] hover:text-white transition-colors`}
                      onClick={handleSortClick}
                    >
                      <ArrowsUpDownIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 搜索面板 */}
                  {showSearch && (
                    <div className="mt-2 p-3 bg-[#f7f3eb] rounded-lg">
                      <input
                        type="text"
                        placeholder="搜索便利签..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-3 py-2 text-sm bg-white rounded border border-[#e9dcc9] focus:outline-none focus:border-[#d4b483] focus:ring-1 focus:ring-[#d4b483]"
                      />
                    </div>
                  )}

                  {/* 排序面板 */}
                  {showSort && (
                    <div className="mt-2 p-3 bg-[#f7f3eb] rounded-lg space-y-2">
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded ${
                          sortBy === 'date' ? 'bg-[#d4b483] text-white' : 'bg-white text-gray-700'
                        }`}
                        onClick={() => handleSort('date')}
                      >
                        <span>按日期</span>
                        {sortBy === 'date' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded ${
                          sortBy === 'title' ? 'bg-[#d4b483] text-white' : 'bg-white text-gray-700'
                        }`}
                        onClick={() => handleSort('title')}
                      >
                        <span>按标题</span>
                        {sortBy === 'title' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* 分类标题 */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">分类</h2>
                  <span className="text-sm text-gray-500">
                    {noteCategories.length} 个
                  </span>
                </div>

                {/* 分类列表 */}
                <div className="space-y-1">
                  <Link
                    to="/notes"
                    className={`flex items-center px-4 py-2 text-sm rounded-sm transition-colors ${
                      location.pathname === '/notes'
                        ? 'text-[#d4b483] bg-[#f7f3eb]'
                        : 'text-gray-600 hover:text-[#d4b483] hover:bg-[#f7f3eb]'
                    }`}
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-3" />
                    全部便利签
                  </Link>
                  {noteCategories.map((category) => {
                    const isActive = location.pathname === category.path;
                    return (
                      <Link
                        key={category.path}
                        to={category.path}
                        className={`flex items-center justify-between px-4 py-2 text-sm rounded-sm transition-colors group ${
                          isActive
                            ? `${category.color} bg-[#f7f3eb]`
                            : `${category.color} hover:bg-[#f7f3eb]`
                        }`}
                      >
                        <div className="flex items-center">
                          <category.icon className={`w-4 h-4 mr-3 ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-500">
                          0
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024 Cute Todo. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout; 