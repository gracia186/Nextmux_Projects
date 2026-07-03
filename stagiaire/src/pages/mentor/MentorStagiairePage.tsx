import {StagiaireList} from '@/features/stagiaires/components/StagiaireList';
import { useAuthStore } from '@/features/auth/store/authStore';

export const MentorStagiairePage = () => {
  const user = useAuthStore((state) => state.user);
  return <StagiaireList mentorId={user?.id} />;
};