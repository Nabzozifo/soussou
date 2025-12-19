import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AfricanPatterns from '../components/AfricanPatterns';

const AlphabetExplanation = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.04} />
        <img src="/7082095.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.1]" />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-orange-100 p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('alphabetExplanationTitle')}</h1>
          <p className="text-gray-700">{t('alphabetExplanationContent')}</p>
        </div>
      </div>
    </div>
  );
};

export default AlphabetExplanation;