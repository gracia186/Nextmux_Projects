// src/features/events/components/EvenementCard.tsx

import type { Evenement } from '@/features/Evènements/types/Evènement.types';
import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';

interface EvenementCardProps {
  evenement: Evenement;
  peutModifier?: boolean; // true uniquement pour le mentor créateur
  onModifier?: (evenement: Evenement) => void;
  onSupprimer?: (id: string) => void;
}

const statutColors: Record<Evenement['statut'], string> = {
  'à venir': 'bg-blue-100 text-blue-700',
  'en cours': 'bg-green-100 text-green-700',
  'terminé': 'bg-gray-100 text-gray-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EvenementCard({ evenement, peutModifier = false, onModifier, onSupprimer }: EvenementCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg">{evenement.titre}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statutColors[evenement.statut]}`}>
          {evenement.statut}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{evenement.description}</p>

      <div className="mt-3 text-sm text-gray-500 space-y-1">
        <p>📍 {evenement.lieu}</p>
        <p>🗓️ {formatDate(evenement.dateDebut)} → {formatDate(evenement.dateFin)}</p>
      </div>

      {peutModifier && (
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t"
        >
          <button onClick={() => onModifier?.(evenement)} className="text-sm text-blue-600 hover:underline"
            style={{backgroundColor:"135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%"}}>
            <Pencil className="w-4 h-4 mr-1" />
            
          </button>
          <button onClick={() => onSupprimer?.(evenement.id)} className="text-sm text-red-600 hover:underline"
            style={{backgroundColor:"135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%"}}>
            <Trash2 className="w-4 h-4 mr-1" />
            
          </button>
        </div>
      )}
    </div>
  );
}