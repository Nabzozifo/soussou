import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import AfricanPatterns from '../components/AfricanPatterns';
import { articles, tips } from '../data/discoveries';

export default function DiscoveryDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const isTip = location.pathname.includes('/saviez-vous/');

  const item = isTip
    ? tips.find((t) => t.slug === slug)
    : articles.find((a) => a.slug === slug);

  const collection = isTip ? tips : articles;
  const currentIndex = collection.findIndex((x) => x.slug === slug);
  const prevItem = currentIndex > 0 ? collection[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < collection.length - 1 ? collection[currentIndex + 1] : null;

  const words = (item?.content || '').trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  if (!item) {
    return (
      <div className="min-h-screen bg-white relative">
        <AfricanPatterns patternType="wax" opacity={0.02} />
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-neutral-900">Contenu introuvable</h1>
          <p className="mt-2 text-neutral-600">L’élément demandé n’existe pas ou a été déplacé.</p>
          <div className="mt-6">
            <Link to="/decouvertes" className="text-emerald-700 hover:underline">← Retour aux Découvertes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.03} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/decouvertes" className="inline-flex items-center text-neutral-700 hover:underline">
            ← Retour aux Découvertes
          </Link>
          <div className="text-sm text-neutral-600">{readingMinutes} min de lecture</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Hero */}
          {item.image && (
            <div className="relative h-56 w-full">
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-white/90 text-orange-700 border border-orange-200">
                  {isTip ? 'Le saviez‑vous' : item.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">{item.title}</h1>
            {item.summary && (
              <p className="text-neutral-700 text-lg mb-4">{item.summary}</p>
            )}

            <p className="text-neutral-800 leading-relaxed text-lg whitespace-pre-line">{item.content}</p>

            {Array.isArray(item.references) && item.references.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Références</h2>
                <ul className="list-disc pl-6 text-neutral-800">
                  {item.references.map((ref, i) => (
                    <li key={i} className="mb-2">
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 hover:text-orange-900">
                        {ref.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prev/Next navigation */}
            {(prevItem || nextItem) && (
              <div className="mt-10 flex items-center justify-between">
                <div>
                  {prevItem && (
                    <Link to={`${isTip ? '/decouvertes/saviez-vous/' : '/decouvertes/article/'}${prevItem.slug}`} className="text-neutral-700 hover:text-orange-700">
                      ← {prevItem.title}
                    </Link>
                  )}
                </div>
                <div>
                  {nextItem && (
                    <Link to={`${isTip ? '/decouvertes/saviez-vous/' : '/decouvertes/article/'}${nextItem.slug}`} className="text-neutral-700 hover:text-orange-700">
                      {nextItem.title} →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}