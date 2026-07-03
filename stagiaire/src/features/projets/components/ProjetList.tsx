import { useProjets } from '../hooks/useProjets'; // récupère la liste des projets
import { useDeleteProjet } from '../hooks/useDeleteProjet'; // mutation de suppression
import type { Projet } from '../types/projet.types';
import { Link } from 'react-router-dom';

// Libellés lisibles pour chaque statut (évite d'afficher le code brut 'en_attente' à l'utilisateur)
const STATUT_LABELS: Record<Projet['statut'], string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  termine: 'Terminé',
  evalue: 'Évalué',
};

// ✅ Classes Tailwind par statut, pour un badge coloré cohérent avec le sens métier
// (attente = neutre, cours = actif/bleu, terminé = succès/vert, évalué = accompli/violet)
const STATUT_STYLES: Record<Projet['statut'], string> = {
  en_attente: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  en_cours: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  termine: 'bg-green-50 text-green-700 ring-green-600/20',
  evalue: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

export function ProjetList() {
  // Récupère les projets + états de chargement/erreur
  const { data: projetsResponse, isLoading, isError, error } = useProjets();

  // Mutation de suppression, réutilisée pour chaque bouton "Supprimer"
  const { mutate: deleteProjet, isPending: isDeleting } = useDeleteProjet();

  // Gère le clic sur "Supprimer" avec une confirmation simple
  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Supprimer ce projet ? Cette action est irréversible.');
    if (confirmed) {
      deleteProjet(id);
    }
  };

  // ✅ État de chargement : skeleton simple plutôt qu'un texte brut
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-500">
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        Chargement des projets...
      </div>
    );
  }

  // ✅ État d'erreur : encadré rouge discret
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Erreur lors du chargement des projets : {(error as Error)?.message}
      </div>
    );
  }

  const liste = projetsResponse?.data ?? []; // ✅ on extrait le vrai tableau

  // ✅ État vide : invitation à agir, pas juste un texte neutre
  if (liste.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
        <p className="text-sm font-medium text-slate-900">Aucun projet créé pour le moment</p>
        <p className="mt-1 text-sm text-slate-500">Créez votre premier projet pour commencer à l'assigner à des stagiaires.</p>
      </div>
    );
  }

  return (
    // ✅ overflow-x-auto : évite que la table casse la mise en page sur mobile
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nom
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Durée
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Stagiaires assignés
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {liste.map((projet: Projet) => (
            // ✅ hover:bg-slate-50 : feedback visuel au survol de la ligne
            <tr key={projet.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3">
                {/* Le nom du projet est un lien vers /mentor/projets/:id */}
                <Link
                  to={`/mentor/projets/${projet.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {projet.nom}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{projet.duree} jour(s)</td>
              <td className="px-4 py-3">
                {/* ✅ badge coloré selon le statut, via le dictionnaire STATUT_STYLES */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUT_STYLES[projet.statut]}`}
                >
                  {STATUT_LABELS[projet.statut]}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {projet.stagiaireIds.length} stagiaire(s)
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(projet.id)}
                  disabled={isDeleting}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}