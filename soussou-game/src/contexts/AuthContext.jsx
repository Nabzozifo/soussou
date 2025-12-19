import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Instance axios pour l'authentification avec Bearer tokens
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter automatiquement le token Bearer
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401 (déconnexion automatique)
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré - nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  const register = async ({ name, email, password, password_confirmation, preferred_language = 'fr' }) => {
    try {
      const res = await authApi.post('/register', {
        name,
        email,
        password,
        password_confirmation,
        preferred_language
      });

      // Stocker le token et l'utilisateur
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Charger la progression
      await fetchProgress();

      return res.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await authApi.post('/login', { email, password });

      // Stocker le token et l'utilisateur
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Charger la progression
      await fetchProgress();

      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.post('/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      // Toujours nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setProgress(null);
    }
  };

  const updateProfile = async (payload) => {
    try {
      const res = await authApi.put('/profile', payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const fetchMe = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.get('/me');
      setUser(res.data.user || res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user || res.data));

      // Charger la progression
      await fetchProgress();
    } catch (e) {
      // Token invalide - nettoyer
      console.error('Fetch me error:', e);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const res = await authApi.get('/progress');
      setProgress(res.data.progress || res.data);
    } catch (e) {
      console.error('Fetch progress error:', e);
      // Ne pas afficher d'erreur si l'utilisateur n'est pas connecté
      if (e.response?.status !== 401) {
        console.error('Error fetching progress:', e);
      }
    }
  };

  const updateProgress = async (sessionData) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('⚠️ Tentative de sauvegarder la progression sans être connecté');
      return null;
    }

    console.log('🎮 Sauvegarde session...', {
      game_mode: sessionData.game_mode,
      difficulty: sessionData.difficulty,
      score: sessionData.score,
      questions: sessionData.total_questions
    });

    try {
      const res = await authApi.post('/game/session', sessionData);
      console.log('✅ Session sauvegardée avec succès:', res.data);
      setProgress(res.data.progress);
      return res.data;
    } catch (e) {
      console.error('❌ Erreur sauvegarde progression:', e.response?.data || e.message);
      return null;
    }
  };

  useEffect(() => {
    // Essayer de récupérer l'utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      progress,
      login,
      register,
      logout,
      updateProfile,
      fetchProgress,
      updateProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Export de l'instance authApi pour l'utiliser ailleurs
export { authApi };