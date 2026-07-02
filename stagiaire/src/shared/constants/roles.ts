 // On définit un type "Role" qui représente les rôles possibles dans l'application
 // Seules ces 3 valeurs sont autorisées
export type Role = 'admin' | 'mentor' | 'stagiaire';


// On définit les permissions associées à chaque rôle
// as const = rend les valeurs strictes et immuables (readonly)
// satisfies Record<Role, string[]> = vérifie que chaque rôle a bien un tableau de permissions
export const PERMISSIONS = {
  admin: [
    'manage_users',          // gérer les utilisateurs
    'manage_mentors',        // gérer les mentors
    'view_all_stagiaires',   // voir tous les stagiaires
    'validate_rapports'      // valider les rapports
  ],

  mentor: [
    'view_own_stagiaires',   // voir ses stagiaires
    'evaluate_stagiaire',    // évaluer un stagiaire
    'comment_rapport'        // commenter un rapport
  ],

  stagiaire: [
    'submit_rapport',        // soumettre un rapport
    'view_own_progress'      // voir son propre progrès
  ],
} as const satisfies Record<Role, string[]>;


// Fonction utilitaire pour vérifier si un rôle possède une permission donnée
export function hasPermission(role: Role, permission: string): boolean {

  // On récupère les permissions du rôle et on vérifie si la permission existe dedans
  return (PERMISSIONS[role] as readonly string[]).includes(permission);
}