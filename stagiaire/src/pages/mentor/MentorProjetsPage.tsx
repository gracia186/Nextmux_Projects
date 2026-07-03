import { useState } from 'react'; // pour gérer l'affichage/masquage du formulaire de création
import { ProjetForm } from '@/features/projets/components/ProjetForm';
import { ProjetList } from '@/features/projets/components/ProjetList';
import { useAuthStore } from '@/features/auth/store/authStore'; // ⚠️ ajuste ce chemin/nom selon ton store Zustand réel d'authentification

export function MentorProjetsPage() {
  // Contrôle l'affichage du formulaire de création (masqué par défaut pour ne pas surcharger la page)
  const [showForm, setShowForm] = useState(false);

  // Récupère le mentor connecté depuis le store d'auth pour pré-remplir mentorId dans le formulaire
  // ⚠️ adapte le nom du champ (user.id) selon la vraie forme de ton store
  const mentorId = useAuthStore((state) => state.user?.id);

  // Si jamais le store n'a pas encore chargé l'utilisateur, on évite de rendre le formulaire avec un id vide
  if (!mentorId) {
    return <p>Chargement de vos informations...</p>;
  }

  return (
    <div>
      <h1>Mes projets</h1>

      {/* Bouton qui bascule l'affichage du formulaire de création */}
      <button type="button" onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? 'Annuler' : 'Créer un nouveau projet'}
      </button>

      {/* Formulaire affiché uniquement si showForm est true */}
      {showForm && (
        <ProjetForm
          mentorId={String(mentorId)} // conversion en string si mentorId est un number côté store
          onSubmit={() => setShowForm(false)} // referme le formulaire après création réussie
        />
      )}

      {/* Liste des projets déjà créés par ce mentor */}
      <ProjetList />
    </div>
  );
}