// src/features/events/components/EvenementForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evenementSchema, type EvenementFormValues } from '@/features/Evènements/Components/Evenement.schema';
import { useCreateEvenement, useUpdateEvenement } from '../hooks/useEvenementMutations';
import type { Evenement } from '@/features/Evènements/types/Evènement.types';

interface EvenementFormProps {
  evenementExistant?: Evenement; // fourni = édition, sinon = création
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Classes réutilisées pour les champs (à ajuster à ton design si besoin)
const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function EvenementForm({ evenementExistant, onSuccess, onCancel }: EvenementFormProps) {
  const isEdition = Boolean(evenementExistant);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EvenementFormValues>({
    resolver: zodResolver(evenementSchema),
    defaultValues: evenementExistant
      ? {
          titre: evenementExistant.titre,
          description: evenementExistant.description,
          lieu: evenementExistant.lieu,
          dateDebut: evenementExistant.dateDebut,
          dateFin: evenementExistant.dateFin,
          statut: evenementExistant.statut,
        }
      : { statut: 'à venir' },
  });

  const { mutateAsync: creer } = useCreateEvenement();
  const { mutateAsync: modifier } = useUpdateEvenement();

  const onSubmit = async (values: EvenementFormValues) => {
    if (isEdition && evenementExistant) {
      await modifier({ id: evenementExistant.id, ...values });
    } else {
      await creer(values);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="titre" className="block text-sm font-medium mb-1">Titre</label>
        <input
          id="titre"
          type="text"
          className={inputClass}
          placeholder="Ex: Atelier suivi mi-parcours"
          {...register('titre')}
        />
        {errors.titre && <p className="text-sm text-red-600 mt-1">{errors.titre.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          rows={4}
          className={inputClass}
          placeholder="Détails de l'événement..."
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="lieu" className="block text-sm font-medium mb-1">Lieu</label>
        <input
          id="lieu"
          type="text"
          className={inputClass}
          placeholder="Ex: Salle A - ENEAM Cotonou"
          {...register('lieu')}
        />
        {errors.lieu && <p className="text-sm text-red-600 mt-1">{errors.lieu.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateDebut" className="block text-sm font-medium mb-1">Date et heure de début</label>
          <input id="dateDebut" type="datetime-local" className={inputClass} {...register('dateDebut')} />
          {errors.dateDebut && <p className="text-sm text-red-600 mt-1">{errors.dateDebut.message}</p>}
        </div>
        <div>
          <label htmlFor="dateFin" className="block text-sm font-medium mb-1">Date et heure de fin</label>
          <input id="dateFin" type="datetime-local" className={inputClass} {...register('dateFin')} />
          {errors.dateFin && <p className="text-sm text-red-600 mt-1">{errors.dateFin.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="statut" className="block text-sm font-medium mb-1">Statut</label>
        <select id="statut" className={inputClass} {...register('statut')}>
          <option value="à venir">À venir</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-white"
            style={{ backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          style={{ backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
        >
          {isEdition ? 'Enregistrer les modifications' : "Créer l'événement"}
        </button>
      </div>
    </form>
  );
}