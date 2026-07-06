import { z } from 'zod';

export const rapportSchema = z.object({
  titre: z.string().min(3, 'Titre trop court'),
  contenu: z.string().min(20, 'Le contenu doit faire au moins 20 caractères'),
  fichier: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'Veuillez fournir un fichier')
    .transform((files) => files[0]),
  dateDebut: z.string().min(1, 'Date de début requise'),
  dateFin: z.string().min(1, 'Date de fin requise'),
});

export type RapportFormInput = z.input<typeof rapportSchema>;
export type RapportFormValues = z.output<typeof rapportSchema>;