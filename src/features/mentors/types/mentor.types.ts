export interface Mentor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  nbStagiaires: number; // calculé côté backend (nombre de stagiaires assignés)
}

export interface CreateMentorDto {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
}

export type UpdateMentorDto = Partial<CreateMentorDto>;