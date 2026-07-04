import { Mentor } from '@/features/mentors/types/mentor.types';
import { stagiairesStore } from './stagiaires.mock';

type MentorSansCompteur = Omit<Mentor, 'nbStagiaires'>;

let mentors: MentorSansCompteur[] = [
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Bob',
    email: 'mentor@test.com',
    telephone: '+229 97 11 11 11',
    specialite: 'Développement web',
  },
];
let nextId = 10;

function withNbStagiaires(m: MentorSansCompteur): Mentor {
  const nb = stagiairesStore.getAll().filter((s) => s.mentorId === m.id).length;
  return { ...m, nbStagiaires: nb };
}

export const mentorsStore = {
  getAll: (): Mentor[] => mentors.map(withNbStagiaires),

  add: (data: Omit<Mentor, 'id' | 'nbStagiaires'>): Mentor => {
    const nouveau: MentorSansCompteur = { ...data, id: nextId++ };
    mentors.push(nouveau);
    return withNbStagiaires(nouveau);
  },

  update: (id: number, data: Partial<Mentor>): Mentor | undefined => {
    const { nbStagiaires, ...rest } = data; // ignoré : jamais stocké, toujours recalculé
    mentors = mentors.map((m) => (m.id === id ? { ...m, ...rest } : m));
    const updated = mentors.find((m) => m.id === id);
    return updated ? withNbStagiaires(updated) : undefined;
  },

  remove: (id: number): void => {
    mentors = mentors.filter((m) => m.id !== id);
  },
};