import { useEffect, useState } from 'react';
import { FileText, Check, X, Download } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import type { Rapport } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/api\/?$/, '');

export default function MentorRapports() {
  useDashboardHeader('Rapports', 'Rapports soumis par vos stagiaires');
  const [rapports, setRapports] = useState<Rapport[] | null>(null);

  function load() {
    mentorApi.rapports().then((res) => setRapports(res.data.data));
  }

  useEffect(load, []);

  async function decide(id: number, statut: 'valide' | 'rejete') {
    await mentorApi.updateRapport(id, { statut });
    load();
  }

  return (
    <Card className="card" index={0}>
      {rapports === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}</div>
      ) : rapports.length === 0 ? (
        <EmptyState icon={<FileText size={40} />} title="Aucun rapport" description="Les rapports soumis par vos stagiaires apparaîtront ici." />
      ) : (
        <table className="data-table">
          <thead><tr><th>Stagiaire</th><th>Titre</th><th>Date</th><th>Document</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {rapports.map((r) => (
              <tr key={r.id}>
                <td>{r.stagiaire?.user?.name ?? '—'}</td>
                <td>{r.titre}</td>
                <td>{r.date_soumission ? new Date(r.date_soumission).toLocaleDateString('fr-FR') : '—'}</td>
                <td>
                  {r.fichier ? (
                    <a href={`${API_ORIGIN}/storage/${r.fichier}`} target="_blank" rel="noreferrer" className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Télécharger">
                      <Download size={14} />
                    </a>
                  ) : '—'}
                </td>
                <td><StatutBadge statut={r.statut} /></td>
                <td>
                  {r.statut === 'soumis' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" icon={<Check size={13} />} onClick={() => decide(r.id, 'valide')}>Valider</Button>
                      <Button size="sm" variant="danger" icon={<X size={13} />} onClick={() => decide(r.id, 'rejete')}>Rejeter</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
