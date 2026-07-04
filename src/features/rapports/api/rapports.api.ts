import { apiClient } from '@/shared/lib/apiClient';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Rapport, CreateRapportDto } from '../types/rapport.types';

export const rapportsApi = {
  // stagiaire récupère uniquement ses propres rapports
  getMesRapports: (page = 1, MentorId?: number) =>
    apiClient.get<PaginatedResponse<Rapport>>('/rapports/mes-rapports', { params: { page, MentorId } }),

  create: (data: CreateRapportDto) =>
    apiClient.post<Rapport>('/rapports', data),

  delete: (id: number) =>
    apiClient.delete(`/rapports/${id}`),
};