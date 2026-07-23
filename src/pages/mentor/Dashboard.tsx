import { useEffect, useState } from 'react';
import { GraduationCap, FolderKanban, FileText, CalendarCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { mentorApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { ChartTooltip } from '../../components/ui/ChartTooltip';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';
import type { Stagiaire } from '../../types';

interface MentorDashboardData {
  total_stagiaires: number;
  projets_en_cours: number;
  projets_termines: number;
  rapports_a_valider: number;
  presences_aujourdhui: number;
  projets_par_statut: Record<string, number>;
  stagiaires: Stagiaire[];
}

const STATUT_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  termine: 'Terminé',
  en_retard: 'En retard',
};
const STATUT_COLORS: Record<string, string> = {
  a_faire: '#94a3b8',
  en_cours: '#60a5fa',
  termine: '#10b981',
  en_retard: '#f43f5e',
};

export default function MentorDashboard() {
  useDashboardHeader('Dashboard', 'Vue d’ensemble de vos stagiaires encadrés');
  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setError(null);
    mentorApi
      .dashboard()
      .then((res) => setData(res.data as MentorDashboardData))
      .catch((err) => setError(apiErrorMessage(err, 'Impossible de charger votre dashboard.')));
  }

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!data) {
    return <div className="grid-cols-4">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>;
  }

  return (
    <div>
      <div className="grid-cols-4">
        <StatCard index={0} label="Mes stagiaires" value={data.total_stagiaires} icon={<GraduationCap size={19} />} />
        <StatCard index={1} label="Projets en cours" value={data.projets_en_cours} icon={<FolderKanban size={19} />} />
        <StatCard index={2} label="Rapports à valider" value={data.rapports_a_valider} icon={<FileText size={19} />} />
        <StatCard index={3} label="Présents aujourd'hui" value={data.presences_aujourdhui} icon={<CalendarCheck size={19} />} />
      </div>

      <Card className="card" style={{ marginTop: 20 }} index={4}>
        <h3 style={{ marginBottom: 2 }}>Projets par statut</h3>
        <p className="page-subtitle" style={{ marginBottom: 14 }}>Répartition de vos projets encadrés</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={Object.entries(data.projets_par_statut).map(([statut, total]) => ({ statut: STATUT_LABELS[statut] ?? statut, key: statut, total }))}
            margin={{ left: -18, right: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="statut" stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
            <Bar dataKey="total" name="Projets" radius={[8, 8, 0, 0]}>
              {Object.keys(data.projets_par_statut).map((statut) => (
                <Cell key={statut} fill={STATUT_COLORS[statut] ?? '#60a5fa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="card" style={{ marginTop: 20 }} index={5}>
        <h3 style={{ marginBottom: 4 }}>Mes stagiaires</h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Stagiaires actuellement sous votre encadrement.</p>
        <table className="data-table">
          <thead><tr><th>Stagiaire</th><th>École</th><th>Sujet de stage</th></tr></thead>
          <tbody>
            {data.stagiaires.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="table-user">
                    <div className="avatar">{(s.user?.name ?? '?').slice(0, 2).toUpperCase()}</div>
                    <div><strong>{s.user?.name}</strong><span>{s.user?.email}</span></div>
                  </div>
                </td>
                <td>{s.ecole ?? '—'}</td>
                <td>{s.sujet_stage ?? '—'}</td>
              </tr>
            ))}
            {data.stagiaires.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun stagiaire affecté pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
