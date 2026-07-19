import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useUser,
  useUsers,
  useUpdateUser,
  useDeactivateUser,
  useAssignMentor,
  useTerminateInternship,
  usePurgeUser,
  useResendInvitation,
  useUpdateInternshipDates,
} from '../hooks/useUsers'
import { Card, CardHeader, PageSpinner } from '@/components/ui/DataDisplay'
import { Avatar } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { Select, Textarea, Input } from '@/components/ui/Field'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { RoleBadge, UserStatusBadge } from '../components/Badges'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading } = useUser(id)
  const { data: mentorsData } = useUsers({ role: 'mentor' })

  const updateUser = useUpdateUser(id as string)
  const deactivate = useDeactivateUser()
  const assignMentor = useAssignMentor()
  const terminate = useTerminateInternship()
  const purge = usePurgeUser()
  const resend = useResendInvitation()
  const updateDates = useUpdateInternshipDates()

  const [mentorId, setMentorId] = useState('')
  const [terminateOpen, setTerminateOpen] = useState(false)
  const [terminateReason, setTerminateReason] = useState('')
  const [purgeOpen, setPurgeOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [datesOpen, setDatesOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  if (isLoading) return <PageSpinner />
  if (!user) return <p>Utilisateur introuvable.</p>

  return (
    <div className="flex flex-col gap-5">
      <button onClick={() => navigate(-1)} className="w-fit text-sm text-ink-700/60 hover:text-ink-900">
        ← Retour
      </button>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar_path} size="lg" />
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-ink-700/60">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <RoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.status === 'pending' && (
            <Button variant="outline" size="sm" loading={resend.isPending} onClick={() => resend.mutate(user.id)}>
              Renvoyer l'invitation
            </Button>
          )}
          {user.status !== 'inactive' && (
            <Button variant="outline" size="sm" onClick={() => setDeactivateOpen(true)}>
              Désactiver
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => setPurgeOpen(true)}>
            Anonymiser (RGPD)
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Informations générales" />
        <form
          className="grid max-w-sm gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            updateUser.mutate({ name: String(form.get('name') || user.name) })
          }}
        >
          <Input label="Nom complet" name="name" defaultValue={user.name} />
          <Select
            label="Statut"
            defaultValue={user.status}
            onChange={(e) => updateUser.mutate({ status: e.target.value as typeof user.status })}
          >
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </Select>
          <Button type="submit" size="sm" className="w-fit" loading={updateUser.isPending}>
            Enregistrer le nom
          </Button>
        </form>
      </Card>

      {user.role === 'intern' && (
        <Card>
          <CardHeader title="Gestion du stage" subtitle="Affectation d'un mentor, dates et clôture." />
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Affecter un mentor" value={mentorId} onChange={(e) => setMentorId(e.target.value)} className="max-w-xs">
                <option value="">Sélectionner un mentor…</option>
                {mentorsData?.users.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
              <Button
                size="sm"
                disabled={!mentorId}
                loading={assignMentor.isPending}
                onClick={() => assignMentor.mutate({ id: user.id, mentorId })}
              >
                Affecter
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ink-700/10 pt-4">
              <Button variant="outline" size="sm" onClick={() => setDatesOpen(true)}>
                Modifier les dates du stage
              </Button>
              <Button variant="danger" size="sm" onClick={() => setTerminateOpen(true)}>
                Clôturer le stage
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={deactivateOpen}
        title="Désactiver ce compte ?"
        description="L'utilisateur ne pourra plus se connecter tant que le compte reste désactivé."
        destructive
        loading={deactivate.isPending}
        onConfirm={() => deactivate.mutate(user.id, { onSuccess: () => setDeactivateOpen(false) })}
        onClose={() => setDeactivateOpen(false)}
      />

      <ConfirmDialog
        open={purgeOpen}
        title="Anonymiser les données ?"
        description="Cette action est irréversible : le nom et l'email seront définitivement remplacés."
        destructive
        loading={purge.isPending}
        onConfirm={() => purge.mutate(user.id, { onSuccess: () => setPurgeOpen(false) })}
        onClose={() => setPurgeOpen(false)}
      />

      <Modal open={terminateOpen} onClose={() => setTerminateOpen(false)} title="Clôturer le stage" size="sm">
        <div className="flex flex-col gap-4">
          <Textarea
            label="Motif de la clôture"
            required
            value={terminateReason}
            onChange={(e) => setTerminateReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTerminateOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              loading={terminate.isPending}
              disabled={!terminateReason.trim()}
              onClick={() =>
                terminate.mutate(
                  { id: user.id, reason: terminateReason },
                  { onSuccess: () => setTerminateOpen(false) }
                )
              }
            >
              Clôturer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={datesOpen} onClose={() => setDatesOpen(false)} title="Modifier les dates du stage" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Date de début" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Date de fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDatesOpen(false)}>
              Annuler
            </Button>
            <Button
              loading={updateDates.isPending}
              disabled={!startDate || !endDate}
              onClick={() =>
                updateDates.mutate(
                  { internId: user.id, payload: { start_date: startDate, end_date: endDate } },
                  { onSuccess: () => setDatesOpen(false) }
                )
              }
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
