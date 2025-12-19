# Kalan Sosso — Frontend (React + Vite)

## Développement

- Démarrage: `npm install && npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Traduction automatique (ES/PT)

Le sélecteur de langue génère automatiquement des bundles de traduction pour l'espagnol et le portugais à partir des clés françaises.

### Configuration

Définissez les variables dans `.env` (voir `.env.example`):

```
VITE_TRANSLATE_PROVIDER=mymemory
VITE_AZURE_TRANSLATOR_KEY=
VITE_AZURE_TRANSLATOR_REGION=global
```

- `VITE_TRANSLATE_PROVIDER` peut être `azure` (recommandé) ou `mymemory` (gratuit, limité).
- Si vous choisissez `azure`, renseignez `VITE_AZURE_TRANSLATOR_KEY` et `VITE_AZURE_TRANSLATOR_REGION`.

### Fonctionnement

- Lors du changement de langue vers `es` ou `pt`, l'application:
  - Cherche un bundle en cache (localStorage).
  - Sinon, traduit automatiquement toutes les clés FR en bloc via le fournisseur.
  - Met en cache le bundle et l'injecte dans i18n.

### Remarques

- Le fournisseur MyMemory est pratique pour tester, mais la qualité est variable et le débit est limité.
- Azure Translator offre une meilleure fiabilité/qualité et permet la traduction en lot.
- Les ressources `src/translations/es.js` et `pt.js` fournissent une base immédiate; les traductions automatiques peuvent les écraser si disponibles.

## Routes principales

- `/` Accueil
- `/jeu` Interface de jeu (Nombres)
- `/alphabet/lecon`, `/alphabet/jeux`, `/alphabet/explication`

## Données Alphabet

L'alphabet Soussou réel est dans `src/data/alphabet.js` (voyelles brèves/longues/nasales, consonnes, digraphes), et les leçons `AlphabetLessons.jsx` affichent l'inventaire et les règles.
