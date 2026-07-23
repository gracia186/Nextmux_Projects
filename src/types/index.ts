export type Role = 'admin' | 'mentor' | 'stagiaire';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  is_active: boolean;
  stagiaire?: Stagiaire;
  mentor?: Mentor;
}

export interface Entreprise {
  id: number;
  nom: string;
  secteur?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rayon_metres?: number;
  stagiaires_count?: number;
  mentors_count?: number;
  departements_count?: number;
}

export interface Departement {
  id: number;
  nom: string;
  entreprise_id: number;
  entreprise?: Entreprise;
  description?: string | null;
  stagiaires_count?: number;
}

export interface Mentor {
  id: number;
  user_id: number;
  user?: User;
  entreprise?: Entreprise;
  departement?: Departement;
  specialite?: string | null;
  fonction?: string | null;
  stagiaires_count?: number;
  stagiaires?: Stagiaire[];
}

export interface Stagiaire {
  id: number;
  user_id: number;
  user?: User;
  entreprise?: Entreprise;
  departement?: Departement;
  mentor?: Mentor;
  ecole?: string | null;
  filiere?: string | null;
  niveau?: string | null;
  date_debut?: string | null;
  date_fin?: string | null;
  statut: 'actif' | 'termine' | 'suspendu';
  sujet_stage?: string | null;
  competences?: string[] | null;
}

export interface Presence {
  id: number;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  date: string;
  heure_arrivee?: string | null;
  heure_depart?: string | null;
  statut: 'present' | 'absent' | 'retard' | 'conge';
  commentaire?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  adresse?: string | null;
  appareil?: string | null;
  distance_metres?: number | null;
}

export interface Tache {
  id: number;
  projet_id: number;
  titre: string;
  description?: string | null;
  statut: 'a_faire' | 'en_cours' | 'termine';
  priorite: 'basse' | 'moyenne' | 'haute';
  deadline?: string | null;
  assigned_to?: number | null;
  evaluation_note?: number | null;
  evaluation_commentaire?: string | null;
}

export interface Projet {
  id: number;
  titre: string;
  description?: string | null;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  mentor_id?: number | null;
  date_debut?: string | null;
  date_fin?: string | null;
  statut: 'a_faire' | 'en_cours' | 'termine' | 'en_retard';
  progression: number;
  taches?: Tache[];
}

export interface Rapport {
  id: number;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  titre: string;
  contenu?: string | null;
  fichier?: string | null;
  type: string;
  date_soumission?: string | null;
  statut: 'brouillon' | 'soumis' | 'valide' | 'rejete';
  feedback?: string | null;
}

export interface DocumentStagiaire {
  id: number;
  stagiaire_id: number;
  nom: string;
  type?: string | null;
  fichier: string;
  taille?: number | null;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender?: User;
  receiver?: User;
  contenu: string;
  lu: boolean;
  created_at: string;
}

export interface DemandeDocument {
  id: number;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  type: 'convention' | 'attestation';
  statut: 'en_attente' | 'validee' | 'rejetee' | 'delivree';
  commentaire_mentor?: string | null;
  fichier?: string | null;
  created_at: string;
}

export interface AvisStage {
  id: number;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  mentor_id: number;
  mentor?: Mentor;
  note_globale: number;
  points_forts?: string | null;
  points_amelioration?: string | null;
  commentaire?: string | null;
  recommande: boolean;
  created_at: string;
}

export interface Publication {
  id: number;
  auteur_id: number;
  auteur?: User;
  titre: string;
  contenu: string;
  audience: 'stagiaires' | 'mentors' | 'tous';
  created_at: string;
}

export interface Soutenance {
  id: number;
  stagiaire_id: number;
  stagiaire?: Stagiaire;
  date_soutenance: string;
  lieu?: string | null;
  jury?: string | null;
  note?: number | null;
  statut: 'planifiee' | 'realisee' | 'annulee';
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
