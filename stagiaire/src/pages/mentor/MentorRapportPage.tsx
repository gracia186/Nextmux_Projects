import { useAuthStore } from '@/features/auth/store/authStore'; // ⚠️ ajuste le chemin selon ton vrai store
import { MentorRapportList } from '@/features/rapports/components/MentorRapportList';

export function MentorRapportsPage() {
  const mentorId = useAuthStore((state) => state.user?.id);

  if (!mentorId) {
    return <p>Chargement de vos informations...</p>;
  }

  return (
    <div>
      <MentorRapportList mentorId={Number(mentorId)} />
    </div>
  );
}