import { apiClient } from '@/shared/lib/apiClient';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Stagiaire, CreateStagiaireDto, UpdateStagiaireDto } from '../types/stagiaire.types';

export const stagiairesApi = {
  getAll: (page = 1,mentorId?:number) =>
    apiClient.get<PaginatedResponse<Stagiaire>>('/stagiaires', { params: { page ,mentorId} }),

  getById: (id: number) =>
    apiClient.get<Stagiaire>(`/stagiaires/${id}`),

  create: (data: CreateStagiaireDto) =>
    apiClient.post<Stagiaire>('/stagiaires', data),

  update: (id: number, data: UpdateStagiaireDto) =>
    apiClient.put<Stagiaire>(`/stagiaires/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/stagiaires/${id}`),
  assignMentor: (stagiaireId: number, mentorId: number | null) =>
    apiClient.patch<Stagiaire>(`/stagiaires/${stagiaireId}/assign-mentor`, { mentorId }),
};
