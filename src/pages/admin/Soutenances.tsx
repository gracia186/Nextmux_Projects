import { useEffect, useState, type FormEvent } from 'react';
import { Plus, GraduationCap, MapPin, Users } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Soutenance, Stagiaire } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const STATUT_LABELS = { planifiee: 'Planifiée', realisee: 'Réalisée', annulee: 'Annulée' };
const STATUT_TONE = { planifiee: 'warning', realisee: 'success', annulee: 'danger' } as const;

export default function AdminSoutenances() {
  useDashboardHeader('Soutenances', 'Planification des soutenances de fin de stage');
  const [soutenances, setSoutenances] = useState<Soutenance[] | null>(null);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ stagiaire_id: '', date_soutenance: '', lieu: '', jury: '' });

  function load() {
    adminApi.soutenances().then((res) => setSoutenances(res.data.data));
    adminApi.stagiaires({ per_page: 100 }).then((res) => setStagiaires(res.data.data));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createSoutenance({ ...form, stagiaire_id: Number(form.stagiaire_id) });
      setModalOpen(false);
      setForm({ stagiaire_id: '', date_soutenance: '', lieu: '', jury: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de planifier cette soutenance.'));
    } finally {
      setSaving(false);
    }
  }

  async function changerStatut(s: Soutenance, statut: Soutenance['statut']) {
    await adminApi.updateSoutenance(s.id, { statut });
    load();
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{soutenances?.length ?? 0} soutenance(s)</p>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Planifier une soutenance</Button>
      </div>

      {soutenances === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[0, 1].map((i) => <Skeleton key={i} height={90} />)}</div>
      ) : soutenances.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<GraduationCap size={40} />} title="Aucune soutenance planifiée" description="Planifiez la soutenance d'un stagiaire." />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {soutenances.map((s, i) => (
            <Card key={s.id} className="card" index={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ fontSize: 15 }}>{s.stagiaire?.user?.name}</h3>
                  <p className="page-subtitle">
                    {new Date(s.date_soutenance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    {' à '}
                    {new Date(s.date_soutenance).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <select
                  value={s.statut}
                  onChange={(e) => changerStatut(s, e.target.value as Soutenance['statut'])}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text)', fontSize: 12.5 }}
                >
                  {(Object.keys(STATUT_LABELS) as Soutenance['statut'][]).map((st) => <option key={st} value={st}>{STATUT_LABELS[st]}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {s.lieu && <span className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} /> {s.lieu}</span>}
                {s.jury && <span className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={12} /> {s.jury}</span>}
                <Badge tone={STATUT_TONE[s.statut]}>{STATUT_LABELS[s.statut]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Planifier une soutenance">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Stagiaire</label>
            <select required value={form.stagiaire_id} onChange={(e) => setForm({ ...form, stagiaire_id: e.target.value })}>
              <option value="">Sélectionner…</option>
              {stagiaires.map((s) => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Date et heure</label>
            <input type="datetime-local" required value={form.date_soutenance} onChange={(e) => setForm({ ...form, date_soutenance: e.target.value })} />
          </div>
          <div className="field">
            <label>Lieu</label>
            <input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} />
          </div>
          <div className="field">
            <label>Jury (noms séparés par virgule)</label>
            <input value={form.jury} onChange={(e) => setForm({ ...form, jury: e.target.value })} />
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Planifier</Button>
        </form>
      </Modal>
    </div>
  );
}
