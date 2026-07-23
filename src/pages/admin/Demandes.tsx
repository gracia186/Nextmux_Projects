import { useEffect, useRef, useState } from 'react';
import { FileSignature, Upload } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import type { DemandeDocument } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const STATUT_TONE = { en_attente: 'warning', validee: 'info', rejetee: 'danger', delivree: 'success' } as const;
const STATUT_LABELS = { en_attente: 'En attente du mentor', validee: 'Validée — à livrer', rejetee: 'Rejetée', delivree: 'Livrée' };
const TYPE_LABELS = { convention: 'Convention de stage', attestation: 'Attestation de stage' };

export default function AdminDemandes() {
  useDashboardHeader('Demandes de documents', 'Téléversez les documents validés par les mentors');
  const [demandes, setDemandes] = useState<DemandeDocument[] | null>(null);
  const [livraisonId, setLivraisonId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    adminApi.demandesDocuments().then((res) => setDemandes(res.data.data));
  }

  useEffect(load, []);

  async function handleFile(id: number, file: File) {
    setLivraisonId(id);
    try {
      await adminApi.livrerDemande(id, file);
      load();
    } finally {
      setLivraisonId(null);
    }
  }

  return (
    <Card className="card" index={0}>
      {demandes === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1].map((i) => <Skeleton key={i} height={44} />)}</div>
      ) : demandes.length === 0 ? (
        <EmptyState icon={<FileSignature size={40} />} title="Aucune demande" description="Les demandes validées par les mentors apparaîtront ici." />
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
                  {d.statut === 'validee' && (
                    <>
                      <Button
                        size="sm"
                        loading={livraisonId === d.id}
                        icon={<Upload size={13} />}
                        onClick={() => { inputRef.current!.dataset.demandeId = String(d.id); inputRef.current?.click(); }}
                      >
                        Téléverser
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          const id = Number(inputRef.current?.dataset.demandeId);
          if (file && id) handleFile(id, file);
          e.target.value = '';
        }}
      />
    </Card>
  );
}
