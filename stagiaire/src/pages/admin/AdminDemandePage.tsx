import { useAdminDemandes } from '@/features/demandes/hooks/useAdminDemande';
import { DemandeList } from '@/features/demandes/components/DemandeList';

export function AdminDemandesPage() {
  const { demandes, loading, error, traitementEnCours, traiterDemande } = useAdminDemandes();

  return (
    <DemandeList
      titre="Demandes de convention"
      demandes={demandes}
      loading={loading}
      error={error}
      traitementEnCours={traitementEnCours}
      onTraiter={traiterDemande}
    />
  );
}