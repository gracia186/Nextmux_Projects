import { useState } from 'react'
import { Card, CardHeader, EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Table, Thead, Th, Tr, Td } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useAttendanceHistory, useRecordAttendance, useRecordDeparture } from '../hooks/useAttendance'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'

function formatTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function InternAttendancePage() {
  const { data: history, isLoading } = useAttendanceHistory()
  const record = useRecordAttendance()
  const recordDeparture = useRecordDeparture()
  const [absentModalOpen, setAbsentModalOpen] = useState(false)
  const [note, setNote] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const todayEntry = history?.find((a) => a.date === today)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Ma présence</h1>
        <p className="text-sm text-ink-700/60">Marquez votre arrivée et votre départ chaque jour de stage.</p>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-700/60">Aujourd'hui — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          {todayEntry ? (
            <div className="mt-2 flex items-center gap-3">
              <AttendanceStatusBadge status={todayEntry.status} />
              <span className="text-sm text-ink-700/60">Arrivée : {formatTime(todayEntry.arrival_time)}</span>
              {todayEntry.departure_time && (
                <span className="text-sm text-ink-700/60">Départ : {formatTime(todayEntry.departure_time)}</span>
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-ink-700/50">Vous n'avez pas encore pointé aujourd'hui.</p>
          )}
        </div>
        <div className="flex gap-2">
          {!todayEntry && (
            <>
              <Button loading={record.isPending} onClick={() => record.mutate({ status: 'present' })}>
                Marquer ma présence
              </Button>
              <Button variant="outline" onClick={() => setAbsentModalOpen(true)}>
                Signaler une absence
              </Button>
            </>
          )}
          {todayEntry && !todayEntry.departure_time && todayEntry.status !== 'absent' && (
            <Button loading={recordDeparture.isPending} onClick={() => recordDeparture.mutate(todayEntry.id)}>
              Signaler mon départ
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Historique" />
        {isLoading ? (
          <PageSpinner />
        ) : !history?.length ? (
          <EmptyState title="Aucune présence enregistrée" />
        ) : (
          <Table>
            <Thead>
              <Th>Date</Th>
              <Th>Statut</Th>
              <Th>Arrivée</Th>
              <Th>Départ</Th>
            </Thead>
            <tbody>
              {history.map((a) => (
                <Tr key={a.id}>
                  <Td>{new Date(a.date).toLocaleDateString('fr-FR')}</Td>
                  <Td>
                    <AttendanceStatusBadge status={a.status} />
                  </Td>
                  <Td className="text-ink-700/60">{formatTime(a.arrival_time)}</Td>
                  <Td className="text-ink-700/60">{formatTime(a.departure_time)}</Td>
                  <Td className="text-ink-700/60">{a.note || '—'}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal open={absentModalOpen} onClose={() => setAbsentModalOpen(false)} title="Signaler une absence" size="sm">
        <div className="flex flex-col gap-4">
          <Textarea label="Motif (optionnel)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAbsentModalOpen(false)}>
              Annuler
            </Button>
            <Button
              loading={record.isPending}
              onClick={() =>
                record.mutate(
                  { status: 'absent', note: note || undefined },
                  { onSuccess: () => setAbsentModalOpen(false) }
                )
              }
            >
              Confirmer l'absence
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
