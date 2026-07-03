import { useState } from 'react';
import { usePresences } from '../hooks/usePresences';
import { formatDuree } from '../lib/presence.utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUT_CONFIG = {
  tot:        { label: 'Tôt',        className: 'bg-blue-100 text-blue-700' },
  a_l_heure:  { label: 'À l\'heure', className: 'bg-green-100 text-green-700' },
  en_retard:  { label: 'En retard',  className: 'bg-red-100 text-red-700' },
  absent:     { label: 'Absent',     className: 'bg-gray-100 text-gray-500' },
};

export function HistoriquePresences() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePresences(page);

  if (isLoading) return <p className="text-dark-500 text-sm">Chargement...</p>;
  if (isError) return <p className="text-red-500 text-sm">Erreur lors du chargement.</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-dark-900">Historique des présences</h2>
        <p className="text-sm text-dark-400 mt-0.5">{data?.meta.total ?? 0} jour(s) enregistré(s)</p>
      </div>

      {data?.data.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-dark-400 text-sm">Aucun historique disponible.</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Date', 'Arrivée', 'Départ', 'Durée', 'Statut'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-dark-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.data.map((p) => {
              const statut = STATUT_CONFIG[p.statut];
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-dark-900 capitalize">
                    {format(new Date(p.date), 'EEE dd MMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-700">
                    {p.heureArrivee ?? <span className="text-dark-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-700">
                    {p.heureDepart ?? <span className="text-dark-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-700">
                    {p.duree ? formatDuree(p.duree) : <span className="text-dark-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statut.className}`}>
                      {statut.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-100">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm text-dark-600 disabled:opacity-40 hover:text-primary-600 transition-colors"
          >
            ← Précédent
          </button>
          <span className="text-sm text-dark-400">
            Page {page} / {data.meta.last_page}
          </span>
          <button
            disabled={page === data.meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-dark-600 disabled:opacity-40 hover:text-primary-600 transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}