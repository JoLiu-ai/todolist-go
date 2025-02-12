import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { api } from '@/api/client';
import './styles.css';

interface LoginForm {
  username: string;
  password: string;
}

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await api.auth.login(form);

      if (!data.token || !data.user) {
        throw new Error('登录失败');
      }

      // 保存 token 到 localStorage
      localStorage.setItem('token', data.token);
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 跳转到首页
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
    }
  };

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <h1>登录</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                label="用户名"
                type="text"
                required
                value={form.username}
                onChange={handleChange('username')}
                placeholder="请输入用户名"
              />
            </div>

            <div className="form-group">
              <Input
                label="密码"
                type="password"
                required
                value={form.password}
                onChange={handleChange('password')}
                placeholder="请输入密码"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <Button type="submit" block>
                登录
              </Button>
            </div>

            <div className="form-links">
              <Button
                type="button"
                variant="text"
                onClick={() => navigate('/register')}
              >
                还没有账号？立即注册
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 
