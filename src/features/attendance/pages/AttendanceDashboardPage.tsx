import { useState } from 'react'
import { Card, CardHeader, EmptyState, PageSpinner, StatCard } from '@/components/ui/DataDisplay'
import { Table, Thead, Th, Tr, Td, Avatar } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { Select, Textarea } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useAttendanceDashboard, useCorrectAttendance } from '../hooks/useAttendance'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import { useAuthStore } from '@/store/authStore'
import type { Attendance, AttendanceStatus } from '../types'

export default function AttendanceDashboardPage() {
  const { data, isLoading } = useAttendanceDashboard()
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')
  const correct = useCorrectAttendance()
  const [editing, setEditing] = useState<Attendance | null>(null)
  const [status, setStatus] = useState<AttendanceStatus>('present')
  
  const stats = (data?.stats ?? {}) as Record<string, number>

  function openEdit(a: Attendance) {
    setEditing(a)
    setStatus(a.status)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Présences</h1>
        <p className="text-sm text-ink-700/60">
          {isAdmin ? "Vue globale de toutes les présences." : 'Présences de vos stagiaires.'}
        </p>
      </div>

      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard key={key} label={key.replace(/_/g, ' ')} value={String(value)} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader title="Présences récentes" />
        {isLoading ? (
          <PageSpinner />
        ) : !data?.attendances.length ? (
          <EmptyState title="Aucune présence enregistrée" />
        ) : (
          <Table>
            <Thead>
              <Th>Stagiaire</Th>
              <Th>Date</Th>
              <Th>Statut</Th>
              <Th>Arrivée</Th>
              <Th>Départ</Th>
              {isAdmin && <Th>Actions</Th>}
            </Thead>
            <tbody>
              {data.attendances.map((a) => (
                <Tr key={a.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.intern?.name ?? '?'} src={a.intern?.avatar_path} size="sm" />
                      {a.intern?.name ?? '—'}
                    </div>
                  </Td>
                  <Td>{new Date(a.date).toLocaleDateString('fr-FR')}</Td>
                  <Td>
                    <AttendanceStatusBadge status={a.status} />
                  </Td>
                  <Td className="text-ink-700/60">
                    {a.arrival_time ? new Date(a.arrival_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Td>
                  <Td className="text-ink-700/60">
                    {a.departure_time ? new Date(a.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Td>
                  {isAdmin && (
                    <Td>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                        Corriger
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Corriger la présence" size="sm">
        {editing && (
          <div className="flex flex-col gap-4">
            <Select label="Statut" value={status} onChange={(e) => setStatus(e.target.value as AttendanceStatus)}>
              <option value="present">Présent</option>
              <option value="absent">Absent</option>
              <option value="late">En retard</option>
            </Select>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
