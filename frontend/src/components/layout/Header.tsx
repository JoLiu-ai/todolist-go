import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-serif text-[#2c2c2c]">
                Cute Todo
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-[#d4b483] hover:text-[#c9a978] transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 