import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  User,
  Calendar,
  Tag,
  Webhook,
  Clock,
  Loader2,
} from 'lucide-react'
import LordIcon from '@/shared/components/LordIcon'
import { useAuth } from '@/context/AuthContext'
import { documentsApi } from '@/api/documents'
import type { Document } from '@/types'
import { DOCUMENT_TYPE_LABELS } from '@/types'
import StatusBadge from '@/components/StatusBadge'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function DocumentView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isManager, isAccountant } = useAuth()
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDoc = () => {
    setLoading(true)
    documentsApi
      .get(id!)
      .then(setDoc)
      .catch(() => setDoc(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDoc()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--accent-500)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <LordIcon name="system-regular-69-document-scan-hover-scan" size={48} trigger="loop" />
        <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Document not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn--ghost mt-4"
          style={{ color: 'var(--accent-500)' }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const canApprove = isManager && doc.status === 'pending_review'
  const canReject = isManager && doc.status === 'pending_review'
  const canDelete = isManager
  const canResubmit = isAccountant && doc.status === 'needs_correction' && doc.uploadedBy.id === user?.id

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await documentsApi.approve(doc.id)
      fetchDoc()
    } catch (err) {
      console.error('Approve failed', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectNote.trim()) return
    setActionLoading(true)
    try {
      await documentsApi.reject(doc.id, rejectNote.trim())
      setShowRejectForm(false)
      setRejectNote('')
      fetchDoc()
    } catch (err) {
      console.error('Reject failed', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleResubmit = async (file?: File) => {
    setActionLoading(true)
    try {
      await documentsApi.resubmit(doc.id, file)
      fetchDoc()
    } catch (err) {
      console.error('Resubmit failed', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setActionLoading(true)
      try {
        await documentsApi.delete(doc.id)
        navigate('/dashboard')
      } catch (err) {
        console.error('Delete failed', err)
        setActionLoading(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hidden file input for resubmit */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const f = e.target.files?.[0]
          handleResubmit(f)
          e.target.value = ''
        }}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn--ghost mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--bg-muted)' }}
          >
            <LordIcon name="system-regular-69-document-scan-hover-scan" size={28} trigger="hover" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {doc.title}
              </h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {DOCUMENT_TYPE_LABELS[doc.type]} &middot; {doc.fileName} &middot; {formatSize(doc.fileSize)}
              {doc.version > 1 && (
                <span className="badge badge--neutral ml-2">Version {doc.version}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rejection notice */}
          {doc.status === 'needs_correction' && doc.rejectionNote && (
            <div
              className="rounded-lg p-4 flex items-start gap-3"
              style={{ background: 'var(--error-bg)', border: '1px solid #FECACA' }}
            >
              <LordIcon name="system-regular-52-wrong-file-hover-wrong-file-1" size={20} trigger="loop" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--error-text)' }}>
                  Correction Required
                </p>
                <p className="text-sm mt-1" style={{ color: '#B91C1C' }}>{doc.rejectionNote}</p>
              </div>
            </div>
          )}

          {/* Document preview */}
          <div className="cmd-card overflow-hidden">
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border-default)' }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Document Preview
              </span>
              {doc.fileUrl && (
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost text-xs" style={{ color: 'var(--accent-500)' }}>
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              )}
            </div>
            <div
              className="h-80 flex items-center justify-center"
              style={{ background: 'var(--bg-muted)' }}
            >
              <div className="text-center">
                <LordIcon name="system-regular-69-document-scan-hover-scan" size={64} trigger="loop" />
                <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>{doc.fileName}</p>
                {doc.fileUrl ? (
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs mt-1 inline-block" style={{ color: 'var(--accent-500)' }}>
                    Open file in new tab
                  </a>
                ) : (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    No file available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canApprove && (
              <button onClick={handleApprove} disabled={actionLoading} className="btn btn--success">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <LordIcon
                    name="system-regular-31-check-hover-pinch"
                    size={16}
                    trigger="click"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                )}
                Approve Document
              </button>
            )}

            {canReject && !showRejectForm && (
              <button onClick={() => setShowRejectForm(true)} disabled={actionLoading} className="btn btn--danger">
                <LordIcon name="system-regular-52-wrong-file-hover-wrong-file-1" size={16} trigger="click" />
                Reject
              </button>
            )}

            {canResubmit && (
              <button onClick={() => fileInputRef.current?.click()} disabled={actionLoading} className="btn btn--primary">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <LordIcon
                    name="system-regular-49-upload-file-hover-upload-1"
                    size={16}
                    trigger="click"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                )}
                Replace & Resubmit
              </button>
            )}

            {canDelete && (
              <button onClick={handleDelete} disabled={actionLoading} className="btn btn--ghost ml-auto" style={{ color: 'var(--text-muted)' }}>
                Delete
              </button>
            )}
          </div>

          {/* Reject form */}
          {showRejectForm && (
            <div className="cmd-card p-5" style={{ borderColor: '#FECACA' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Rejection Note
              </p>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Explain what needs to be corrected..."
                className="fd-input"
                rows={3}
                style={{ resize: 'none' }}
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectNote.trim() || actionLoading}
                  className="btn btn--danger"
                  style={{ opacity: !rejectNote.trim() ? 0.5 : 1 }}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => { setShowRejectForm(false); setRejectNote('') }}
                  className="btn btn--ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="cmd-card p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Tag className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--text-primary)' }}>
                  {DOCUMENT_TYPE_LABELS[doc.type]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Related Party</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--text-primary)' }}>
                  {doc.relatedParty}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--text-primary)' }}>
                  {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Uploaded by</span>
                <span className="ml-auto font-medium" style={{ color: 'var(--text-primary)' }}>
                  {doc.uploadedBy.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Uploaded</span>
                <span className="ml-auto text-xs" style={{ color: 'var(--text-primary)' }}>
                  {formatDate(doc.uploadedAt)}
                </span>
              </div>
              {doc.source === 'webhook' && (
                <div className="flex items-center gap-3 text-sm">
                  <Webhook className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-500)' }} />
                  <span className="font-medium" style={{ color: 'var(--accent-500)' }}>
                    Received via webhook
                  </span>
                </div>
              )}
              {doc.approvedBy && (
                <div
                  className="flex items-center gap-3 text-sm pt-2"
                  style={{ borderTop: '1px solid var(--border-default)' }}
                >
                  <LordIcon name="system-regular-31-check-hover-pinch" size={16} trigger="hover" />
                  <span style={{ color: 'var(--text-secondary)' }}>Approved by</span>
                  <span className="ml-auto font-medium" style={{ color: 'var(--success-text)' }}>
                    {doc.approvedBy.name}
                  </span>
                </div>
              )}
              {doc.webhookTriggered && (
                <div className="flex items-center gap-3 text-sm">
                  <Webhook className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--success-text)' }}>
                    Archive webhook sent
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Audit trail */}
          <div className="cmd-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <LordIcon name="system-regular-78-check-list-hover-check-list" size={16} trigger="hover" />
              Audit Trail
            </h3>
            <div className="space-y-0">
              {doc.history.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`mt-2 flex-shrink-0 ${i === 0 ? 'audit-dot' : 'audit-dot audit-dot--muted'}`} />
                    {i < doc.history.length - 1 && <div className="audit-line flex-1 my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{event.action}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {event.user} &middot; {formatDate(event.timestamp)}
                    </p>
                    {event.note && (
                      <p className="text-xs mt-1 italic" style={{ color: 'var(--error-text)' }}>
                        "{event.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
