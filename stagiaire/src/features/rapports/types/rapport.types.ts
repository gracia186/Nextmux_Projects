export interface Rapport {
  id: number;
  stagiaireId: number;
  titre: string;
  contenu: string;
  fichier?: File;
  dateDebut: string;
  dateFin: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  commentaireMentor?: string;
  note?: number; // note attribuée par le mentor lors de l'évaluation (ex: /20)
  createdAt: string;
}

export interface CreateRapportDto {
  titre: string;
  contenu: string;
  fichier: File;
  dateDebut: string;
  dateFin: string;
}

// Payload envoyé par le mentor pour évaluer un rapport
export interface EvaluerRapportDto {
  statut: 'valide' | 'rejete';
  commentaireMentor: string;
  note: number;
}