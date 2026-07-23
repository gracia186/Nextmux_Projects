import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi, mentorApi, stagiaireApi } from '../../lib/endpoints';

interface Result {
  id: number;
  label: string;
  sub?: string;
  path: string;
}

export function GlobalSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let active = true;

    async function run() {
      if (user?.role === 'admin') {
        const res = await adminApi.utilisateurs({ search: query, per_page: 6 });
        if (!active) return;
        setResults(
          res.data.data.map((u) => ({
            id: u.id,
            label: u.name,
            sub: `${u.email} · ${u.role}`,
            path: '/admin/utilisateurs',
          }))
        );
      } else if (user?.role === 'mentor') {
        const res = await mentorApi.stagiaires({ search: query, per_page: 6 });
        if (!active) return;
        setResults(
          res.data.data.map((s) => ({
            id: s.id,
            label: s.user?.name ?? '—',
            sub: s.sujet_stage ?? s.ecole ?? undefined,
            path: '/mentor/stagiaires',
          }))
        );
      } else if (user?.role === 'stagiaire') {
        const res = await stagiaireApi.projets({ per_page: 50 });
        if (!active) return;
        const q = query.toLowerCase();
        setResults(
          res.data.data
            .filter((p) => p.titre.toLowerCase().includes(q))
            .slice(0, 6)
            .map((p) => ({ id: p.id, label: p.titre, sub: `${p.progression}% complété`, path: '/stagiaire/projets' }))
        );
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [query, user?.role]);

  return (
    <div className="topbar-search" ref={boxRef} style={{ position: 'relative' }}>
      <Search size={15} />
      <input
        placeholder="Rechercher…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim() && (
        <div className="search-dropdown glass glass-strong">
          {results.length === 0 ? (
            <div className="search-dropdown-empty">Aucun résultat pour « {query} »</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                type="button"
                className="search-dropdown-item"
                onClick={() => {
                  navigate(r.path);
                  setOpen(false);
                  setQuery('');
                }}
              >
                <strong>{r.label}</strong>
                {r.sub && <span>{r.sub}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
