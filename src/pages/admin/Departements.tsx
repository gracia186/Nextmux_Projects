import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Network } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Departement, Entreprise } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function AdminDepartements() {
  useDashboardHeader('Départements', "Répartition des services au sein des entreprises");

  const [departements, setDepartements] = useState<Departement[] | null>(null);
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: '', entreprise_id: '' });

  function load() {
    adminApi.departements().then((res) => setDepartements(res.data.data));
  }

  useEffect(() => {
    load();
    adminApi.entreprises({ per_page: 100 }).then((res) => setEntreprises(res.data.data));
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createDepartement({ nom: form.nom, entreprise_id: Number(form.entreprise_id) });
      setModalOpen(false);
      setForm({ nom: '', entreprise_id: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de créer ce département.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="page-subtitle">{departements?.length ?? 0} département(s)</p>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Ajouter un département</Button>
      </div>

      <Card className="card" index={0}>
        {departements === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}
          </div>
        ) : departements.length === 0 ? (
          <EmptyState icon={<Network size={40} />} title="Aucun département" description="Structurez vos entreprises partenaires en départements." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Département</th><th>Entreprise</th><th>Stagiaires</th></tr></thead>
            <tbody>
              {departements.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.nom}</strong></td>
                  <td>{d.entreprise?.nom ?? '—'}</td>
                  <td>{d.stagiaires_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau département" subtitle="Rattaché à une entreprise partenaire">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Nom du département</label>
            <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div className="field">
            <label>Entreprise</label>
            <select required value={form.entreprise_id} onChange={(e) => setForm({ ...form, entreprise_id: e.target.value })}>
              <option value="">Sélectionner…</option>
              {entreprises.map((e) => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Créer le département</Button>
        </form>
      </Modal>
    </div>
  );
}
