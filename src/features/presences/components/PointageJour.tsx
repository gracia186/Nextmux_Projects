import { usePresenceJour } from '../hooks/usePresenceJour';
import { useConfirmerArrivee } from '../hooks/useConfirmerArrivee';
import { useConfirmerDepart } from '../hooks/useConfirmerDepart';
import { formatDuree } from '../lib/presence.utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUT_CONFIG = {
  tot:        { label: 'Tôt',        className: 'bg-blue-100 text-blue-700' },
  a_l_heure:  { label: 'À l\'heure', className: 'bg-green-100 text-green-700' },
  en_retard:  { label: 'En retard',  className: 'bg-red-100 text-red-700' },
  absent:     { label: 'Absent',     className: 'bg-gray-100 text-gray-600' },
};

export function PointageJour() {
  const { data: presence, isLoading } = usePresenceJour();
  const { mutate: arrivee, isPending: arriveeLoading } = useConfirmerArrivee();
  const { mutate: depart, isPending: departLoading } = useConfirmerDepart();

  const today = format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  const statut = presence?.statut ?? 'absent';
  const statutConfig = STATUT_CONFIG[statut];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-dark-900">Pointage du jour</h2>
          <p className="text-sm text-dark-400 capitalize">{today}</p>
        </div>
        {presence?.heureArrivee && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statutConfig.className}`}>
            {statutConfig.label}
          </span>
        )}
      </div>

      {/* Grille arrivée / départ / durée */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-xs text-dark-400 mb-1">Arrivée</p>
          <p className="text-2xl font-bold text-dark-900">
            {presence?.heureArrivee ?? '—'}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-xs text-dark-400 mb-1">Départ</p>
          <p className="text-2xl font-bold text-dark-900">
            {presence?.heureDepart ?? '—'}
          </p>
        </div>

        <div className={`rounded-lg p-4 text-center ${presence?.duree ? 'bg-primary-50' : 'bg-gray-50'}`}>
          <p className="text-xs text-dark-400 mb-1">Durée</p>
          <p className={`text-2xl font-bold ${presence?.duree ? 'text-primary-700' : 'text-dark-900'}`}>
            {presence?.duree ? formatDuree(presence.duree) : '—'}
          </p>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <button
          onClick={() => arrivee()}
          disabled={!!presence?.heureArrivee || arriveeLoading}
          style = {{ background:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
          className="flex-1 rounded-lg  py-3 text-sm font-semibold text-white
                     hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          {arriveeLoading ? 'Enregistrement...' : '✅ Confirmer l\'arrivée'}
        </button>

        <button
          onClick={() => depart()}
          disabled={!presence?.heureArrivee || !!presence?.heureDepart || departLoading}
          style = {{ background:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
          className="flex-1 rounded-lg  py-3 text-sm font-semibold text-white
                     hover:bg-dark-800 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          {departLoading ? 'Enregistrement...' : '🚪 Confirmer le départ'}
        </button>
      </div>

      {/* Message d'état */}
      <p className="text-center text-xs text-dark-400 mt-3">
        {!presence?.heureArrivee && 'Vous n\'avez pas encore confirmé votre arrivée aujourd\'hui.'}
        {presence?.heureArrivee && !presence?.heureDepart && 'Arrivée enregistrée. N\'oubliez pas de confirmer votre départ.'}
        {presence?.heureArrivee && presence?.heureDepart && 'Bonne journée ! Votre présence a été enregistrée.'}
      </p>
    </div>
  );
}