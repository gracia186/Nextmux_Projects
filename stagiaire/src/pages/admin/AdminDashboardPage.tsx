// Import du store Zustand pour afficher le prénom de l'utilisateur connecté
//import { useAuthStore } from '@/features/auth/store/authStore';
// Import des hooks pour récupérer les vraies données depuis les mock stores
import { useStagiaires } from '@/features/stagiaires/hooks/useStagiaires';
import { useMentors } from '@/features/mentors/hooks/useMentors';

// Déclaration et export du composant AdminDashboardPage
export function AdminDashboardPage() {
  // Lecture de l'utilisateur connecté depuis le store Zustand
  //const user = useAuthStore((state) => state.user);

  // Récupération de la liste des stagiaires via TanStack Query
  const { data: stagiairesData } = useStagiaires();
  // Récupération de la liste des mentors via TanStack Query
  const { data: mentorsData } = useMentors();

 // Nombre total de stagiaires depuis meta.total
const totalStagiaires = stagiairesData?.meta.total ?? '—';
// Nombre total de mentors depuis meta.total
const totalMentors = mentorsData?.meta.total ?? '—';

  return (
    // Conteneur de la page avec padding intérieur
    <div className="p-8">

      {/* ── En-tête de bienvenue ── */}
      {/* Titre avec le prénom de l'utilisateur connecté */}
      
      

      {/* ── Grille des cartes statistiques ── */}
      {/* 1 colonne sur mobile, 2 sur md, 4 sur lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Carte Stagiaires — valeur réelle depuis useStagiaires */}
        <StatCard
          label="Stagiaires"
          value={String(totalStagiaires)}
          // Barre de couleur bleue à gauche
          borderColor="#3b82f6"
          valueColor="#3b82f6"
        />

        {/* Carte Mentors — valeur réelle depuis useMentors */}
        <StatCard
          label="Mentors"
          value={String(totalMentors)}
          // Barre de couleur verte à gauche
          borderColor="#10b981"
          valueColor="#10b981"
        />

        {/* Carte Rapports — feature pas encore développée, affiche "—" */}
        <StatCard
          label="Rapports en attente"
          value="—"
          // Barre de couleur ambre à gauche
          borderColor="#f59e0b"
          valueColor="#f59e0b"
        />

        {/* Carte Évaluations — feature pas encore développée, affiche "—" */}
        <StatCard
          label="Évaluations"
          value="—"
          // Barre de couleur violet à gauche
          borderColor="#8b5cf6"
          valueColor="#8b5cf6"
        />

      </div>
    </div>
  );
}

// ── Composant StatCard ──
// Props : label affiché, valeur, couleur de la barre gauche et du chiffre
function StatCard({
  label,
  value,
  borderColor,
  valueColor,
}: {
  label: string;      // libellé de la carte
  value: string;      // valeur à afficher (nombre ou "—")
  borderColor: string; // couleur de la bordure gauche
  valueColor: string;  // couleur du chiffre
}) {
  return (
    // Carte blanche avec ombre légère, coins arrondis, bordure colorée à gauche via style inline
    <div
      className="bg-white rounded-xl p-5 shadow-sm"
      style={{ borderLeft: `4px solid ${borderColor}` }} // couleur dynamique impossible en Tailwind pur
    >
      {/* Libellé de la statistique, petit et gris */}
      <p className="text-xs font-medium text-dark-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      {/* Valeur principale, grande et colorée */}
      <p className="text-3xl font-bold" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}