import { useQuery } from '@tanstack/react-query';
import { getProjetById } from '../api/projets.api';
import { projetsKeys } from './useProjets'; // on réutilise la factory de clés définie plus haut
import type { Projet } from '../types/projet.types';

// Hook pour récupérer un projet précis (ex: page de détail /projets/:id)
export function useProjet(id: string) {
  return useQuery<Projet>({
    queryKey: projetsKeys.detail(id), // clé unique par id, isolée du cache de la liste
    queryFn: () => getProjetById(id), // appel API paramétré par l'id
    enabled: !!id, // n'exécute la requête que si un id valide est fourni (évite un appel avec id vide)
  });
}