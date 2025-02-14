import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '@/api/client';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const from = location.state?.from?.pathname || '/';

  ;
  ;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    ;

    try {
      if (!username.trim()) {
        throw new Error('请输入用户名或邮箱');
      }

      if (!password.trim()) {
        throw new Error('请输入密码');
      }

      const data = await api.auth.login({ username: username.trim(), password });
      ;

      if (data.token && data.user) {
        
        login(data.token, data.user);
        
        navigate(from, { replace: true });
        
      } else {
        console.error('Invalid response format:', data);
        setError('登录失败，服务器返回数据格式不正确');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error details:', {
        message: err.message,
        data: err.data,
        response: err.response
      });
      
      // 处理后端返回的具体错误信息
      if (err.data && err.data.error) {
        setError(err.data.error);
      } else if (err instanceof Error) {
        if (err.message.includes('record not found')) {
          setError('用户名或邮箱不存在');
        } else {
          setError(err.message);
        }
      } else {
        setError('登录失败，请检查用户名和密码');
      }
    } finally {
      setIsLoading(false);
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
                用户名或邮箱
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 text-sm text-[#4a4a4a] bg-[#f7f3eb] border border-[#ebe5d9] rounded-sm focus:outline-none focus:border-[#d4b483] transition-colors"
                required
                placeholder="请输入用户名或邮箱"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-sm font-serif text-white ${
                isLoading ? 'bg-[#e5d5b5] cursor-not-allowed' : 'bg-[#d4b483] hover:bg-[#c9a978]'
              } transition-colors rounded-sm`}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
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