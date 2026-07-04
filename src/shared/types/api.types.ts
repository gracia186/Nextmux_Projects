// Interface générique pour gérer les réponses paginées de l'API
// T = type générique (ex: User, Stagiaire, etc.)
export interface PaginatedResponse<T> {

  // Liste des données retournées par l'API
  data: T[];

  // Métadonnées de pagination (informations sur les pages)
  meta: {

    // Page actuellement affichée
    current_page: number;

    // Dernière page disponible
    last_page: number;

    // Nombre total d'éléments dans la base de données
    total: number;

    // Nombre d'éléments par page
    per_page: number;
  };
}

// Interface pour gérer les erreurs de validation Laravel (backend PHP)
export interface LaravelValidationError {

  // Message général de l'erreur (ex: "The given data was invalid.")
  message: string;

  // Détails des erreurs par champ
  // Exemple:
  // {
  //   email: ["Email is required"],
  //   password: ["Password must be at least 6 characters"]
  // }
  errors: Record<string, string[]>;
}