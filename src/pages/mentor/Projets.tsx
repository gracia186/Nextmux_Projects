import { useEffect, useState, type FormEvent } from 'react';
import { Plus, FolderKanban, CheckSquare, Square, Star } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Projet, Stagiaire, Tache } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function MentorProjets() {
  useDashboardHeader('Projets', 'Projets confiés à vos stagiaires');

  const [projets, setProjets] = useState<Projet[] | null>(null);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ titre: '', description: '', stagiaire_id: '' });

  const [detail, setDetail] = useState<Projet | null>(null);
  const [newTache, setNewTache] = useState('');
  const [evalTache, setEvalTache] = useState<Tache | null>(null);
  const [evalForm, setEvalForm] = useState({ note: '15', commentaire: '' });
  const [evalSaving, setEvalSaving] = useState(false);

  function load() {
    mentorApi.projets().then((res) => setProjets(res.data.data));
  }

  useEffect(() => {
    load();
    mentorApi.stagiaires({ per_page: 100 }).then((res) => setStagiaires(res.data.data));
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await mentorApi.createProjet({ ...form, stagiaire_id: Number(form.stagiaire_id) });
      setModalOpen(false);
      setForm({ titre: '', description: '', stagiaire_id: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de créer ce projet.'));
    } finally {
      setSaving(false);
    }
  }

  function openDetail(p: Projet) {
    setDetail(p);
  }

  async function refreshDetailTaches() {
    if (!detail) return;
    const taches = await mentorApi.taches(detail.id);
    setDetail((d) => (d ? { ...d, taches: taches.data } : d));
  }

  async function addTache(e: FormEvent) {
    e.preventDefault();
    if (!detail || !newTache.trim()) return;
    await mentorApi.createTache(detail.id, { titre: newTache });
    setNewTache('');
    await refreshDetailTaches();
    load();
  }

  async function toggleTache(t: Tache) {
    const nextStatut = t.statut === 'termine' ? 'a_faire' : 'termine';
    await mentorApi.updateTache(t.id, { statut: nextStatut });
    await refreshDetailTaches();
  }

  async function handleEvaluer(e: FormEvent) {
    e.preventDefault();
    if (!evalTache) return;
    setEvalSaving(true);
    try {
      await mentorApi.evaluerTache(evalTache.id, { evaluation_note: Number(evalForm.note), evaluation_commentaire: evalForm.commentaire });
      setEvalTache(null);
      await refreshDetailTaches();
    } finally {
      setEvalSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{projets?.length ?? 0} projet(s) actif(s)</p>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Nouveau projet</Button>
      </div>

      {projets === null ? (
        <div className="grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} height={140} />)}</div>
      ) : projets.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<FolderKanban size={40} />} title="Aucun projet" description="Créez un projet pour l'un de vos stagiaires." />
        </Card>
      ) : (
        <div className="grid-cols-3">
          {projets.map((p, i) => (
            <Card key={p.id} className="card ring-hover" hover index={i} style={{ cursor: 'pointer' }} onClick={() => openDetail(p)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15 }}>{p.titre}</h3>
                <StatutBadge statut={p.statut} />
              </div>
              <p className="page-subtitle" style={{ marginBottom: 14 }}>{p.stagiaire?.user?.name ?? '—'}</p>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${p.progression}%` }} /></div>
              <p className="page-subtitle" style={{ marginTop: 6 }}>{p.progression}% complété</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau projet" subtitle="Assigné à un stagiaire">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Titre</label>
            <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Stagiaire</label>
            <select required value={form.stagiaire_id} onChange={(e) => setForm({ ...form, stagiaire_id: e.target.value })}>
              <option value="">Sélectionner…</option>
              {stagiaires.map((s) => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
            </select>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Créer le projet</Button>
        </form>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.titre ?? ''} subtitle={detail?.stagiaire?.user?.name}>
        {detail && (
          <div>
            <form onSubmit={addTache} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input placeholder="Nouvelle tâche…" value={newTache} onChange={(e) => setNewTache(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }} />
              <Button type="submit" size="sm">Ajouter</Button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(detail.taches ?? []).map((t) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
                  <span onClick={() => toggleTache(t)} style={{ cursor: 'pointer', display: 'flex' }}>
                    {t.statut === 'termine' ? <CheckSquare size={17} color="var(--success)" /> : <Square size={17} color="var(--text-faint)" />}
                  </span>
                  <span style={{ flex: 1, fontSize: 13.5, textDecoration: t.statut === 'termine' ? 'line-through' : 'none', color: t.statut === 'termine' ? 'var(--text-faint)' : 'var(--text)' }}>
                    {t.titre}
                  </span>
                  {t.evaluation_note !== null && t.evaluation_note !== undefined ? (
                    <span style={{ fontSize: 11.5, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={11} fill="currentColor" /> {t.evaluation_note}/20
                    </span>
                  ) : t.statut === 'termine' ? (
                    <button
                      type="button"
                      className="role-pill"
                      style={{ fontSize: 11, padding: '4px 9px' }}
                      onClick={() => { setEvalTache(t); setEvalForm({ note: '15', commentaire: '' }); }}
                    >
                      Évaluer
                    </button>
                  ) : null}
                </div>
              ))}
              {(!detail.taches || detail.taches.length === 0) && <p className="page-subtitle">Aucune tâche pour ce projet.</p>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!evalTache} onClose={() => setEvalTache(null)} title="Évaluer la tâche" subtitle={evalTache?.titre}>
        <form onSubmit={handleEvaluer}>
          <div className="field">
            <label>Note /20</label>
            <input type="number" min={0} max={20} required value={evalForm.note} onChange={(e) => setEvalForm({ ...evalForm, note: e.target.value })} />
          </div>
          <div className="field">
            <label>Commentaire</label>
            <textarea rows={3} value={evalForm.commentaire} onChange={(e) => setEvalForm({ ...evalForm, commentaire: e.target.value })} />
          </div>
          <Button type="submit" loading={evalSaving} style={{ width: '100%' }}>Enregistrer l'évaluation</Button>
        </form>
      </Modal>
    </div>
  );
}
