import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('fh_token');
      const cachedUser = localStorage.getItem('fh_user');
      if (token) {
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (e) {}
        }
        try {
          const { data } = await getMe();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('fh_user', JSON.stringify(data.user));
          }
        } catch {
          // Keep cached session intact if network fails
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('fh_token', token || 'demo_token_123');
    localStorage.setItem('fh_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fh_token');
    localStorage.removeItem('fh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
