import { Rapport, EvaluerRapportDto } from '@/features/rapports/types/rapport.types';
import { stagiairesStore } from './stagiaires.mock';

let rapports: Rapport[] = [
  {
    id: 1,
    stagiaireId: 2,
    titre: 'Rapport - Semaine 1',
    contenu: 'Première semaine de stage : prise en main des outils, présentation de l\'équipe et découverte des processus internes.',
    dateDebut: '2026-01-15',
    dateFin: '2026-01-22',
    statut: 'valide',
    fichier: new File(['Contenu du rapport'], 'rapport_semaine_1.pdf', { type: 'application/pdf' }),
    createdAt: '2026-01-23T10:00:00Z',
  },
  {
    id: 2,
    stagiaireId: 4,
    titre: 'Rapport - Semaine 2',
    contenu: 'Début du développement du module de gestion des utilisateurs. Travail sur les maquettes UI.',
    dateDebut: '2026-01-23',
    dateFin: '2026-01-30',
    statut: 'en_attente',
    fichier: new File(['Contenu du rapport'], 'rapport_semaine_2.pdf', { type: 'application/pdf' }),
    createdAt: '2026-01-31T08:30:00Z',
  },
];

let nextId = 10;

export const rapportsStore = {
  getAll: (): Rapport[] => rapports,

  getByStagiaireId: (stagiaireId: number): Rapport[] =>
    rapports.filter((r) => r.stagiaireId === stagiaireId),

  // Filtre les rapports en croisant avec stagiairesStore : ne garde que les
  // rapports des stagiaires dont le mentorId correspond au mentor donné.
  getByMentorId: (mentorId: number): Rapport[] => {
    const stagiaireIdsDuMentor = stagiairesStore
      .getAll()
      .filter((s) => s.mentorId === mentorId)
      .map((s) => s.id);

    return rapports.filter((r) => stagiaireIdsDuMentor.includes(r.stagiaireId));
  },

  add: (data: Omit<Rapport, 'id' | 'statut' | 'createdAt'> & { stagiaireId: number }): Rapport => {
    const nouveau: Rapport = {
      ...data,
      id: nextId++,
      statut: 'en_attente',
      createdAt: new Date().toISOString(),
    };
    rapports.push(nouveau);
    return nouveau;
  },

  // Évaluation par le mentor : statut (valide/rejete) + commentaire + note
  evaluer: (id: number, data: EvaluerRapportDto): Rapport | undefined => {
    rapports = rapports.map((r) => (r.id === id ? { ...r, ...data } : r));
    return rapports.find((r) => r.id === id);
  },

  remove: (id: number): void => {
    rapports = rapports.filter((r) => r.id !== id);
  },
};