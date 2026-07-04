// On importe la bibliothèque Zod.
// Zod permet de valider les données (formulaires, API, etc.) et de définir des schémas.
import { z } from "zod";

// Création du schéma de validation du formulaire de connexion.
export const loginSchema = z.object({

  // Le champ email :
  // - doit être une chaîne de caractères (string)
  // - doit respecter le format d'une adresse email
  // Si ce n'est pas le cas, le message "Email invalide" sera retourné.
  email: z.string().email("Email invalide"),

  // Le champ password :
  // - doit être une chaîne de caractères
  // - doit contenir au moins 1 caractère
  // Si le champ est vide, le message sera affiché.
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Création automatique d'un type TypeScript à partir du schéma Zod.
// Ainsi, on n'a pas besoin d'écrire une interface manuellement.
export type LoginFormValues = z.infer<typeof loginSchema>;