import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Demande, TraiterDemandePayload } from '../types/demande.types';

const STATUT_CONFIG = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  'approuvée': { label: 'Approuvée', className: 'bg-green-100 text-green-700' },
  'rejetée': { label: 'Rejetée', className: 'bg-red-100 text-red-700' },
};

interface DemandeListProps {
  titre: string; // "Demandes d'attestation" ou "Demandes de convention"
  demandes: Demande[];
  loading: boolean;
  error: string | null;
  traitementEnCours: boolean;
  onTraiter: (id: string, payload: TraiterDemandePayload) => Promise<boolean>;
}

export function DemandeList({
  titre,
  demandes,
  loading,
  error,
  traitementEnCours,
  onTraiter,
}: DemandeListProps) {
  const [demandeActive, setDemandeActive] = useState<Demande | null>(null);
  const [statut, setStatut] = useState<'approuvée' | 'rejetée'>('approuvée');
  const [commentaire, setCommentaire] = useState('');
  const [fichier, setFichier] = useState<File | null>(null);

  if (loading) return <p className="text-dark-500">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const ouvrirTraitement = (demande: Demande) => {
    setDemandeActive(demande);
    setStatut('approuvée');
    setCommentaire(demande.commentaire ?? '');
    setFichier(null);
  };

  const confirmerTraitement = async () => {
    if (!demandeActive) return;
    const success = await onTraiter(demandeActive.id, {
      statut,
      commentaire: commentaire || undefined,
      fichier: fichier ?? undefined,
    });
    if (success) setDemandeActive(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark-900">{titre}</h2>
        <p className="text-sm text-dark-500 mt-1">{demandes.length} demande(s)</p>
      </div>

      {demandes.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-dark-400 text-sm">Aucune demande pour l'instant.</p>
        </div>
      )}

      <div className="space-y-4">
        {demandes.map((demande) => {
          const statutConfig = STATUT_CONFIG[demande.statut];
          const dejaTraitee = demande.statut !== 'en_attente';

          return (
            <div
              key={demande.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-dark-900 capitalize">{demande.type}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statutConfig.className}`}
                    >
                      {statutConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400 mt-1">
                    Demandée le{' '}
                    {format(new Date(demande.dateCreation), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  {demande.commentaire && (
                    <p className="text-sm text-dark-600 mt-2">{demande.commentaire}</p>
                  )}
                  {demande.fichierNom && (
                    <p className="text-xs text-primary-600 mt-2">📎 {demande.fichierNom}</p>
                  )}
                </div>

                <button
                  onClick={() => ouvrirTraitement(demande)}
                  disabled={dejaTraitee}
                  className={`ml-4 text-sm font-medium whitespace-nowrap ${
                    dejaTraitee
                      ? 'text-dark-300 cursor-not-allowed'
                      : 'text-primary-600 hover:underline'
                  }`}
                >
                  {dejaTraitee ? 'Déjà traitée' : 'Traiter'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {demandeActive && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-dark-900 mb-5 capitalize">
              Traiter la demande de {demandeActive.type}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Décision</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as 'approuvée' | 'rejetée')}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="approuvée">Approuvée</option>
                  <option value="rejetée">Rejetée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Commentaire
                </label>
                <textarea
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Document ({demandeActive.type} signée)
                </label>
                <label
                  htmlFor="demande-fichier-input"
                  className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed
                             border-gray-300 px-3 py-2 text-sm text-dark-500 hover:border-primary-500
                             hover:text-primary-600 transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  {fichier?.name ?? 'Choisir un fichier'}
                </label>
                <input
                  id="demande-fichier-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDemandeActive(null)}
                className="text-sm font-medium text-dark-500 hover:text-dark-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmerTraitement}
                disabled={traitementEnCours}
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
                }}
                className="rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {traitementEnCours ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}