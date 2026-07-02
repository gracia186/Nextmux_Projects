// Import useEffect pour gérer la redirection automatique si déjà connecté
import { useEffect } from 'react';
// Import useNavigate pour rediriger vers le bon dashboard selon le rôle
import { useNavigate } from 'react-router-dom';
// Import du composant formulaire de connexion
import { LoginForm } from '@/features/auth/components/LoginForm';
// Import du store Zustand pour lire l'état d'authentification
import { useAuthStore } from '@/features/auth/store/authStore';
// Import des constantes de routes
import { ROUTES } from '@/shared/constants/routes';
// Import de l'image de couverture depuis les assets
import loginBanner from '@/assets/images/login-banner.jpeg';

// Déclaration et export du composant LoginPage
export function LoginPage() {
  // Lecture de l'état d'auth : utilisateur connecté, état de chargement
  const { isAuthenticated, user, isLoading } = useAuthStore();
  // Hook de navigation pour les redirections programmatiques
  const navigate = useNavigate();

  // Redirection automatique si l'utilisateur est déjà connecté
  useEffect(() => {
    // On attend que le chargement soit terminé avant de rediriger
    if (!isLoading && isAuthenticated && user) {
      // Redirection vers le dashboard correspondant au rôle
      if (user.role === 'admin') navigate(ROUTES.admin.dashboard, { replace: true });
      if (user.role === 'mentor') navigate(ROUTES.mentor.dashboard, { replace: true });
      if (user.role === 'stagiaire') navigate(ROUTES.stagiaire.dashboard, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Affichage d'un spinner pendant la vérification initiale de l'auth
  if (isLoading) {
    return (
      // Conteneur plein écran centré
      <div className="flex min-h-screen items-center justify-center bg-dark-100">
        {/* Spinner animé en couleur primary */}
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // Conteneur global : flex horizontal, plein écran
    <div className="flex min-h-screen">

      {/* ── Panneau gauche : image de couverture ── */}
      {/* Masqué sur mobile, visible à partir de lg, occupe la moitié gauche */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Image qui couvre toute la hauteur du panneau sans déformation */}
        <img
          src={loginBanner}
          alt="Gestion des stagiaires"
          className="h-full w-full object-cover"
        />
        {/* Overlay noir semi-transparent pour assombrir l'image et faire ressortir le texte */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        />
        {/* Texte positionné en bas à gauche par-dessus l'overlay */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          {/* Titre principal en grands caractères gras */}
          <h2 className="text-4xl font-bold leading-tight">
            Plateforme de gestion<br />des stagiaires
          </h2>
          {/* Sous-titre descriptif légèrement atténué */}
          <p className="mt-3 text-gray-300 text-base">
            Suivez, encadrez et évaluez vos stagiaires en un seul endroit.
          </p>
        </div>
      </div>

      {/* ── Panneau droit : formulaire de connexion ── */}
      {/* Fond gris très clair pour contraster avec la carte blanche */}
      {/* Centrage horizontal et vertical du contenu */}
      <div
        className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12"
        style={{ backgroundColor: '#f1f5f9' }}
      >
        {/* Carte blanche avec ombre douce et coins arrondis */}
        <div
          className="w-full bg-white rounded-[18px]"
          style={{
            maxWidth: '450px',          // largeur fixe comme dans ton CSS
            padding: '45px',            // padding généreux pour l'espace intérieur
            boxShadow: '0 20px 60px rgba(54, 80, 99, 0.15), 0 4px 16px rgba(0,0,0,0.06)', // ombre douce visible sur fond gris
          }}
        >
          {/* Titre de bienvenue, centré, noir */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Bienvenue
          </h1>
          {/* Sous-titre descriptif centré, couleur atténuée */}
          <p className="text-sm text-gray-500 text-center mb-8">
            Connectez-vous pour accéder à votre espace
          </p>

          {/* Composant formulaire (email + password + bouton) */}
          <LoginForm />
        </div>
      </div>

    </div>
  );
}