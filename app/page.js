'use client';

import { useEffect, useMemo, useState } from 'react';

const emptyForm = { title: '', description: '', category: 'Rapide', maxMinutes: 20, budget: '€', authorName: '' };

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({ category: 'Tous', budget: 'Tous', maxMinutes: '60' });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  async function loadIdeas() {
    const response = await fetch('/api/ideas', { cache: 'no-store' });
    const data = await response.json();
    setIdeas(data);
    setLoading(false);
  }

  useEffect(() => { loadIdeas(); }, []);

  const filtered = useMemo(() => ideas.filter((idea) => {
    return (filters.category === 'Tous' || idea.category === filters.category)
      && (filters.budget === 'Tous' || idea.budget === filters.budget)
      && idea.maxMinutes <= Number(filters.maxMinutes);
  }), [ideas, filters]);

  async function submit(event) {
    event.preventDefault();
    setMessage('Ajout en cours…');
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, maxMinutes: Number(form.maxMinutes) }),
    });
    if (!response.ok) {
      setMessage('Impossible d’ajouter cette idée.');
      return;
    }
    setForm(emptyForm);
    setMessage('Idée ajoutée, merci !');
    await loadIdeas();
  }

  async function like(id) {
    await fetch(`/api/ideas/${id}/like`, { method: 'POST' });
    await loadIdeas();
  }

  function randomIdea() {
    if (!filtered.length) return;
    setSelected(filtered[Math.floor(Math.random() * filtered.length)]);
  }

  async function share(idea) {
    const text = `${idea.title} — ${idea.description} (${idea.maxMinutes} min, budget ${idea.budget})`;
    if (navigator.share) await navigator.share({ title: 'On mange quoi ?', text, url: location.href });
    else {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      setMessage('Idée copiée dans le presse-papiers.');
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Le casse-tête du soir, réglé.</div>
        <h1>On mange quoi ?</h1>
        <p>Trouve une idée simple selon ton temps et ton budget, ou partage ton plat fétiche avec tout le monde.</p>
        <div className="heroActions">
          <button className="primary" onClick={randomIdea}>🎲 Tire une idée au hasard</button>
          <a className="secondary" href="#ajouter">＋ Ajouter une idée</a>
        </div>
      </section>

      {selected && (
        <section className="spotlight">
          <span>Le hasard a choisi</span>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
          <div className="tags"><b>{selected.category}</b><b>{selected.maxMinutes} min</b><b>{selected.budget}</b></div>
          <button onClick={() => share(selected)}>Partager cette idée</button>
        </section>
      )}

      <section className="filters">
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          {['Tous', 'Rapide', 'Familial', 'Léger', 'Végétarien', 'Gourmand'].map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })}>
          {['Tous', '€', '€€', '€€€'].map((value) => <option key={value}>{value}</option>)}
        </select>
        <label>Maximum {filters.maxMinutes} min<input type="range" min="10" max="120" step="10" value={filters.maxMinutes} onChange={(e) => setFilters({ ...filters, maxMinutes: e.target.value })} /></label>
      </section>

      <section className="grid">
        {loading && <p>Chargement des idées…</p>}
        {!loading && !filtered.length && <p>Aucune idée ne correspond. Ajoute la première !</p>}
        {filtered.map((idea) => (
          <article className="card" key={idea.id}>
            <div className="cardTop"><span>{idea.category}</span><span>{idea.budget}</span></div>
            <h2>{idea.title}</h2>
            <p>{idea.description}</p>
            <div className="meta"><span>⏱ {idea.maxMinutes} min</span><span>{idea.authorName ? `par ${idea.authorName}` : 'anonyme'}</span></div>
            <div className="cardActions"><button onClick={() => like(idea.id)}>❤️ {idea.likes}</button><button onClick={() => share(idea)}>Partager</button></div>
          </article>
        ))}
      </section>

      <section id="ajouter" className="formSection">
        <div><span className="eyebrow">Une bonne idée ne se garde pas pour soi</span><h2>Ajoute ton repas préféré</h2><p>Pas besoin d’une recette complète : un nom clair et une petite description suffisent.</p></div>
        <form onSubmit={submit}>
          <input required maxLength="80" placeholder="Nom du plat" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea required maxLength="240" placeholder="Décris l’idée en une ou deux phrases" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="row">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Rapide', 'Familial', 'Léger', 'Végétarien', 'Gourmand'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>{['€', '€€', '€€€'].map((v) => <option key={v}>{v}</option>)}</select>
          </div>
          <input required min="5" max="240" type="number" placeholder="Temps en minutes" value={form.maxMinutes} onChange={(e) => setForm({ ...form, maxMinutes: e.target.value })} />
          <input maxLength="40" placeholder="Ton prénom (facultatif)" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
          <button className="primary" type="submit">Publier l’idée</button>
          {message && <small>{message}</small>}
        </form>
      </section>

      <footer>Fait pour les soirs où personne ne sait quoi manger.</footer>
    </main>
  );
}
