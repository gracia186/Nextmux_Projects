import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Megaphone, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Publication } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const AUDIENCE_LABELS = { stagiaires: 'Stagiaires', mentors: 'Mentors', tous: 'Tous' };
const AUDIENCE_TONE = { stagiaires: 'success', mentors: 'info', tous: 'neutral' } as const;

export default function AdminPublications() {
  useDashboardHeader('Publications', 'Annonces visibles par les utilisateurs de la plateforme');
  const [publications, setPublications] = useState<Publication[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ titre: string; contenu: string; audience: Publication['audience'] }>({
    titre: '', contenu: '', audience: 'tous',
  });

  function load() {
    adminApi.publications().then((res) => setPublications(res.data.data));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createPublication(form);
      setModalOpen(false);
      setForm({ titre: '', contenu: '', audience: 'tous' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de publier cette annonce.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await adminApi.deletePublication(id);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{publications?.length ?? 0} publication(s)</p>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Nouvelle annonce</Button>
      </div>

      {publications === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[0, 1].map((i) => <Skeleton key={i} height={90} />)}</div>
      ) : publications.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<Megaphone size={40} />} title="Aucune publication" description="Publiez une annonce pour vos stagiaires, mentors, ou tous." />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {publications.map((p, i) => (
            <Card key={p.id} className="card" index={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>{p.titre}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge tone={AUDIENCE_TONE[p.audience]}>{AUDIENCE_LABELS[p.audience]}</Badge>
                    <span className="page-subtitle">{new Date(p.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => handleDelete(p.id)} aria-label="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{p.contenu}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle annonce">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Titre</label>
            <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} />
          </div>
          <div className="field">
            <label>Contenu</label>
            <textarea rows={4} required value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} />
          </div>
          <div className="field">
            <label>Audience</label>
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as Publication['audience'] })}>
              <option value="tous">Tous</option>
              <option value="stagiaires">Stagiaires uniquement</option>
              <option value="mentors">Mentors uniquement</option>
            </select>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Publier</Button>
        </form>
      </Modal>
    </div>
  );
}
