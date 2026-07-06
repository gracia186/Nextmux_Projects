// src/features/Evènements/hooks/useEvenements.ts

import { useQuery } from '@tanstack/react-query';
import { getEvenements, getEvenementById } from '../api/Evenements.api';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { GetEvenementsPayload } from '../types/Evènement.types';

export function useEvenements(
  page: number = 1,
  filtresSupplementaires?: Omit<GetEvenementsPayload, 'adminId'>
) {
  const user = useAuthStore((state) => state.user);

  const filtres: GetEvenementsPayload = {
    ...filtresSupplementaires,
    page,
  };

  if (user?.role === 'stagiaire') {
    // ⚠️ à confirmer : le champ exact sur `user` qui référence le mentor assigné
    filtres.adminId = String(user.id);
  }

  return useQuery({
    queryKey: ['evenements', 'list', page, filtres],
    queryFn: () => getEvenements(filtres),
    placeholderData: (previousData) => previousData,
  });
}

export function useEvenementDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['evenements', 'detail', id],
    queryFn: () => getEvenementById(id as string),
    enabled: Boolean(id),
  });
}