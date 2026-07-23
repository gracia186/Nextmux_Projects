import { useEffect, useState } from 'react';
import { CalendarCheck, FolderKanban, ClipboardList, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { stagiaireApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import { obtenirPosition } from '../../lib/geolocation';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { ChartTooltip } from '../../components/ui/ChartTooltip';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';
import type { Presence, Projet } from '../../types';

const STATUT_COLORS: Record<string, string> = {
  present: '#10b981',
  retard: '#f59e0b',
  absent: '#f43f5e',
  conge: '#94a3b8',
};
const STATUT_LABELS: Record<string, string> = {
  present: 'Présent', retard: 'Retard', absent: 'Absent', conge: 'Congé',
};

interface StagiaireDashboardData {
  taux_presence: number;
  projets_en_cours: number;
  taches_a_faire: number;
  rapports_soumis: number;
  jours_restants: number | null;
  progression_globale: number;
  historique_presence: Presence[];
  projets_recents: Projet[];
}

export default function StagiaireDashboard() {
  useDashboardHeader('Dashboard', 'Vue d’ensemble de votre stage');
  const [data, setData] = useState<StagiaireDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [pointing, setPointing] = useState<'in' | 'out' | null>(null);

  function load() {
    setError(null);
    stagiaireApi
      .dashboard()
      .then((res) => setData(res.data as StagiaireDashboardData))
      .catch((err) => setError(apiErrorMessage(err, 'Impossible de charger votre dashboard.')));
  }

  useEffect(load, []);

  async function handlePointer(type: 'in' | 'out') {
    setPointing(type);
    setGeoError(null);
    try {
      const position = await obtenirPosition();
      if (type === 'in') await stagiaireApi.checkIn(position);
      else await stagiaireApi.checkOut(position);
      load();
    } catch (err) {
      setGeoError(err instanceof Error ? err.message : apiErrorMessage(err, "Impossible d'enregistrer le pointage."));
    } finally {
      setPointing(null);
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (!data) {
    return <div className="grid-cols-4">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>;
  }

  const repartition = Object.entries(
    data.historique_presence.reduce<Record<string, number>>((acc, p) => {
      acc[p.statut] = (acc[p.statut] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([statut, total]) => ({ name: STATUT_LABELS[statut] ?? statut, statut, value: total }));

  return (
    <div>
      <motion.div
        className="glass glass-strong card ring-hover"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="stat-icon" style={{ width: 46, height: 46 }}><Clock size={20} /></div>
            <div>
              <h3 style={{ fontSize: 16 }}>Pointage du jour</h3>
              <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={12} /> Géolocalisation requise — soyez sur le site de votre entreprise.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" loading={pointing === 'in'} disabled={pointing !== null} onClick={() => handlePointer('in')}>
              Pointer l'arrivée
            </Button>
            <Button size="sm" variant="ghost" loading={pointing === 'out'} disabled={pointing !== null} onClick={() => handlePointer('out')}>
              Pointer le départ
            </Button>
          </div>
        </div>
        {geoError && (
          <p style={{ color: '#fb7185', fontSize: 12.5, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={13} /> {geoError}
          </p>
        )}
      </motion.div>

      <div className="grid-cols-4">
        <StatCard index={0} label="Taux de présence" value={`${data.taux_presence}%`} icon={<CalendarCheck size={19} />} />
        <StatCard index={1} label="Projets en cours" value={data.projets_en_cours} icon={<FolderKanban size={19} />} />
        <StatCard index={2} label="Tâches à faire" value={data.taches_a_faire} icon={<ClipboardList size={19} />} />
        <StatCard index={3} label="Jours restants" value={data.jours_restants ?? '—'} icon={<Clock size={19} />} />
      </div>

      <div className="grid-cols-2" style={{ marginTop: 20 }}>
        <Card className="card" index={4}>
          <h3 style={{ marginBottom: 2 }}>Historique de présence</h3>
          <p className="page-subtitle" style={{ marginBottom: 14 }}>14 derniers pointages</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={[...data.historique_presence].reverse().slice(-14).map((p) => ({
                jour: new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                statut: p.statut,
                valeur: 1,
              }))}
              margin={{ left: -30, right: 8 }}
            >
              <XAxis dataKey="jour" stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <Bar dataKey="valeur" name="Présence" radius={[6, 6, 0, 0]} maxBarSize={22}>
                {[...data.historique_presence].reverse().slice(-14).map((p) => (
                  <Cell key={p.id} fill={STATUT_COLORS[p.statut] ?? '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="card" index={5}>
          <h3 style={{ marginBottom: 2 }}>Répartition des présences</h3>
          <p className="page-subtitle" style={{ marginBottom: 14 }}>Proportions sur les 30 derniers jours</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={repartition} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={3}>
                {repartition.map((r) => <Cell key={r.statut} fill={STATUT_COLORS[r.statut] ?? '#60a5fa'} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="card" style={{ marginTop: 20 }} index={6}>
        <h3 style={{ marginBottom: 16 }}>Mes projets récents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.projets_recents.map((p) => (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                <strong>{p.titre}</strong>
                <span className="page-subtitle">{p.progression}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${p.progression}%` }} /></div>
            </div>
          ))}
          {data.projets_recents.length === 0 && <p className="page-subtitle">Aucun projet pour le moment.</p>}
        </div>
      </Card>
    </div>
  );
}
