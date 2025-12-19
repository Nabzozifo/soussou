import React, { useMemo, useState } from 'react';
import { alphabet } from '../data/alphabet';

const shuffle = (arr) => arr.map(v => ({ v, r: Math.random() }))
  .sort((a, b) => a.r - b.r).map(x => x.v);

export default function AlphabetMatchGame() {
  const [result, setResult] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedIpa, setSelectedIpa] = useState(null);

  const items = useMemo(() => shuffle(alphabet).slice(0, 4), []);
  const letters = items.map(i => i.letter);
  const ipas = shuffle(items.map(i => i.ipa));

  const onSelectLetter = (l) => {
    setSelectedLetter(l);
    setResult(null);
  };
  const onSelectIpa = (i) => {
    setSelectedIpa(i);
    setResult(null);
  };

  const onCheck = () => {
    if (!selectedLetter || !selectedIpa) return;
    const item = items.find(x => x.letter === selectedLetter);
    const ok = item?.ipa === selectedIpa;
    setResult(ok ? 'correct' : 'incorrect');
  };

  const onReset = () => {
    setSelectedLetter(null);
    setSelectedIpa(null);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Associe la lettre à sa prononciation (IPA)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Lettres</h3>
          <div className="flex flex-wrap gap-2">
            {letters.map((l) => (
              <button
                key={l}
                onClick={() => onSelectLetter(l)}
                className={`px-3 py-2 rounded-lg border ${selectedLetter === l ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-white hover:bg-orange-50'} `}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">IPA</h3>
          <div className="flex flex-wrap gap-2">
            {ipas.map((i) => (
              <button
                key={i}
                onClick={() => onSelectIpa(i)}
                className={`px-3 py-2 rounded-lg border ${selectedIpa === i ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-emerald-50'} `}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onCheck} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Valider</button>
        <button onClick={onReset} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Réinitialiser</button>
        {result === 'correct' && <span className="text-emerald-700 font-medium">✅ Correct</span>}
        {result === 'incorrect' && <span className="text-red-600 font-medium">❌ Incorrect</span>}
      </div>
    </div>
  );
}