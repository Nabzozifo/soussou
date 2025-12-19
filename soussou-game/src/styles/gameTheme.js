/**
 * Thème unifié pour toute l'application
 * Utilisé pour maintenir la cohérence visuelle à travers tous les modes de jeu
 */

export const gameTheme = {
  // Couleurs principales
  colors: {
    primary: {
      orange: '#ea580c',      // Orange vif
      yellow: '#f59e0b',      // Jaune doré
      red: '#dc2626',         // Rouge
      green: '#16a34a',       // Vert
      blue: '#2563eb',        // Bleu
      purple: '#9333ea',      // Violet
    },
    feedback: {
      correct: 'bg-green-100 text-green-800 border-green-200',
      incorrect: 'bg-red-100 text-red-800 border-red-200',
      hint: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      info: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  },

  // Backgrounds (au niveau racine pour accès facile)
  backgrounds: {
    pattern: 'opacity-[0.06]',           // Opacité pour motifs de fond
    overlay: 'opacity-[0.12]',           // Opacité pour image overlay
    glass: 'backdrop-blur-sm bg-white/90', // Effet verre
    glassStrong: 'backdrop-blur-md bg-white/95',
  },

  // Motifs africains
  patterns: {
    default: 'kente',
    opacity: 0.08,
    variants: ['kente', 'dogon', 'mask', 'elements', 'geometric'],
  },

  // Animations Framer Motion
  animations: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
    fadeInFast: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 },
    },
    slideIn: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.4 },
    },
    scaleIn: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: 'spring', stiffness: 200 },
    },
  },

  // Espacement et layout
  spacing: {
    container: 'max-w-4xl mx-auto p-6',
    containerLarge: 'max-w-6xl mx-auto p-6',
    card: 'p-6 glass-morphism rounded-2xl shadow-xl relative z-10',
    cardSmall: 'p-4 glass-morphism rounded-xl shadow-lg',
  },

  // Boutons
  buttons: {
    primary: 'bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-4 px-6 rounded-2xl text-xl font-black hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-4 border-white/70',
    secondary: 'bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold',
    danger: 'bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold',
    success: 'bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold',
    info: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold',
    outline: 'border-2 border-gray-700 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold',
  },

  // Inputs
  inputs: {
    default: 'w-full p-6 text-2xl font-black bg-gradient-to-r from-white to-yellow-50 backdrop-blur-sm border-4 border-yellow-500 rounded-2xl focus:border-orange-500 focus:ring-8 focus:ring-orange-500/40 focus:outline-none shadow-2xl hover:shadow-3xl transition-all duration-300 text-gray-900 placeholder-gray-600',
    small: 'w-full p-4 text-lg bg-white border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:outline-none',
  },

  // Typographie
  typography: {
    title: 'text-4xl font-bold text-black mb-4',
    titleLarge: 'text-5xl font-bold text-black mb-6',
    subtitle: 'text-xl text-black/80 mb-6',
    numberDisplay: 'text-6xl font-bold text-orange-600 mb-4 soussou-text',
    numberDisplayLarge: 'text-8xl font-bold text-orange-600 mb-6 soussou-text',
    label: 'text-lg font-semibold text-gray-700 mb-2',
    body: 'text-base text-gray-700',
    bodyLarge: 'text-lg text-gray-700',
  },

  // Stats et scores
  stats: {
    container: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6',
    item: 'bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-200',
    value: 'text-3xl font-bold',
    label: 'text-sm text-gray-600',
  },

  // Timer
  timer: {
    normal: 'text-4xl font-bold text-blue-600',
    warning: 'text-4xl font-bold text-yellow-600 animate-pulse',
    danger: 'text-4xl font-bold text-red-600 animate-pulse',
  },
};

export default gameTheme;
