import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/DataDisplay'
import { Button } from '@/components/ui/Button'
import { useAttendanceHistory, useRecordAttendance } from '@/features/attendance/hooks/useAttendance'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { useAuthStore } from '@/store/authStore'

export default function InternDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: history } = useAttendanceHistory()
  const record = useRecordAttendance()
  const { data: projects } = useProjects()

  const today = new Date().toISOString().slice(0, 10)
  const todayEntry = history?.find((a) => a.date === today)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Bonjour {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-ink-700/60">Bon stage ! Voici un résumé de votre journée.</p>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-700/60">Présence du jour</p>
          <p className="mt-1 font-medium text-ink-950">
            {todayEntry ? 'Déjà enregistrée aujourd\'hui' : "Vous n'avez pas encore pointé"}
          </p>
        </div>
        {!todayEntry && (
          <Button loading={record.isPending} onClick={() => record.mutate({ status: 'present' })}>
            Marquer ma présence
          </Button>
        )}
        <Link to="/attendance" className="text-sm font-medium text-brand-600 hover:underline">
          Voir l'historique →
        </Link>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mes projets</h2>
          <Link to="/projects" className="text-sm font-medium text-brand-600 hover:underline">
            Voir tout →
          </Link>
        </div>
        {!projects?.length ? (
          <p className="text-sm text-ink-700/50">Aucun projet ne vous a encore été assigné.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="Rapports" subtitle="Déposez vos rapports hebdomadaires et mensuels." />
          <Link to="/reports">
            <Button variant="outline" size="sm">
              Gérer mes rapports
            </Button>
          </Link>
        </Card>
        <Card>
          <CardHeader title="Documents" subtitle="Demandez une attestation ou une convention." />
          <Link to="/documents">
            <Button variant="outline" size="sm">
              Gérer mes documents
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
