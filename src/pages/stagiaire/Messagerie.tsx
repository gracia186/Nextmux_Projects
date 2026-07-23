import { useMemo } from 'react';
import { stagiaireApi } from '../../lib/endpoints';
import { useAuth } from '../../context/AuthContext';
import { MessagerieView } from '../../components/messaging/MessagerieView';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function StagiaireMessagerie() {
  useDashboardHeader('Messagerie', 'Échangez avec votre mentor');
  const { user } = useAuth();

  const contacts = useMemo(() => {
    const mentorUser = user?.stagiaire?.mentor?.user;
    return mentorUser ? [{ id: mentorUser.id, name: mentorUser.name, sub: 'Votre mentor' }] : [];
  }, [user]);

  return <MessagerieView api={stagiaireApi} contacts={contacts} />;
}
