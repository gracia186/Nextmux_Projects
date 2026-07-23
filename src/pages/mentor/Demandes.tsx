import { useEffect, useState } from 'react';
import { FileSignature, Check, X } from 'lucide-react';
import { mentorApi } from '../../lib/endpoints';
import type { DemandeDocument } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const STATUT_TONE = { en_attente: 'warning', validee: 'info', rejetee: 'danger', delivree: 'success' } as const;
const STATUT_LABELS = { en_attente: 'En attente', validee: 'Validée', rejetee: 'Rejetée', delivree: 'Livrée' };
const TYPE_LABELS = { convention: 'Convention de stage', attestation: 'Attestation de stage' };

export default function MentorDemandes() {
  useDashboardHeader('Demandes de documents', 'Validez les demandes de convention/attestation de vos stagiaires');
  const [demandes, setDemandes] = useState<DemandeDocument[] | null>(null);
  const [rejetId, setRejetId] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState('');

  function load() {
    mentorApi.demandesDocuments().then((res) => setDemandes(res.data));
  }

  useEffect(load, []);

  async function valider(id: number) {
    await mentorApi.updateDemande(id, { statut: 'validee' });
    load();
  }

  async function rejeter() {
    if (rejetId === null) return;
    await mentorApi.updateDemande(rejetId, { statut: 'rejetee', commentaire_mentor: commentaire });
    setRejetId(null);
    setCommentaire('');
    load();
  }

  return (
    <div>
      <Card className="card" index={0}>
        {demandes === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : demandes.length === 0 ? (
          <EmptyState icon={<FileSignature size={40} />} title="Aucune demande" description="Les demandes de vos stagiaires apparaîtront ici." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Stagiaire</th><th>Type</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.id}>
                  <td>{d.stagiaire?.user?.name ?? '—'}</td>
                  <td>{TYPE_LABELS[d.type]}</td>
                  <td><Badge tone={STATUT_TONE[d.statut]}>{STATUT_LABELS[d.statut]}</Badge></td>
                  <td>
                    {d.statut === 'en_attente' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button size="sm" icon={<Check size={13} />} onClick={() => valider(d.id)}>Valider</Button>
                        <Button size="sm" variant="danger" icon={<X size={13} />} onClick={() => setRejetId(d.id)}>Rejeter</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={rejetId !== null} onClose={() => setRejetId(null)} title="Rejeter la demande" subtitle="Expliquez pourquoi au stagiaire">
        <div className="field">
          <label>Motif du rejet</label>
          <textarea rows={3} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Expliquez pourquoi au stagiaire…" />
        </div>
        <Button variant="danger" onClick={rejeter} style={{ width: '100%' }}>Confirmer le rejet</Button>
      </Modal>
    </div>
  );
}
