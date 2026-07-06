
import { useAuthStore } from '@/features/auth/store/authStore';
import { useProjets } from '@/features/projets/hooks/useProjets';
import { StagiaireProjetList } from '@/features/projets/components/ProjetStagiaireList';

export function StagiaireProjetsPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useProjets({ stagiaireId: String(user?.id) });

  return (
    <div>
      <h1>Mes projets assignés</h1>
      {isLoading && <p>Chargement...</p>}
      {isError && <p>Erreur lors du chargement des projets.</p>}
      {data && <StagiaireProjetList projets={data} />}
    </div>
  );
}