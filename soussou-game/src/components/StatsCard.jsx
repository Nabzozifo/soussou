import React from 'react';

// Format compact FR: 2,4 M / 184 k
const formatCompactFR = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} k`;
  return n.toLocaleString('fr-FR');
};

export default function StatsCard({ title = 'Statistiques linguistiques (Sosoxui)', metrics = [] }) {
  const total = metrics.reduce((sum, m) => sum + (m.value || 0), 0);
  return (
    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">Total estimé: {formatCompactFR(total)}</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const pct = total > 0 ? Math.round((m.value / total) * 100) : 0;
          return (
            <div key={i} className="bg-white rounded-xl border border-orange-100 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-800">{m.label}</div>
                <div className="text-sm text-gray-500">{pct}%</div>
              </div>
              <div className="mt-2 text-2xl font-bold text-orange-700 leading-none tracking-tight">{formatCompactFR(m.value)}</div>
              <div className="mt-3 h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}