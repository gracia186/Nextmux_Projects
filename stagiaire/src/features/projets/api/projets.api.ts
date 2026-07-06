import { apiClient } from '@/shared/lib/apiClient';
import type {
  Projet,
  CreateProjetPayload,
  UpdateProjetPayload,
  AssignStagiairesPayload,
} from '../types/projet.types';
import type { PaginatedResponse } from '@/shared/types/api.types';

const BASE_URL = '/projets';

interface ProjetsFilter {
  mentorId?: string;
  stagiaireId?: string;
}

// GET /projets?mentorId=...&stagiaireId=... — récupère la liste paginée des projets,
// filtrée par mentor ou par stagiaire selon ce qui est fourni (sinon tous les projets)
export const getProjets = async (
  filter?: ProjetsFilter
): Promise<PaginatedResponse<Projet>> => {
  const response = await apiClient.get<PaginatedResponse<Projet>>(BASE_URL, {
    params: filter,
  });
  return response.data;
};

export const getProjetById = async (id: string): Promise<Projet> => {
  const response = await apiClient.get<Projet>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createProjet = async (
  payload: CreateProjetPayload
): Promise<Projet> => {
  const response = await apiClient.post<Projet>(BASE_URL, payload);
  return response.data;
};

export const updateProjet = async (
  id: string,
  payload: UpdateProjetPayload
): Promise<Projet> => {
  const response = await apiClient.put<Projet>(`${BASE_URL}/${id}`, payload);
  return response.data;
};

export const deleteProjet = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

export const assignStagiairesToProjet = async (
  payload: AssignStagiairesPayload
): Promise<Projet> => {
  const response = await apiClient.patch<Projet>(
    `${BASE_URL}/${payload.projetId}/assign-stagiaires`,
    { stagiaireIds: payload.stagiaireIds }
  );
  return response.data;
};