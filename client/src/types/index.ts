export type UserRole = 'manager' | 'accountant'

export type DocumentStatus =
  | 'pending_review'
  | 'needs_correction'
  | 'approved'
  | 'archived'

export type DocumentType =
  | 'payment_voucher'
  | 'journal_voucher'
  | 'purchase_order'
  | 'invoice'
  | 'receipt'
  | 'credit_note'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Document {
  id: string
  title: string
  type: DocumentType
  status: DocumentStatus
  relatedParty: string
  date: string
  fileName: string
  fileSize: number
  fileUrl?: string
  uploadedBy: User
  uploadedAt: string
  updatedAt: string
  rejectionNote?: string
  approvedAt?: string
  approvedBy?: User
  source: 'web_upload' | 'webhook'
  webhookTriggered?: boolean
  version: number
  history: DocumentEvent[]
}

export interface DocumentEvent {
  id: string
  action: string
  user: string
  timestamp: string
  note?: string
}

export interface WebhookLog {
  id: string
  direction: 'inbound' | 'outbound'
  url: string
  method: string
  status: number
  payload: string
  documentId?: string
  timestamp: string
}

export interface DashboardStats {
  total: number
  pendingReview: number
  needsCorrection: number
  approved: number
  archived: number
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  payment_voucher: 'Payment Voucher',
  journal_voucher: 'Journal Voucher',
  purchase_order: 'Purchase Order',
  invoice: 'Invoice',
  receipt: 'Receipt',
  credit_note: 'Credit Note',
}

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending_review: 'Pending Review',
  needs_correction: 'Needs Correction',
  approved: 'Approved',
  archived: 'Archived',
}

export const STATUS_COLORS: Record<DocumentStatus, { bg: string; text: string; dot: string }> = {
  pending_review: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  needs_correction: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  archived: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}
