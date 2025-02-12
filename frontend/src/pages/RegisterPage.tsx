import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { api } from '@/api/client';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 添加前端验证
    if (password.length < 6) {
      setError('密码长度至少需要6个字符');
      return;
    }

    const requestData = {
      email,
      password,
      username: username || undefined  // 如果用户名为空字符串，则设为 undefined
    };
    
    console.log('Sending registration request with data:', requestData);

    try {
      const responseData = await api.auth.register(requestData);
      console.log('Registration response:', responseData);

      if (responseData.token && responseData.user) {
        login(responseData.token, responseData.user);
        navigate('/', { replace: true });
      } else {
        throw new Error('注册失败，请稍后重试');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // 处理特定的错误类型
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('password') && errorMessage.includes('min')) {
          setError('密码长度至少需要6个字符');
        } else if (errorMessage.includes('email') && errorMessage.includes('already exists')) {
          setError('该邮箱已被注册');
        } else {
          setError('注册失败，请检查输入信息是否正确');
        }
      } else {
        setError('注册失败，请稍后重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 rounded-sm">
          <h1 className="text-2xl font-serif text-[#2c2c2c] mb-8 text-center">注册</h1>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-serif text-[#4a4a4a] mb-2">
                用户名（选填）
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 text-sm text-[#4a4a4a] bg-[#f7f3eb] border border-[#ebe5d9] rounded-sm focus:outline-none focus:border-[#d4b483] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-serif text-[#4a4a4a] mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              注册
            </button>

            <div className="text-center">
              <Link 
                to="/login"
                className="text-sm text-[#8c8c8c] hover:text-[#4a4a4a] transition-colors"
              >
                已有账号？点击登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 