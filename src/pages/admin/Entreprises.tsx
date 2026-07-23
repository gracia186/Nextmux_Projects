import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Entreprise } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function AdminEntreprises() {
  useDashboardHeader('Entreprises', 'Entreprises partenaires accueillant des stagiaires');

  const [entreprises, setEntreprises] = useState<Entreprise[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: '', secteur: '', adresse: '', telephone: '', email: '' });

  function load() {
    adminApi.entreprises().then((res) => setEntreprises(res.data.data));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createEntreprise(form);
      setModalOpen(false);
      setForm({ nom: '', secteur: '', adresse: '', telephone: '', email: '' });
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Impossible de créer cette entreprise.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-subtitle">{entreprises?.length ?? 0} entreprise(s) partenaire(s)</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Ajouter une entreprise</Button>
      </div>

      {entreprises === null ? (
        <div className="grid-cols-3">{[0, 1, 2].map((i) => <CardSkeleton key={i} />)}</div>
      ) : entreprises.length === 0 ? (
        <Card className="card" index={0}>
          <EmptyState icon={<Building2 size={40} />} title="Aucune entreprise" description="Ajoutez une entreprise partenaire pour y rattacher des stagiaires et mentors." />
        </Card>
      ) : (
        <div className="grid-cols-3">
          {entreprises.map((e, i) => (
            <Card key={e.id} className="card" hover index={i}>
              <div className="stat-icon" style={{ marginBottom: 14 }}><Building2 size={19} /></div>
              <h3 style={{ marginBottom: 4 }}>{e.nom}</h3>
              <p className="page-subtitle" style={{ marginBottom: 14 }}>{e.secteur ?? 'Secteur non renseigné'}</p>
              <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--text-muted)' }}>
                <span>{e.stagiaires_count ?? 0} stagiaires</span>
                <span>{e.mentors_count ?? 0} mentors</span>
                <span>{e.departements_count ?? 0} départements</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle entreprise" subtitle="Ajouter un partenaire d'accueil">
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Nom de l'entreprise</label>
            <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div className="field">
            <label>Secteur</label>
            <input value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} />
          </div>
          <div className="field">
            <label>Adresse</label>
            <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>
          <div className="grid-cols-2">
            <div className="field">
              <label>Téléphone</label>
              <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <Button type="submit" loading={saving} style={{ width: '100%' }}>Créer l'entreprise</Button>
        </form>
      </Modal>
    </div>
  );
}
