import { useEffect, useState } from 'react';
import { CalendarCheck, History } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import type { Presence, Stagiaire } from '../../types';
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

export default function MentorPresences() {
  useDashboardHeader('Présences', 'Suivi de la présence de vos stagiaires');
  const [presences, setPresences] = useState<Presence[] | null>(null);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [mois, setMois] = useState<number | ''>('');
  const [stagiaireId, setStagiaireId] = useState<number | ''>('');

  useEffect(() => {
    mentorApi.stagiaires({ per_page: 100 }).then((res) => setStagiaires(res.data.data));
  }, []);

  useEffect(() => {
    const params: Record<string, unknown> = { per_page: 60 };
    if (mois !== '') params.mois = mois;
    if (stagiaireId !== '') params.stagiaire_id = stagiaireId;
    mentorApi.presences(params).then((res) => setPresences(res.data.data));
  }, [mois, stagiaireId]);

  const filtered = mois !== '' || stagiaireId !== '';
  const visibles = showAll || filtered ? presences : presences?.slice(0, 7);

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{filtered ? `${presences?.length ?? 0} résultat(s)` : '7 pointages les plus récents'}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={stagiaireId}
            onChange={(e) => { setStagiaireId(e.target.value === '' ? '' : Number(e.target.value)); setShowAll(false); }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)' }}
          >
            <option value="">Tous les stagiaires</option>
            {stagiaires.map((s) => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
          </select>
          <select
            value={mois}
            onChange={(e) => { setMois(e.target.value === '' ? '' : Number(e.target.value)); setShowAll(false); }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)' }}
          >
            <option value="">Tous les mois</option>
            {MOIS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          {!filtered && !showAll && (
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
          <EmptyState icon={<CalendarCheck size={40} />} title="Aucune présence enregistrée" description="Les pointages de vos stagiaires apparaîtront ici." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Stagiaire</th><th>Date</th><th>Arrivée</th><th>Départ</th><th>Statut</th></tr></thead>
            <tbody>
              {visibles!.map((p) => (
                <tr key={p.id}>
                  <td>{p.stagiaire?.user?.name ?? '—'}</td>
                  <td>{new Date(p.date).toLocaleDateString('fr-FR')}</td>
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
