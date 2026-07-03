// Statut global du projet (cycle de vie)
export type ProjetStatut = 'en_attente' | 'en_cours' | 'termine' | 'evalue';

// Un projet créé par un mentor
export interface Projet {
  id: string; // identifiant unique du projet
  nom: string; // nom du projet
  dateCreation: string; // date de création (ISO string)
  duree: number; // durée en jours
  tache: string; // description de la tâche à réaliser
  livrableAttendu: string; // description de ce qui est attendu comme livrable
  statut: ProjetStatut; // statut courant du projet (ajouté : manquait dans la version initiale)
  mentorId: string; // id du mentor créateur
  stagiaireIds: string[]; // liste des stagiaires assignés (plusieurs possibles)
  createdAt: string; // horodatage de création
}

// La soumission d'un stagiaire pour un projet donné
// Un stagiaire = une soumission par projet (relation 1-1 pour un couple projet/stagiaire)
export interface ProjetSubmission {
  id: string; // identifiant unique de la soumission
  projetId: string; // référence vers le projet
  stagiaireId: string; // référence vers le stagiaire qui soumet
  lienLivrable: string; // URL du livrable (GitHub, Drive, etc.)
  commentaire?: string; // commentaire optionnel du stagiaire
  dateSoumission: string; // date de soumission (ISO string)
}

// L'évaluation du mentor sur la soumission d'un stagiaire
export interface ProjetEvaluation {
  id: string; // identifiant unique de l'évaluation
  projetId: string; // référence vers le projet
  stagiaireId: string; // référence vers le stagiaire évalué
  note: number; // note attribuée (ex: /20)
  commentaire: string; // commentaire du mentor
  evaluateurId: string; // id du mentor qui évalue
  dateEvaluation: string; // date de l'évaluation (ISO string)
}

// Payload envoyé à l'API pour créer un projet
// (on omet les champs générés côté serveur : id, dateCreation, createdAt, statut)
export interface CreateProjetPayload {
  nom: string;
  duree: number;
  tache: string;
  livrableAttendu: string;
  mentorId: string;
  stagiaireIds: string[]; // permet d'assigner dès la création
}

// Payload envoyé à l'API pour mettre à jour un projet existant
// Partial : tous les champs sont optionnels (mise à jour partielle)
export interface UpdateProjetPayload extends Partial<CreateProjetPayload> {
  statut?: ProjetStatut; // permet de changer le statut lors d'une update
}

// Payload dédié à l'assignation de stagiaires à un projet existant
// (utile pour un endpoint séparé du type PATCH /projets/:id/assign)
export interface AssignStagiairesPayload {
  projetId: string; // le projet cible
  stagiaireIds: number[]; // la nouvelle liste complète des stagiaires assignés
}