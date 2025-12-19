import React, { useEffect, useMemo, useRef, useState } from 'react';
import AfricanPatterns from '../components/AfricanPatterns';

function Toolbar({ onCmd }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 mb-3">
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('bold')}>Gras</button>
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('italic')}>Italique</button>
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('underline')}>Souligner</button>
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('insertUnorderedList')}>Liste</button>
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('createLink')}>Lien</button>
      <button className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200" onClick={() => onCmd('removeFormat')}>Nettoyer</button>
    </div>
  );
}

export default function AdminBlog() {
  const [articles, setArticles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [meta, setMeta] = useState({ title: '', category: '', coverUrl: '' });
  const editorRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('blog_articles') || '[]');
    setArticles(stored);
    if (stored.length) setSelectedId(stored[0].id);
  }, []);

  const selected = useMemo(() => articles.find((a) => a.id === selectedId) || null, [articles, selectedId]);

  useEffect(() => {
    if (selected) {
      setMeta({ title: selected.title, category: selected.category || '', coverUrl: selected.coverUrl || '' });
      if (editorRef.current) editorRef.current.innerHTML = selected.html || '';
    } else {
      setMeta({ title: '', category: '', coverUrl: '' });
      if (editorRef.current) editorRef.current.innerHTML = '';
    }
  }, [selectedId]);

  const persist = (next) => {
    localStorage.setItem('blog_articles', JSON.stringify(next));
    setArticles(next);
  };

  const newArticle = () => {
    const id = 'a_' + Math.random().toString(36).slice(2, 8);
    const next = [{ id, title: 'Nouvel article', category: '', coverUrl: '', html: '<p>Commencez à écrire...</p>', updatedAt: new Date().toISOString() }, ...articles];
    persist(next);
    setSelectedId(id);
  };

  const deleteArticle = (id) => {
    const next = articles.filter((a) => a.id !== id);
    persist(next);
    if (selectedId === id) setSelectedId(next[0]?.id || null);
  };

  const saveArticle = () => {
    if (!selectedId) return;
    const html = editorRef.current?.innerHTML || '';
    const next = articles.map((a) => (a.id === selectedId ? { ...a, title: meta.title, category: meta.category, coverUrl: meta.coverUrl, html, updatedAt: new Date().toISOString() } : a));
    persist(next);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(articles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog_articles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onCmd = (cmd) => {
    if (cmd === 'createLink') {
      const href = prompt('URL du lien:');
      if (href) document.execCommand(cmd, false, href);
      return;
    }
    document.execCommand(cmd, false, undefined);
  };

  return (
    <div className="relative min-h-screen bg-neutral-50">
      <AfricanPatterns variant="bogolan" opacity={0.04} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-neutral-900">Admin — Blog</h1>
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-neutral-900 text-white px-3 py-2" onClick={newArticle}>Nouvel article</button>
            <button className="rounded-md bg-emerald-600 text-white px-3 py-2" onClick={saveArticle}>Enregistrer</button>
            <button className="rounded-md bg-neutral-200 text-neutral-900 px-3 py-2" onClick={exportJSON}>Exporter JSON</button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 bg-white border border-neutral-200 rounded-lg p-3">
            <h2 className="font-semibold text-neutral-900">Articles</h2>
            <ul className="mt-3 space-y-2">
              {articles.length === 0 && <li className="text-neutral-600 text-sm">Aucun article pour le moment.</li>}
              {articles.map((a) => (
                <li key={a.id} className={`flex items-center justify-between rounded-md p-2 border ${selectedId === a.id ? 'border-emerald-500' : 'border-neutral-200'}`}>
                  <button className="text-left flex-1" onClick={() => setSelectedId(a.id)}>
                    <p className="font-medium text-neutral-900 truncate">{a.title}</p>
                    <p className="text-xs text-neutral-500">{a.category || 'Sans catégorie'}</p>
                  </button>
                  <button className="text-red-600 text-sm" onClick={() => deleteArticle(a.id)}>Supprimer</button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="md:col-span-2 bg-white border border-neutral-200 rounded-lg p-4">
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-sm text-neutral-700">Titre</label>
                <input
                  value={meta.title}
                  onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                  placeholder="Titre de l’article"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-700">Catégorie</label>
                <input
                  value={meta.category}
                  onChange={(e) => setMeta((m) => ({ ...m, category: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                  placeholder="Culture, Éducation, Musique..."
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-700">Image de couverture (URL)</label>
                <input
                  value={meta.coverUrl}
                  onChange={(e) => setMeta((m) => ({ ...m, coverUrl: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                  placeholder="https://..."
                />
              </div>
            </div>

            <Toolbar onCmd={onCmd} />
            <div
              ref={editorRef}
              className="min-h-[250px] rounded-md border border-neutral-300 p-3 focus:outline-none"
              contentEditable
              suppressContentEditableWarning
            />
          </main>
        </div>
      </div>
    </div>
  );
}