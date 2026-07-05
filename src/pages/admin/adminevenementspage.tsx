// src/pages/admin/AdminEvenementsPage.tsx

import { EvenementList } from '@/features/Evènements/Components/evenementlist';

export default function AdminEvenementsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Tous les événements</h1>
      <EvenementList modeGestion={false} />
    </div>
  );
}