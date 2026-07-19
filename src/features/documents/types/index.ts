import type { User } from '@/types/common'

export type DocumentType = 'attestation' | 'convention'
export type DocumentStatus = 'pending' | 'mentor_approved' | 'mentor_rejected' | 'admin_rejected' | 'completed'

export interface AdminDocument {
  id: string
  intern?: User
  type: DocumentType
  status: DocumentStatus
  request_note: string | null
  rejection_reason: string | null
  document_number: string | null
  requested_at: string | null
  reviewed_by?: User
  reviewed_at: string | null
  generated_at: string | null
  is_downloadable: boolean
}

export interface RequestDocumentPayload {
  type: DocumentType
  request_note?: string
}

export interface MentorValidateDocumentPayload {
  status: 'approved' | 'rejected'
  rejection_reason?: string
}
