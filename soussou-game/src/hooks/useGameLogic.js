import { useState, useCallback, useRef } from 'react';
import apiService from '../services/apiService';

// Configuration des points par difficulté
const difficultyPoints = {
  facile: 10,
  easy: 10,
  moyen: 20,
  medium: 20,
  difficile: 30,
  hard: 30,
  expert: 50
};

// Mapper les difficultés françaises vers anglaises (pour l'API)
const mapDifficulty = (diff) => {
  // Si diff est un objet avec un id, utiliser l'id
  const diffStr = typeof diff === 'object' && diff?.id ? diff.id : diff;

  const mapping = {
    'facile': 'easy',
    'moyen': 'medium',
    'difficile': 'hard'
  };
  return mapping[diffStr] || diffStr;
};

const useGameLogic = (difficulty = 'facile', gameDirection = 'number-to-soussou') => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [soussouData, setSoussouData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Cache pour le préchargement
  const cache = useRef(new Map());
  const preloadQueue = useRef([]);

  // Historique des derniers nombres pour éviter les répétitions
  const recentNumbers = useRef([]);
  const MAX_HISTORY = 10; // Garder les 10 derniers nombres

  const getDifficultyPoints = useCallback(() => {
    return difficultyPoints[difficulty] || 10;
  }, [difficulty]);

  // Fonction de préchargement (maintenant via API)
  const preloadNumbers = useCallback(async (count = 3) => {
    try {
      const items = await Promise.all(
        Array.from({ length: count }, () => apiService.getRandomNumber(mapDifficulty(difficulty)))
      );
      preloadQueue.current = items.filter(Boolean);
    } catch (error) {
      console.error('Erreur lors du préchargement:', error);
    }
  }, [difficulty]);

  const generateNewNumberWithDifficulty = useCallback(async (selectedDifficulty, _format = 'csv_data', _direction = gameDirection) => {
    setLoading(true);
    try {
      const difficultyId = selectedDifficulty?.id || selectedDifficulty || difficulty;
      const apiDifficulty = mapDifficulty(difficultyId);

      // Boucle pour éviter les répétitions
      let data;
      let attempts = 0;
      const maxAttempts = 5;

      do {
        data = await apiService.getRandomNumber(apiDifficulty);
        attempts++;
      } while (
        recentNumbers.current.includes(data.number) &&
        attempts < maxAttempts
      );

      // Ajouter à l'historique
      recentNumbers.current.push(data.number);
      if (recentNumbers.current.length > MAX_HISTORY) {
        recentNumbers.current.shift();
      }

      setCurrentNumber(data.number);
      setSoussouData({
        number: data.number,
        soussou: data.soussou || data.alternatives?.[0],
        translation: data.translation,
        alternatives: data.alternatives || []
      });
      setShowResult(false);
      setIsCorrect(false);

      return { number: data.number, data };
    } catch (error) {
      console.error('Erreur lors de la génération du nombre:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [difficulty, gameDirection]);

  const generateNewNumber = useCallback(async (_format = 'csv_data', _direction = gameDirection) => {
    setLoading(true);
    try {
      const apiDifficulty = mapDifficulty(difficulty);

      // Boucle pour éviter les répétitions
      let data;
      let attempts = 0;
      const maxAttempts = 5;

      do {
        data = await apiService.getRandomNumber(apiDifficulty);
        attempts++;
      } while (
        recentNumbers.current.includes(data.number) &&
        attempts < maxAttempts
      );

      // Ajouter à l'historique
      recentNumbers.current.push(data.number);
      if (recentNumbers.current.length > MAX_HISTORY) {
        recentNumbers.current.shift(); // Retirer le plus ancien
      }

      setCurrentNumber(data.number);
      setSoussouData({
        number: data.number,
        soussou: data.soussou || data.alternatives?.[0],
        translation: data.translation,
        alternatives: data.alternatives || []
      });
      setShowResult(false);
      setIsCorrect(false);

      return { number: data.number, soussou: data.soussou, translation: data.translation };
    } catch (error) {
      console.error('Erreur lors de la génération du nombre:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [difficulty, gameDirection]);

  const checkAnswer = useCallback((userAnswer, correctAnswers) => {
    if (!userAnswer || !correctAnswers) return false;
    
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    
    // Vérifier contre toutes les réponses possibles
    if (Array.isArray(correctAnswers)) {
      return correctAnswers.some(answer => 
        answer.toLowerCase().trim() === normalizedUserAnswer
      );
    }
    
    return correctAnswers.toLowerCase().trim() === normalizedUserAnswer;
  }, []);

  const handleGuess = useCallback((userGuess, onCorrectAnswer, onIncorrectAnswer) => {
    if (!soussouData || !userGuess.trim()) return;

    let correct = false;
    
    if (gameDirection === 'soussou-to-number') {
      // Mode: Soussou vers Nombre
      const userNumber = parseInt(userGuess.trim());
      correct = userNumber === currentNumber;
    } else {
      // Mode: Nombre vers Soussou
      const correctAnswers = [
        soussouData.soussou,
        ...(soussouData.alternatives || [])
      ].filter(Boolean);
      
      correct = checkAnswer(userGuess, correctAnswers);
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct && onCorrectAnswer) {
      onCorrectAnswer();
    } else if (!correct && onIncorrectAnswer) {
      onIncorrectAnswer();
    }

    return correct;
  }, [soussouData, currentNumber, gameDirection, checkAnswer]);

  const resetGame = useCallback(() => {
    setCurrentNumber(null);
    setSoussouData(null);
    setIsCorrect(false);
    setShowResult(false);
    setLoading(false);
  }, []);

  const nextChallenge = useCallback(async (format = 'linguistic', dataset = 'soussou') => {
    await generateNewNumber(format, dataset);
  }, [generateNewNumber]);

  return {
    // État
    currentNumber,
    soussouData,
    loading,
    isCorrect,
    showResult,
    
    // Actions
    generateNewNumberWithDifficulty,
    generateNewNumber,
    handleGuess,
    checkAnswer,
    getDifficultyPoints,
    resetGame,
    nextChallenge,
    preloadNumbers,
    
    // Setters pour compatibilité
    setIsCorrect,
    setShowResult
  };
};

export default useGameLogic;