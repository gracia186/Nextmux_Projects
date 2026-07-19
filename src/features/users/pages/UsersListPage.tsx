import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Card, EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Table, Thead, Th, Tr, Td, Pagination, Avatar } from '@/components/ui/Elements'
import { Input, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { RoleBadge, UserStatusBadge } from '../components/Badges'
import { CreateUserModal } from '../components/CreateUserModal'
import type { UserRole, UserStatus } from '@/types/common'

export default function UsersListPage() {
  const [role, setRole] = useState<UserRole | ''>('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useUsers({ role, status, search, page })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Utilisateurs</h1>
          <p className="text-sm text-ink-700/60">Créez et gérez les comptes administrateurs, mentors et stagiaires.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Nouvel utilisateur</Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-xs"
          />
          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as UserRole | '')
              setPage(1)
            }}
            className="max-w-[180px]"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="mentor">Mentor</option>
            <option value="intern">Stagiaire</option>
          </Select>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as UserStatus | '')
              setPage(1)
            }}
            className="max-w-[180px]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </Select>
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : !data?.users.length ? (
          <EmptyState title="Aucun utilisateur trouvé" description="Ajustez vos filtres ou créez un nouveau compte." />
        ) : (
          <>
            <Table>
              <Thead>
                <Th>Utilisateur</Th>
                <Th>Rôle</Th>
                <Th>Statut</Th>
                <Th>Créé le</Th>
                <Th />
              </Thead>
              <tbody>
                {data.users.map((u) => (
                  <Tr key={u.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.avatar_path} size="sm" />
                        <div>
                          <p className="font-medium text-ink-950">{u.name}</p>
                          <p className="text-xs text-ink-700/50">{u.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <RoleBadge role={u.role} />
                    </Td>
                    <Td>
                      <UserStatusBadge status={u.status} />
                    </Td>
                    <Td className="text-ink-700/60">{u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}</Td>
                    <Td>
                      <Link to={`/admin/users/${u.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                        Voir →
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              currentPage={data.meta?.current_page ?? 1}
              lastPage={data.meta?.last_page ?? 1}
              onChange={setPage}
            />
          </>
        )}
      </Card>

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
