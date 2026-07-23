import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { AvisStage, Stagiaire } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function MentorAvis() {
  useDashboardHeader('Avis de fin de stage', 'Évaluez globalement vos stagiaires en fin de parcours');
  const [avis, setAvis] = useState<AvisStage[] | null>(null);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    stagiaire_id: '', note_globale: '15', points_forts: '', points_amelioration: '', commentaire: '', recommande: true,
  });

  function load() {
    mentorApi.avis().then((res) => setAvis(res.data));
    mentorApi.stagiaires({ per_page: 100 }).then((res) => setStagiaires(res.data.data));
  }

  useEffect(load, []);

  const stagiairesSansAvis = stagiaires.filter((s) => !avis?.some((a) => a.stagiaire_id === s.id));

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await mentorApi.createAvis({
        stagiaire_id: Number(form.stagiaire_id),
        note_globale: Number(form.note_globale),
        points_forts: form.points_forts,
        points_amelioration: form.points_amelioration,
        commentaire: form.commentaire,
        recommande: form.recommande,
      });
      setModalOpen(false);
      setForm({ stagiaire_id: '', note_globale: '15', points_forts: '', points_amelioration: '', commentaire: '', recommande: true });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Impossible d'enregistrer cet avis."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{avis?.length ?? 0} avis rédigé(s)</p>
        <Button icon={<Plus size={15} />} disabled={stagiairesSansAvis.length === 0} onClick={() => setModalOpen(true)}>
          Nouvel avis
        </Button>
      </div>

      {avis === null ? (
        <div className="grid-cols-3">{[0, 1].map((i) => <Skeleton key={i} height={140} />)}</div>
      ) : avis.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<Star size={40} />} title="Aucun avis" description="Rédigez un avis de fin de stage pour vos stagiaires." />
        </Card>
      ) : (
        <div className="grid-cols-3">
          {avis.map((a, i) => (
            <Card key={a.id} className="card" index={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15 }}>{a.stagiaire?.user?.name}</h3>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={13} fill="currentColor" /> {a.note_globale}/20
                </span>
              </div>
              {a.commentaire && <p className="page-subtitle" style={{ marginBottom: 10 }}>{a.commentaire}</p>}
              <div style={{ fontSize: 12, color: a.recommande ? 'var(--success)' : '#fb7185', display: 'flex', alignItems: 'center', gap: 5 }}>
                {a.recommande ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />}
                {a.recommande ? 'Recommandé' : 'Non recommandé'}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel avis de fin de stage">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Stagiaire</label>
            <select required value={form.stagiaire_id} onChange={(e) => setForm({ ...form, stagiaire_id: e.target.value })}>
              <option value="">Sélectionner…</option>
              {stagiairesSansAvis.map((s) => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Note globale /20</label>
            <input type="number" min={0} max={20} required value={form.note_globale} onChange={(e) => setForm({ ...form, note_globale: e.target.value })} />
          </div>
          <div className="field">
            <label>Points forts</label>
            <textarea rows={2} value={form.points_forts} onChange={(e) => setForm({ ...form, points_forts: e.target.value })} />
          </div>
          <div className="field">
            <label>Axes d'amélioration</label>
            <textarea rows={2} value={form.points_amelioration} onChange={(e) => setForm({ ...form, points_amelioration: e.target.value })} />
          </div>
          <div className="field">
            <label>Commentaire général</label>
            <textarea rows={2} value={form.commentaire} onChange={(e) => setForm({ ...form, commentaire: e.target.value })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 16 }}>
            <input type="checkbox" checked={form.recommande} onChange={(e) => setForm({ ...form, recommande: e.target.checked })} />
            Je recommande ce stagiaire
          </label>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Enregistrer l'avis</Button>
        </form>
      </Modal>
    </div>
  );
}
