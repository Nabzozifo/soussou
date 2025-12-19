import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerProgress = () => {
  const [playerLevel, setPlayerLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [badges, setBadges] = useState([]);
  const [serverDataLoaded, setServerDataLoaded] = useState(false);

  // Load progress from server first, then localStorage as fallback
  useEffect(() => {
    const loadProgress = async () => {
      const token = localStorage.getItem('auth_token');

      // Si connecté, charger depuis le serveur
      if (token) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
          const res = await axios.get(`${API_BASE_URL}/progress`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });

          if (res.data) {
            // Calculer XP et niveau depuis les stats du serveur
            const serverXP = (res.data.correct_answers || 0) * 10;
            const serverLevel = Math.floor(serverXP / 100) + 1;

            setTotalXP(serverXP);
            setPlayerLevel(serverLevel);
            setServerDataLoaded(true);

            // Sauvegarder en local
            localStorage.setItem('playerProgress', JSON.stringify({
              playerLevel: serverLevel,
              totalXP: serverXP,
              badges: badges
            }));
            return;
          }
        } catch (e) {
          if (e.response?.status !== 401) {
            console.error('Erreur chargement progression serveur:', e);
          }
        }
      }

      // Fallback: charger depuis localStorage
      const savedProgress = localStorage.getItem('playerProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setPlayerLevel(progress.playerLevel || 1);
        setTotalXP(progress.totalXP || 0);
        setBadges(progress.badges || []);
      }
    };

    loadProgress();
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progress = {
      playerLevel,
      totalXP,
      badges
    };
    localStorage.setItem('playerProgress', JSON.stringify(progress));

    // Tentative de synchronisation côté API (si connecté)
    const sync = async () => {
      // Vérifier si l'utilisateur est connecté avant d'appeler l'API
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Pas connecté, ne pas essayer de syncer
        return;
      }

      try {
        const payload = {
          games_played: Math.max(1, Math.floor(totalXP / 30)),
          correct_answers: Math.floor(totalXP / 10),
          streak: Math.min(10, Math.floor(totalXP / 25)),
          lessons_completed: Math.floor(totalXP / 50),
          hard_mode_wins: Math.floor(totalXP / 70)
        };
        // Utiliser la base API configurable (dev/prod)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        await axios.post(`${API_BASE_URL}/progress`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (e) {
        // Erreur de synchronisation : ignorer silencieusement
        if (e.response?.status !== 401) {
          console.error('Erreur sync progression:', e);
        }
      }
    };
    sync();
  }, [playerLevel, totalXP, badges]);

  const addXP = (xp) => {
    setTotalXP(prev => {
      const newXP = prev + xp;
      const newLevel = Math.floor(newXP / 100) + 1;
      if (newLevel > playerLevel) {
        setPlayerLevel(newLevel);
        // Add level up badge
        addBadge({
          id: `level-${newLevel}`,
          name: `Niveau ${newLevel}`,
          emoji: '🏆',
          description: `Atteint le niveau ${newLevel}`,
          earnedAt: new Date().toISOString()
        });
      }
      return newXP;
    });
  };

  const addBadge = (badge) => {
    setBadges(prev => {
      // Check if badge already exists
      if (prev.some(b => b.id === badge.id)) {
        return prev;
      }
      return [...prev, badge];
    });
  };

  const getLevelProgress = () => {
    return (totalXP % 100);
  };

  const getXPToNextLevel = () => {
    return 100 - (totalXP % 100);
  };

  return {
    playerLevel,
    totalXP,
    badges,
    addXP,
    addBadge,
    getLevelProgress,
    getXPToNextLevel
  };
};

export default usePlayerProgress;