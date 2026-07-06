// src/features/events/api/events.api.ts

import { apiClient } from '@/shared/lib/apiClient';
import type {
  Evenement,
  EvenementResponse,
  EvenementslistResponse,
  CreateEvenementPayload,
  UpdateEvenementPayload,
  GetEvenementsPayload,
} from '../types/Evènement.types';

const BASE_URL = '/evenements';

export async function getEvenements(
  filtres?: GetEvenementsPayload & { creePar?: string; page?: number; perPage?: number }
): Promise<EvenementslistResponse> {
  const params = new URLSearchParams();
  if (filtres?.adminId) params.append('adminId', filtres.adminId);
  if (filtres?.creePar) params.append('creePar', filtres.creePar);
  if (filtres?.statut) params.append('statut', filtres.statut);
  if (filtres?.dateDebut) params.append('dateDebut', filtres.dateDebut);
  if (filtres?.dateFin) params.append('dateFin', filtres.dateFin);
  if (filtres?.page) params.append('page', String(filtres.page));
  if (filtres?.perPage) params.append('perPage', String(filtres.perPage));

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  const { data } = await apiClient.get<EvenementslistResponse>(url);
  return data; // on retourne tout l'objet, pas juste .evenements, pour garder la pagination
}

export async function getEvenementById(id: string): Promise<Evenement> {
  const { data } = await apiClient.get<EvenementResponse>(`${BASE_URL}/${id}`);
  return data.evenement;
}

export async function createEvenement(
  payload: CreateEvenementPayload
): Promise<Evenement> {
  const { data } = await apiClient.post<EvenementResponse>(BASE_URL, payload);
  return data.evenement;
}

export async function updateEvenement(
  payload: UpdateEvenementPayload
): Promise<Evenement> {
  const { id, ...body } = payload;
  const { data } = await apiClient.patch<EvenementResponse>(`${BASE_URL}/${id}`, body);
  return data.evenement;
}

export async function deleteEvenement(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}