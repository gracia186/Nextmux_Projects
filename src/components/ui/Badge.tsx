import clsx from 'clsx';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const STATUT_MAP: Record<string, { label: string; tone: BadgeTone }> = {
  actif: { label: 'Actif', tone: 'success' },
  termine: { label: 'Terminé', tone: 'info' },
  suspendu: { label: 'Suspendu', tone: 'danger' },
  present: { label: 'Présent', tone: 'success' },
  absent: { label: 'Absent', tone: 'danger' },
  retard: { label: 'Retard', tone: 'warning' },
  conge: { label: 'Congé', tone: 'neutral' },
  a_faire: { label: 'À faire', tone: 'neutral' },
  en_cours: { label: 'En cours', tone: 'info' },
  en_retard: { label: 'En retard', tone: 'danger' },
  brouillon: { label: 'Brouillon', tone: 'neutral' },
  soumis: { label: 'Soumis', tone: 'warning' },
  valide: { label: 'Validé', tone: 'success' },
  rejete: { label: 'Rejeté', tone: 'danger' },
  basse: { label: 'Basse', tone: 'neutral' },
  moyenne: { label: 'Moyenne', tone: 'warning' },
  haute: { label: 'Haute', tone: 'danger' },
};

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return <span className={clsx('badge', `badge-${tone}`)}>{children}</span>;
}

/** Badge automatique à partir d'une valeur de statut connue du backend. */
export function StatutBadge({ statut }: { statut: string }) {
  const meta = STATUT_MAP[statut] ?? { label: statut, tone: 'neutral' as BadgeTone };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
