// src/features/events/hooks/useEvenements.ts

import { useQuery } from '@tanstack/react-query';
import { getEvenements, getEvenementById } from '@/features/Evènements/api/Evenements.api';
import { useAuthStore } from '@/features/auth/store/authStore'; // ⚠️ adapte ce chemin
import type { GetEvenementsPayload } from '@/features/Evènements/types/Evènement.types';

export function useEvenements(
  filtresSupplementaires?: Omit<GetEvenementsPayload, 'mentorId'>
) {
  const user = useAuthStore((state) => state.user);

  const filtres: GetEvenementsPayload & { creePar?: string } = {
    ...filtresSupplementaires,
  };

  if (user?.role === 'mentor') {
    filtres.creePar = user.id;
  } else if (user?.role === 'stagiaire') {
    filtres.mentorId = user.mentorId; // ⚠️ adapte le nom du champ si différent
  }

  return useQuery({
    queryKey: ['evenements', filtres],
    queryFn: () => getEvenements(filtres),
    enabled: user?.role !== 'stagiaire' || Boolean(user?.mentorId), // ⚠️ adapte le nom du champ si différent
  });
}

export function useEvenementDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['evenements', id],
    queryFn: () => getEvenementById(id as string),
    enabled: Boolean(id),
  });
}