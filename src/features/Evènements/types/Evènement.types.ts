// src/features/events/types/event.types.ts

export type TypeEvenement = 'atelier' | 'présentation';

export type StatutEvenement = 'à venir' | 'en cours' | 'terminé';

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  statut: StatutEvenement;
  creePar: string;
}

export interface CreateEvenementPayload {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  statut: StatutEvenement;
}

export interface UpdateEvenementPayload {
  id: string;
  titre?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  lieu?: string;
  statut?: StatutEvenement;
}

export interface DeleteEvenementPayload {
  id: string;
}

export interface GetEvenementByIdPayload {
  id: string;
}

export interface GetEvenementsPayload {
  statut?: StatutEvenement;
  dateDebut?: string;
  dateFin?: string;
  adminId?: string;
  page?: number;
  perPage?: number;
}

export interface EvenementResponse {
  evenement: Evenement;
}

// Métadonnées de pagination — noms alignés sur la convention camelCase du projet
export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface EvenementslistResponse {
  evenements: Evenement[];
  meta: PaginationMeta;
}