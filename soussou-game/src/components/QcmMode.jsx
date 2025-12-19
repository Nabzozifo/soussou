import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AfricanPatterns, { AdinkraSymbol } from './AfricanPatterns';
import { BookOpen, Target, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import gameTheme from '../styles/gameTheme';

const QcmMode = ({ setGameMode, difficulty = 'easy' }) => {
  const { updateProgress, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  // Charger le quiz au montage
  useEffect(() => {
    loadQuiz();
  }, [difficulty]);

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await apiService.generateQuiz({
        difficulty,
        count: 10,
        gameMode: 'qcm'
      });
      setQuiz(quizData);
      setCurrentIndex(0);
      setAnswers([]);
      setScore({ correct: 0, wrong: 0 });
    } catch (err) {
      console.error('Erreur lors du chargement du quiz:', err);
      setError('Impossible de charger le quiz. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = quiz.questions[currentIndex];
    // Comparer la valeur sélectionnée avec la bonne réponse
    const isCorrect = currentQuestion.options[selectedAnswer] === currentQuestion.correct_answer;

    setResult(isCorrect ? 'correct' : 'incorrect');

    // Enregistrer la réponse
    setAnswers([...answers, {
      question_id: currentQuestion.id,
      user_answer: selectedAnswer,
      is_correct: isCorrect
    }]);

    // Mettre à jour le score
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      // Fin du quiz - vérifier et sauvegarder
      await finishQuiz();
    } else {
      // Question suivante
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setResult(null);
    }
  };

  const finishQuiz = async () => {
    try {
      // Vérifier le quiz côté backend
      const verification = await apiService.checkQuiz({
        quiz_id: quiz.id,
        answers: answers
      });

      // Sauvegarder la progression si l'utilisateur est connecté
      if (user) {
        await updateProgress({
          game_mode: 'qcm',
          difficulty: difficulty,
          score: score.correct,
          total_questions: quiz.questions.length,
          correct_answers: score.correct,
          wrong_answers: score.wrong,
          time_spent: 0, // TODO: implémenter un timer
          completed: true
        });
      }

      // Afficher les résultats ou retourner au menu
      alert(`Quiz terminé! Score: ${score.correct}/${quiz.questions.length}`);
      setGameMode('menu');
    } catch (err) {
      console.error('Erreur lors de la finalisation du quiz:', err);
      // Retourner au menu même en cas d'erreur
      setGameMode('menu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="kente" opacity={gameTheme.patterns.opacity} />
          <img
            src="/7062114.jpg"
            alt="Motif ouest africain"
            className={`absolute inset-0 object-cover w-full h-full ${gameTheme.backgrounds.overlay}`}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className={gameTheme.spacing.card}>
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700 text-center">
              Chargement du quiz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="kente" opacity={gameTheme.patterns.opacity} />
          <img
            src="/7062114.jpg"
            alt="Motif ouest africain"
            className={`absolute inset-0 object-cover w-full h-full ${gameTheme.backgrounds.overlay}`}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className={gameTheme.spacing.card}>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700 text-center mb-4">
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={loadQuiz}
                className={gameTheme.buttons.primary}
              >
                Réessayer
              </button>
              <button
                onClick={() => setGameMode('menu')}
                className={gameTheme.buttons.secondary}
              >
                Retour au menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="kente" opacity={gameTheme.patterns.opacity} />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700">Aucune question disponible</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Overlay de fond couvrant toute la page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={gameTheme.patterns.opacity} />
        <img
          src="/7062114.jpg"
          alt="Motif ouest africain"
          className={`absolute inset-0 object-cover w-full h-full ${gameTheme.backgrounds.overlay}`}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setGameMode('menu')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retour au Jeu
          </button>
          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">QCM – Compréhension</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Question {currentIndex + 1} / {quiz.questions.length}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Score: {score.correct} / {currentIndex + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentIndex}
          {...gameTheme.animations.fadeIn}
          className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 border border-orange-100 shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              Question {currentIndex + 1}
            </h3>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  if (result === null) {
                    setSelectedAnswer(index);
                  }
                }}
                disabled={result !== null}
                whileHover={result === null ? { scale: 1.02 } : {}}
                whileTap={result === null ? { scale: 0.98 } : {}}
                className={`text-left px-6 py-5 rounded-2xl border-2 transition-all min-h-[72px] text-base sm:text-lg shadow-sm ${
                  selectedAnswer === index
                    ? 'border-orange-400 bg-orange-50 font-semibold'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md'
                } ${result !== null ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Feedback et actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || result !== null}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedAnswer === null || result !== null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
              }`}
            >
              Valider
            </button>

            {result && (
              <motion.div
                {...gameTheme.animations.fadeInFast}
                className="flex-1"
              >
                <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                  result === 'correct'
                    ? gameTheme.colors.feedback.correct
                    : gameTheme.colors.feedback.incorrect
                }`}>
                  {result === 'correct' ? 'Correct!' : 'Incorrect.'}
                  {result === 'incorrect' && (
                    <span className="block text-sm mt-1">
                      Bonne réponse: {currentQuestion.correct_answer}
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            <button
              onClick={handleNext}
              disabled={result === null}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                result === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
              }`}
            >
              {currentIndex + 1 >= quiz.questions.length ? 'Terminer' : 'Suivante'}
            </button>
          </div>
        </motion.div>

        {/* Symboles Adinkra décoratifs */}
        <div className="mt-8 flex justify-center gap-8 opacity-20">
          <AdinkraSymbol symbol="sankofa" size="w-16 h-16" color="text-orange-600" />
          <AdinkraSymbol symbol="gye_nyame" size="w-16 h-16" color="text-purple-600" />
          <AdinkraSymbol symbol="dwennimmen" size="w-16 h-16" color="text-orange-600" />
        </div>
      </div>
    </div>
  );
};

export default QcmMode;
