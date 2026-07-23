import { useEffect, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import type { User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const ROLE_TONE = { admin: 'danger', mentor: 'info', stagiaire: 'success' } as const;

export default function AdminUtilisateurs() {
  useDashboardHeader('Utilisateurs', 'Tous les comptes ayant accès à la plateforme');

  const [users, setUsers] = useState<User[] | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    adminApi.utilisateurs({ search: search || undefined, role: role || undefined }).then((res) => setUsers(res.data.data));
  }, [search, role]);

  return (
    <div>
      <div className="page-header">
        <div className="topbar-search" style={{ margin: 0, maxWidth: 320 }}>
          <Search size={15} />
          <input placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text)' }}>
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="stagiaire">Stagiaire</option>
        </select>
      </div>

      <Card className="card" index={0}>
        {users === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={44} />)}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={40} />} title="Aucun utilisateur" description="Aucun compte ne correspond à cette recherche." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Téléphone</th><th>Statut</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-user">
                      <div className="avatar">{u.name.slice(0, 2).toUpperCase()}</div>
                      <div><strong>{u.name}</strong><span>{u.email}</span></div>
                    </div>
                  </td>
                  <td><Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge></td>
                  <td>{u.phone ?? '—'}</td>
                  <td><Badge tone={u.is_active ? 'success' : 'neutral'}>{u.is_active ? 'Actif' : 'Désactivé'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
