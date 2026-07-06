import { useState } from 'react';
import { useMentorRapports } from '@/features/rapports/hooks/useMentorRapport';
import { useEvaluerRapport } from '@/features/rapports/hooks/useEvaluerRapport';
import type { Rapport } from '@/features/rapports/types/rapport.types';
import { format } from 'date-fns'; import { fr } from 'date-fns/locale';


const STATUT_CONFIG = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  valide: { label: 'Validé', className: 'bg-green-100 text-green-700' },
  rejete: { label: 'Rejeté', className: 'bg-red-100 text-red-700' },
};

interface MentorRapportListProps {
  mentorId: number;
}

export function MentorRapportList({ mentorId }: MentorRapportListProps) {
  const { data, isLoading, isError } = useMentorRapports(mentorId);
  const { mutate: evaluer, isPending: isEvaluating } = useEvaluerRapport();

  const [rapportActif, setRapportActif] = useState<Rapport | null>(null);
  const [statut, setStatut] = useState<'valide' | 'rejete'>('valide');
  const [note, setNote] = useState(10);
  const [commentaireMentor, setCommentaireMentor] = useState('');

  if (isLoading) return <p className="text-dark-500">Chargement...</p>;
  if (isError) return <p className="text-red-500">Erreur lors du chargement.</p>;

  const rapports = data?.data ?? [];

  const ouvrirEvaluation = (rapport: Rapport) => {
    setRapportActif(rapport);
    setStatut('valide');
    setNote(rapport.note ?? 10);
    setCommentaireMentor(rapport.commentaireMentor ?? '');
  };

  const confirmerEvaluation = () => {
    if (!rapportActif) return;
    evaluer(
      { id: rapportActif.id, data: { statut, note, commentaireMentor } },
      { onSuccess: () => setRapportActif(null) }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark-900">Rapports de mes stagiaires</h2>
        <p className="text-sm text-dark-500 mt-1">{data?.meta.total ?? 0} rapport(s)</p>
      </div>

      {rapports.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-dark-400 text-sm">Aucun rapport pour l'instant.</p>
        </div>
      )}

      <div className="space-y-4">
        {rapports.map((rapport) => {
          const statutConfig = STATUT_CONFIG[rapport.statut];
          const dejaEvalue = rapport.statut !== 'en_attente';

          return (
            <div
              key={rapport.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-dark-900">{rapport.titre}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statutConfig.className}`}
                    >
                      {statutConfig.label}
                    </span>
                    {rapport.note !== undefined && (
                      <span className="text-xs font-medium text-dark-600">
                        Note : {rapport.note}/20
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dark-400 mt-1">
                    Période : {format(new Date(rapport.dateDebut), 'dd MMM yyyy', { locale: fr })}
                    {' → '}
                    {format(new Date(rapport.dateFin), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-dark-600 mt-3 line-clamp-2">{rapport.contenu}</p>

                  {rapport.commentaireMentor && (
                    <div className="mt-3 rounded-md bg-gray-50 border border-gray-100 px-3 py-2">
                      <p className="text-xs font-medium text-dark-700">Votre commentaire :</p>
                      <p className="text-xs text-dark-600 mt-0.5">{rapport.commentaireMentor}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => ouvrirEvaluation(rapport)}
                  disabled={dejaEvalue}
                  className={`ml-4 text-sm font-medium whitespace-nowrap ${
                    dejaEvalue
                      ? 'text-dark-300 cursor-not-allowed'
                      : 'text-primary-600 hover:underline'
                  }`}
                >
                  {dejaEvalue ? 'Déjà évalué' : 'Évaluer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rapportActif && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-dark-900 mb-5">
              Évaluer : {rapportActif.titre}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Statut</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as 'valide' | 'rejete')}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="valide">Validé</option>
                  <option value="rejete">Rejeté</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Note (/20)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={note}
                  onChange={(e) => setNote(Number(e.target.value))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Commentaire
                </label>
                <textarea
                  rows={3}
                  value={commentaireMentor}
                  onChange={(e) => setCommentaireMentor(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRapportActif(null)}
                className="text-sm font-medium text-dark-500 hover:text-dark-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmerEvaluation}
                disabled={isEvaluating}
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
                }}
                className="rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isEvaluating ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}