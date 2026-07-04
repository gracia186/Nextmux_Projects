import { useDemandes } from '@/features/demandes/hooks/useDemandes';
import { DemandeCard } from '@/features/demandes/components/DemandeCard';
import { NouvelleDemandeForm } from  '@/features/demandes/components/NouvelleDemandeForm';

export function DemandesPage() {
  const { demandes, loading, error, submitting, creerDemande, dejaEnvoyee } = useDemandes();

  if (loading) return <p>Chargement des demandes...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Mes demandes</h1>

      {error && <p className="text-red-600">{error}</p>}

      <NouvelleDemandeForm
        dejaEnvoyee={dejaEnvoyee}
        onDemander={creerDemande}
        submitting={submitting}
      />

      <div className="space-y-3">
        {demandes.length === 0 ? (
          <p className="text-gray-500">Aucune demande envoyée pour le moment.</p>
        ) : (
          demandes.map((d) => <DemandeCard key={d.id} demande={d} />)
        )}
      </div>
    </div>
  );
}