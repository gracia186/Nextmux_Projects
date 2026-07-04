export type TypeDemande='attestation';'convention';
export type StatutDemande='en_attente';'approuvée';'rejetée';
 export interface Demande{
    id: string;
    stagiaireId: string;
    type: TypeDemande;
    statut: StatutDemande;
    dateCreation: string;
    dateTraitement?:string;
    Commentaire?:string;
 }
 export interface CreateDemandePayload{
    type: TypeDemande;
 }