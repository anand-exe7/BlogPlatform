import { useState, useEffect, useCallback } from 'react';

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
    const checkAuth = async () => {
      try {
        const { apiClient } = await import('./api-client');
        const response = await apiClient.get('/auth/me');
        const userData = response.data?.data?.user || response.data?.user;
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
  };
}
