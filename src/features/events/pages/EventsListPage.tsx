import { useState } from 'react'
import { Card, EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Badge } from '@/components/ui/DataDisplay'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { useEvents, useDeleteEvent } from '../hooks/useEvents'
import { PublishEventModal } from '../components/PublishEventModal'
import { useAuthStore } from '@/store/authStore'

const audienceLabels: Record<string, string> = { all: 'Tout le monde', interns: 'Stagiaires', mentors: 'Mentors' }

export default function EventsListPage() {
  const { data, isLoading } = useEvents()
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')
  const deleteEvent = useDeleteEvent()
  const [publishOpen, setPublishOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Annonces &amp; événements</h1>
          <p className="text-sm text-ink-700/60">Actualités et communications de NEXTMUX.</p>
        </div>
        {isAdmin && <Button onClick={() => setPublishOpen(true)}>+ Publier une annonce</Button>}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data?.events.length ? (
        <EmptyState title="Aucune annonce publiée" />
      ) : (
        <div className="flex flex-col gap-4">
          {data.events.map((event) => (
            <Card key={event.id} className={event.is_pinned ? 'border-clay-500/30 bg-clay-50/30' : undefined}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {event.is_pinned && <Badge tone="warning">Épinglé</Badge>}
                    <Badge tone="neutral">{audienceLabels[event.audience] ?? event.audience}</Badge>
                  </div>
                  <h3 className="mt-2 font-semibold text-ink-950">{event.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-ink-700/70">{event.content}</p>
                  <p className="mt-3 text-xs text-ink-700/40">
                    {event.author?.name ? `Par ${event.author.name} — ` : ''}
                    {event.published_at ? new Date(event.published_at).toLocaleDateString('fr-FR') : ''}
                  </p>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => setDeletingId(event.id)}>
                    Supprimer
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <PublishEventModal open={publishOpen} onClose={() => setPublishOpen(false)} />

      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Supprimer cette annonce ?"
        destructive
        loading={deleteEvent.isPending}
        onConfirm={() => deletingId && deleteEvent.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}
