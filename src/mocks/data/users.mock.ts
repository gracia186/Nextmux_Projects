import { User } from '@/features/auth/types/auth.types';

export const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'password',
    nom: 'Dupont',
    prenom: 'Alice',
    role: 'admin',
  },
  {
    id: 2,
    email: 'mentor@test.com',
    password: 'password',
    nom: 'Martin',
    prenom: 'Bob',
    role: 'mentor',
  },
  {
    id: 3,
    email: 'stagiaire@test.com',
    password: 'password',
    nom: 'Bernard',
    prenom: 'Claire',
    role: 'stagiaire',
  },
];