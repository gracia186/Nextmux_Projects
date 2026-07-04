import { useState } from 'react';
import { useRapports } from '../hooks/useRapports';
import { useSubmitRapport } from '../hooks/useSubmitRapport';
import { useDeleteRapport } from '../hooks/useDeleteRapport';
import { RapportForm } from './RapportForm';
import { RapportFormValues } from '../types/rapport.schema';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {Trash2 } from 'lucide-react';

const STATUT_CONFIG = {
  en_attente: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  valide: { label: 'Validé', className: 'bg-green-100 text-green-700' },
  rejete: { label: 'Rejeté', className: 'bg-red-100 text-red-700' },
};
interface RapportListProps {
  mentorId?: number;
}
export function RapportList({ mentorId }: RapportListProps) {
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, isError } = useRapports(1, mentorId);
  const { mutate: submit, isPending } = useSubmitRapport();
  const { mutate: remove } = useDeleteRapport();

  const handleSubmit = (values: RapportFormValues) => {
    submit(values, { onSuccess: () => setShowModal(false) });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer ce rapport ?')) remove(id);
  };

  if (isLoading) return <p className="text-dark-500">Chargement...</p>;
  if (isError) return <p className="text-red-500">Erreur lors du chargement.</p>;

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark-900">Mes rapports</h2>
          <p className="text-sm text-dark-500 mt-1">
            {data?.meta.total ?? 0} rapport(s) soumis
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ backgroundImage:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
          className="rounded-md  px-4 py-2 text-sm font-semibold text-white
                     hover:bg-primary-700 transition-colors"
        >
          + Nouveau rapport
        </button>
      </div>

      {/* Liste vide */}
      {data?.data.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-dark-400 text-sm">Aucun rapport soumis pour l'instant.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-primary-600 text-sm font-medium hover:underline"
          >
            Soumettre votre premier rapport →
          </button>
        </div>
      )}

      {/* Cartes rapports */}
      <div className="space-y-4">
        {data?.data.map((rapport) => {
          const statut = STATUT_CONFIG[rapport.statut];
          return (
            <div key={rapport.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-dark-900">{rapport.titre}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statut.className}`}>
                      {statut.label}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400 mt-1">
                    Période : {format(new Date(rapport.dateDebut), 'dd MMM yyyy', { locale: fr })}
                    {' → '}
                    {format(new Date(rapport.dateFin), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-dark-600 mt-3 line-clamp-2">{rapport.contenu}</p>

                  {/* Commentaire mentor si rejeté */}
                  {rapport.commentaireMentor && (
                    <div className="mt-3 rounded-md bg-red-50 border border-red-100 px-3 py-2">
                      <p className="text-xs font-medium text-red-700">Commentaire mentor :</p>
                      <p className="text-xs text-red-600 mt-0.5">{rapport.commentaireMentor}</p>
                    </div>
                  )}
                </div>

                {/* Actions — suppression uniquement si en attente */}
                {rapport.statut === 'en_attente' && (
                  <button
                    onClick={() => handleDelete(rapport.id)}
                    className="ml-4 text-sm  hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal nouveau rapport */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-dark-900 mb-5">Nouveau rapport</h3>
            <RapportForm
              onSubmit={handleSubmit}
              isPending={isPending}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}