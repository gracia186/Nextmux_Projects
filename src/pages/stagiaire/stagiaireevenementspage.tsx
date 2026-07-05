// src/pages/stagiaire/StagiaireEvenementsPage.tsx

import { EvenementList } from '@/features/Evènements/Components/evenementlist';

export default function StagiaireEvenementsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Événements</h1>
      <EvenementList modeGestion={false} />
    </div>
  );
}