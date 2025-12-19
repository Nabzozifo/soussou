// Alphabet soussou (post-1988 et pré-1988) basé sur alphabet.txt
// Inclut voyelles courtes/longues/nasales, consonnes, digraphes et tons

export const orthographies = {
  post1988: {
    baseLetters: [
      { upper: 'A', lower: 'a', ipa: 'a' },
      { upper: 'B', lower: 'b', ipa: 'b' },
      { upper: 'D', lower: 'd', ipa: 'd' },
      { upper: 'Nd', lower: 'nd', ipa: 'ⁿd' },
      { upper: 'E', lower: 'e', ipa: 'e' },
      { upper: 'Ɛ', lower: 'ɛ', ipa: 'ɛ' },
      { upper: 'F', lower: 'f', ipa: 'f' },
      { upper: 'G', lower: 'g', ipa: 'ɡ' },
      { upper: 'Gb', lower: 'gb', ipa: 'ɡ͡b' },
      { upper: 'H', lower: 'h', ipa: 'h' },
      { upper: 'I', lower: 'i', ipa: 'i' },
      { upper: 'K', lower: 'k', ipa: 'k' },
      { upper: 'X', lower: 'x', ipa: 'x' },
      { upper: 'L', lower: 'l', ipa: 'l' },
      { upper: 'M', lower: 'm', ipa: 'm' },
      { upper: 'N', lower: 'n', ipa: 'n' },
      { upper: 'Ng', lower: 'ng', ipa: 'ⁿɡ' },
      { upper: 'Ɲ', lower: 'ɲ', ipa: 'ɲ' },
      { upper: 'O', lower: 'o', ipa: 'o' },
      { upper: 'Ɔ', lower: 'ɔ', ipa: 'ɔ' },
      { upper: 'P', lower: 'p', ipa: 'p' },
      { upper: 'R', lower: 'r', ipa: 'r' },
      { upper: 'S', lower: 's', ipa: 's' },
      { upper: 'T', lower: 't', ipa: 't' },
      { upper: 'U', lower: 'u', ipa: 'u' },
      { upper: 'W', lower: 'w', ipa: 'w' },
      { upper: 'Y', lower: 'y', ipa: 'j' }
    ],
    digraphs: [
      { letters: 'Nd', ipa: 'ⁿd' },
      { letters: 'Gb', ipa: 'ɡ͡b' },
      { letters: 'Ng', ipa: 'ⁿɡ' }
    ],
    longVowels: ['aa', 'ee', 'ɛɛ', 'ii', 'oo', 'ɔɔ', 'uu'],
    nasalVowels: ['an', 'en', 'ɛn', 'in', 'on', 'ɔn', 'un']
  },
  pre1988: {
    baseLetters: [
      { upper: 'A', lower: 'a', ipa: 'a' },
      { upper: 'B', lower: 'b', ipa: 'b' },
      { upper: 'D', lower: 'd', ipa: 'd' },
      { upper: 'Nd', lower: 'nd', ipa: 'ⁿd' },
      { upper: 'E', lower: 'e', ipa: 'e' },
      { upper: 'Ë', lower: 'ë', ipa: 'ɛ' },
      { upper: 'F', lower: 'f', ipa: 'f' },
      { upper: 'G', lower: 'g', ipa: 'ɡ' },
      { upper: 'Gb', lower: 'gb', ipa: 'ɡ͡b' },
      { upper: 'H', lower: 'h', ipa: 'h' },
      { upper: 'I', lower: 'i', ipa: 'i' },
      { upper: 'K', lower: 'k', ipa: 'k' },
      { upper: 'Kh', lower: 'kh', ipa: 'x' },
      { upper: 'L', lower: 'l', ipa: 'l' },
      { upper: 'M', lower: 'm', ipa: 'm' },
      { upper: 'N', lower: 'n', ipa: 'n' },
      { upper: 'Ng', lower: 'ng', ipa: 'ⁿɡ' },
      { upper: 'Ny', lower: 'ny', ipa: 'ɲ' },
      { upper: 'O', lower: 'o', ipa: 'o' },
      { upper: 'Ö', lower: 'ö', ipa: 'ɔ' },
      { upper: 'P', lower: 'p', ipa: 'p' },
      { upper: 'R', lower: 'r', ipa: 'r' },
      { upper: 'S', lower: 's', ipa: 's' },
      { upper: 'T', lower: 't', ipa: 't' },
      { upper: 'U', lower: 'u', ipa: 'u' },
      { upper: 'W', lower: 'w', ipa: 'w' },
      { upper: 'Y', lower: 'y', ipa: 'j' }
    ],
    digraphs: [
      { letters: 'Nd', ipa: 'ⁿd' },
      { letters: 'Gb', ipa: 'ɡ͡b' },
      { letters: 'Ng', ipa: 'ⁿɡ' }
    ],
    longVowels: ['aa', 'ee', 'ëë', 'ii', 'oo', 'öö', 'uu'],
    nasalVowels: ['an', 'en', 'ën', 'in', 'on', 'ön', 'un']
  }
};

export const tones = [
  { mark: 'á', name: 'ton haut', id: 'high' },
  { mark: 'à', name: 'ton bas', id: 'low' },
  { mark: 'â', name: 'ton descendant', id: 'falling' },
  { mark: 'ǎ', name: 'ton montant', id: 'rising' }
];

// Compatibilité avec les anciens imports dans les pages
export const alphabet = [
  { letter: 'a', ipa: 'a', examples: [], note: 'voyelle orale brève' },
  { letter: 'e', ipa: 'e', examples: ['ginɛ'], note: 'voyelle orale brève' },
  { letter: 'ɛ', ipa: 'ɛ', examples: ['ginɛ'], note: 'voyelle ouverte (ɛ)' },
  { letter: 'o', ipa: 'o', examples: [], note: 'voyelle orale brève' },
  { letter: 'ɔ', ipa: 'ɔ', examples: ['pɔsta'], note: 'voyelle ouverte (ɔ)' },
  { letter: 'i', ipa: 'i', examples: [], note: 'voyelle orale brève' },
  { letter: 'u', ipa: 'u', examples: [], note: 'voyelle orale brève' }
];

export const inventory = {
  vowelsShort: ['a', 'e', 'ɛ', 'o', 'ɔ', 'i', 'u'],
  vowelsLong: ['aa', 'ee', 'ɛɛ', 'ii', 'oo', 'ɔɔ', 'uu'],
  vowelsNasal: ['an', 'en', 'ɛn', 'in', 'on', 'ɔn', 'un'],
  consonants: ['b', 'd', 'f', 'h', 'ɡ', 'k', 'l', 'm', 'n', 'ɲ', 'p', 'r', 's', 't', 'w', 'x', 'y'],
  digraphs: ['gb', 'nd', 'ng']
};

export const readingRules = [
  { id: 'vowels-short', title: 'Voyelles orales brèves', description: 'a, e, ɛ, o, ɔ, i, u' },
  { id: 'vowels-long', title: 'Voyelles orales longues', description: 'aa, ee, ɛɛ, ii, oo, ɔɔ, uu' },
  { id: 'vowels-nasal', title: 'Voyelles nasales', description: 'an, en, ɛn, in, on, ɔn, un' },
  { id: 'consonants', title: 'Consonnes', description: 'b, d, f, h, ɡ, k, l, m, n, ɲ, p, r, s, t, w, x (kh), y' },
  { id: 'digraphs', title: 'Digraphes', description: 'gb (labio‑vélaire), nd (prénasalisée), ng (prénasalisée vélaire)' },
  { id: 'pronunciation-notes', title: 'Notes de prononciation', description: 'x→kh (xili), ɛ (ginɛ), ɔ (pɔsta), ɲ (ɲari), nd (nde), gb (gbɛŋgbɛ)' },
  { id: 'tonality', title: 'Tonalité', description: 'Le soussou est tonal; longueur vocalique et tons influencent le sens.' }
];

export const sampleWords = [
  { word: 'xili', ipa: 'xili', gloss: 'exemple de x', letters: ['x','i','l','i'] },
  { word: 'ginɛ', ipa: 'ginɛ', gloss: 'exemple de ɛ', letters: ['g','i','n','ɛ'] },
  { word: 'pɔsta', ipa: 'pɔsta', gloss: 'exemple de ɔ', letters: ['p','ɔ','s','t','a'] },
  { word: 'ɲari', ipa: 'ɲari', gloss: 'exemple de ɲ', letters: ['ɲ','a','r','i'] },
  { word: 'gbɛŋgbɛ', ipa: 'ɡ͡bɛŋɡ͡bɛ', gloss: 'exemple de gb', letters: ['g','b','ɛ','ŋ','g','b','ɛ'] },
  { word: 'nde', ipa: 'ⁿde', gloss: 'exemple de nd', letters: ['n','d','e'] }
];