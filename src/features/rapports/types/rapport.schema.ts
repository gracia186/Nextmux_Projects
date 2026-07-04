import { z } from 'zod';

export const rapportSchema = z.object({
  titre: z.string().min(3, 'Titre trop court'),
  contenu: z.string().min(20, 'Le contenu doit faire au moins 20 caractères'),
  fichier: z.instanceof(File, { message: 'Veuillez fournir un fichier valide' }),
  dateDebut: z.string().min(1, 'Date de début requise'),
  dateFin: z.string().min(1, 'Date de fin requise'),
});

export type RapportFormValues = z.infer<typeof rapportSchema>;