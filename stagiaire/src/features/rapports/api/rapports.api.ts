import { apiClient } from '@/shared/lib/apiClient';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Rapport, CreateRapportDto, EvaluerRapportDto } from '../types/rapport.types';

export const rapportsApi = {
  // Stagiaire : récupère uniquement ses propres rapports (filtré côté serveur/mock)
  getMesRapports: (page = 1) =>
    apiClient.get<PaginatedResponse<Rapport>>('/rapports/mes-rapports', {
      params: { page },
    }),

  // Mentor : récupère uniquement les rapports des stagiaires qui lui sont assignés
  getMentorRapports: (mentorId: number, page = 1) =>
    apiClient.get<PaginatedResponse<Rapport>>('/rapports/mentor-rapports', {
      params: { page, mentorId },
    }),

  create: (data: CreateRapportDto) => apiClient.post<Rapport>('/rapports', data),

  // Mentor : évalue un rapport (statut + commentaire + note)
  evaluer: (id: number, data: EvaluerRapportDto) =>
    apiClient.patch<Rapport>(`/rapports/${id}/evaluer`, data),

  delete: (id: number) => apiClient.delete(`/rapports/${id}`),
};