import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';
import { TreePine, Target, Sparkles, Info, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';
import DecisionTree from './DecisionTree';
import { useLanguage } from '../contexts/LanguageContext';
import audioService from '../services/audioService';
import gameTheme from '../styles/gameTheme';

const ExplorationMode = ({ explorationResult, setExplorationResult }) => {
  const { t } = useLanguage();
  const [inputNumber, setInputNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAnalyze = async () => {
    const numValue = parseInt(inputNumber, 10);
    if (!inputNumber || isNaN(numValue) || numValue < 1 || numValue > 9999) {
      setError('Veuillez entrer un nombre valide entre 1 et 9999');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Récupérer le nombre depuis le backend
      const numberData = await apiService.getNumberByValue(numValue);

      if (!numberData || !numberData.data) {
        setError('Nombre non trouvé dans la base de données');
        setLoading(false);
        return;
      }

      // Analyser le nombre en détail
      const analysis = await apiService.analyzeNumber(numberData.data.id);

      // Construire l'objet d'exploration avec les données du backend
      const exploration = {
        number: numValue,
        translation: analysis.data.translation || numberData.data.translation,
        soussou_translation: analysis.data.translation || numberData.data.translation,
        pronunciation: analysis.data.pronunciation,
        morphological_decomposition: analysis.data.morphological_decomposition || {
          tokens: [],
          structure: {}
        },
        morphological_rules_applied: analysis.data.morphological_rules || [],
        morphological_tree: analysis.data.morphological_tree,
        alternatives: analysis.data.alternatives || [],
        stats: {
          token_count: analysis.data.morphological_decomposition?.tokens?.length || 0,
          segments: analysis.data.morphological_decomposition?.tokens?.length || 0
        },
        additional_info: {
          note: "Analyse provenant du backend Laravel",
          source: 'backend-api'
        }
      };

      setExplorationResult(exploration);
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      if (err.response?.status === 404) {
        setError('Ce nombre n\'existe pas dans la base de données');
      } else {
        setError('Erreur lors de l\'analyse. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour jouer la prononciation audio du nombre
  const playAudio = async () => {
    const number = explorationResult?.number;
    if (!number || isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      await audioService.playNumber(number);
    } catch (error) {
      console.error('Erreur lors de la lecture audio:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  if (!explorationResult) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Section principale avec motifs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="bogolan" opacity={gameTheme.patterns.opacity} />
          <img
            src="/7082095.jpg"
            alt="Motif ouest africain"
            className={`absolute inset-0 w-full h-full object-cover ${gameTheme.backgrounds.overlay} pointer-events-none`}
          />
        </div>

        <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gradient-text mb-6">Mode Exploration</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Analyse de la formation des nombres en soussou
            </p>
          </div>

          <div className="text-center">
            <div className={`${gameTheme.backgrounds.glass} p-8 rounded-2xl border border-orange-100 mb-6`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Prêt pour l'Exploration ?
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Plongez dans l'univers fascinant de la numération soussou et découvrez ses secrets millénaires
              </p>

              <div className="space-y-6">
                {/* Input pour vérifier un nombre */}
                <div className="relative max-w-md mx-auto">
                  <input
                    type="number"
                    value={inputNumber}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '' || /^\d+$/.test(raw)) {
                        const value = raw === '' ? '' : Math.min(9999, parseInt(raw, 10));
                        setInputNumber(value === '' ? '' : String(value));
                        setError('');
                      }
                    }}
                    placeholder="Entrez un nombre (1-9999)"
                    className="w-full px-6 py-4 text-xl font-semibold bg-white border-2 border-orange-300 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-center placeholder-gray-500"
                    min="1"
                    max="9999"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'Delete') {
                        e.preventDefault();
                      }
                      if (e.key === 'Enter') {
                        handleAnalyze();
                      }
                    }}
                  />
                </div>

                {/* Messages d'erreur */}
                {error && (
                  <motion.div
                    {...gameTheme.animations.fadeInFast}
                    className={`max-w-md mx-auto ${gameTheme.colors.feedback.incorrect} px-4 py-3 rounded-lg border-2`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Bouton de vérification */}
                <div className="max-w-md mx-auto">
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={loading || !inputNumber}
                    className={`w-full text-white px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      loading || !inputNumber
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-2xl'
                    }`}
                    whileHover={!loading && inputNumber ? { scale: 1.03 } : {}}
                    whileTap={!loading && inputNumber ? { scale: 0.97 } : {}}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-bold">{t('analysisInProgress') || 'Analyse en cours...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold">{t('analyzeNumber') || 'Analyser le nombre'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render exploration result if available
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Section principale avec motifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={gameTheme.patterns.opacity} />
        <img
          src="/7062114.jpg"
          alt="Motif ouest africain"
          className={`absolute inset-0 w-full h-full object-cover ${gameTheme.backgrounds.overlay} pointer-events-none`}
        />
      </div>

      <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setExplorationResult(null)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {t('newAnalysis') || 'Nouvelle analyse'}
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t('linguisticAnalysis') || 'Analyse linguistique'}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <p className="text-gray-600 text-lg">
                {t('numberAnalyzed') || 'Nombre analysé'}: <span className="font-bold text-2xl text-orange-600">{explorationResult?.number || 'N/A'}</span>
              </p>
              {explorationResult?.number && (
                <button
                  onClick={playAudio}
                  disabled={isPlayingAudio}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isPlayingAudio
                      ? 'bg-blue-200 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  title={t('listenPronunciation') || 'Écouter la prononciation'}
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="w-32"></div>
        </div>

        {/* Résultat principal - Traduction Soussou */}
        <motion.div
          {...gameTheme.animations.fadeIn}
          className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 mb-8 border border-orange-100 shadow-lg`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('soussouTranslation') || 'Traduction Soussou'}
            </h2>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                {explorationResult?.soussou_translation || explorationResult?.translation || '—'}
              </div>
              <div className="text-sm text-gray-600">
                {t('pronunciation') || 'Prononciation'} : <span className="font-medium">{explorationResult?.pronunciation || '—'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alternatives si disponibles */}
        {explorationResult?.alternatives && explorationResult.alternatives.length > 0 && (
          <motion.div
            {...gameTheme.animations.fadeIn}
            className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 mb-8 border border-blue-100 shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                {t('alternatives') || 'Alternatives'}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {explorationResult.alternatives.map((alt, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-900">{alt.translation}</div>
                  {alt.context && (
                    <div className="text-sm text-blue-700 mt-1">{alt.context}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Arbre de décomposition morphologique */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Arbre visuel */}
          <motion.div
            {...gameTheme.animations.fadeIn}
            className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 border border-orange-100 shadow-lg`}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <TreePine className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                {t('morphologicalTree') || 'Arbre morphologique'}
              </h3>
            </div>

            <div className="relative">
              <DecisionTree explorationResult={explorationResult} />
            </div>
          </motion.div>

          {/* Règles */}
          <motion.div
            {...gameTheme.animations.fadeIn}
            className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 border border-orange-100 shadow-lg`}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Target className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                {t('appliedRules') || 'Règles appliquées'}
              </h3>
            </div>

            <div>
              {explorationResult?.morphological_rules_applied && explorationResult.morphological_rules_applied.length > 0 ? (
                <div className="space-y-4">
                  {explorationResult.morphological_rules_applied.map((rule, index) => {
                    const magicColors = [
                      'from-purple-400 to-indigo-500',
                      'from-pink-400 to-rose-500',
                      'from-blue-400 to-purple-500',
                      'from-indigo-400 to-pink-500',
                      'from-violet-400 to-purple-500'
                    ];
                    const bgMagic = [
                      'border-purple-200 bg-purple-50/90',
                      'border-pink-200 bg-pink-50/90',
                      'border-blue-200 bg-blue-50/90',
                      'border-indigo-200 bg-indigo-50/90',
                      'border-violet-200 bg-violet-50/90'
                    ];

                    return (
                      <motion.div
                        key={index}
                        {...gameTheme.animations.fadeInFast}
                        className={`${bgMagic[index % bgMagic.length]} backdrop-blur-sm rounded-2xl p-6 border-2`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${magicColors[index % magicColors.length]} rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-purple-800 mb-2 text-lg">
                              {rule.rule_name || `${t('rule') || 'Règle'} ${index + 1}`}
                            </div>
                            <div className="text-gray-700 text-base font-medium leading-relaxed">
                              {rule.description || rule.rule || (typeof rule === 'string' ? rule : JSON.stringify(rule))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-purple-700 mb-4">
                    {t('rulesPreparing') || 'Règles en préparation'}
                  </h4>
                  <p className="text-purple-600 text-lg font-medium">
                    {t('rulesPreparingDesc') || 'Les règles morphologiques seront bientôt disponibles'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Explication détaillée de la formation du nombre */}
        <motion.div
          {...gameTheme.animations.fadeIn}
          className={`${gameTheme.backgrounds.glass} rounded-2xl p-8 border border-orange-100 shadow-lg`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <TreePine className="w-8 h-8 text-emerald-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              {t('detailedExplanation') || 'Explication détaillée'}
            </h3>
          </div>

          {(() => {
            const s = explorationResult?.morphological_decomposition?.structure || {};
            const hasAny = ['thousands','hundreds','tens','units'].some(k => s[k] && Number(s[k]) > 0) || Object.values(s).some(v => Number(v) > 0);
            const ordered = Object.entries(s).sort(([a],[b]) => {
              const weight = (k) => {
                const t = String(k).toLowerCase();
                if (t.includes('mill')) return 0;
                if (t.includes('cent')) return 1;
                if (t.includes('diz') || t.includes('ten')) return 2;
                if (t.includes('uni')) return 3;
                return 4;
              };
              return weight(a) - weight(b);
            });
            const tokens = explorationResult?.morphological_decomposition?.tokens || [];
            const soussou = explorationResult?.soussou_translation || explorationResult?.translation || '';

            if (!hasAny) {
              return (
                <p className="text-gray-700 text-lg text-center">
                  {t('noDecompositionAvailable') || 'Aucune décomposition disponible'}
                </p>
              );
            }

            return (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <div className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-semibold">{t('principle') || 'Principe'} : </span>
                    {t('principleText') || 'En soussou, les nombres se construisent par agrégation hiérarchique'}
                    <span className="font-semibold"> {t('orderSegments') || 'dans l\'ordre des segments'}</span>,
                    {t('withLinkNun') || ' reliés par le lien "nŭn"'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      {t('stepsRootLeaves') || 'Étapes (racine → feuilles)'}
                    </h4>
                    <ul className="space-y-3">
                      {ordered.map(([key, value]) => (
                        Number(value) > 0 ? (
                          <li key={key} className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                              {(() => {
                                const w = String(key).toLowerCase();
                                if (w.includes('mill')) return 'M';
                                if (w.includes('cent')) return 'C';
                                if (w.includes('diz')||w.includes('ten')) return 'D';
                                if (w.includes('uni')) return 'U';
                                return '·';
                              })()}
                            </span>
                            <div>
                              <div className="font-semibold capitalize">
                                {key.replace('_',' ')}: <span className="text-gray-900">{value}</span>
                              </div>
                              <div className="text-gray-600 text-sm">
                                {t('addSegmentUnderBranch') || 'Ajoute un segment sous cette branche'}
                              </div>
                            </div>
                          </li>
                        ) : null
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      {t('textualFormulaSoussou') || 'Formule textuelle soussou'}
                    </h4>
                    <div className="text-gray-800">
                      {tokens.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-lg font-semibold">
                            {t('segments') || 'Segments'}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tokens.map((t, i) => (
                              <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-gray-600">
                            {t('assembly') || 'Assemblage'}: <span className="font-semibold text-gray-800">{tokens.join(' nŭn ')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">{soussou || '—'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>

        {/* Symboles décoratifs */}
        <div className="mt-8 flex justify-center gap-8 opacity-20">
          <AdinkraSymbol symbol="sankofa" size="w-16 h-16" color="text-orange-600" />
          <AdinkraSymbol symbol="gye_nyame" size="w-16 h-16" color="text-green-600" />
          <AdinkraSymbol symbol="dwennimmen" size="w-16 h-16" color="text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default ExplorationMode;
