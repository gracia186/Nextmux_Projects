import { useParams } from 'react-router-dom'; // pour lire le paramètre :id de l'URL
import { ProjetDetail } from '@/features/projets/components/ProjetDetail';

export function MentorProjetDetailPage() {
  // useParams retourne les paramètres dynamiques définis dans router.tsx (ici :id)
  const { id } = useParams<{ id: string }>();

  // Garde-fou : si l'URL est malformée et qu'aucun id n'est présent
  if (!id) {
    return <p role="alert">Identifiant de projet manquant dans l'URL.</p>;
  }

  return <ProjetDetail projetId={id} />;
}