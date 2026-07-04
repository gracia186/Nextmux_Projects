// Import du client Axios configuré avec les cookies Sanctum
import {apiClient} from '@/shared/lib/apiClient';
// Import du type User
import { User } from '@/features/auth/types/auth.types';

// Type pour la création d'un utilisateur (sans ID, généré côté serveur)
export type CreateUserDto = Omit<User, 'id'> & { password: string };
// Type pour la modification (tous les champs optionnels sauf ID)
export type UpdateUserDto = Partial<CreateUserDto>;

// Objet centralisant tous les appels API liés aux utilisateurs
export const usersApi = {
  // Récupère la liste paginée des utilisateurs
  getAll: (page = 1) =>
    apiClient.get<{ data: User[]; meta: { total: number } }>('/users', { params: { page } }),

  // Crée un nouvel utilisateur
  create: (data: CreateUserDto) =>
    apiClient.post<User>('/users', data),

  // Met à jour un utilisateur existant par son ID
  update: (id: number, data: UpdateUserDto) =>
    apiClient.put<User>(`/users/${id}`, data),

  // Supprime un utilisateur par son ID
  remove: (id: number) =>
    apiClient.delete(`/users/${id}`),
};