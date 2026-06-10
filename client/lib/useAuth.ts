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

  const fetchUser = useCallback(async () => {
    try {
      const { apiClient } = await import('./api-client');
      const response = await apiClient.get('/auth/me');
      const userData = response.data?.data?.user || response.data?.user;
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        return userData;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return null;
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const initial = async () => {
      setLoading(true);
      await fetchUser();
      setLoading(false);
    };
    initial();
  }, [fetchUser]);

  useEffect(() => {
    let lastFetch = Date.now();
    const handleVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch > 30000) {
        lastFetch = Date.now();
        fetchUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [fetchUser]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const refreshUser = useCallback(async () => {
    return fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    refreshUser,
  };
}
