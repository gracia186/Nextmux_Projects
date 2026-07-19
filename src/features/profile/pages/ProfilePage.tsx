import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/DataDisplay'
import { Avatar, FileInput } from '@/components/ui/Elements'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { RoleBadge, UserStatusBadge } from '@/features/users/components/Badges'
import { useAuthStore } from '@/store/authStore'
import { useUpdateProfile, useUploadAvatar, useEnableMfa, useDataExport } from '../hooks/useProfile'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const enableMfa = useEnableMfa()
  const dataExport = useDataExport()
  const [name, setName] = useState(user?.name ?? '')

  if (!user) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Mon profil</h1>
        <p className="text-sm text-ink-700/60">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar_path} size="lg" />
          <div>
            <p className="font-semibold text-ink-950">{user.name}</p>
            <p className="text-sm text-ink-700/60">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <RoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <FileInput
            label="Changer la photo de profil"
            accept="image/jpeg,image/png"
            onFileSelected={(f) => f && uploadAvatar.mutate(f)}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Informations personnelles" />
        <form
          className="flex max-w-sm flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile.mutate({ name })
          }}
        >
          <Input label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" size="sm" className="w-fit" loading={updateProfile.isPending}>
            Enregistrer
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Sécurité" subtitle="Authentification à deux facteurs (MFA)" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-700/70">
            {user.mfa_enabled ? 'La MFA est actuellement activée sur votre compte.' : "La MFA n'est pas activée."}
          </p>
          <Button
            variant={user.mfa_enabled ? 'outline' : 'primary'}
            size="sm"
            loading={enableMfa.isPending}
            onClick={() => enableMfa.mutate(!user.mfa_enabled)}
          >
            {user.mfa_enabled ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Vos données (RGPD)" subtitle="Téléchargez une copie de toutes vos données personnelles." />
        <Button variant="outline" size="sm" loading={dataExport.isPending} onClick={() => dataExport.mutate()}>
          Exporter mes données
        </Button>
      </Card>
    </div>
  )
}
