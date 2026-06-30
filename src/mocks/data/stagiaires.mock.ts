import { Stagiaire } from '@/features/stagiaires/types/stagiaire.types';
import { mentorsStore } from './mentors.mock';

let stagiaires: Stagiaire[] = [
  {
    id: 1,
    nom: 'Koffi',
    prenom: 'Jean',
    email: 'jean.koffi@email.com',
    telephone: '+229 97 00 00 01',
    dateDebut: '2026-01-15',
    dateFin: '2026-07-15',
    statut: 'en_cours',
    mentorId: 2,
    mentorPrenom: 'Bob',
    mentorNom: 'Martin',
  },
  {
    id: 2,
    nom: 'Sossa',
    prenom: 'Marie',
    email: 'marie.sossa@email.com',
    telephone: '+229 97 00 00 02',
    dateDebut: '2025-10-01',
    dateFin: '2026-04-01',
    statut: 'termine',
    mentorId: null,
  },
];

let nextId = 10;

export const stagiairesStore = {
  getAll: (): Stagiaire[] => stagiaires,

  add: (data: Omit<Stagiaire, 'id' | 'statut'>): Stagiaire => {
    const nouveau: Stagiaire = { ...data, id: nextId++, statut: 'en_cours' };
    stagiaires.push(nouveau);
    return nouveau;
  },

  update: (id: number, data: Partial<Stagiaire>): Stagiaire | undefined => {
    stagiaires = stagiaires.map((s) => {
      if (s.id !== id) return s;
      const merged = { ...s, ...data };

      if ('mentorId' in data) {
        const mentor = data.mentorId
          ? mentorsStore.getAll().find((m) => m.id === data.mentorId)
          : null;
        merged.mentorPrenom = mentor?.prenom;
        merged.mentorNom = mentor?.nom;
      }

      return merged;
    });
    return stagiaires.find((s) => s.id === id);
  },

  remove: (id: number): void => {
    stagiaires = stagiaires.filter((s) => s.id !== id);
  },
};