import type { User, Document, WebhookLog, DocumentStatus, DocumentType } from '@/types'

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Mustafa Al-Arbash', email: 'manager@flowdesk.io', role: 'manager' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@flowdesk.io', role: 'accountant' },
  { id: 'u3', name: 'James Miller', email: 'james@flowdesk.io', role: 'accountant' },
]

const now = new Date()
const h = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString()

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    title: 'Q1 Office Supplies Payment',
    type: 'payment_voucher',
    status: 'pending_review',
    relatedParty: 'Staples Inc.',
    date: '2026-03-08',
    fileName: 'q1-office-supplies-pv.pdf',
    fileSize: 245000,
    uploadedBy: MOCK_USERS[1],
    uploadedAt: h(2),
    updatedAt: h(2),
    source: 'web_upload',
    version: 1,
    history: [
      { id: 'e1', action: 'Document uploaded', user: 'Sarah Chen', timestamp: h(2) },
    ],
  },
  {
    id: 'doc-002',
    title: 'Contractor Payment — March',
    type: 'payment_voucher',
    status: 'pending_review',
    relatedParty: 'Acme Consulting LLC',
    date: '2026-03-07',
    fileName: 'contractor-march-pv.pdf',
    fileSize: 189000,
    uploadedBy: MOCK_USERS[2],
    uploadedAt: h(5),
    updatedAt: h(5),
    source: 'web_upload',
    version: 1,
    history: [
      { id: 'e2', action: 'Document uploaded', user: 'James Miller', timestamp: h(5) },
    ],
  },
  {
    id: 'doc-003',
    title: 'Server Hosting Invoice — Feb',
    type: 'invoice',
    status: 'needs_correction',
    relatedParty: 'AWS',
    date: '2026-02-28',
    fileName: 'aws-feb-invoice.pdf',
    fileSize: 312000,
    uploadedBy: MOCK_USERS[1],
    uploadedAt: h(48),
    updatedAt: h(12),
    rejectionNote: 'Invoice amount does not match the PO. Please verify with AWS support and upload the corrected version.',
    source: 'web_upload',
    version: 1,
    history: [
      { id: 'e3', action: 'Document uploaded', user: 'Sarah Chen', timestamp: h(48) },
      { id: 'e4', action: 'Rejected by manager', user: 'Mustafa Al-Arbash', timestamp: h(12), note: 'Invoice amount does not match the PO.' },
    ],
  },
  {
    id: 'doc-004',
    title: 'Laptop Purchase Order',
    type: 'purchase_order',
    status: 'approved',
    relatedParty: 'Dell Technologies',
    date: '2026-03-05',
    fileName: 'dell-laptops-po.pdf',
    fileSize: 156000,
    uploadedBy: MOCK_USERS[2],
    uploadedAt: h(72),
    updatedAt: h(24),
    approvedAt: h(24),
    approvedBy: MOCK_USERS[0],
    source: 'web_upload',
    webhookTriggered: true,
    version: 1,
    history: [
      { id: 'e5', action: 'Document uploaded', user: 'James Miller', timestamp: h(72) },
      { id: 'e6', action: 'Approved by manager', user: 'Mustafa Al-Arbash', timestamp: h(24) },
      { id: 'e7', action: 'Outbound webhook triggered', user: 'System', timestamp: h(24) },
    ],
  },
  {
    id: 'doc-005',
    title: 'Catering Receipt — Team Lunch',
    type: 'receipt',
    status: 'approved',
    relatedParty: 'Fresh Kitchen Co.',
    date: '2026-03-06',
    fileName: 'catering-receipt-mar6.pdf',
    fileSize: 89000,
    uploadedBy: MOCK_USERS[1],
    uploadedAt: h(60),
    updatedAt: h(36),
    approvedAt: h(36),
    approvedBy: MOCK_USERS[0],
    source: 'web_upload',
    webhookTriggered: true,
    version: 1,
    history: [
      { id: 'e8', action: 'Document uploaded', user: 'Sarah Chen', timestamp: h(60) },
      { id: 'e9', action: 'Approved by manager', user: 'Mustafa Al-Arbash', timestamp: h(36) },
      { id: 'e10', action: 'Outbound webhook triggered', user: 'System', timestamp: h(36) },
    ],
  },
  {
    id: 'doc-006',
    title: 'Marketing Materials — Q1',
    type: 'journal_voucher',
    status: 'pending_review',
    relatedParty: 'CreativeEdge Agency',
    date: '2026-03-09',
    fileName: 'marketing-jv-q1.pdf',
    fileSize: 415000,
    uploadedBy: MOCK_USERS[1],
    uploadedAt: h(1),
    updatedAt: h(1),
    source: 'webhook',
    version: 1,
    history: [
      { id: 'e11', action: 'Document received via webhook', user: 'System', timestamp: h(1) },
    ],
  },
  {
    id: 'doc-007',
    title: 'Client Refund — Order #4892',
    type: 'credit_note',
    status: 'needs_correction',
    relatedParty: 'TechStart Solutions',
    date: '2026-03-04',
    fileName: 'refund-4892-cn.pdf',
    fileSize: 98000,
    uploadedBy: MOCK_USERS[2],
    uploadedAt: h(96),
    updatedAt: h(48),
    rejectionNote: 'Missing customer signature on the credit note. Please get the signed copy.',
    source: 'web_upload',
    version: 2,
    history: [
      { id: 'e12', action: 'Document uploaded', user: 'James Miller', timestamp: h(96) },
      { id: 'e13', action: 'Rejected by manager', user: 'Mustafa Al-Arbash', timestamp: h(72), note: 'Missing customer signature.' },
      { id: 'e14', action: 'Document replaced', user: 'James Miller', timestamp: h(48) },
      { id: 'e15', action: 'Rejected by manager', user: 'Mustafa Al-Arbash', timestamp: h(48), note: 'Still missing customer signature on the credit note.' },
    ],
  },
  {
    id: 'doc-008',
    title: 'Field Purchase — Site Materials',
    type: 'purchase_order',
    status: 'pending_review',
    relatedParty: 'BuildRight Supplies',
    date: '2026-03-09',
    fileName: 'field-purchase-site-materials.pdf',
    fileSize: 267000,
    uploadedBy: MOCK_USERS[2],
    uploadedAt: h(0.5),
    updatedAt: h(0.5),
    source: 'webhook',
    version: 1,
    history: [
      { id: 'e16', action: 'Document received via Google Forms webhook', user: 'System', timestamp: h(0.5) },
    ],
  },
]

export const MOCK_WEBHOOK_LOGS: WebhookLog[] = [
  {
    id: 'wh-001',
    direction: 'inbound',
    url: '/api/webhooks/inbound',
    method: 'POST',
    status: 200,
    payload: JSON.stringify({ source: 'google_forms', formId: 'abc123', title: 'Field Purchase — Site Materials' }),
    documentId: 'doc-008',
    timestamp: h(0.5),
  },
  {
    id: 'wh-002',
    direction: 'outbound',
    url: 'https://n8n.example.com/webhook/archive',
    method: 'POST',
    status: 200,
    payload: JSON.stringify({ documentId: 'doc-004', status: 'approved', archiveTo: 'paperless-ngx' }),
    documentId: 'doc-004',
    timestamp: h(24),
  },
  {
    id: 'wh-003',
    direction: 'outbound',
    url: 'https://n8n.example.com/webhook/archive',
    method: 'POST',
    status: 200,
    payload: JSON.stringify({ documentId: 'doc-005', status: 'approved', archiveTo: 'paperless-ngx' }),
    documentId: 'doc-005',
    timestamp: h(36),
  },
  {
    id: 'wh-004',
    direction: 'inbound',
    url: '/api/webhooks/inbound',
    method: 'POST',
    status: 200,
    payload: JSON.stringify({ source: 'google_forms', formId: 'def456', title: 'Marketing Materials — Q1' }),
    documentId: 'doc-006',
    timestamp: h(1),
  },
]

// --- Mock API functions ---

let documents = [...MOCK_DOCUMENTS]
let webhookLogs = [...MOCK_WEBHOOK_LOGS]
let currentUser: User | null = null

export function mockLogin(email: string, _password: string): User | null {
  const user = MOCK_USERS.find((u) => u.email === email)
  if (user) currentUser = user
  return user || null
}

export function mockGetCurrentUser(): User | null {
  return currentUser
}

export function mockLogout() {
  currentUser = null
}

export function mockGetDocuments(filters?: {
  status?: DocumentStatus
  type?: DocumentType
  search?: string
}): Document[] {
  let result = [...documents]
  if (filters?.status) result = result.filter((d) => d.status === filters.status)
  if (filters?.type) result = result.filter((d) => d.type === filters.type)
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.relatedParty.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q)
    )
  }
  return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function mockGetDocument(id: string): Document | undefined {
  return documents.find((d) => d.id === id)
}

export function mockApproveDocument(id: string): Document | undefined {
  const doc = documents.find((d) => d.id === id)
  if (!doc || !currentUser) return undefined
  doc.status = 'approved'
  doc.approvedAt = new Date().toISOString()
  doc.approvedBy = currentUser
  doc.updatedAt = new Date().toISOString()
  doc.webhookTriggered = true
  doc.history.push(
    { id: `e-${Date.now()}`, action: 'Approved by manager', user: currentUser.name, timestamp: new Date().toISOString() },
    { id: `e-${Date.now() + 1}`, action: 'Outbound webhook triggered → n8n/Paperless-ngx', user: 'System', timestamp: new Date().toISOString() }
  )
  webhookLogs.push({
    id: `wh-${Date.now()}`,
    direction: 'outbound',
    url: 'https://n8n.example.com/webhook/archive',
    method: 'POST',
    status: 200,
    payload: JSON.stringify({ documentId: id, status: 'approved', archiveTo: 'paperless-ngx' }),
    documentId: id,
    timestamp: new Date().toISOString(),
  })
  return doc
}

export function mockRejectDocument(id: string, note: string): Document | undefined {
  const doc = documents.find((d) => d.id === id)
  if (!doc || !currentUser) return undefined
  doc.status = 'needs_correction'
  doc.rejectionNote = note
  doc.updatedAt = new Date().toISOString()
  doc.history.push({
    id: `e-${Date.now()}`,
    action: 'Rejected by manager',
    user: currentUser.name,
    timestamp: new Date().toISOString(),
    note,
  })
  return doc
}

export function mockResubmitDocument(id: string, fileName: string): Document | undefined {
  const doc = documents.find((d) => d.id === id)
  if (!doc || !currentUser) return undefined
  doc.status = 'pending_review'
  doc.fileName = fileName
  doc.version += 1
  doc.rejectionNote = undefined
  doc.updatedAt = new Date().toISOString()
  doc.history.push({
    id: `e-${Date.now()}`,
    action: 'Document replaced and resubmitted',
    user: currentUser.name,
    timestamp: new Date().toISOString(),
  })
  return doc
}

export function mockUploadDocument(data: {
  title: string
  type: DocumentType
  relatedParty: string
  date: string
  fileName: string
  fileSize: number
}): Document {
  const doc: Document = {
    id: `doc-${Date.now()}`,
    ...data,
    status: 'pending_review',
    uploadedBy: currentUser!,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'web_upload',
    version: 1,
    history: [
      { id: `e-${Date.now()}`, action: 'Document uploaded', user: currentUser!.name, timestamp: new Date().toISOString() },
    ],
  }
  documents = [doc, ...documents]
  return doc
}

export function mockDeleteDocument(id: string): boolean {
  const idx = documents.findIndex((d) => d.id === id)
  if (idx === -1) return false
  documents.splice(idx, 1)
  return true
}

export function mockGetWebhookLogs(): WebhookLog[] {
  return [...webhookLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function mockGetStats(): {
  total: number
  pendingReview: number
  needsCorrection: number
  approved: number
  archived: number
} {
  return {
    total: documents.length,
    pendingReview: documents.filter((d) => d.status === 'pending_review').length,
    needsCorrection: documents.filter((d) => d.status === 'needs_correction').length,
    approved: documents.filter((d) => d.status === 'approved').length,
    archived: documents.filter((d) => d.status === 'archived').length,
  }
}
