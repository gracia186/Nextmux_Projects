import { useEffect, useState } from 'react';
import { ClipboardList, Star } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import type { Tache } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const PRIORITE_TONE = { basse: 'neutral', moyenne: 'warning', haute: 'danger' } as const;
const STATUT_LABELS: Record<Tache['statut'], string> = {
  a_faire: 'À faire', en_cours: 'En cours', termine: 'Terminé',
};

export default function StagiaireTaches() {
  useDashboardHeader('Mes tâches', 'Tâches à réaliser dans le cadre de vos projets');
  const [taches, setTaches] = useState<Tache[] | null>(null);

  function load() {
    stagiaireApi.taches().then((res) => setTaches(res.data.data));
  }

  useEffect(load, []);

  async function changerStatut(t: Tache, statut: Tache['statut']) {
    setTaches((prev) => prev!.map((x) => (x.id === t.id ? { ...x, statut } : x)));
    await stagiaireApi.updateTache(t.id, statut);
  }

  return (
    <Card className="card" index={0}>
      {taches === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} height={40} />)}</div>
      ) : taches.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} />} title="Aucune tâche" description="Vos tâches assignées apparaîtront ici." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {taches.map((t) => (
            <div
              key={t.id}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 4px', borderTop: '1px solid var(--glass-border)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, textDecoration: t.statut === 'termine' ? 'line-through' : 'none', color: t.statut === 'termine' ? 'var(--text-faint)' : 'var(--text)' }}>
                  {t.titre}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 2 }}>
                  {t.deadline && <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Échéance : {new Date(t.deadline).toLocaleDateString('fr-FR')}</span>}
                  {t.evaluation_note !== null && t.evaluation_note !== undefined && (
                    <span style={{ fontSize: 11.5, color: 'var(--warning, #f59e0b)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={11} fill="currentColor" /> {t.evaluation_note}/20
                    </span>
                  )}
                </div>
              </div>
              <Badge tone={PRIORITE_TONE[t.priorite]}>{t.priorite}</Badge>
              <select
                value={t.statut}
                onChange={(e) => changerStatut(t, e.target.value as Tache['statut'])}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text)', fontSize: 12.5 }}
              >
                {(Object.keys(STATUT_LABELS) as Tache['statut'][]).map((s) => (
                  <option key={s} value={s}>{STATUT_LABELS[s]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
