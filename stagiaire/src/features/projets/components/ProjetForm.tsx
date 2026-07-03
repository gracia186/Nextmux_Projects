import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStagiaires } from '@/features/stagiaires/hooks/useStagiaires';
import {
  Projet,
  CreateProjetPayload,
  UpdateProjetPayload,
} from '@/features/projets/types/projet.types';

interface ProjetFormValues {
  nom: string;
  duree: number;
  tache: string;
  livrableAttendu: string;
  stagiaireIds: string[];
}

interface ProjetFormProps {
  mentorId: string;
  projet?: Projet; // fourni en mode édition, absent en mode création
  onSubmit: (data: CreateProjetPayload | UpdateProjetPayload) => void;
  isSubmitting?: boolean;
}

export function ProjetForm({
  mentorId,
  projet,
  onSubmit,
  isSubmitting = false,
}: ProjetFormProps) {
  const isEditMode = Boolean(projet);

  const { data: stagiaires, isLoading: isLoadingStagiaires } = useStagiaires(
    1,
    Number(mentorId)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjetFormValues>({
    defaultValues: {
      nom: projet?.nom ?? '',
      duree: projet?.duree ?? 1,
      tache: projet?.tache ?? '',
      livrableAttendu: projet?.livrableAttendu ?? '',
      stagiaireIds: projet?.stagiaireIds ?? [],
    },
  });

  // Réinitialise le formulaire si le projet change (ex: passage création -> édition)
  useEffect(() => {
    if (projet) {
      reset({
        nom: projet.nom,
        duree: projet.duree,
        tache: projet.tache,
        livrableAttendu: projet.livrableAttendu,
        stagiaireIds: projet.stagiaireIds,
      });
    }
  }, [projet, reset]);

  const submitHandler = (values: ProjetFormValues) => {
    const payload: CreateProjetPayload | UpdateProjetPayload = {
      nom: values.nom,
      duree: Number(values.duree),
      tache: values.tache,
      livrableAttendu: values.livrableAttendu,
      mentorId,
      stagiaireIds: values.stagiaireIds,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 max-w-xl">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom du projet
        </label>
        <input
          id="nom"
          type="text"
          {...register('nom', { required: 'Le nom du projet est requis' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="duree" className="block text-sm font-medium text-gray-700">
          Durée (en jours)
        </label>
        <input
          id="duree"
          type="number"
          min={1}
          {...register('duree', {
            required: 'La durée est requise',
            min: { value: 1, message: 'La durée doit être d’au moins 1 jour' },
            valueAsNumber: true,
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.duree && (
          <p className="mt-1 text-sm text-red-600">{errors.duree.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tache" className="block text-sm font-medium text-gray-700">
          Tâche à réaliser
        </label>
        <textarea
          id="tache"
          rows={3}
          {...register('tache', { required: 'La description de la tâche est requise' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.tache && (
          <p className="mt-1 text-sm text-red-600">{errors.tache.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="livrableAttendu"
          className="block text-sm font-medium text-gray-700"
        >
          Livrable attendu
        </label>
        <textarea
          id="livrableAttendu"
          rows={2}
          {...register('livrableAttendu', {
            required: 'La description du livrable attendu est requise',
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.livrableAttendu && (
          <p className="mt-1 text-sm text-red-600">
            {errors.livrableAttendu.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="stagiaireIds"
          className="block text-sm font-medium text-gray-700"
        >
          Stagiaires assignés
        </label>

        {isLoadingStagiaires ? (
          <p className="mt-1 text-sm text-gray-500">Chargement des stagiaires...</p>
        ) : (
          <select
            id="stagiaireIds"
            multiple
            {...register('stagiaireIds')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-32"
          >
            {stagiaires?.data.map((stagiaire) => (
              <option key={stagiaire.id} value={String(stagiaire.id)}>
                {stagiaire.prenom} {stagiaire.nom}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs stagiaires.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting
          ? 'Enregistrement...'
          : isEditMode
            ? 'Mettre à jour le projet'
            : 'Créer le projet'}
      </button>
    </form>
  );
}