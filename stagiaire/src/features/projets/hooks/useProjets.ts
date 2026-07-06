import { useQuery } from '@tanstack/react-query';
import { getProjets } from '../api/projets.api';
import type { Projet } from '../types/projet.types';

export const projetsKeys = {
  all: ['projets'] as const,
  lists: () => [...projetsKeys.all, 'list'] as const,
  detail: (id: string) => [...projetsKeys.all, 'detail', id] as const,
};

interface ProjetsFilter {
  mentorId?: string;
  stagiaireId?: string;
}

export function useProjets(filter?: ProjetsFilter) {
  return useQuery<Projet[]>({
    queryKey: [...projetsKeys.lists(), filter],
    queryFn: () => getProjets(filter).then((res) => res.data),
    staleTime: 30_000,
  });
}