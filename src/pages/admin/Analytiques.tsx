import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { adminApi } from '../../lib/endpoints';
import type { Entreprise, Mentor } from '../../types';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ChartTooltip } from '../../components/ui/ChartTooltip';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function AdminAnalytiques() {
  useDashboardHeader('Analytiques', "Indicateurs détaillés de l'activité STAMUX");

  const [entreprises, setEntreprises] = useState<Entreprise[] | null>(null);
  const [mentors, setMentors] = useState<Mentor[] | null>(null);

  useEffect(() => {
    adminApi.entreprises({ per_page: 100 }).then((res) => setEntreprises(res.data.data));
    adminApi.mentors({ per_page: 100 }).then((res) => setMentors(res.data.data));
  }, []);

  if (entreprises === null || mentors === null) {
    return <div className="grid-cols-2">{[0, 1].map((i) => <CardSkeleton key={i} />)}</div>;
  }

  const entrepriseData = entreprises
    .map((e) => ({ nom: e.nom.length > 14 ? `${e.nom.slice(0, 14)}…` : e.nom, total: e.stagiaires_count ?? 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const mentorData = mentors
    .map((m) => ({ nom: m.user?.name?.split(' ')[0] ?? '—', total: m.stagiaires_count ?? 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  return (
    <div className="grid-cols-2">
      <Card className="card" index={0}>
        <h3 style={{ marginBottom: 2 }}>Stagiaires par entreprise</h3>
        <p className="page-subtitle" style={{ marginBottom: 14 }}>Répartition des effectifs accueillis</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={entrepriseData} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="nom" stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Stagiaires" fill="#60a5fa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="card" index={1}>
        <h3 style={{ marginBottom: 2 }}>Charge par mentor</h3>
        <p className="page-subtitle" style={{ marginBottom: 14 }}>Nombre de stagiaires encadrés</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mentorData} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="nom" stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Stagiaires" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
