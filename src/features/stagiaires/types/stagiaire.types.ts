export interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateDebut: string;
  dateFin: string;
  statut: 'en_cours' | 'termine' | 'abandonne';
  mentorId: number | null;
  mentorNom?: string;
  mentorPrenom?: string;
}

export interface CreateStagiaireDto {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateDebut: string;
  dateFin: string;
  mentorId?: number | null;
}

export interface UpdateStagiaireDto extends Partial<CreateStagiaireDto> {
  statut?: Stagiaire['statut'];
}