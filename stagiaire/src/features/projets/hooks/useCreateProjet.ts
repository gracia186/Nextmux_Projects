import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjet } from '../api/projets.api';
import { projetsKeys } from './useProjets';
import type { CreateProjetPayload, Projet } from '../types/projet.types';

// Hook de mutation pour la création d'un projet par un mentor
export function useCreateProjet() {
  const queryClient = useQueryClient(); // accès au cache global pour l'invalidation

  return useMutation<Projet, Error, CreateProjetPayload>({
    mutationFn: createProjet, // fonction qui exécute le POST vers l'API

    // onSuccess se déclenche uniquement si la mutation a réussi
    onSuccess: () => {
      // Invalide la liste des projets : force React Query à la refetch
      // → c'est CE point précis qui corrige le bug de non-rafraîchissement
      // que tu avais sur les autres entités (stagiaires/mentors)
      queryClient.invalidateQueries({ queryKey: projetsKeys.lists() });

      // Si ton dashboard a une clé de stats globale (ex: ['dashboard', 'stats']),
      // invalide-la aussi ici pour que les compteurs se mettent à jour.
      // Exemple (à adapter à ta vraie clé) :
      // queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}