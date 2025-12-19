import React, { useState } from 'react';
import AfricanPatterns from '../components/AfricanPatterns';

export default function Partnerships() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    interest: 'UNESCO',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Minimal client-side handling: persist locally and show confirmation.
    const existing = JSON.parse(localStorage.getItem('partnership_requests') || '[]');
    existing.push({ ...form, createdAt: new Date().toISOString() });
    localStorage.setItem('partnership_requests', JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-neutral-50">
      <AfricanPatterns variant="wax" opacity={0.04} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-neutral-900">Partenariats</h1>
        <p className="mt-2 text-neutral-600">
          Vous souhaitez collaborer (UNESCO, ministères, universités, ONG, sponsors) ?
          Contactez-nous via ce formulaire.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Formulaire de contact</h2>
            {!submitted ? (
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Nom</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="nom@domaine.tld"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Organisation</label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Institution / Entreprise / ONG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Intérêt principal</label>
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>UNESCO</option>
                    <option>Ministère de la Culture</option>
                    <option>Ministère de l'Éducation</option>
                    <option>Université / Centre de recherche</option>
                    <option>ONG</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="mt-1 w-full min-h-32 rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Décrivez votre demande ou proposition"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Envoyer
                  </button>
                  <a
                    href="mailto:contact@soussou.guinee?subject=Partenariat%20Soussou&body=Bonjour,%20je%20souhaite%20proposer%20un%20partenariat..."
                    className="text-emerald-700 hover:underline"
                  >
                    Ou nous écrire par email
                  </a>
                </div>
              </form>
            ) : (
              <div className="mt-4">
                <p className="text-emerald-700 font-medium">Merci, votre demande a été enregistrée.</p>
                <p className="text-neutral-600 text-sm">Nous vous contacterons prochainement.</p>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Pourquoi collaborer ?</h2>
            <ul className="mt-3 space-y-2 text-neutral-700">
              <li>Valoriser le patrimoine immatériel (Sosso Bala, arts et langue).</li>
              <li>Déployer des contenus éducatifs adaptés au primaire et au secondaire.</li>
              <li>Favoriser l’inclusion linguistique et culturelle à l’école.</li>
              <li>Co-construire des parcours pédagogiques et des événements.</li>
            </ul>

            <div className="mt-6">
              <h3 className="font-semibold text-neutral-900">Partenaires cibles</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <p className="font-medium">UNESCO</p>
                  <p className="text-sm text-neutral-600">Patrimoine immatériel, éducation.</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-medium">Ministères</p>
                  <p className="text-sm text-neutral-600">Culture, Éducation, Recherche.</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-medium">Universités</p>
                  <p className="text-sm text-neutral-600">Linguistique, histoire, musique.</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-medium">ONG / Sponsors</p>
                  <p className="text-sm text-neutral-600">Projets éducatifs et culturels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <a href="/decouvertes" className="text-neutral-700 hover:underline">← Retour aux Découvertes</a>
        </div>
      </div>
    </div>
  );
}