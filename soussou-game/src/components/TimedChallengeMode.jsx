import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Zap, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';
import apiService from '../services/apiService';
import gameTheme from '../styles/gameTheme';

// Mapper les difficultés
const mapDifficulty = (diff) => {
  if (typeof diff === 'object' && diff?.id) {
    diff = diff.id;
  }
  const mapping = {
    'facile': 'easy',
    'moyen': 'medium',
    'difficile': 'hard'
  };
  return mapping[diff] || diff;
};

const TimedChallengeMode = ({ setGameMode, difficulty = 'easy' }) => {
  const { t } = useLanguage();
  const { user, updateProgress } = useAuth();

  // Mapper la difficulté
  const apiDifficulty = mapDifficulty(difficulty);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Démarrer/arrêter le chronomètre
  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded, timeLeft]);

  // Focus sur l'input
  useEffect(() => {
    if (gameStarted && !gameEnded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentNumber, gameStarted, gameEnded]);

  // Charger le premier nombre
  const startGame = async () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    await loadNewNumber();
  };

  const loadNewNumber = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRandomNumber(apiDifficulty);
      setCurrentNumber(data);
      setUserAnswer('');
      setFeedback('');
    } catch (error) {
      console.error('Erreur lors du chargement du nombre:', error);
      setFeedback('Erreur lors du chargement du nombre');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!userAnswer.trim() || !currentNumber || loading) return;

    try {
      setLoading(true);
      const result = await apiService.checkAnswer(currentNumber.id, userAnswer.trim());

      setTotalQuestions(prev => prev + 1);

      if (result.correct) {
        // Bonne réponse
        const points = getPoints();
        setScore(prev => prev + points);
        setCorrectAnswers(prev => prev + 1);
        setStreak(prev => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });

        // Bonus de temps
        const timeBonus = apiDifficulty === 'easy' ? 3 : apiDifficulty === 'medium' ? 5 : 7;
        setTimeLeft(prev => Math.min(prev + timeBonus, 120)); // Max 2 minutes

        setFeedback(`✅ Correct ! +${points} points (+${timeBonus}s)`);

        // Charger le prochain nombre après un court délai
        setTimeout(() => {
          loadNewNumber();
        }, 800);
      } else {
        // Mauvaise réponse
        setWrongAnswers(prev => prev + 1);
        setStreak(0);
        const correctAnswer = result.correct_answer || currentNumber.soussou || 'Non disponible';
        setFeedback(`❌ Incorrect. La bonne réponse était : ${correctAnswer}`);

        // Pénalité de temps
        setTimeLeft(prev => Math.max(prev - 3, 0));

        // Charger le prochain nombre après un délai plus long
        setTimeout(() => {
          loadNewNumber();
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setFeedback('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const getPoints = () => {
    const basePoints = apiDifficulty === 'easy' ? 10 : apiDifficulty === 'medium' ? 20 : 30;
    const streakBonus = Math.floor(streak / 3) * 5; // +5 points tous les 3 bons coups
    return basePoints + streakBonus;
  };

  const endGame = async () => {
    setGameEnded(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Sauvegarder la session si l'utilisateur est connecté
    if (user && totalQuestions > 0) {
      try {
        await updateProgress({
          game_mode: 'timed_challenge',
          difficulty: apiDifficulty,
          score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          time_spent: 60 - timeLeft,
          completed: true,
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-blue-600';
    if (timeLeft > 10) return 'text-yellow-600 animate-pulse';
    return 'text-red-600 animate-pulse';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white p-6 relative overflow-hidden">
      {/* Motifs de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType={gameTheme.patterns.default} opacity={gameTheme.patterns.opacity} />
        <img
          src="/7062114.jpg"
          alt="Motif ouest africain"
          className={`absolute inset-0 w-full h-full object-cover ${gameTheme.backgrounds.overlay}`}
        />
      </div>

      {/* Symboles Adinkra */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-10 left-10">
          <AdinkraSymbol symbol="sankofa" size="w-32 h-32" color="text-orange-400" />
        </div>
        <div className="absolute top-20 right-20">
          <AdinkraSymbol symbol="gye_nyame" size="w-40 h-40" color="text-red-400" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <AdinkraSymbol symbol="dwennimmen" size="w-36 h-36" color="text-yellow-500" />
        </div>
      </div>

      <motion.div
        {...gameTheme.animations.fadeIn}
        className={gameTheme.spacing.container}
      >
        <div className={gameTheme.spacing.card}>
          {/* En-tête */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-orange-600" />
              <h2 className={gameTheme.typography.title}>Défi Chrono</h2>
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
            <p className={gameTheme.typography.subtitle}>
              Répondez vite et gagnez du temps bonus !
            </p>
          </div>

          {!gameStarted ? (
            // Écran de démarrage
            <motion.div {...gameTheme.animations.fadeInFast} className="text-center space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-2xl border-4 border-orange-200">
                <Clock className="w-20 h-20 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Comment jouer ?</h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Vous avez <strong>60 secondes</strong> pour répondre à un maximum de questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Chaque bonne réponse vous donne du <strong>temps bonus</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Les <strong>combos</strong> augmentent vos points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">⚠</span>
                    <span>Les erreurs retirent <strong>3 secondes</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className={`${gameTheme.buttons.primary} w-full max-w-md mx-auto block text-2xl py-6`}
              >
                <span className="flex items-center justify-center gap-3">
                  <Zap className="w-8 h-8" />
                  DÉMARRER LE DÉFI
                  <Zap className="w-8 h-8" />
                </span>
              </button>

              <button
                onClick={() => setGameMode('menu')}
                className={gameTheme.buttons.secondary}
              >
                ← Retour au menu
              </button>
            </motion.div>
          ) : gameEnded ? (
            // Écran de fin
            <motion.div {...gameTheme.animations.scaleIn} className="text-center space-y-6">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
              <h3 className="text-4xl font-bold text-gray-800">Défi terminé !</h3>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-4 border-green-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-5xl font-bold text-orange-600">{score}</div>
                    <div className="text-gray-600 font-semibold">Points</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-blue-600">{totalQuestions}</div>
                    <div className="text-gray-600 font-semibold">Questions</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600">{correctAnswers}</div>
                    <div className="text-gray-600 font-semibold">Correctes</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600">{bestStreak}</div>
                    <div className="text-gray-600 font-semibold">Meilleur combo</div>
                  </div>
                </div>

                {totalQuestions > 0 && (
                  <div className="mt-6 text-xl font-bold text-gray-700">
                    Précision : {Math.round((correctAnswers / totalQuestions) * 100)}%
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className={gameTheme.buttons.primary}
                >
                  🔄 Rejouer
                </button>
                <button
                  onClick={() => setGameMode('menu')}
                  className={gameTheme.buttons.secondary}
                >
                  ← Retour au menu
                </button>
              </div>
            </motion.div>
          ) : (
            // Jeu en cours
            <div className="space-y-6">
              {/* Stats en haut */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200 text-center">
                  <div className={getTimerColor() + ' text-3xl font-bold'}>
                    <Clock className="w-6 h-6 inline mr-2" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border-2 border-orange-200 text-center">
                  <div className="text-3xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border-2 border-purple-200 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {streak > 0 && '🔥'} {streak}
                  </div>
                  <div className="text-sm text-gray-600">Combo</div>
                </div>
              </div>

              {/* Question */}
              {currentNumber && !loading && (
                <motion.div {...gameTheme.animations.fadeInFast} className="text-center">
                  <div className={gameTheme.typography.numberDisplayLarge}>
                    {currentNumber.soussou || currentNumber.alternatives?.[0] || 'Chargement...'}
                  </div>
                  <p className={gameTheme.typography.subtitle}>
                    Quel est ce nombre ?
                  </p>
                </motion.div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`text-center p-4 rounded-lg font-semibold text-lg ${
                      feedback.includes('✅')
                        ? gameTheme.colors.feedback.correct
                        : gameTheme.colors.feedback.incorrect
                    }`}
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tapez le nombre..."
                  className={gameTheme.inputs.default}
                  disabled={loading || gameEnded}
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className={`${gameTheme.buttons.primary} w-full`}
                >
                  {loading ? 'Vérification...' : '✅ VALIDER'}
                </button>
              </form>

              {/* Bouton abandon */}
              <div className="text-center">
                <button
                  onClick={endGame}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Abandonner
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TimedChallengeMode;
