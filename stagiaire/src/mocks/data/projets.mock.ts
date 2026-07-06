import { Projet, ProjetStatut } from '@/features/projets/types/projet.types';

let projets: Projet[] = [
  {
    id: '1',
    nom: 'Refonte site vitrine',
    dateCreation: '2026-01-20',
    duree: 14,
    tache: 'Refondre la page d’accueil en React',
    livrableAttendu: 'Lien vers le dépôt GitHub + démo déployée',
    statut: 'en_cours',
    mentorId: '2',
    stagiaireIds: ['1', '3'],
    createdAt: '2026-01-20T09:00:00.000Z',
  },
  {
    id: '2',
    nom: 'API de gestion des présences',
    dateCreation: '2026-02-01',
    duree: 21,
    tache: 'Concevoir et implémenter une API REST pour les présences',
    livrableAttendu: 'Documentation API + collection Postman',
    statut: 'en_attente',
    mentorId: '3',
    stagiaireIds: [],
    createdAt: '2026-02-01T09:00:00.000Z',
  },
];

let nextId = 10;

export const projetsStore = {
  getAll: (): Projet[] => projets,

  getById: (id: string): Projet | undefined => projets.find((p) => p.id === id),

  add: (
    data: Omit<Projet, 'id' | 'dateCreation' | 'createdAt' | 'statut'>
  ): Projet => {
    const now = new Date().toISOString();
    const nouveau: Projet = {
      ...data,
      id: String(nextId++),
      dateCreation: now,
      createdAt: now,
      statut: 'en_attente',
    };
    projets.push(nouveau);
    return nouveau;
  },

  update: (id: string, data: Partial<Projet>): Projet | undefined => {
    projets = projets.map((p) => (p.id === id ? { ...p, ...data } : p));
    return projets.find((p) => p.id === id);
  },

  remove: (id: string): void => {
    projets = projets.filter((p) => p.id !== id);
  },

  assignStagiaires: (id: string, stagiaireIds: string[]): Projet | undefined => {
    projets = projets.map((p) =>
      p.id === id ? { ...p, stagiaireIds } : p
    );
    return projets.find((p) => p.id === id);
  },

  updateStatut: (id: string, statut: ProjetStatut): Projet | undefined => {
    projets = projets.map((p) => (p.id === id ? { ...p, statut } : p));
    return projets.find((p) => p.id === id);
  },
};