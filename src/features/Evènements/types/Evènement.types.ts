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
  // userId du mentor créateur de l'événement
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
  // Filtre par mentor : utilisé côté stagiaire pour ne récupérer que
  // les événements créés par SON mentor assigné (pas tous les mentors).
  mentorId?: string;
}

export interface EvenementResponse {
  evenement: Evenement;
}

export interface EvenementslistResponse {
  evenements: Evenement[];
}