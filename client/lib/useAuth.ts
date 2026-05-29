import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  is_super_admin?: boolean;
  status?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const isLoggedInFlag = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('auth_token');

      if (storedUser && isLoggedInFlag === 'true' && token) {
        try {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Failed to parse stored user:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes from other tabs or interceptors
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
  };
}
