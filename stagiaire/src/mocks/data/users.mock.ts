// Import du type User depuis les types d'auth
import { User } from '@/features/auth/types/auth.types';

// Type étendu avec le mot de passe pour le mock (jamais exposé côté client réel)
export type UserWithPassword = User & { password: string };

// Liste initiale des utilisateurs avec leurs mots de passe mockés
let users: UserWithPassword[] = [
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

// Compteur pour générer des IDs uniques aux nouveaux utilisateurs
let nextId = 10;

// Store en mémoire pour les opérations CRUD sur les utilisateurs
export const usersStore = {
  // Retourne tous les utilisateurs sans le mot de passe (sécurité)
  getAll: (): User[] =>
    users.map(({ password, ...u }) => u),

  // Recherche un utilisateur par email (utilisé par le handler de login)
  findByEmail: (email: string): UserWithPassword | undefined =>
    users.find((u) => u.email === email),
  // Recherche un utilisateur par son ID (utilisé par le handler GET /user)
  findById: (id: number): UserWithPassword | undefined =>
  users.find((u) => u.id === id),
  // Ajoute un nouvel utilisateur et retourne l'objet sans mot de passe
  add: (data: Omit<UserWithPassword, 'id'>): User => {
    // Génération d'un ID unique incrémental
    const nouveau: UserWithPassword = { ...data, id: nextId++ };
    // Ajout au tableau en mémoire
    users.push(nouveau);
    // Retour sans le mot de passe
    const { password, ...u } = nouveau;
    return u;
  },

  // Met à jour un utilisateur existant par son ID
  update: (id: number, data: Partial<UserWithPassword>): User | undefined => {
    // Remplacement de l'utilisateur correspondant dans le tableau
    users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    // Recherche de l'utilisateur mis à jour
    const updated = users.find((u) => u.id === id);
    // Retour sans le mot de passe ou undefined si non trouvé
    if (!updated) return undefined;
    const { password, ...u } = updated;
    return u;
  },

  // Supprime un utilisateur par son ID
  remove: (id: number): void => {
    users = users.filter((u) => u.id !== id);
  },
};