import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

interface Notif { id: string; data: { message?: string; titre?: string }; read_at: string | null; created_at: string }

export default function AdminNotifications() {
  useDashboardHeader('Notifications', 'Historique des alertes système');
  const [items, setItems] = useState<Notif[] | null>(null);

  function load() {
    adminApi.notifications().then((res) => {
      const payload = res.data as { data?: Notif[] } | Notif[];
      setItems(Array.isArray(payload) ? payload : payload.data ?? []);
    });
  }

  useEffect(load, []);

  async function markAll() {
    await adminApi.markAllNotificationsRead();
    load();
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{items?.filter((n) => !n.read_at).length ?? 0} non lue(s)</p>
        <Button variant="ghost" icon={<CheckCheck size={15} />} onClick={markAll}>Tout marquer comme lu</Button>
      </div>

      <Card className="card" index={0}>
        {items === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={<Bell size={40} />} title="Aucune notification" description="Vous serez averti ici des événements importants." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((n) => (
              <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 4px', borderTop: '1px solid var(--glass-border)', opacity: n.read_at ? 0.6 : 1 }}>
                <Bell size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--primary-light)' }} />
                <div>
                  <strong style={{ fontSize: 13.5 }}>{n.data.titre ?? 'Notification'}</strong>
                  <p className="page-subtitle" style={{ marginTop: 2 }}>{n.data.message ?? ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
