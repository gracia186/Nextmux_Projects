import { useEffect, useState } from 'react';
import { CalendarCheck, History } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import type { Presence } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export default function StagiairePresences() {
  useDashboardHeader('Présences', 'Historique de vos pointages');
  const [presences, setPresences] = useState<Presence[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [mois, setMois] = useState<number | ''>('');

  useEffect(() => {
    const params = mois !== '' ? { mois, per_page: 60 } : { per_page: 60 };
    stagiaireApi.presences(params).then((res) => setPresences(res.data.data));
  }, [mois]);

  const visibles = showAll || mois !== '' ? presences : presences?.slice(0, 7);

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">
          {mois !== '' ? `${MOIS[mois - 1]} · ${presences?.length ?? 0} jour(s)` : '7 derniers jours affichés'}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={mois}
            onChange={(e) => {
              setMois(e.target.value === '' ? '' : Number(e.target.value));
              setShowAll(false);
            }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)' }}
          >
            <option value="">Tous les mois</option>
            {MOIS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          {mois === '' && !showAll && (
            <Button variant="ghost" size="sm" icon={<History size={14} />} onClick={() => setShowAll(true)}>
              Voir tout l'historique
            </Button>
          )}
        </div>
      </div>

      <Card className="card" index={0}>
        {presences === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : presences.length === 0 ? (
          <EmptyState icon={<CalendarCheck size={40} />} title="Aucune présence" description="Pointez votre arrivée depuis le dashboard pour commencer." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Arrivée</th><th>Départ</th><th>Statut</th></tr></thead>
            <tbody>
              {visibles!.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}</td>
                  <td>{p.heure_arrivee?.slice(0, 5) ?? '—'}</td>
                  <td>{p.heure_depart?.slice(0, 5) ?? '—'}</td>
                  <td><StatutBadge statut={p.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
