import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Instance axios pour les requêtes API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercepteur pour ajouter le token Bearer automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas logger les erreurs 401 pour éviter de polluer la console
    if (error.response?.status !== 401) {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Services API - TOUT provient du backend Laravel
export const apiService = {
  // ==================== NOMBRES ====================

  /**
   * Obtenir un nombre aléatoire selon la difficulté
   * @param {string} difficulty - 'easy', 'medium', ou 'hard'
   */
  getRandomNumber: async (difficulty = 'easy') => {
    try {
      const response = await api.get('/numbers/random', {
        params: { difficulty }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du nombre aléatoire');
    }
  },

  /**
   * Vérifier la réponse de l'utilisateur
   * @param {number} numberId - ID du nombre
   * @param {string} userAnswer - Réponse de l'utilisateur
   */
  checkAnswer: async (numberId, userAnswer) => {
    try {
      const response = await api.post('/numbers/check-answer', {
        number_id: numberId,
        user_answer: userAnswer
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la vérification de la réponse');
    }
  },

  /**
   * Obtenir un nombre spécifique par sa valeur
   * @param {number} value - Valeur du nombre (1-9999)
   */
  getNumberByValue: async (value) => {
    try {
      const response = await api.get(`/numbers/${value}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du nombre ${value}`);
    }
  },

  /**
   * Analyser un nombre en détail
   * @param {number} id - ID du nombre
   */
  analyzeNumber: async (id) => {
    try {
      const response = await api.get(`/numbers/${id}/analyze`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de l\'analyse du nombre');
    }
  },

  /**
   * Obtenir une liste paginée de nombres
   * @param {number} page - Numéro de page
   * @param {number} perPage - Nombres par page
   */
  getNumbers: async (page = 1, perPage = 20) => {
    try {
      const response = await api.get('/numbers', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des nombres');
    }
  },

  // ==================== QUIZ & JEUX ====================

  /**
   * Générer un quiz avec choix multiples
   * @param {object} options - Options du quiz
   */
  generateQuiz: async (options = {}) => {
    try {
      const response = await api.post('/game/quiz/generate', {
        difficulty: options.difficulty || 'easy',
        count: options.count || 10,
        game_mode: options.gameMode || 'qcm'
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la génération du quiz');
    }
  },

  /**
   * Vérifier les réponses d'un quiz
   * @param {object} quizData - Données du quiz avec réponses
   */
  checkQuiz: async (quizData) => {
    try {
      const response = await api.post('/game/quiz/check', quizData);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la vérification du quiz');
    }
  },

  /**
   * Sauvegarder une session de jeu (nécessite authentification)
   * @param {object} sessionData - Données de la session
   */
  saveGameSession: async (sessionData) => {
    try {
      const response = await api.post('/game/session', {
        game_mode: sessionData.gameMode,
        difficulty: sessionData.difficulty,
        score: sessionData.score,
        total_questions: sessionData.totalQuestions,
        correct_answers: sessionData.correctAnswers,
        wrong_answers: sessionData.wrongAnswers,
        time_spent: sessionData.timeSpent,
        completed: sessionData.completed || true
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Utilisateur non connecté - ne rien faire
        return null;
      }
      throw new Error('Erreur lors de la sauvegarde de la session');
    }
  },

  /**
   * Obtenir l'historique des sessions de jeu
   * @param {string} gameMode - Mode de jeu (optionnel)
   */
  getGameSessions: async (gameMode = null) => {
    try {
      const params = gameMode ? { game_mode: gameMode } : {};
      const response = await api.get('/game/sessions', { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { sessions: [] };
      }
      throw new Error('Erreur lors de la récupération des sessions');
    }
  },

  /**
   * Obtenir les statistiques globales
   */
  getGlobalStats: async () => {
    try {
      const response = await api.get('/game/stats/global');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  },

  // ==================== ALPHABET ====================

  /**
   * Obtenir l'alphabet complet
   * @param {string} orthography - 'post1988' ou 'pre1988'
   */
  getAlphabet: async (orthography = 'post1988') => {
    try {
      const response = await api.get('/alphabet', {
        params: { orthography }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'alphabet');
    }
  },

  /**
   * Obtenir les voyelles
   * @param {string} category - 'short', 'long', 'nasal', etc.
   */
  getVowels: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/alphabet/vowels', { params });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des voyelles');
    }
  },

  /**
   * Obtenir les consonnes
   */
  getConsonants: async () => {
    try {
      const response = await api.get('/alphabet/consonants');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des consonnes');
    }
  },

  /**
   * Obtenir les digraphes
   */
  getDigraphs: async () => {
    try {
      const response = await api.get('/alphabet/digraphs');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des digraphes');
    }
  },

  /**
   * Générer un exercice de correspondance
   */
  generateMatchExercise: async () => {
    try {
      const response = await api.get('/alphabet/exercise/match');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la génération de l\'exercice');
    }
  },

  // ==================== PROGRESSION ====================

  /**
   * Obtenir la progression de l'utilisateur (nécessite authentification)
   */
  getProgress: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error('Erreur lors de la récupération de la progression');
    }
  },

  /**
   * Obtenir le tableau de bord complet (nécessite authentification)
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error('Erreur lors de la récupération du tableau de bord');
    }
  },

  /**
   * Obtenir le classement (nécessite authentification)
   * @param {string} period - 'day', 'week', 'month', 'all'
   */
  getLeaderboard: async (period = 'week') => {
    try {
      const response = await api.get('/leaderboard', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { leaderboard: [] };
      }
      throw new Error('Erreur lors de la récupération du classement');
    }
  },

  // ==================== CONTACT & BLOG ====================

  /**
   * Envoyer un message de contact
   */
  sendContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de l\'envoi du message');
    }
  },

  /**
   * Envoyer une demande de partenariat
   */
  sendPartnership: async (partnershipData) => {
    try {
      const response = await api.post('/partnership', partnershipData);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de l\'envoi de la demande de partenariat');
    }
  },

  /**
   * Obtenir les articles de blog
   */
  getBlogPosts: async () => {
    try {
      const response = await api.get('/blog');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des articles');
    }
  },

  /**
   * Obtenir un article de blog par ID
   */
  getBlogPost: async (id) => {
    try {
      const response = await api.get(`/blog/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'article');
    }
  },
};

export default apiService;
