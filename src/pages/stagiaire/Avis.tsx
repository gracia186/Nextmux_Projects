import { useEffect, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, GraduationCap, MapPin, Users, CalendarClock } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import type { AvisStage, Soutenance } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const STATUT_LABELS = { planifiee: 'Planifiée', realisee: 'Réalisée', annulee: 'Annulée' };
const STATUT_TONE = { planifiee: 'warning', realisee: 'success', annulee: 'danger' } as const;

export default function StagiaireAvis() {
  useDashboardHeader('Avis & Soutenance', 'Retour de votre mentor et informations de soutenance');
  const [avis, setAvis] = useState<AvisStage[] | null>(null);
  const [soutenance, setSoutenance] = useState<Soutenance | null | undefined>(undefined);

  useEffect(() => {
    stagiaireApi.avis().then((res) => setAvis(res.data));
    stagiaireApi.soutenance().then((res) => setSoutenance(res.data));
  }, []);

  return (
    <div>
      <Card className="card" index={0} style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarClock size={16} /> Soutenance
        </h3>
        {soutenance === undefined ? (
          <Skeleton height={60} />
        ) : soutenance === null ? (
          <p className="page-subtitle">Aucune soutenance planifiée pour le moment.</p>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Badge tone={STATUT_TONE[soutenance.statut]}>{STATUT_LABELS[soutenance.statut]}</Badge>
              <strong style={{ fontSize: 13.5 }}>
                {new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                {' à '}
                {new Date(soutenance.date_soutenance).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            {soutenance.lieu && <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><MapPin size={13} /> {soutenance.lieu}</p>}
            {soutenance.jury && <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} /> Jury : {soutenance.jury}</p>}
            {soutenance.note !== null && soutenance.note !== undefined && (
              <p style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>Note : {soutenance.note}/20</p>
            )}
          </div>
        )}
      </Card>

      <h3 style={{ marginBottom: 12, paddingLeft: 2 }}>Avis de mon mentor</h3>
      {avis === null ? (
        <Skeleton height={140} />
      ) : avis.length === 0 ? (
        <Card className="card" index={1}>
          <EmptyState icon={<GraduationCap size={40} />} title="Aucun avis pour le moment" description="Votre mentor pourra rédiger un avis de fin de stage." />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {avis.map((a, i) => (
            <Card key={a.id} className="card" index={i + 1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15 }}>{a.mentor?.user?.name}</h3>
                  <p className="page-subtitle">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Star size={15} fill="currentColor" /> {a.note_globale}/20
                </span>
              </div>
              {a.points_forts && <p style={{ fontSize: 13, marginBottom: 6 }}><strong>Points forts :</strong> {a.points_forts}</p>}
              {a.points_amelioration && <p style={{ fontSize: 13, marginBottom: 6 }}><strong>Axes d'amélioration :</strong> {a.points_amelioration}</p>}
              {a.commentaire && <p className="page-subtitle" style={{ marginBottom: 10 }}>{a.commentaire}</p>}
              <div style={{ fontSize: 12, color: a.recommande ? 'var(--success)' : '#fb7185', display: 'flex', alignItems: 'center', gap: 5 }}>
                {a.recommande ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />}
                {a.recommande ? 'Recommandé pour un futur poste' : 'Non recommandé'}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
