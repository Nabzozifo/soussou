import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fr } from '../translations/fr';
import { translateBundle, getCachedBundle, setCachedBundle } from '../services/translationProvider';
import { useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  // Preload cached ES/PT bundles if present
  useEffect(() => {
    ['es','pt'].forEach((lng) => {
      const cached = getCachedBundle(lng);
      if (cached) {
        i18n.addResourceBundle(lng, 'translation', cached, true, true);
      }
    });
  }, [i18n]);

  const changeLanguage = async (newLanguage) => {
    if (newLanguage === 'es' || newLanguage === 'pt') {
      // Try cached bundle first
      let bundle = getCachedBundle(newLanguage);
      if (!bundle) {
        try {
          setIsTranslating(true);
          bundle = await translateBundle(fr, newLanguage, 'fr');
          if (bundle) setCachedBundle(newLanguage, bundle);
        } catch (e) {
          console.warn('Error generating translation bundle:', e);
        } finally {
          setIsTranslating(false);
        }
      }
      if (bundle) {
        i18n.addResourceBundle(newLanguage, 'translation', bundle, true, true);
      }
    }
    i18n.changeLanguage(newLanguage);
  };

  const value = {
    language: i18n.language,
    changeLanguage,
    t: i18n.t.bind(i18n),
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};