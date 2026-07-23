import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { authApi } from '../../lib/endpoints';
import type { Publication } from '../../types';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function Annonces() {
  useDashboardHeader('Annonces', "Publications de l'administration");
  const [publications, setPublications] = useState<Publication[] | null>(null);

  useEffect(() => {
    authApi.publications().then((res) => setPublications(res.data));
  }, []);

  if (publications === null) return <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[0, 1].map((i) => <Skeleton key={i} height={90} />)}</div>;

  if (publications.length === 0) {
    return (
      <Card className="card" index={0}>
        <EmptyState icon={<Megaphone size={40} />} title="Aucune annonce" description="Les annonces de l'administration apparaîtront ici." />
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {publications.map((p, i) => (
        <Card key={p.id} className="card" index={i}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>{p.titre}</h3>
          <p className="page-subtitle" style={{ marginBottom: 8 }}>{new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{p.contenu}</p>
        </Card>
      ))}
    </div>
  );
}
