import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rapportSchema, RapportFormValues } from '../types/rapport.schema';

interface RapportFormProps {
  onSubmit: (values: RapportFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function RapportForm({ onSubmit, isPending, onCancel }: RapportFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RapportFormValues>({
    resolver: zodResolver(rapportSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark-700">Titre</label>
        <input
          {...register('titre')}
          placeholder="Ex : Rapport de stage - Mois 1"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.titre && <p className="mt-1 text-xs text-red-500">{errors.titre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-700">Période du</label>
          <input
            type="date"
            {...register('dateDebut')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <label className="block text-sm font-medium text-dark-700">+</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            {...register("fichier")}
/>  
          {errors.dateDebut && <p className="mt-1 text-xs text-red-500">{errors.dateDebut.message}</p>}
        </div>
        <div>
          
          <label className="block text-sm font-medium text-dark-700">Au</label>
          <input
            type="date"
            {...register('dateFin')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.dateFin && <p className="mt-1 text-xs text-red-500">{errors.dateFin.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-700">Contenu</label>
        <textarea
          {...register('contenu')}
          rows={6}
          placeholder="Décrivez vos activités, apprentissages et observations..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                     resize-none"
        />
        {errors.contenu && <p className="mt-1 text-xs text-red-500">{errors.contenu.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-dark-700
                     hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          style={{
            background:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)'
          }}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-dark-50
                     hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Envoi...' : 'Soumettre le rapport'}
        </button>
      </div>
    </form>
  );
}