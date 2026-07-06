export type TypeDemande = 'attestation' | 'convention';
export type StatutDemande = 'en_attente' | 'approuvée' | 'rejetée';

export interface Demande {
  id: string;
  stagiaireId: string;
  type: TypeDemande;
  statut: StatutDemande;
  dateCreation: string;
  dateTraitement?: string;
  commentaire?: string;
  fichierNom?: string; // nom du fichier de réponse (attestation/convention) uploadé par mentor/admin
}

export interface CreateDemandePayload {
  type: TypeDemande;
}

// Payload envoyé par le mentor (attestation) ou l'admin (convention) pour traiter une demande
export interface TraiterDemandePayload {
  statut: 'approuvée' | 'rejetée';
  commentaire?: string;
  fichier?: File;
}