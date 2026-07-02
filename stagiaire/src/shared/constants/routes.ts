// Objet qui centralise toutes les routes (URLs) de l'application.
// Cela évite d'écrire les chemins en dur ("hardcodés") partout dans le projet.
export const ROUTES = {

  // Route de la page de connexion
  login: '/login',

  // Ensemble des routes réservées à l'administrateur
  admin: {

    // Tableau de bord de l'administrateur
    dashboard: '/admin',

    // Page de gestion des utilisateurs
    users: '/admin/users',

    // Page de gestion des stagiaires
    stagiaires: '/admin/stagiaires',

    // Page de gestion des mentors
    mentors: '/admin/mentors',
  },

  // Ensemble des routes réservées au mentor
  mentor: {

    // Tableau de bord du mentor
    dashboard: '/mentor',

    // Liste des stagiaires suivis par le mentor
    stagiaires: '/mentor/stagiaires',

    // Liste des rapports à consulter ou commenter
    rapports: '/mentor/rapports',
  },

  // Ensemble des routes réservées au stagiaire
  stagiaire: {

    // Tableau de bord du stagiaire
    dashboard: '/stagiaire',

    // Page des rapports du stagiaire
    rapports: '/stagiaire/rapports',

    // Page du profil du stagiaire
    profile: '/stagiaire/profile',
  },

// "as const" indique à TypeScript que toutes les valeurs sont constantes.
// Les chemins deviennent immuables et leur type reste exact.
// Exemple : ROUTES.login est de type "/login" et non simplement string.
} as const;