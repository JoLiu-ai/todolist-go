import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  FilmIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navigation = [
    { name: '首页', href: '/', icon: HomeIcon },
    { name: '任务', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: '书籍', href: '/books', icon: BookOpenIcon },
    { name: '影视', href: '/movies', icon: FilmIcon },
    { name: '知识库', href: '/knowledge', icon: AcademicCapIcon },
  ];

  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="h-full px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-[#f8f4f0] text-[#d4b483]'
                    : 'text-gray-600 hover:bg-[#f8f4f0] hover:text-[#d4b483]'
                  }
                  transition-colors duration-200
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive ? 'text-[#d4b483]' : 'text-gray-400'}
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 