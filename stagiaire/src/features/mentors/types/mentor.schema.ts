import { z } from 'zod';

export const mentorSchema = z.object({
  nom: z.string().min(2, 'Minimum 2 caractères'),
  prenom: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  specialite: z.string().min(2, 'Spécialité requise'),
});

export type MentorFormValues = z.infer<typeof mentorSchema>;