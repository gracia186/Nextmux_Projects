import { Link } from 'react-router-dom'
import { Card, CardHeader, PageSpinner, StatCard } from '@/components/ui/DataDisplay'
import { useOverviewStats } from '@/features/stats/hooks/useStats'
import { usePendingReports } from '@/features/reports/hooks/useReports'
import { usePendingDocumentsForAdmin } from '@/features/documents/hooks/useDocuments'
import { useAuthStore } from '@/store/authStore'

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: overview, isLoading } = useOverviewStats()
  const { data: pendingReports } = usePendingReports()
  const { data: pendingDocuments } = usePendingDocumentsForAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Bonjour {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-ink-700/60">Voici l'état actuel de la plateforme NEXTMUX.</p>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        overview && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Stagiaires actifs" value={overview.active_interns} />
            <StatCard label="Stages terminés" value={overview.completed_internships} />
            <StatCard label="Rapports en attente" value={overview.pending_reports} />
            <StatCard label="Documents en attente" value={overview.pending_documents} />
            <StatCard label="Présence moyenne" value={`${overview.average_attendance_rate}%`} />
          </div>
        )
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Rapports en attente"
            action={
              <Link to="/reports" className="text-sm font-medium text-brand-600 hover:underline">
                Voir tout →
              </Link>
            }
          />
          {!pendingReports?.length ? (
            <p className="text-sm text-ink-700/50">Aucun rapport en attente.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {pendingReports.slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between text-sm">
                  <span className="text-ink-800">{r.intern?.name ?? '—'}</span>
                  <span className="text-ink-700/50">{new Date(r.period_start).toLocaleDateString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Documents à traiter"
            action={
              <Link to="/documents" className="text-sm font-medium text-brand-600 hover:underline">
                Voir tout →
              </Link>
            }
          />
          {!pendingDocuments?.length ? (
            <p className="text-sm text-ink-700/50">Aucun document à traiter.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {pendingDocuments.slice(0, 5).map((d) => (
                <li key={d.id} className="flex justify-between text-sm">
                  <span className="text-ink-800">{d.intern?.name ?? '—'}</span>
                  <span className="capitalize text-ink-700/50">{d.type}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
