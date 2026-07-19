import { Link } from 'react-router-dom'
import { Card, CardHeader, PageSpinner } from '@/components/ui/DataDisplay'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { usePendingReports } from '@/features/reports/hooks/useReports'
import { usePendingDocumentsForMentor } from '@/features/documents/hooks/useDocuments'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { useAuthStore } from '@/store/authStore'

export default function MentorDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: projects, isLoading } = useProjects()
  const { data: pendingReports } = usePendingReports()
  const { data: pendingDocuments } = usePendingDocumentsForMentor()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Bonjour {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-ink-700/60">Voici ce qui demande votre attention aujourd'hui.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Rapports à valider"
            action={
              <Link to="/reports" className="text-sm font-medium text-brand-600 hover:underline">
                Voir tout →
              </Link>
            }
          />
          {!pendingReports?.length ? (
            <p className="text-sm text-ink-700/50">Rien à valider pour le moment.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {pendingReports.slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between text-sm">
                  <span className="text-ink-800">{r.intern?.name ?? '—'}</span>
                  <span className="capitalize text-ink-700/50">{r.type}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Documents à valider"
            action={
              <Link to="/documents" className="text-sm font-medium text-brand-600 hover:underline">
                Voir tout →
              </Link>
            }
          />
          {!pendingDocuments?.length ? (
            <p className="text-sm text-ink-700/50">Rien à valider pour le moment.</p>
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

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Vos projets</h2>
          <Link to="/projects" className="text-sm font-medium text-brand-600 hover:underline">
            Voir tout →
          </Link>
        </div>
        {isLoading ? (
          <PageSpinner />
        ) : !projects?.length ? (
          <p className="text-sm text-ink-700/50">Vous n'avez pas encore créé de projet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
