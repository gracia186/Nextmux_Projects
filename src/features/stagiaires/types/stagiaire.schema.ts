import { z } from 'zod';

export const stagiaireSchema = z.object({
  nom: z.string().min(2, 'Minimum 2 caractères'),
  prenom: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  dateDebut: z.string().min(1, 'Date de début requise'),
  dateFin: z.string().min(1, 'Date de fin requise'),
  mentorId: z.number().nullable().optional(),
});

export type StagiaireFormValues = z.infer<typeof stagiaireSchema>;