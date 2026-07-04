import { PointageJour } from '@/features/presences/components/PointageJour';
import { HistoriquePresences } from '@/features/presences/components/HistoriquePresences';

export function StagiairePresencePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Mes présences</h1>
        <p className="text-sm text-dark-500 mt-1">
          Heure officielle d'arrivée : <span className="font-semibold text-dark-700">09h00</span>
        </p>
      </div>

      <PointageJour />
      <HistoriquePresences />
    </div>
  );
}