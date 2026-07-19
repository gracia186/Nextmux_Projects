import { useState } from 'react'
import { Card, CardHeader, EmptyState, PageSpinner } from '@/components/ui/DataDisplay'
import { Table, Thead, Th, Tr, Td, Avatar, FileInput } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import {
  useDocuments,
  usePendingDocumentsForMentor,
  usePendingDocumentsForAdmin,
  useMentorValidateDocument,
  useUploadDocument,
  useRejectDocument,
  useDownloadDocument,
} from '../hooks/useDocuments'
import { DocumentStatusBadge, DocumentTypeBadge } from '../components/DocumentBadges'
import { RequestDocumentModal } from '../components/RequestDocumentModal'
import { useAuthStore } from '@/store/authStore'
import type { AdminDocument } from '../types'

export default function DocumentsPage() {
  const role = useAuthStore((s) => s.user?.role)

  if (role === 'intern') return <InternDocumentsView />
  if (role === 'mentor') return <MentorDocumentsView />
  return <AdminDocumentsView />
}

function InternDocumentsView() {
  const { data: documents, isLoading } = useDocuments()
  const download = useDownloadDocument()
  const [requestOpen, setRequestOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mes documents</h1>
          <p className="text-sm text-ink-700/60">Demandez une attestation ou une convention de stage.</p>
        </div>
        <Button onClick={() => setRequestOpen(true)}>+ Nouvelle demande</Button>
      </div>
      <Card>
        <CardHeader title="Historique des demandes" />
        {isLoading ? (
          <PageSpinner />
        ) : !documents?.length ? (
          <EmptyState title="Aucune demande de document" />
        ) : (
          <Table>
            <Thead>
              <Th>Type</Th>
              <Th>Statut</Th>
              <Th>Demandé le</Th>
             
            </Thead>
            <tbody>
              {documents.map((d) => (
                <Tr key={d.id}>
                  <Td>
                    <DocumentTypeBadge type={d.type} />
                  </Td>
                  <Td>
                    <DocumentStatusBadge status={d.status} />
                    {(d.status === 'mentor_rejected' || d.status === 'admin_rejected') && d.rejection_reason && (
                      <p className="mt-1 text-xs text-ink-700/50">{d.rejection_reason}</p>
                    )}
                  </Td>
                  <Td className="text-ink-700/60">{d.requested_at ? new Date(d.requested_at).toLocaleDateString('fr-FR') : '—'}</Td>
                  <Td>
                    {d.is_downloadable && (
                      <Button variant="ghost" size="sm" onClick={() => download.mutate(d.id)}>
                        Télécharger
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <RequestDocumentModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  )
}

function MentorDocumentsView() {
  const { data: documents, isLoading } = usePendingDocumentsForMentor()
  const validate = useMentorValidateDocument()
  const [rejecting, setRejecting] = useState<AdminDocument | null>(null)
  const [reason, setReason] = useState('')

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Demandes de documents</h1>
        <p className="text-sm text-ink-700/60">Validez ou rejetez les demandes avant transmission à l'administrateur.</p>
      </div>
      <Card>
        <CardHeader title="En attente de validation" />
        {isLoading ? (
          <PageSpinner />
        ) : !documents?.length ? (
          <EmptyState title="Aucune demande en attente" />
        ) : (
          <Table>
            <Thead>
              <Th>Stagiaire</Th>
              <Th>Type</Th>
              <Th>Note</Th>
              
            </Thead>
            <tbody>
              {documents.map((d) => (
                <Tr key={d.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar name={d.intern?.name ?? '?'} src={d.intern?.avatar_path} size="sm" />
                      {d.intern?.name ?? '—'}
                    </div>
                  </Td>
                  <Td>
                    <DocumentTypeBadge type={d.type} />
                  </Td>
                  <Td className="text-ink-700/60">{d.request_note || '—'}</Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        loading={validate.isPending}
                        onClick={() => validate.mutate({ id: d.id, payload: { status: 'approved' } })}
                      >
                        Valider
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setRejecting(d)}>
                        Rejeter
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal open={Boolean(rejecting)} onClose={() => setRejecting(null)} title="Rejeter la demande" size="sm">
        <div className="flex flex-col gap-4">
          <Textarea label="Motif du rejet" required value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={!reason.trim()}
              loading={validate.isPending}
              onClick={() =>
                rejecting &&
                validate.mutate(
                  { id: rejecting.id, payload: { status: 'rejected', rejection_reason: reason } },
                  {
                    onSuccess: () => {
                      setRejecting(null)
                      setReason('')
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
    </div>
  )
}

function AdminDocumentsView() {
  const { data: documents, isLoading } = usePendingDocumentsForAdmin()
  const upload = useUploadDocument()
  const reject = useRejectDocument()
  const [uploading, setUploading] = useState<AdminDocument | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [rejecting, setRejecting] = useState<AdminDocument | null>(null)
  const [reason, setReason] = useState('')

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Documents à traiter</h1>
        <p className="text-sm text-ink-700/60">Demandes validées par un mentor, en attente du fichier final.</p>
      </div>
      <Card>
        <CardHeader title="Validées par le mentor" />
        {isLoading ? (
          <PageSpinner />
        ) : !documents?.length ? (
          <EmptyState title="Aucune demande à traiter" />
        ) : (
          <Table>
            <Thead>
              <Th>Stagiaire</Th>
              <Th>Type</Th>
              <Th>Statut</Th>
              
            </Thead>
            <tbody>
              {documents.map((d) => (
                <Tr key={d.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar name={d.intern?.name ?? '?'} src={d.intern?.avatar_path} size="sm" />
                      {d.intern?.name ?? '—'}
                    </div>
                  </Td>
                  <Td>
                    <DocumentTypeBadge type={d.type} />
                  </Td>
                  <Td>
                    <DocumentStatusBadge status={d.status} />
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => setUploading(d)}>
                        Téléverser le fichier
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setRejecting(d)}>
                        Rejeter
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal open={Boolean(uploading)} onClose={() => setUploading(null)} title="Téléverser le document final" size="sm">
        <div className="flex flex-col gap-4">
          <FileInput label="Fichier PDF" accept=".pdf" fileName={file?.name} onFileSelected={setFile} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploading(null)}>
              Annuler
            </Button>
            <Button
              disabled={!file}
              loading={upload.isPending}
              onClick={() =>
                uploading &&
                file &&
                upload.mutate(
                  { id: uploading.id, file },
                  {
                    onSuccess: () => {
                      setUploading(null)
                      setFile(null)
                    },
                  }
                )
              }
            >
              Téléverser
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(rejecting)} onClose={() => setRejecting(null)} title="Rejeter la demande" size="sm">
        <div className="flex flex-col gap-4">
          <Textarea label="Motif du rejet (obligatoire)" required value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={!reason.trim()}
              loading={reject.isPending}
              onClick={() =>
                rejecting &&
                reject.mutate(
                  { id: rejecting.id, reason },
                  {
                    onSuccess: () => {
                      setRejecting(null)
                      setReason('')
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
    </div>
  )
}
