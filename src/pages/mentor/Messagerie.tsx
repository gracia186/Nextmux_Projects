import { useEffect, useState } from 'react';
import { mentorApi } from '../../lib/endpoints';
import { MessagerieView } from '../../components/messaging/MessagerieView';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function MentorMessagerie() {
  useDashboardHeader('Messagerie', 'Échangez avec vos stagiaires');
  const [contacts, setContacts] = useState<{ id: number; name: string; sub?: string }[]>([]);

  useEffect(() => {
    mentorApi.stagiaires({ per_page: 100 }).then((res) => {
      setContacts(res.data.data.map((s) => ({ id: s.user_id, name: s.user?.name ?? '—', sub: s.sujet_stage ?? undefined })));
    });
  }, []);

  return <MessagerieView api={mentorApi} contacts={contacts} />;
}
