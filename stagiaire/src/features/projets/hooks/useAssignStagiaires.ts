import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignStagiairesToProjet } from '../api/projets.api';
import { projetsKeys } from './useProjets';
import type { AssignStagiairesPayload, Projet } from '../types/projet.types';

// Hook dédié à la (ré)assignation de stagiaires à un projet existant
// Séparé de useUpdateProjet pour un usage ciblé (ex: depuis un composant MultiSelect dédié)
export function useAssignStagiaires() {
  const queryClient = useQueryClient();

  return useMutation<Projet, Error, AssignStagiairesPayload>({
    mutationFn: assignStagiairesToProjet, // appel PATCH /projets/:id/assign

    onSuccess: (updatedProjet) => {
      // Rafraîchit la liste (la colonne "stagiaires assignés" doit se mettre à jour)
      queryClient.invalidateQueries({ queryKey: projetsKeys.lists() });

      // Rafraîchit le détail du projet concerné
      queryClient.invalidateQueries({
        queryKey: projetsKeys.detail(updatedProjet.id),
      });

      // Si tu as un hook côté stagiaire qui liste "mes projets assignés"
      // (ex: useMesProjets dans features/stagiaires), invalide-le aussi ici.
      // Exemple : queryClient.invalidateQueries({ queryKey: ['mesProjets'] });
    },
  });
}