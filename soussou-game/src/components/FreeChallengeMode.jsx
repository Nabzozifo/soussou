import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const FreeChallengeMode = ({ setGameMode, difficulty = 'easy' }) => {
  const { t } = useLanguage();
  const { user, updateProgress } = useAuth();

  // Mapper la difficulté
  const apiDifficulty = mapDifficulty(difficulty);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [showExplanationLink, setShowExplanationLink] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const inputRef = useRef(null);

  // Messages d'encouragement
  const encouragementMessages = [
    "Courage ! Vous pouvez y arriver !",
    "Essayez encore, vous êtes sur la bonne voie !",
    "Concentrez-vous, la réponse est proche !"
  ];

  // Maintenir le focus sur l'input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentNumber, feedback]);

  // Charger le premier nombre au montage
  useEffect(() => {
    loadNewNumber();
  }, []);

  const loadNewNumber = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRandomNumber(apiDifficulty);
      setCurrentNumber(data);
      setUserAnswer('');
      setAttempts(0);
      setShowHint(false);
      setEncouragement('');
      setShowExplanationLink(false);
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

      // Vérifier la réponse via le backend
      const result = await apiService.checkAnswer(currentNumber.id, userAnswer.trim());

      setTotalQuestions(prev => prev + 1);

      if (result.correct) {
        // Bonne réponse !
        setFeedback('✅ Excellent ! Bonne réponse !');
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30));
        setAttempts(0);
        setShowHint(false);
        setEncouragement('');
        setShowExplanationLink(false);

        // Sauvegarder la progression si connecté
        if (user) {
          try {
            await updateProgress({
              game_mode: 'free_challenge',
              difficulty: apiDifficulty,
              score: score + (apiDifficulty === 'easy' ? 10 : apiDifficulty === 'medium' ? 20 : 30),
              total_questions: totalQuestions + 1,
              correct_answers: correctAnswers + 1,
              wrong_answers,
              time_spent: 0,
              completed: false,
            });
          } catch (error) {
            console.error('Erreur sauvegarde:', error);
          }
        }

        // Charger le prochain nombre après 2 secondes
        setTimeout(() => {
          loadNewNumber();
        }, 2000);
      } else {
        // Mauvaise réponse
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setWrongAnswers(prev => prev + 1);

        if (newAttempts === 1) {
          setFeedback('❌ Pas tout à fait. Essayez encore !');
          setEncouragement(encouragementMessages[0]);
        } else if (newAttempts === 2) {
          setFeedback('❌ Encore une tentative !');
          setEncouragement(encouragementMessages[1]);
          setShowHint(true);
        } else if (newAttempts >= 3) {
          const correctAnswer = result.correct_answer || currentNumber.soussou || 'Non disponible';
          setFeedback(`❌ La bonne réponse était : ${correctAnswer}`);
          setEncouragement('Consultez les explications pour mieux comprendre');
          setShowExplanationLink(true);

          // Charger le prochain nombre après 4 secondes
          setTimeout(() => {
            loadNewNumber();
          }, 4000);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setFeedback('Erreur lors de la vérification de la réponse');
    } finally {
      setLoading(false);
    }
  };

  if (!currentNumber && loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 relative overflow-hidden">
      {/* Overlay motif+image fixe couvrant toute la page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType={gameTheme.patterns.default} opacity={gameTheme.patterns.opacity} />
        <img
          src="/7062114.jpg"
          alt="Motif ouest africain"
          className={`absolute inset-0 w-full h-full object-cover ${gameTheme.backgrounds.overlay}`}
        />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Motifs africains authentiques en arrière-plan */}
        <AfricanPatterns patternType="kente" opacity={0.08} />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10">
            <AdinkraSymbol symbol="sankofa" size="w-32 h-32" color="text-orange-400" />
          </div>
          <div className="absolute top-20 right-20">
            <AdinkraSymbol symbol="gye_nyame" size="w-40 h-40" color="text-red-400" />
          </div>
          <div className="absolute bottom-20 left-1/4">
            <AdinkraSymbol symbol="dwennimmen" size="w-36 h-36" color="text-yellow-500" />
          </div>
          <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2">
            <AfricanPatterns patternType="dogon" opacity={0.2} className="w-24 h-24" />
          </div>
          <div className="absolute bottom-20 right-20">
            <AfricanPatterns patternType="mask" opacity={0.2} className="w-32 h-32" />
          </div>
          <div className="absolute top-10 right-1/4">
            <AfricanPatterns patternType="elements" opacity={0.2} className="w-36 h-36" />
          </div>
          <div className="absolute bottom-10 left-10">
            <AfricanPatterns patternType="geometric" opacity={0.2} className="w-28 h-28" />
          </div>
        </div>
      </div>

      <motion.div
        {...gameTheme.animations.fadeIn}
        className="max-w-2xl mx-auto p-6 glass-morphism rounded-2xl shadow-xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Défi Libre</h2>
          <p className="text-black/80">Prenez votre temps, apprenez à votre rythme</p>

          {/* Affichage du score */}
          {totalQuestions > 0 && (
            <div className="mt-4 flex gap-4 justify-center">
              <div className="bg-orange-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-orange-600">{score}</span>
                <span className="text-gray-600 ml-2">points</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-green-600">{correctAnswers}/{totalQuestions}</span>
                <span className="text-gray-600 ml-2">bonnes réponses</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <div className={gameTheme.typography.numberDisplay}>
            {currentNumber?.soussou || currentNumber?.alternatives?.[0] || 'Chargement...'}
          </div>
          <p className="text-lg text-black/80 mb-6">
            Quel nombre correspond à ce mot en Soussou ?
          </p>

          {/* Indice */}
          <AnimatePresence>
            {showHint && currentNumber && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${gameTheme.colors.feedback.hint} border rounded-lg p-4 mb-4`}
              >
                <p className="font-medium">💡 Indice :</p>
                <p>
                  Ce nombre commence par "{currentNumber.number?.toString().charAt(0) || ''}..."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Encouragement */}
          <AnimatePresence>
            {encouragement && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${gameTheme.colors.feedback.warning} border rounded-lg p-3 mb-4`}
              >
                <p className="font-medium">{encouragement}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lien vers explications */}
          <AnimatePresence>
            {showExplanationLink && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${gameTheme.colors.feedback.info} border rounded-lg p-4 mb-4`}
              >
                <button
                  onClick={() => setGameMode('exploration')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📚 Voir les explications
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-2xl blur-lg animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl opacity-50 blur-xl animate-pulse"></div>
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="TAPEZ LE NOMBRE ICI..."
              className={gameTheme.inputs.default}
              disabled={loading}
              autoFocus
            />
          </form>

          <button
            onClick={handleSubmit}
            disabled={loading || !userAnswer.trim()}
            className={`${gameTheme.buttons.primary} w-full relative overflow-hidden group`}
          >
            <span className="relative z-10 drop-shadow-lg tracking-wide">
              {loading ? '⏳ VÉRIFICATION...' : '✅ VÉRIFIER MA RÉPONSE'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl -z-10 opacity-50 blur-lg animate-pulse"></div>
          </button>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center p-4 rounded-lg mb-4 ${
                feedback.includes('✅')
                  ? gameTheme.colors.feedback.correct
                  : gameTheme.colors.feedback.incorrect
              }`}
            >
              <p className="font-semibold text-lg">{feedback}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boutons d'action */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setGameMode('menu')}
            className={gameTheme.buttons.secondary}
          >
            ← {t('backToMenu')}
          </button>
          <button
            onClick={loadNewNumber}
            disabled={loading}
            className={gameTheme.buttons.info}
          >
            🔄 Nouveau nombre
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FreeChallengeMode;
