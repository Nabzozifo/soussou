import React from 'react';
import AfricanPatterns from '../components/AfricanPatterns';
import { Link } from 'react-router-dom';

export default function DiscoveriesHistory() {
  const facts = [
    {
      title: 'Le Sosso-Bala, trésor immatériel',
      content: 'Le Sosso-Bala, balafon sacré associé au roi Sumaoro Kanté (XIIIe siècle), est inscrit par l’UNESCO au patrimoine culturel immatériel. Il est conservé à Nyagassola (Guinée) et transmis par la famille Dökala.'
    },
    {
      title: 'Héritage mandingue',
      content: 'Les Soussou sont liés au monde mandingue et à l’influence de l’Empire du Mali. Histoire faite de migrations, échanges et traditions orales.'
    },
    {
      title: 'Société et transmissions',
      content: 'Société patrilinéaire, familles étendues et artisanats (pêche, sel, agriculture). Les savoirs sont transmis de génération en génération.'
    }
  ];

  const references = [
    { label: 'UNESCO – Patrimoine culturel immatériel (Balafon/Sosso‑Bala)', url: 'https://ich.unesco.org/fr/listes?text=balafon' },
    { label: 'Wikipédia – Peuple Susu/Soussou', url: 'https://fr.wikipedia.org/wiki/Soussou_(peuple)' },
    { label: 'Wikipédia – Langue soussou', url: 'https://fr.wikipedia.org/wiki/Soussou' }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.02} />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Découvertes — Histoire</h1>
              <p className="mt-2 text-gray-700">Patrimoine, faits clés et récits historiques autour du Sosoxui.</p>
            </div>
            <Link to="/decouvertes" className="text-orange-700 hover:text-orange-900">← Retour au hub</Link>
          </div>

          {/* Section UNESCO */}
          <div className="bg-white rounded-2xl border border-orange-200 p-6 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Patrimoine UNESCO</h2>
                <p className="text-gray-700">Le Sosso‑Bala (balafon sacré) et sa tradition musicale sont reconnus au titre du patrimoine culturel immatériel. Cette reconnaissance favorise la sauvegarde, la transmission et la valorisation internationale.</p>
              </div>
              <a href="https://ich.unesco.org/fr/listes?text=balafon" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-200">Voir la page UNESCO</a>
            </div>
          </div>

          {/* Bandeau de faits clés */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {facts.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-700">{f.content}</p>
              </div>
            ))}
          </div>

          {/* Références */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Références</h2>
            <ul className="list-disc pl-6 text-gray-800">
              {references.map((ref, i) => (
                <li key={i} className="mb-2">
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-900">
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}