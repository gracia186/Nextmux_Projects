import { Demande } from '../types/demande.types';

const statutConfig: Record<string, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  approuvee: { label: 'Approuvée', color: 'bg-green-100 text-green-800' },
  rejetee: { label: 'Rejetée', color: 'bg-red-100 text-red-800' },
};

interface Props {
  demande: Demande;
}

export function DemandeCard({ demande }: Props) {
  const config = statutConfig[demande.statut];
  const titre = demande.type === 'attestation' ? 'Attestation de stage' : 'Convention de stage';

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{titre}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Envoyée le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
      </p>
      {demande.commentaire && (
        <p className="text-sm text-gray-700 mt-2 italic">
          Commentaire : {demande.commentaire}
        </p>
      )}
    </div>
  );
}