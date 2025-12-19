import React from 'react';
import AfricanPatterns from '../components/AfricanPatterns';
import { Link } from 'react-router-dom';
import { tips as tipsData } from '../data/discoveries';

export default function DiscoveriesDidYouKnow() {
  const tips = tipsData || [];
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.02} />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Découvertes — Le saviez‑vous</h1>
              <p className="mt-2 text-gray-700">Faits, chiffres et curiosités pour apprendre en un clin d’œil.</p>
            </div>
            <Link to="/decouvertes" className="text-orange-700 hover:text-orange-900">← Retour au hub</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <Link key={tip.slug} to={`/decouvertes/saviez-vous/${tip.slug}`} className="block bg-white border rounded-2xl p-6 text-gray-800 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <p className="font-bold text-lg text-gray-900">{tip.title}</p>
                <p className="text-sm text-gray-600 mt-1">{tip.summary}</p>
                <div className="mt-4 text-orange-700">Lire →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}