import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// Source TopoJSON monde (pays) — world-atlas via jsDelivr (fiable)
// Référence: topojson/world-atlas (countries-110m.json)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Pays clés pour Sosoxui (Soussou)
const highlightCountries = ['Guinea', 'Sierra Leone', 'Senegal', 'Guinea-Bissau'];

const isWestAfrica = (name) => {
  const westAfrica = [
    'Benin', 'Burkina Faso', 'Cabo Verde', 'Cape Verde', 'Gambia', 'Ghana',
    'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Côte d’Ivoire', 'Liberia',
    'Mali', 'Mauritania', 'Niger', 'Nigeria', 'Senegal', 'Sierra Leone', 'Togo'
  ];
  return westAfrica.includes(name);
};

export default function WestAfricaMap() {
  const [selected, setSelected] = useState(null);
  const soussouStats = useMemo(() => ({
    'Guinea': 2200000,
    'Sierra Leone': 184000,
    'Senegal': 44800,
    'Guinea-Bissau': 5340
  }), []);
  const formatFr = (n) => new Intl.NumberFormat('fr-FR').format(n);
  return (
    <div className="bg-white/70 backdrop-blur-md border border-orange-100 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Carte — Afrique de l’Ouest</h3>
        <span className="text-sm text-gray-600">Sosoxui : Guinée et région</span>
      </div>
      <div className="mt-3">
        <ComposableMap
          projection="geoNaturalEarth1"
          width={560}
          height={320}
          style={{ width: '100%', height: 'auto' }}
        >
          {/* Focus sur l’Afrique de l’Ouest */}
          <ZoomableGroup center={[-11, 9]} zoom={3.2}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const props = geo.properties || {};
                  const name =
                    props.name ||
                    props.NAME ||
                    props.ADMIN ||
                    props.NAME_LONG ||
                    props.geounit ||
                    '';
                  const highlight = highlightCountries.includes(name);
                  const west = isWestAfrica(name);
                  const isSelected = selected === name;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      title={name}
                      onClick={() => setSelected(name)}
                      style={{
                        default: {
                          fill: isSelected ? '#fb923c' : (highlight ? '#f59e0b' : west ? '#fde68a' : '#f3f4f6'),
                          stroke: '#9ca3af',
                          strokeWidth: isSelected ? 1.2 : 0.5,
                          outline: 'none'
                        },
                        hover: {
                          fill: highlight ? '#f59e0b' : west ? '#fcd34d' : '#e5e7eb',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: highlight ? '#f59e0b' : '#d1d5db'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {selected && (
        <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-gray-900">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Statistiques — {selected}</div>
            <button className="text-sm text-orange-700 hover:text-orange-900" onClick={() => setSelected(null)}>Effacer</button>
          </div>
          <div className="mt-1 text-sm">
            {soussouStats[selected] ? (
              <>Locuteurs du Sosoxui : <span className="font-bold">{formatFr(soussouStats[selected])}</span></>
            ) : (
              <span className="text-gray-700">Aucune donnée disponible.</span>
            )}
          </div>
        </div>
      )}
      <div className="mt-3 text-sm text-gray-700">
        <span className="inline-block w-3 h-3 rounded-sm bg-[#f59e0b] align-middle mr-2" />
        <span className="mr-4 align-middle">Pays clés : Guinée, Sierra Leone, Sénégal, Guinée‑Bissau</span>
        <span className="inline-block w-3 h-3 rounded-sm bg-[#fde68a] align-middle mr-2" />
        <span className="align-middle">Région : Afrique de l’Ouest</span>
      </div>
    </div>
  );
}