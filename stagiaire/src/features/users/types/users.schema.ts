import {z} from "zod";

// Schéma Zod pour la validation du formulaire utilisateur
const userSchema = z.object({
  // Prénom obligatoire
  prenom: z.string().min(1, 'Le prénom est requis'),
  // Nom obligatoire
  nom: z.string().min(1, 'Le nom est requis'),
  // Email valide obligatoire
  email: z.string().email('Email invalide'),
  // Rôle limité aux 3 valeurs possibles
  role: z.enum(['admin', 'mentor', 'stagiaire']),
  // Mot de passe minimum 6 caractères
  password: z.string().min(6, 'Minimum 6 caractères'),
});

// Type inféré depuis le schéma Zod
export type UserFormValues = z.infer<typeof userSchema>;