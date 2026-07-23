import { useEffect, useState } from 'react';
import { GraduationCap, Users, Building2, CalendarCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatutBadge } from '../../components/ui/Badge';
import { ChartTooltip } from '../../components/ui/ChartTooltip';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const STATUT_COLORS: Record<string, string> = {
  actif: '#10b981',
  termine: '#60a5fa',
  suspendu: '#f43f5e',
};

interface AdminDashboardData {
  total_stagiaires: number;
  stagiaires_actifs: number;
  total_mentors: number;
  total_entreprises: number;
  total_utilisateurs: number;
  presences_aujourdhui: number;
  repartition_par_statut: Record<string, number>;
  evolution_stagiaires: Array<{ mois: string; total: number }>;
  stagiaires_recents: Array<{
    id: number;
    statut: string;
    user?: { name: string };
    entreprise?: { nom: string };
  }>;
}

export default function AdminDashboard() {
  useDashboardHeader('Dashboard', "Vue d'ensemble de l'activité STAMUX");
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setError(null);
    adminApi
      .dashboard()
      .then((res) => setData(res.data as AdminDashboardData))
      .catch((err) => setError(apiErrorMessage(err, 'Impossible de charger le dashboard.')));
  }

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!data) {
    return (
      <div className="grid-cols-4">
        {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  const pieData = Object.entries(data.repartition_par_statut).map(([statut, total]) => ({ name: statut, value: total }));

  return (
    <div>
      <div className="grid-cols-4">
        <StatCard index={0} label="Stagiaires actifs" value={data.stagiaires_actifs} icon={<GraduationCap size={19} />} />
        <StatCard index={1} label="Mentors" value={data.total_mentors} icon={<Users size={19} />} />
        <StatCard index={2} label="Entreprises partenaires" value={data.total_entreprises} icon={<Building2 size={19} />} />
        <StatCard index={3} label="Présences aujourd'hui" value={data.presences_aujourdhui} icon={<CalendarCheck size={19} />} />
      </div>

      <div className="grid-cols-2" style={{ marginTop: 20 }}>
        <Card className="card" index={4}>
          <h3 style={{ marginBottom: 2 }}>Évolution des stagiaires</h3>
          <p className="page-subtitle" style={{ marginBottom: 14 }}>Nouvelles inscriptions sur 6 mois</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.evolution_stagiaires} margin={{ left: -18, right: 8 }}>
              <defs>
                <linearGradient id="fillStagiaires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="mois" stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="total" name="Stagiaires" stroke="#60a5fa" strokeWidth={2.5} fill="url(#fillStagiaires)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="card" index={5}>
          <h3 style={{ marginBottom: 2 }}>Répartition par statut</h3>
          <p className="page-subtitle" style={{ marginBottom: 14 }}>{data.total_stagiaires} stagiaire(s) au total</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUT_COLORS[entry.name] ?? '#8b5cf6'} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: -8 }}>
            {pieData.map((entry) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: STATUT_COLORS[entry.name] ?? '#8b5cf6' }} />
                <span style={{ textTransform: 'capitalize' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="card" style={{ marginTop: 20 }} index={6}>
        <h3 style={{ marginBottom: 4 }}>Stagiaires récents</h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Derniers stagiaires ajoutés à la plateforme.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Stagiaire</th>
              <th>Entreprise</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {data.stagiaires_recents.map((s) => (
              <tr key={s.id}>
                <td>{s.user?.name ?? '—'}</td>
                <td>{s.entreprise?.nom ?? '—'}</td>
                <td><StatutBadge statut={s.statut} /></td>
              </tr>
            ))}
            {data.stagiaires_recents.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun stagiaire pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
