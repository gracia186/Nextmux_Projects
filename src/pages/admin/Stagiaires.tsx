import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Search, GraduationCap, Mail } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Stagiaire } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function AdminStagiaires() {
  useDashboardHeader('Stagiaires', 'Gérez les stagiaires inscrits sur la plateforme');

  const [stagiaires, setStagiaires] = useState<Stagiaire[] | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', ecole: '', filiere: '' });

  function load() {
    adminApi.stagiaires({ search: search || undefined }).then((res) => setStagiaires(res.data.data));
  }

  useEffect(load, [search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createStagiaire(form);
      setModalOpen(false);
      setForm({ name: '', email: '', ecole: '', filiere: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Impossible de créer ce stagiaire."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="topbar-search" style={{ margin: 0, maxWidth: 320 }}>
          <Search size={15} />
          <input placeholder="Rechercher un stagiaire…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Ajouter un stagiaire</Button>
      </div>

      <Card className="card" index={0}>
        {stagiaires === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={44} />)}
          </div>
        ) : stagiaires.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={40} />}
            title="Aucun stagiaire"
            description="Ajoutez votre premier stagiaire pour commencer le suivi de stage."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Stagiaire</th>
                <th>École / Filière</th>
                <th>Entreprise</th>
                <th>Mentor</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="table-user">
                      <div className="avatar">{(s.user?.name ?? '?').slice(0, 2).toUpperCase()}</div>
                      <div>
                        <strong>{s.user?.name}</strong>
                        <span>{s.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{s.ecole ?? '—'} {s.filiere ? `· ${s.filiere}` : ''}</td>
                  <td>{s.entreprise?.nom ?? '—'}</td>
                  <td>{s.mentor?.user?.name ?? '—'}</td>
                  <td><StatutBadge statut={s.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau stagiaire" subtitle="Crée un compte et un profil de stage">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Nom complet</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <p className="page-subtitle" style={{ marginBottom: 16, marginTop: -6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={13} /> Un email d'activation sera envoyé pour définir le mot de passe.
          </p>
          <div className="grid-cols-2">
            <div className="field">
              <label>École</label>
              <input value={form.ecole} onChange={(e) => setForm({ ...form, ecole: e.target.value })} />
            </div>
            <div className="field">
              <label>Filière</label>
              <input value={form.filiere} onChange={(e) => setForm({ ...form, filiere: e.target.value })} />
            </div>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Créer le stagiaire</Button>
        </form>
      </Modal>
    </div>
  );
}
