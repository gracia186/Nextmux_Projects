import { Mentor } from '@/features/mentors/types/mentor.types';

let mentors: Mentor[] = [
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Bob',
    email: 'mentor@test.com',
    telephone: '+229 97 11 11 11',
    specialite: 'Développement web',
    nbStagiaires: 1,
  },
];
let  nextId = 10;

export const mentorsStore = {
  getAll: (): Mentor[] => mentors,

  add: (data: Omit<Mentor, 'id' | 'nbStagiaires'>): Mentor => {
    const nouveau: Mentor = { ...data, id: nextId++, nbStagiaires: 0 };
    mentors.push(nouveau);
    return nouveau;
  },

  update: (id: number, data: Partial<Mentor>): Mentor | undefined => {
    mentors = mentors.map((m) => (m.id === id ? { ...m, ...data } : m));
    return mentors.find((m) => m.id === id);
  },

  remove: (id: number): void => {
    mentors = mentors.filter((m) => m.id !== id);
  },
};