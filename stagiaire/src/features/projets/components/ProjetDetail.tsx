import { useProjet } from '../hooks/useProjet'; // récupère le détail d'un projet précis
import { useStagiaires } from '@/features/stagiaires/hooks/useStagiaires'; // pour résoudre les noms des stagiaires assignés
import type { Stagiaire } from '@/features/stagiaires/types/stagiaire.types';

// Libellés lisibles pour les statuts (même dictionnaire que dans ProjetList)
const STATUT_LABELS = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  termine: 'Terminé',
  evalue: 'Évalué',
} as const;

// Props : l'id du projet à afficher, passé depuis la page via useParams
interface ProjetDetailProps {
  projetId: string;
}

export function ProjetDetail({ projetId }: ProjetDetailProps) {
  // Récupère le projet ciblé (isLoading/isError gérés séparément du fetch des stagiaires)
  const { data: projet, isLoading, isError, error } = useProjet(projetId);

  // Récupère la liste des stagiaires pour pouvoir résoudre les noms à partir des ids assignés
  const { data: stagiairesResponse } = useStagiaires();

  // État de chargement du projet
  if (isLoading) {
    return <p>Chargement du projet...</p>;
  }

  // État d'erreur (ex: projet introuvable, erreur réseau)
  if (isError) {
    return <p role="alert">Erreur : {error.message}</p>;
  }

  // Garde-fou : si le hook n'a rien retourné (ne devrait pas arriver si isLoading/isError sont bien gérés)
  if (!projet) {
    return <p>Projet introuvable.</p>;
  }

  // Résout les ids de stagiaires assignés en objets Stagiaire complets (pour afficher leurs noms)
  // .filter(Boolean) élimine les ids qui ne correspondraient à aucun stagiaire trouvé (sécurité)
  const stagiairesAssignes: Stagiaire[] = projet.stagiaireIds
    .map((id) => stagiairesResponse?.data.find((s) => String(s.id) === id))
    .filter((s): s is Stagiaire => Boolean(s)); // type guard : élimine les undefined et informe TS que le résultat est Stagiaire[]

  return (
    <div>
      <h1>{projet.nom}</h1>

      {/* Statut affiché sous forme de badge/texte lisible */}
      <p>
        <strong>Statut :</strong> {STATUT_LABELS[projet.statut]}
      </p>

      <p>
        <strong>Durée :</strong> {projet.duree} jour(s)
      </p>

      <section>
        <h2>Tâche à réaliser</h2>
        <p>{projet.tache}</p>
      </section>

      <section>
        <h2>Livrable attendu</h2>
        <p>{projet.livrableAttendu}</p>
      </section>

      <section>
        <h2>Stagiaires assignés ({stagiairesAssignes.length})</h2>
        {/* Liste vide si aucun stagiaire n'a pu être résolu (ex: pagination trop courte) */}
        {stagiairesAssignes.length === 0 ? (
          <p>Aucun stagiaire assigné.</p>
        ) : (
          <ul>
            {stagiairesAssignes.map((stagiaire) => (
              <li key={stagiaire.id}>{stagiaire.nom}</li>
            ))}
          </ul>
        )}
      </section>

      <p>
        <small>
          Créé le {new Date(projet.createdAt).toLocaleDateString('fr-FR')}
        </small>
      </p>
    </div>
  );
}