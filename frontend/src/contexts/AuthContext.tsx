import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/api/client';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    console.log('Initial token from localStorage:', savedToken);
    return savedToken;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    console.log('Initial user from localStorage:', savedUser);
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing saved user:', e);
      return null;
    }
  });

  const login = (newToken: string, newUser: User) => {
    console.log('Login called with:', { token: newToken, user: newUser });
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('Token and user saved to localStorage');
  };

  const logout = () => {
    console.log('Logout called');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Token and user removed from localStorage');
  };

  useEffect(() => {
    // 验证 token 是否有效
    if (token) {
      console.log('Validating token:', token);
      api.auth.getProfile()
        .then(data => {
          console.log('Token validation successful, user data:', data);
          setUser(data);
        })
        .catch((error) => {
          console.error('Token validation error:', error);
          logout();
        });
    }
  }, [token]);

  const contextValue: AuthContextType = {
    token,
    user,
    login,
    logout,
  };

  console.log('AuthContext current state:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
