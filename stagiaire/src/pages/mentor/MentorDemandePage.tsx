import { useAuthStore } from '@/features/auth/store/authStore'; // ⚠️ ajuste selon ton store réel
import { useMentorDemandes } from '@/features/demandes/hooks/useMentorDemande';
import { DemandeList } from '@/features/demandes/components/DemandeList';

export function MentorDemandePage() {
  const mentorId = useAuthStore((state) => state.user?.id);
  const { demandes, loading, error, traitementEnCours, traiterDemande } = useMentorDemandes(
    Number(mentorId)
  );

  if (!mentorId) {
    return <p>Chargement de vos informations...</p>;
  }

  return (
    <DemandeList
      titre="Demandes d'attestation"
      demandes={demandes}
      loading={loading}
      error={error}
      traitementEnCours={traitementEnCours}
      onTraiter={traiterDemande}
    />
  );
}