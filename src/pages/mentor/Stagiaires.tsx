import { useEffect, useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import type { Stagiaire } from '../../types';
import { Card } from '../../components/ui/Card';
import { StatutBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function MentorStagiaires() {
  useDashboardHeader('Mes stagiaires', 'Stagiaires que vous encadrez actuellement');
  const [stagiaires, setStagiaires] = useState<Stagiaire[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    mentorApi.stagiaires({ search: search || undefined }).then((res) => setStagiaires(res.data.data));
  }, [search]);

  return (
    <div>
      <div className="page-header">
        <div className="topbar-search" style={{ margin: 0, maxWidth: 320 }}>
          <Search size={15} />
          <input placeholder="Rechercher un stagiaire…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="card" index={0}>
        {stagiaires === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : stagiaires.length === 0 ? (
          <EmptyState icon={<GraduationCap size={40} />} title="Aucun stagiaire" description="Aucun stagiaire ne vous a encore été affecté." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Stagiaire</th><th>École / Filière</th><th>Sujet</th><th>Statut</th></tr></thead>
            <tbody>
              {stagiaires.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="table-user">
                      <div className="avatar">{(s.user?.name ?? '?').slice(0, 2).toUpperCase()}</div>
                      <div><strong>{s.user?.name}</strong><span>{s.user?.email}</span></div>
                    </div>
                  </td>
                  <td>{s.ecole ?? '—'} {s.filiere ? `· ${s.filiere}` : ''}</td>
                  <td>{s.sujet_stage ?? '—'}</td>
                  <td><StatutBadge statut={s.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
