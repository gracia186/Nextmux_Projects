import { Demande, TraiterDemandePayload, TypeDemande } from '@/features/demandes/types/demande.types';
import { stagiairesStore } from './stagiaires.mock';

// id: '1' correspond au stagiaire seedé dans stagiaires.mock.ts (mentorId: 2)
// pour que le filtrage mentor fonctionne out-of-the-box en dev
const MOCK_STAGIAIRE_ID = '1';

let demandes: Demande[] = [];

export const demandesStore = {
  getAll: (): Demande[] => demandes,

  getByStagiaireId: (stagiaireId: string): Demande[] =>
    demandes.filter((d) => d.stagiaireId === stagiaireId),

  // Mentor : attestations des stagiaires qui lui sont assignés
  getAttestationsByMentorId: (mentorId: number): Demande[] => {
    const stagiaireIdsDuMentor = stagiairesStore
      .getAll()
      .filter((s) => s.mentorId === mentorId)
      .map((s) => String(s.id));

    return demandes.filter(
      (d) => d.type === 'attestation' && stagiaireIdsDuMentor.includes(d.stagiaireId)
    );
  },

  // Admin : toutes les conventions, tous stagiaires confondus
  getConventionsPourAdmin: (): Demande[] =>
    demandes.filter((d) => d.type === 'convention'),

  add: (type: TypeDemande, stagiaireId: string = MOCK_STAGIAIRE_ID): Demande => {
    const nouvelle: Demande = {
      id: crypto.randomUUID(),
      stagiaireId,
      type,
      statut: 'en_attente',
      dateCreation: new Date().toISOString(),
    };
    demandes.push(nouvelle);
    return nouvelle;
  },

  traiter: (id: string, data: TraiterDemandePayload & { fichierNom?: string }): Demande | undefined => {
    demandes = demandes.map((d) =>
      d.id === id
        ? {
            ...d,
            statut: data.statut,
            commentaire: data.commentaire,
            fichierNom: data.fichierNom,
            dateTraitement: new Date().toISOString(),
          }
        : d
    );
    return demandes.find((d) => d.id === id);
  },
};