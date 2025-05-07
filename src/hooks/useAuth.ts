import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../api/auth';
import { setToken, removeToken, getToken } from '../utils/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération du profil', err);
      removeToken();
      setUser(null);
      setError('Session expirée. Veuillez vous reconnecter.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiLogin({ email, password });
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.message || 'Échec de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      removeToken();
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    refetchUser: fetchCurrentUser
  };
}
