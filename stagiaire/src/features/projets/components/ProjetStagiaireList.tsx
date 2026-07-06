import type { Projet } from '../types/projet.types';

const STATUT_LABELS: Record<Projet['statut'], string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  termine: 'Terminé',
  evalue: 'Évalué',
};

const STATUT_STYLES: Record<Projet['statut'], string> = {
  en_attente: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  en_cours: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  termine: 'bg-green-50 text-green-700 ring-green-600/20',
  evalue: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

interface StagiaireProjetListProps {
  projets: Projet[];
}

export function StagiaireProjetList({ projets }: StagiaireProjetListProps) {
  if (projets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
        <p className="text-sm font-medium text-slate-900">Aucun projet assigné pour le moment</p>
        <p className="mt-1 text-sm text-slate-500">
          Votre mentor vous assignera un projet prochainement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projets.map((projet) => (
        <div
          key={projet.id}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-slate-900">{projet.nom}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUT_STYLES[projet.statut]}`}
                >
                  {STATUT_LABELS[projet.statut]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{projet.duree} jour(s)</p>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Tâche</p>
                <p className="mt-0.5 text-sm text-slate-700">{projet.tache}</p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Livrable attendu
                </p>
                <p className="mt-0.5 text-sm text-slate-700">{projet.livrableAttendu}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}