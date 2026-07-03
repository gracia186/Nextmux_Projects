import { apiClient } from '@/shared/lib/apiClient';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Presence } from '../types/presence.types';

export const presencesApi = {
  getMesPresences: (page = 1) =>
    apiClient.get<PaginatedResponse<Presence>>('/presences/mes-presences', { params: { page } }),

  getPresenceJour: (date: string) =>
    apiClient.get<Presence | null>(`/presences/aujourd-hui`, { params: { date } }),

  confirmerArrivee: () =>
    apiClient.post<Presence>('/presences/arrivee'),

  confirmerDepart: () =>
    apiClient.patch<Presence>('/presences/depart'),
};