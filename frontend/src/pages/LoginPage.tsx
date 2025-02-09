import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 rounded-sm">
          <h1 className="text-2xl font-serif text-[#2c2c2c] mb-8 text-center">登录</h1>
          
          {message && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-serif text-[#4a4a4a] mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 text-sm text-[#4a4a4a] bg-[#f7f3eb] border border-[#ebe5d9] rounded-sm focus:outline-none focus:border-[#d4b483] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-serif text-[#4a4a4a] mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-sm text-[#4a4a4a] bg-[#f7f3eb] border border-[#ebe5d9] rounded-sm focus:outline-none focus:border-[#d4b483] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm font-serif text-white bg-[#d4b483] hover:bg-[#c9a978] transition-colors rounded-sm"
            >
              登录
            </button>

            <div className="text-center">
              <Link 
                to="/register"
                className="text-sm text-[#8c8c8c] hover:text-[#4a4a4a] transition-colors"
              >
                没有账号？点击注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 