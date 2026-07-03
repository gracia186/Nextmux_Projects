import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProjet } from '../api/projets.api';
import { projetsKeys } from './useProjets';
import type { UpdateProjetPayload, Projet } from '../types/projet.types';

// Type d'entrée de la mutation : on regroupe id + payload dans un seul objet
// car useMutation n'accepte qu'un seul argument
interface UpdateProjetArgs {
  id: string; // id du projet à modifier
  payload: UpdateProjetPayload; // champs à mettre à jour
}

export function useUpdateProjet() {
  const queryClient = useQueryClient();

  return useMutation<Projet, Error, UpdateProjetArgs>({
    // on déstructure { id, payload } pour appeler l'API avec les 2 arguments attendus
    mutationFn: ({ id, payload }) => updateProjet(id, payload),

    onSuccess: (updatedProjet) => {
      // Invalide la liste globale pour refléter le changement dans les tableaux/listes
      queryClient.invalidateQueries({ queryKey: projetsKeys.lists() });

      // Invalide aussi le détail de CE projet précis s'il est affiché ailleurs
      queryClient.invalidateQueries({
        queryKey: projetsKeys.detail(updatedProjet.id),
      });
    },
  });
}