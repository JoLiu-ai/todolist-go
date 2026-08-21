import React from 'react';
import { api, type User } from '@/api/client';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = React.useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    console.log('[AuthProvider] Initial token from localStorage:', savedToken);
    return savedToken;
  });

  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    console.log('[AuthProvider] Initial user from localStorage:', savedUser);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('[AuthProvider] Error parsing saved user:', error);
        return null;
      }
    }
    return null;
  });

  React.useEffect(() => {
    console.log('[AuthProvider] Token changed:', token);
    const validateToken = async () => {
      if (token) {
        try {
          console.log('[AuthProvider] Validating token...');
          const userData = await api.auth.getProfile();
          console.log('[AuthProvider] Profile response:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('[AuthProvider] Error validating token:', error);
          logout();
        }
      } else {
        console.log('[AuthProvider] No token to validate');
      }
    };

    validateToken();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    console.log('[AuthProvider] Login called with token:', newToken);
    console.log('[AuthProvider] Login called with user:', newUser);
    
    // 先保存到 localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('[AuthProvider] Token and user saved to localStorage');
    
    // 再更新状态
    setToken(newToken);
    setUser(newUser);
  };

  const logout = React.useCallback(() => {
    console.log('[AuthProvider] Logout called');
    
    // 先清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('[AuthProvider] Token and user removed from localStorage');
    
    // 再更新状态
    setToken(null);
    setUser(null);
  }, []);

  const contextValue = React.useMemo(() => ({
    token,
    user,
    isAuthenticated: !!(token && user),
    login,
    logout,
  }), [token, user, logout]);

  console.log('[AuthProvider] Current context value:', { 
    token: token ? 'exists' : 'null',
    user: user ? 'exists' : 'null'
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 
