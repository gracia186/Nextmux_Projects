// src/features/events/components/EvenementList.tsx

import { useState } from 'react';
import { useEvenements } from '../hooks/useEvenements';
import { useDeleteEvenement } from '../hooks/useEvenementMutations';
import { EvenementCard } from '../Components/evenementcard';
import { EvenementForm } from '../Components/Evenementform';
import type { Evenement } from '@/features/Evènements/types/Evènement.types';

interface EvenementListProps {
  modeGestion?: boolean; // true = vue mentor (CRUD), false = vue lecture seule
}

export function EvenementList({ modeGestion = false }: EvenementListProps) {
  const { data: evenements, isLoading, isError } = useEvenements();
  const { mutate: supprimer } = useDeleteEvenement();
  const [evenementEnEdition, setEvenementEnEdition] = useState<Evenement | null>(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  if (isLoading) return <p className="text-gray-500 text-sm">Chargement des événements...</p>;
  if (isError) return <p className="text-red-600 text-sm">Impossible de charger les événements.</p>;
  if (!evenements || evenements.length === 0) {
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
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
            onModifier={(ev) => { setEvenementEnEdition(ev); setAfficherFormulaire(true); }}
            onSupprimer={handleSupprimer}
          />
        ))}
      </div>
    </div>
  );
}