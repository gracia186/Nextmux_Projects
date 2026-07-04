import { useQuery } from '@tanstack/react-query';
import { presencesApi } from '../api/presences.api';
import { dateAujourdhui } from '../lib/presence.utils';

export const PRESENCE_JOUR_KEY = 'presence-jour';

export function usePresenceJour() {
  return useQuery({
    queryKey: [PRESENCE_JOUR_KEY],
    queryFn: () =>
      presencesApi.getPresenceJour(dateAujourdhui()).then((r) => r.data),
    refetchInterval: 60_000, // rafraîchit chaque minute (pour le timer)
  });
}