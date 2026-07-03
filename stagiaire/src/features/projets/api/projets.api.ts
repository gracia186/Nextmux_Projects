import { apiClient } from '@/shared/lib/apiClient'; // client axios centralisé (baseURL, intercepteurs, token, etc.)
import type {
  Projet,
  CreateProjetPayload,
  UpdateProjetPayload,
  AssignStagiairesPayload,
} from '../types/projet.types';
import type { PaginatedResponse } from '@/shared/types/api.types'; // ✅ import ajouté

// Préfixe commun de toutes les routes projet (facilite un renommage global si besoin)
const BASE_URL = '/projets';

// GET /projets — récupère la liste paginée de tous les projets
// ✅ retourne maintenant PaginatedResponse<Projet> pour matcher la vraie forme de l'API/du handler MSW
export const getProjets = async (): Promise<PaginatedResponse<Projet>> => {
  const response = await apiClient.get<PaginatedResponse<Projet>>(BASE_URL);
  return response.data;
};

// GET /projets/:id — récupère le détail d'un projet précis
export const getProjetById = async (id: string): Promise<Projet> => {
  const response = await apiClient.get<Projet>(`${BASE_URL}/${id}`);
  return response.data;
};

// POST /projets — création d'un projet par un mentor
export const createProjet = async (
  payload: CreateProjetPayload
): Promise<Projet> => {
  const response = await apiClient.post<Projet>(BASE_URL, payload);
  return response.data;
};

// PATCH /projets/:id — mise à jour partielle d'un projet existant
export const updateProjet = async (
  id: string,
  payload: UpdateProjetPayload
): Promise<Projet> => {
  const response = await apiClient.patch<Projet>(`${BASE_URL}/${id}`, payload);
  return response.data;
};

// DELETE /projets/:id — suppression d'un projet
export const deleteProjet = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

// PATCH /projets/:id/assign-stagiaires — endpoint dédié pour (ré)assigner des stagiaires
// ✅ chemin corrigé : ton handler MSW écoute sur "/assign-stagiaires", pas "/assign"
export const assignStagiairesToProjet = async (
  payload: AssignStagiairesPayload
): Promise<Projet> => {
  const response = await apiClient.patch<Projet>(
    `${BASE_URL}/${payload.projetId}/assign-stagiaires`,
    { stagiaireIds: payload.stagiaireIds }
  );
  return response.data;
};