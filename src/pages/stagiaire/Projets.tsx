import { useEffect, useState } from 'react';
import { FolderKanban } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import type { Projet } from '../../types';
import { Card } from '../../components/ui/Card';
import { StatutBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function StagiaireProjets() {
  useDashboardHeader('Mes projets', 'Projets qui vous ont été confiés');
  const [projets, setProjets] = useState<Projet[] | null>(null);

  useEffect(() => {
    stagiaireApi.projets().then((res) => setProjets(res.data.data));
  }, []);

  if (projets === null) return <div className="grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} height={140} />)}</div>;

  if (projets.length === 0) {
    return (
      <Card className="card" index={0}>
        <EmptyState icon={<FolderKanban size={40} />} title="Aucun projet" description="Votre mentor vous assignera bientôt un projet." />
      </Card>
    );
  }

  return (
    <div className="grid-cols-3">
      {projets.map((p, i) => (
        <Card key={p.id} className="card" hover index={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h3 style={{ fontSize: 15 }}>{p.titre}</h3>
            <StatutBadge statut={p.statut} />
          </div>
          <p className="page-subtitle" style={{ marginBottom: 14, minHeight: 34 }}>{p.description ?? 'Aucune description.'}</p>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${p.progression}%` }} /></div>
          <p className="page-subtitle" style={{ marginTop: 6 }}>{p.progression}% complété · {(p.taches ?? []).length} tâche(s)</p>
        </Card>
      ))}
    </div>
  );
}
