import { useQuery } from '@tanstack/react-query';
import { getProjets } from '../api/projets.api';
import type { Projet } from '../types/projet.types';
import type { PaginatedResponse } from '@/shared/types/api.types'; // ✅ ajuste le chemin si besoin

export const projetsKeys = {
  all: ['projets'] as const,
  lists: () => [...projetsKeys.all, 'list'] as const,
  detail: (id: string) => [...projetsKeys.all, 'detail', id] as const,
};

// ✅ le type générique de useQuery est maintenant PaginatedResponse<Projet>
export function useProjets() {
  return useQuery<PaginatedResponse<Projet>>({
    queryKey: projetsKeys.lists(),
    queryFn: getProjets,
    staleTime: 30_000,
  });
}