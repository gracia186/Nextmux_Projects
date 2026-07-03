export interface Rapport {
  id: number;
  stagiaireId: number;
  titre: string;
  contenu: string;
  fichier?:File;
  dateDebut: string;
  dateFin: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  commentaireMentor?: string;
  createdAt: string;
}

export interface CreateRapportDto {
  titre: string;
  contenu: string;
  fichier: File;
  dateDebut: string;
  dateFin: string;
}
