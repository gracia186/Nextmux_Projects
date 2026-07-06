// src/features/events/components/EvenementList.tsx

import { useState } from 'react';
import { useEvenements } from '../hooks/useEvenements';
import { useDeleteEvenement, useUpdateEvenement } from '../hooks/useEvenementMutations';
import { EvenementCard } from '../Components/evenementcard';
import { EvenementForm } from '../Components/Evenementform';
import type { Evenement } from '../types/Evènement.types';

interface EvenementListProps {
  modeGestion?: boolean; // true = vue mentor (CRUD), false = vue lecture seule
}

const styles: Record<string, React.CSSProperties> = {
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  pageBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  pageInfo: {
    fontSize: '0.875rem',
    color: '#4b5563',
  },
};

export function EvenementList({ modeGestion = false }: EvenementListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useEvenements(page);
  const { mutate: supprimer } = useDeleteEvenement();
 
  const [evenementEnEdition, setEvenementEnEdition] = useState<Evenement | null>(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  if (isLoading) return <p className="text-gray-500 text-sm">Chargement des événements...</p>;
  if (isError) return <p className="text-red-600 text-sm">Impossible de charger les événements.</p>;

  const evenements = data?.evenements ?? [];

  if (evenements.length === 0) {
    return <p className="text-gray-500 text-sm">Aucun événement pour le moment.</p>;
  }

  const handleSupprimer = (id: string) => {
    if (confirm('Supprimer cet événement ?')) supprimer(id);
  };

  

  return (
    <div>
      {modeGestion && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => { setEvenementEnEdition(null); setAfficherFormulaire(true); }}
            className="text-sm text-white px-4 py-2 rounded-md hover:opacity-90"
            style={{ backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
          >
            + Créer un événement
          </button>
        </div>
      )}

      {afficherFormulaire && modeGestion && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <EvenementForm
            evenementExistant={evenementEnEdition ?? undefined}
            onSuccess={() => setAfficherFormulaire(false)}
            onCancel={() => setAfficherFormulaire(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evenements.map((evenement) => (
          <EvenementCard
            key={evenement.id}
            evenement={evenement}
            peutModifier={modeGestion}
            onModifier={(ev) => { setEvenementEnEdition(ev); setAfficherFormulaire(true);useUpdateEvenement(); }}
            onSupprimer={handleSupprimer}
          />
        ))}
      </div>

      {data?.meta && data.meta.lastPage > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Précédent
          </button>
          <span style={styles.pageInfo}>Page {page} / {data.meta.lastPage}</span>
          <button
            disabled={page === data.meta.lastPage}
            onClick={() => setPage((p) => p + 1)}
            style={{ ...styles.pageBtn, opacity: page === data.meta.lastPage ? 0.5 : 1, cursor: page === data.meta.lastPage ? 'not-allowed' : 'pointer' }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}