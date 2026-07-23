import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Search, Users, UserPlus, X, Mail } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Mentor, Stagiaire } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function AdminMentors() {
  useDashboardHeader('Mentors', 'Encadrants rattachés aux entreprises partenaires');

  const [mentors, setMentors] = useState<Mentor[] | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', specialite: '', fonction: '' });

  // ── Affectation de stagiaires ────────────────────────────
  const [assignTarget, setAssignTarget] = useState<Mentor | null>(null);
  const [availableStagiaires, setAvailableStagiaires] = useState<Stagiaire[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  function load() {
    adminApi.mentors({ search: search || undefined }).then((res) => setMentors(res.data.data));
  }

  useEffect(load, [search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createMentor(form);
      setModalOpen(false);
      setForm({ name: '', email: '', specialite: '', fonction: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de créer ce mentor.'));
    } finally {
      setSaving(false);
    }
  }

  async function openAssign(mentor: Mentor) {
    setAssignTarget(mentor);
    setSelectedIds([]);
    const res = await adminApi.stagiaires({ per_page: 100 });
    // On ne propose que les stagiaires non déjà affectés à CE mentor.
    setAvailableStagiaires(res.data.data.filter((s) => s.mentor?.id !== mentor.id));
  }

  async function handleAssign(e: FormEvent) {
    e.preventDefault();
    if (!assignTarget || selectedIds.length === 0) return;
    setAssigning(true);
    try {
      await adminApi.affecterStagiaires(assignTarget.id, selectedIds);
      setAssignTarget(null);
      load();
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassign(mentorId: number, stagiaireId: number) {
    await adminApi.retirerStagiaire(mentorId, stagiaireId);
    const res = await adminApi.mentor(mentorId);
    setMentors((prev) => prev!.map((m) => (m.id === mentorId ? res.data : m)));
  }

  return (
    <div>
      <div className="page-header">
        <div className="topbar-search" style={{ margin: 0, maxWidth: 320 }}>
          <Search size={15} />
          <input placeholder="Rechercher un mentor…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Ajouter un mentor</Button>
      </div>

      {mentors === null ? (
        <div className="grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} height={180} />)}</div>
      ) : mentors.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<Users size={40} />} title="Aucun mentor" description="Ajoutez un mentor pour pouvoir lui affecter des stagiaires." />
        </Card>
      ) : (
        <div className="grid-cols-3">
          {mentors.map((m, i) => (
            <Card key={m.id} className="card" index={i}>
              <div className="table-user" style={{ marginBottom: 12 }}>
                <div className="avatar">{(m.user?.name ?? '?').slice(0, 2).toUpperCase()}</div>
                <div>
                  <strong>{m.user?.name}</strong>
                  <span>{m.user?.email}</span>
                </div>
              </div>
              <p className="page-subtitle" style={{ marginBottom: 4 }}>{m.entreprise?.nom ?? 'Entreprise non renseignée'}</p>
              <p className="page-subtitle" style={{ marginBottom: 14 }}>{m.specialite ?? 'Spécialité non renseignée'}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, minHeight: 26 }}>
                {(m.stagiaires ?? []).length === 0 ? (
                  <span className="page-subtitle">Aucun stagiaire affecté</span>
                ) : (
                  (m.stagiaires ?? []).map((s) => (
                    <span key={s.id} className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      {s.user?.name}
                      <X size={11} style={{ cursor: 'pointer' }} onClick={() => handleUnassign(m.id, s.id)} />
                    </span>
                  ))
                )}
              </div>

              <Button size="sm" variant="ghost" icon={<UserPlus size={13} />} onClick={() => openAssign(m)} style={{ width: '100%' }}>
                Affecter des stagiaires
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau mentor" subtitle="Crée un compte encadrant">
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
              <label>Spécialité</label>
              <input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
            </div>
            <div className="field">
              <label>Fonction</label>
              <input value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} />
            </div>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Créer le mentor</Button>
        </form>
      </Modal>

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={`Affecter des stagiaires`}
        subtitle={assignTarget ? `à ${assignTarget.user?.name}` : undefined}
      >
        <form onSubmit={handleAssign}>
          <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {availableStagiaires.length === 0 ? (
              <p className="page-subtitle">Tous les stagiaires sont déjà affectés à ce mentor.</p>
            ) : (
              availableStagiaires.map((s) => (
                <label
                  key={s.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, cursor: 'pointer', background: selectedIds.includes(s.id) ? 'rgba(96,165,250,0.12)' : 'transparent' }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={(e) =>
                      setSelectedIds((prev) => (e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id)))
                    }
                  />
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{(s.user?.name ?? '?').slice(0, 2).toUpperCase()}</div>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{s.user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.mentor ? `Actuellement avec ${s.mentor.user?.name}` : 'Sans mentor'}</div>
                  </div>
                </label>
              ))
            )}
          </div>
          <Button type="submit" loading={assigning} disabled={selectedIds.length === 0} style={{ width: '100%' }}>
            Affecter {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
