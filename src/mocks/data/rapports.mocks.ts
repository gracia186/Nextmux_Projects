import { Rapport } from '@/features/rapports/types/rapport.types';

let rapports: Rapport[] = [
  {
    id: 1,
    stagiaireId: 3,
    titre: 'Rapport - Semaine 1',
    contenu: 'Première semaine de stage : prise en main des outils, présentation de l\'équipe et découverte des processus internes.',
    dateDebut: '2026-01-15',
    dateFin: '2026-01-22',
    statut: 'valide',
    createdAt: '2026-01-23T10:00:00Z',
  },
  {
    id: 2,
    stagiaireId: 3,
    titre: 'Rapport - Semaine 2',
    contenu: 'Début du développement du module de gestion des utilisateurs. Travail sur les maquettes UI.',
    dateDebut: '2026-01-23',
    dateFin: '2026-01-30',
    statut: 'en_attente',
    createdAt: '2026-01-31T08:30:00Z',
  },
];

let nextId = 10;

export const rapportsStore = {
  getAll: (): Rapport[] => rapports,

  getByStagiaireId: (stagiaireId: number): Rapport[] =>
    rapports.filter((r) => r.stagiaireId === stagiaireId),

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

  remove: (id: number): void => {
    rapports = rapports.filter((r) => r.id !== id);
  },
};