import { TypeDemande } from '../types/demande.types';

interface Props {
  dejaEnvoyee: (type: TypeDemande) => boolean;
  onDemander: (type: TypeDemande) => void;
  submitting: boolean;
}

export function NouvelleDemandeForm({ dejaEnvoyee, onDemander, submitting }: Props) {
  const options: { type: TypeDemande; label: string; destinataire: string }[] = [
    { type: 'attestation', label: "Demande d'attestation", destinataire: 'au mentor' },
    { type: 'convention', label: 'Demande de convention', destinataire: "à l'administrateur" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((opt) => {
        const envoyee = dejaEnvoyee(opt.type);
        return (
          <div key={opt.type} className="border rounded-lg p-4">
            <p className="font-medium">{opt.label}</p>
            <p className="text-sm text-gray-500 mb-3">Envoyée {opt.destinataire}</p>
            <button
              onClick={() => onDemander(opt.type)}
              disabled={envoyee || submitting}
              style={{backgroundImage:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)'}}
              className="w-full px-4 py-2 rounded-md  text-white text-sm font-medium
                         hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {envoyee ? 'Déjà envoyée' : 'Envoyer la demande'}
            </button>
          </div>
        );
      })}
    </div>
  );
}