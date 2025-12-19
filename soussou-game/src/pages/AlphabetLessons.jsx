import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AfricanPatterns from '../components/AfricanPatterns';
import { alphabet, readingRules, inventory, orthographies, tones } from '../data/alphabet';

const AlphabetLessons = () => {
  const { t } = useLanguage();

  const [orthography, setOrthography] = useState('post1988');

  const shortVowels = useMemo(() => {
    return orthography === 'pre1988'
      ? ['a', 'e', 'ë', 'i', 'o', 'ö', 'u']
      : ['a', 'e', 'ɛ', 'i', 'o', 'ɔ', 'u'];
  }, [orthography]);

  const current = orthographies[orthography];
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.04} />
        <img src="/7078374.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.08]" />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-orange-100 p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('alphabetLessonsTitle')}</h1>
          <p className="text-gray-700 mb-6">{t('alphabetIntro')}</p>

          <div className="mb-6 flex items-center gap-3">
            <span className="text-gray-700 font-medium">{t('alphabetSelectorLabel')}:</span>
            <div className="inline-flex rounded-lg border border-orange-200 overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${orthography === 'post1988' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setOrthography('post1988')}
              >{t('orthographyTogglePost')}</button>
              <button
                className={`px-3 py-1 text-sm border-l border-orange-200 ${orthography === 'pre1988' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setOrthography('pre1988')}
              >{t('orthographyTogglePre')}</button>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('vowelInventoryTitle')}</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-orange-100 bg-white">
                  <div className="font-medium text-gray-800 mb-1">{t('oralShortVowels')}</div>
                  <div className="text-gray-700">{shortVowels.join(', ')}</div>
                </div>
                <div className="p-3 rounded-lg border border-orange-100 bg-white">
                  <div className="font-medium text-gray-800 mb-1">{t('oralLongVowels')}</div>
                  <div className="text-gray-700">{current.longVowels.join(', ')}</div>
                </div>
                <div className="p-3 rounded-lg border border-orange-100 bg-white">
                  <div className="font-medium text-gray-800 mb-1">{t('nasalVowelsLabel')}</div>
                  <div className="text-gray-700">{current.nasalVowels.join(', ')}</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('consonantsAndDigraphsTitle')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-orange-100 bg-white">
                  <div className="font-medium text-gray-800 mb-1">{t('consonantsLabel')}</div>
                  <div className="text-gray-700">{inventory.consonants.join(', ')}</div>
                </div>
                <div className="p-3 rounded-lg border border-orange-100 bg-white">
                  <div className="font-medium text-gray-800 mb-1">{t('digraphsLabel')}</div>
                  <div className="text-gray-700">{current.digraphs.map(d => d.letters).join(', ')}</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('examplesAndIpaTitle')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {alphabet.slice(0, 7).map((l) => (
                  <div key={l.letter} className="p-3 rounded-lg border border-orange-100 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-700">{l.letter}</span>
                      <span className="text-gray-600">{t('ipaLabel')}: {l.ipa}</span>
                    </div>
                    {l.examples?.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">{t('examplesLabel')}: {l.examples.join(', ')}</div>
                    )}
                    {l.note && (
                      <div className="mt-1 text-xs text-gray-500">{l.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Systèmes d’écriture */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('writingSystemsTitle')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-orange-100 bg-white">
                  <div className="font-semibold text-gray-800 mb-1">{t('latinAlphabetTitle')}</div>
                  <p className="text-gray-700 text-sm">{t('firstWritingWilhelm')}</p>
                  <p className="text-gray-700 text-sm mt-1">{t('revision1988')}</p>
                </div>
                <div className="p-4 rounded-lg border border-orange-100 bg-white">
                  <div className="font-semibold text-gray-800 mb-1">{t('arabicAlphabetTitle')}</div>
                  <p className="text-gray-700 text-sm">{t('arabicAlphabetDesc')}</p>
                </div>
                <div className="p-4 rounded-lg border border-orange-100 bg-white">
                  <div className="font-semibold text-gray-800 mb-1">{t('nkoAlphabetTitle')}</div>
                  <p className="text-gray-700 text-sm">{t('nkoAlphabetDesc')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('baseLettersTitle')}</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {current.baseLetters.map((b) => (
                  <div key={`${b.upper}-${b.lower}`} className="p-3 rounded-lg border border-orange-100 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-700">{b.upper} / {b.lower}</span>
                      <span className="text-gray-600">{t('ipaLabel')}: {b.ipa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('tonesTitle')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tones.map((tone) => (
                  <div key={tone.id} className="p-3 rounded-lg border border-orange-100 bg-white flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-700">{tone.mark}</span>
                    <span className="text-gray-700">{tone.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('readingRulesTitle')}</h2>
              <ul className="list-disc pl-6 text-gray-700">
                {readingRules.map((r) => (
                  <li key={r.id}><span className="font-medium">{r.title}:</span> {r.description}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetLessons;