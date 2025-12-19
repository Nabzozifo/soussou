import React, { useEffect, useState } from 'react';
import AfricanPatterns from '../components/AfricanPatterns';
import { Link } from 'react-router-dom';
// StatsCard retiré sur demande
// import StatsCard from '../components/StatsCard';
import WestAfricaMap from '../components/WestAfricaMap';

const Discoveries = () => {
  // Texte demandé (en français) et statistiques
  const intro = {
    title: 'Sosoxui (Susu) — Langue mandé et identité nationale',
    description:
      'Le soussou (Sosu, Soso, Soussou, Susoo), dont le nom endonyme est «\u00A0Sosoxui\u00A0», appartient à la branche mandé des langues nigéro-congolaises. On estime à environ 2,4\u00A0millions le nombre de locuteurs, principalement en Guinée, mais aussi en Sierra Leone, au Sénégal et en Guinée-Bissau. En Guinée, le soussou est une langue de facto d\u2019identité nationale et de commerce, notamment sur le littoral et autour de Conakry.',
    synonyms: ['Sose', 'Soso', 'Soussou', 'Susoo'],
    nativeName: 'Sosoxui'
  };

  const languageStats = [
    { label: 'Locuteurs totaux (estimés)', value: 2400000 },
    { label: 'Guinée', value: 2200000 },
    { label: 'Sierra Leone', value: 184000 },
    { label: 'Sénégal', value: 44800 },
    { label: 'Guinée-Bissau', value: 5340 }
  ];

  // Page légère (hub): les sections détaillées seront dans des sous-pages dédiées

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Motifs de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.02} />
        <img src="/7078374.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
      {/* En-tête + texte de présentation enrichi */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 rounded-2xl border border-orange-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold text-gray-900">{intro.title}</h1>
              <p className="mt-3 text-lg text-gray-700">{intro.description}</p>
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Synonymes :</span> {intro.synonyms.join(', ')} · <span className="font-medium">Nom endonyme :</span> {intro.nativeName}
              </div>
            </div>
            <div className="w-full md:w-[560px]">
              <WestAfricaMap />
            </div>
          </div>
        </div>
      </div>
          {/* Navigation thématique (hub) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/decouvertes/blog" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-orange-200 hover:shadow-md transition">
              <div className="text-sm px-3 py-1 inline-block rounded-full bg-orange-100 text-orange-700 border border-orange-200">Blog</div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">Articles & récits</h3>
              <p className="mt-1 text-gray-700">Parcourez les articles, anecdotes et analyses sur la langue et la culture.</p>
              <div className="mt-4 text-orange-700 group-hover:text-orange-900">Explorer →</div>
            </Link>
            <Link to="/decouvertes/histoire" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-orange-200 hover:shadow-md transition">
              <div className="text-sm px-3 py-1 inline-block rounded-full bg-orange-100 text-orange-700 border border-orange-200">Histoire</div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">Patrimoine & faits clés</h3>
              <p className="mt-1 text-gray-700">UNESCO, Sosso‑Bala, contextes historiques, transmission et société.</p>
              <div className="mt-4 text-orange-700 group-hover:text-orange-900">Explorer →</div>
            </Link>
            <Link to="/decouvertes/saviez-vous" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-orange-200 hover:shadow-md transition">
              <div className="text-sm px-3 py-1 inline-block rounded-full bg-orange-100 text-orange-700 border border-orange-200">Le saviez‑vous</div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">Faits, chiffres & curiosités</h3>
              <p className="mt-1 text-gray-700">Points rapides et statistiques pour apprendre en un clin d’œil.</p>
              <div className="mt-4 text-orange-700 group-hover:text-orange-900">Explorer →</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discoveries;