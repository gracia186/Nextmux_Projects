import { RapportList } from '@/features/rapports/components/RapportList';
import { useAuthStore } from '@/features/auth/store/authStore';

export const MentorRapportPage = () => {
  const user = useAuthStore((state) => state.user);
  return <RapportList mentorId={user?.id} />;
};
