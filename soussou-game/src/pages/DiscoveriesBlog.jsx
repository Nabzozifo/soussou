import React from 'react';
import AfricanPatterns from '../components/AfricanPatterns';
import { Link } from 'react-router-dom';
import { articles as articlesData } from '../data/discoveries';

export default function DiscoveriesBlog() {
  const articles = articlesData || [];
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.02} />
      </div>
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Découvertes — Blog</h1>
              <p className="mt-2 text-gray-700">Articles, récits et analyses autour du Sosoxui et de sa culture.</p>
            </div>
            <Link to="/decouvertes" className="text-orange-700 hover:text-orange-900">← Retour au hub</Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-orange-200 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200">{a.category}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{a.title}</h2>
                {a.image && (
                  <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded-lg mb-4 border" />
                )}
                <p className="text-gray-700 leading-relaxed">{a.summary}</p>
                <div className="mt-4">
                  <Link
                    to={`/decouvertes/article/${a.slug}`}
                    className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-sm"
                  >
                    Lire plus
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}