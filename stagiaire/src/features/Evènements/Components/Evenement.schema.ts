// src/features/events/schemas/evenement.schema.ts

import { z } from 'zod';

export const evenementSchema = z
  .object({
    titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
    lieu: z.string().min(2, 'Le lieu est requis'),
    dateDebut: z.string().min(1, 'La date de début est requise'),
    dateFin: z.string().min(1, 'La date de fin est requise'),
    statut: z.enum(['à venir', 'en cours', 'terminé']),
  })
  .refine((data) => new Date(data.dateFin) > new Date(data.dateDebut), {
    message: 'La date de fin doit être après la date de début',
    path: ['dateFin'],
  });

export type EvenementFormValues = z.infer<typeof evenementSchema>;