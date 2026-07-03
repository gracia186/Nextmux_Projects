import { z } from 'zod';

// Schéma de validation pour la création d'un projet par un mentor
// Reflète les règles métier : champs obligatoires, durée positive, au moins un stagiaire
export const createProjetSchema = z.object({
  // le nom du projet ne peut pas être vide
  nom: z
    .string()
    .min(1, 'Le nom du projet est requis')
    .max(150, 'Le nom ne doit pas dépasser 150 caractères'),

  // la durée est exprimée en jours, doit être un entier positif
  duree: z
    .number({ error: 'La durée doit être un nombre' })
    .int('La durée doit être un nombre entier')
    .positive('La durée doit être supérieure à 0'),

  // description de la tâche à réaliser, obligatoire
  tache: z
    .string()
    .min(10, 'La description de la tâche doit contenir au moins 10 caractères'),

  // description du livrable attendu, obligatoire
  livrableAttendu: z
    .string()
    .min(5, 'Le livrable attendu doit contenir au moins 5 caractères'),

  // id du mentor créateur (généralement injecté depuis le user connecté, pas depuis un champ de formulaire)
  mentorId: z.string().min(1, 'Le mentor créateur est requis'),

  // liste des stagiaires assignés : au moins un stagiaire obligatoire
  stagiaireIds: z
    .array(z.string())
    .min(1, 'Vous devez assigner au moins un stagiaire'),
});

// Type TypeScript dérivé automatiquement du schéma Zod
// Garantit que le type et la validation ne divergent jamais
export type CreateProjetFormValues = z.infer<typeof createProjetSchema>;

// Schéma de mise à jour : tous les champs deviennent optionnels via .partial()
// On y ajoute le statut, qui n'a de sens qu'en update (pas en création)
export const updateProjetSchema = createProjetSchema.partial().extend({
  statut: z
    .enum(['en_attente', 'en_cours', 'termine', 'evalue'])
    .optional(),
});

export type UpdateProjetFormValues = z.infer<typeof updateProjetSchema>;

// Schéma dédié uniquement à la réassignation de stagiaires (formulaire séparé possible)
export const assignStagiairesSchema = z.object({
  stagiaireIds: z
    .array(z.string())
    .min(1, 'Vous devez assigner au moins un stagiaire'),
});

export type AssignStagiairesFormValues = z.infer<typeof assignStagiairesSchema>;