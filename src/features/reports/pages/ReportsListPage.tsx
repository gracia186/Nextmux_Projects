import { useState } from 'react'
import { Card, CardHeader, EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Table, Thead, Th, Tr, Td, Pagination, Avatar } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Field'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { useReports, useValidateReport, useHideReport, useDownloadReport } from '../hooks/useReports'
import { ReportStatusBadge, ReportTypeBadge } from '../components/ReportBadges'
import { SubmitReportModal } from '../components/SubmitReportModal'
import { useAuthStore } from '@/store/authStore'
import type { Report } from '../types'

export default function ReportsListPage() {
  const role = useAuthStore((s) => s.user?.role)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useReports(page)
  const validate = useValidateReport()
  const hide = useHideReport()
  const download = useDownloadReport()

  const [submitOpen, setSubmitOpen] = useState(false)
  const [rejecting, setRejecting] = useState<Report | null>(null)
  const [comment, setComment] = useState('')
  const [hidingId, setHidingId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Rapports</h1>
          <p className="text-sm text-ink-700/60">
            {role === 'intern'
              ? 'Déposez vos rapports hebdomadaires et mensuels.'
              : role === 'mentor'
                ? 'Validez ou rejetez les rapports déposés par vos stagiaires.'
                : 'Historique de tous les rapports déposés.'}
          </p>
        </div>
        {role === 'intern' && <Button onClick={() => setSubmitOpen(true)}>+ Déposer un rapport</Button>}
      </div>

      <Card>
        <CardHeader title="Liste des rapports" />
        {isLoading ? (
          <PageSpinner />
        ) : !data?.reports.length ? (
          <EmptyState title="Aucun rapport" />
        ) : (
          <>
            <Table>
              <Thead>
                {role !== 'intern' && <Th>Stagiaire</Th>}
                <Th>Type</Th>
                <Th>Période</Th>
                <Th>Statut</Th>
                <Th />
              </Thead>
              <tbody>
                {data.reports.map((r) => (
                  <Tr key={r.id}>
                    {role !== 'intern' && (
                      <Td>
                        <div className="flex items-center gap-2">
                          <Avatar name={r.intern?.name ?? '?'} src={r.intern?.avatar_path} size="sm" />
                          {r.intern?.name ?? '—'}
                        </div>
                      </Td>
                    )}
                    <Td>
                      <ReportTypeBadge type={r.type} />
                    </Td>
                    <Td className="text-ink-700/60">
                      {new Date(r.period_start).toLocaleDateString('fr-FR')} → {new Date(r.period_end).toLocaleDateString('fr-FR')}
                    </Td>
                    <Td>
                      <ReportStatusBadge status={r.status} />
                      {r.status === 'rejected' && r.mentor_comment && (
                        <p className="mt-1 text-xs text-ink-700/50">{r.mentor_comment}</p>
                      )}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => download.mutate(r.id)}>
                          Télécharger
                        </Button>
                        {role === 'mentor' && r.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              loading={validate.isPending}
                              onClick={() => validate.mutate({ id: r.id, payload: { status: 'validated' } })}
                            >
                              Valider
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setRejecting(r)}>
                              Rejeter
                            </Button>
                          </>
                        )}
                        {role === 'intern' && r.status !== 'validated' && (
                          <Button variant="outline" size="sm" onClick={() => setHidingId(r.id)}>
                            Masquer
                          </Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination currentPage={data.meta?.current_page ?? 1} lastPage={data.meta?.last_page ?? 1} onChange={setPage} />
          </>
        )}
      </Card>

      <SubmitReportModal open={submitOpen} onClose={() => setSubmitOpen(false)} />

      <Modal open={Boolean(rejecting)} onClose={() => setRejecting(null)} title="Rejeter le rapport" size="sm">
        <div className="flex flex-col gap-4">
          <Textarea
            label="Commentaire (obligatoire en cas de rejet)"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={!comment.trim()}
              loading={validate.isPending}
              onClick={() =>
                rejecting &&
                validate.mutate(
                  { id: rejecting.id, payload: { status: 'rejected', mentor_comment: comment } },
                  {
                    onSuccess: () => {
                      setRejecting(null)
                      setComment('')
                    },
                  }
                )
              }
            >
              Rejeter
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(hidingId)}
        title="Masquer ce rapport ?"
        description="Il restera visible par votre mentor et l'administrateur, mais disparaîtra de votre historique."
        loading={hide.isPending}
        onConfirm={() => hidingId && hide.mutate(hidingId, { onSuccess: () => setHidingId(null) })}
        onClose={() => setHidingId(null)}
      />
    </div>
  )
}
