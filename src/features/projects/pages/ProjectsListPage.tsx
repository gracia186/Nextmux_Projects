import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Button } from '@/components/ui/Button'
import { ProjectCard } from '../components/ProjectCard'
import { CreateProjectModal } from '../components/CreateProjectModal'
import { useAuthStore } from '@/store/authStore'

export default function ProjectsListPage() {
  const { data: projects, isLoading } = useProjects()
  const role = useAuthStore((s) => s.user?.role)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Projets</h1>
          <p className="text-sm text-ink-700/60">
            {role === 'intern' ? 'Les projets auxquels vous participez.' : 'Vos projets et leur avancement.'}
          </p>
        </div>
        {role === 'mentor' && <Button onClick={() => setCreateOpen(true)}>+ Nouveau projet</Button>}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !projects?.length ? (
        <EmptyState title="Aucun projet" description={role === 'mentor' ? 'Créez votre premier projet.' : 'Aucun projet ne vous a encore été assigné.'} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
