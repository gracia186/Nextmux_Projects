import { Card, CardHeader, PageSpinner, StatCard } from '@/components/ui/DataDisplay'
import { BreakdownBar } from '../components/BreakdownBar'
import { useAttendanceStats, useDocumentStats, useOverviewStats, useReportStats } from '../hooks/useStats'

export default function StatsPage() {
  const { data: overview, isLoading: loadingOverview } = useOverviewStats()
  const { data: attendance } = useAttendanceStats()
  const { data: reports } = useReportStats()
  const { data: documents } = useDocumentStats()

  if (loadingOverview) return <PageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Statistiques globales</h1>
        <p className="text-sm text-ink-700/60">Vue d'ensemble du programme de stage NEXTMUX.</p>
      </div>

      {overview && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="Stagiaires actifs" value={overview.active_interns} />
          <StatCard label="Stages terminés" value={overview.completed_internships} />
          <StatCard label="Rapports en attente" value={overview.pending_reports} />
          <StatCard label="Documents en attente" value={overview.pending_documents} />
          <StatCard label="Taux de présence moyen" value={`${overview.average_attendance_rate}%`} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {attendance && (
          <Card>
            <CardHeader title="Présences" subtitle={`${attendance.total} enregistrements`} />
            <BreakdownBar
              items={[
                { label: 'Présent', value: attendance.present_rate, color: '#2FAE81' },
                { label: 'Absent', value: attendance.absent_rate, color: '#dc2626' },
                { label: 'En retard', value: attendance.late_rate, color: '#D6883A' },
              ]}
            />
          </Card>
        )}

        {reports && (
          <Card>
            <CardHeader title="Rapports" subtitle={`${reports.total} au total`} />
            <BreakdownBar
              items={[
                { label: 'Validés', value: reports.validated, color: '#2FAE81' },
                { label: 'En attente', value: reports.pending, color: '#D6883A' },
                { label: 'Rejetés', value: reports.rejected, color: '#dc2626' },
              ]}
            />
          </Card>
        )}

        {documents && (
          <Card>
            <CardHeader title="Documents" subtitle={`${documents.total} au total`} />
            <BreakdownBar
              items={[
                { label: 'Terminés', value: documents.completed, color: '#2FAE81' },
                { label: 'En attente', value: documents.pending, color: '#D6883A' },
                { label: 'Approuvés (mentor)', value: documents.mentor_approved, color: '#3D63E0' },
                { label: 'Rejetés (mentor)', value: documents.mentor_rejected, color: '#dc2626' },
                { label: 'Rejetés (admin)', value: documents.admin_rejected, color: '#991b1b' },
              ]}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
