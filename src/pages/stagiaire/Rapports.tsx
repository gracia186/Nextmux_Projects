import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, FileText, Paperclip, Download } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Rapport } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/api\/?$/, '');

export default function StagiaireRapports() {
  useDashboardHeader('Mes rapports', 'Soumettez vos rapports hebdomadaires ou de fin de stage');
  const [rapports, setRapports] = useState<Rapport[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ titre: '', contenu: '', type: 'hebdomadaire' });
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    stagiaireApi.rapports().then((res) => setRapports(res.data.data));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const fichier = fileRef.current?.files?.[0];
    if (!fichier) {
      setError('Veuillez joindre le document de votre rapport (PDF, Word...).');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await stagiaireApi.createRapport({ ...form, fichier });
      setModalOpen(false);
      setForm({ titre: '', contenu: '', type: 'hebdomadaire' });
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de soumettre ce rapport.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{rapports?.length ?? 0} rapport(s) soumis</p>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Nouveau rapport</Button>
      </div>

      <Card className="card" index={0}>
        {rapports === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : rapports.length === 0 ? (
          <EmptyState icon={<FileText size={40} />} title="Aucun rapport" description="Soumettez votre premier rapport de stage." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Titre</th><th>Type</th><th>Date</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {rapports.map((r) => (
                <tr key={r.id}>
                  <td>{r.titre}</td>
                  <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                  <td>{r.date_soumission ? new Date(r.date_soumission).toLocaleDateString('fr-FR') : '—'}</td>
                  <td><StatutBadge statut={r.statut} /></td>
                  <td>
                    {r.fichier && (
                      <a href={`${API_ORIGIN}/storage/${r.fichier}`} target="_blank" rel="noreferrer" className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Télécharger">
                        <Download size={14} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau rapport" subtitle="Sera soumis à votre mentor pour validation">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Titre</label>
            <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
              <option value="final">Rapport final</option>
            </select>
          </div>
          <div className="field">
            <label>Résumé (optionnel)</label>
            <textarea rows={4} value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} />
          </div>
          <div className="field">
            <label>Document du rapport (PDF, Word...)</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '1px dashed var(--glass-border-hover)', borderRadius: 12, padding: '16px 14px',
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13,
              }}
            >
              <Paperclip size={16} color="var(--primary-light)" />
              <span>{fileRef.current?.files?.[0]?.name ?? 'Cliquez pour choisir un fichier'}</span>
            </div>
            <input ref={fileRef} type="file" hidden required onChange={() => setError(null)} />
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Soumettre le rapport</Button>
        </form>
      </Modal>
    </div>
  );
}
