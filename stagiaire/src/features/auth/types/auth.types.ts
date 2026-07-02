import { Role } from '@/shared/constants/roles';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}