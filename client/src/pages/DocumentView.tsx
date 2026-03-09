import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Upload,
  Trash2,
  Clock,
  User,
  Calendar,
  Tag,
  Webhook,
  History,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  mockGetDocument,
  mockApproveDocument,
  mockRejectDocument,
  mockResubmitDocument,
  mockDeleteDocument,
} from '@/mock/data'
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
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [, forceUpdate] = useState(0)

  const doc = useMemo(() => mockGetDocument(id!), [id, forceUpdate])

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Document not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
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

  const handleApprove = () => {
    mockApproveDocument(doc.id)
    forceUpdate((n) => n + 1)
  }

  const handleReject = () => {
    if (!rejectNote.trim()) return
    mockRejectDocument(doc.id, rejectNote.trim())
    setShowRejectForm(false)
    setRejectNote('')
    forceUpdate((n) => n + 1)
  }

  const handleResubmit = () => {
    mockResubmitDocument(doc.id, `${doc.fileName.replace('.pdf', '')}-v${doc.version + 1}.pdf`)
    forceUpdate((n) => n + 1)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      mockDeleteDocument(doc.id)
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{doc.title}</h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-sm text-slate-500">
              {DOCUMENT_TYPE_LABELS[doc.type]} &middot; {doc.fileName} &middot;{' '}
              {formatSize(doc.fileSize)}
              {doc.version > 1 && (
                <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                  Version {doc.version}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rejection notice */}
          {doc.status === 'needs_correction' && doc.rejectionNote && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Correction Required</p>
                  <p className="text-sm text-red-700 mt-1">{doc.rejectionNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* Document preview placeholder */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Document Preview</span>
              <button className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            <div className="h-80 bg-slate-50 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">{doc.fileName}</p>
                <p className="text-xs text-slate-300 mt-1">PDF preview available in production</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canApprove && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Document
              </button>
            )}

            {canReject && !showRejectForm && (
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            )}

            {canResubmit && (
              <button
                onClick={handleResubmit}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Replace & Resubmit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 px-3 py-2.5 rounded-lg text-sm transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>

          {/* Reject form */}
          {showRejectForm && (
            <div className="bg-white rounded-xl border border-red-200 p-5">
              <p className="text-sm font-semibold text-slate-900 mb-3">Rejection Note</p>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Explain what needs to be corrected..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition text-sm resize-none"
                rows={3}
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectNote.trim()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false)
                    setRejectNote('')
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700"
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
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">Type</span>
                <span className="ml-auto text-slate-900 font-medium">
                  {DOCUMENT_TYPE_LABELS[doc.type]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">Related Party</span>
                <span className="ml-auto text-slate-900 font-medium">{doc.relatedParty}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">Date</span>
                <span className="ml-auto text-slate-900 font-medium">{doc.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">Uploaded by</span>
                <span className="ml-auto text-slate-900 font-medium">{doc.uploadedBy.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">Uploaded</span>
                <span className="ml-auto text-slate-900 text-xs">{formatDate(doc.uploadedAt)}</span>
              </div>
              {doc.source === 'webhook' && (
                <div className="flex items-center gap-3 text-sm">
                  <Webhook className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-indigo-600 font-medium">Received via webhook</span>
                </div>
              )}
              {doc.approvedBy && (
                <div className="flex items-center gap-3 text-sm pt-2 border-t border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-500">Approved by</span>
                  <span className="ml-auto text-emerald-700 font-medium">
                    {doc.approvedBy.name}
                  </span>
                </div>
              )}
              {doc.webhookTriggered && (
                <div className="flex items-center gap-3 text-sm">
                  <Webhook className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-600 text-xs font-medium">
                    Archive webhook sent
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Audit trail */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Audit Trail
            </h3>
            <div className="space-y-0">
              {doc.history.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        i === 0 ? 'bg-indigo-500' : 'bg-slate-300'
                      }`}
                    />
                    {i < doc.history.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-slate-900">{event.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {event.user} &middot; {formatDate(event.timestamp)}
                    </p>
                    {event.note && (
                      <p className="text-xs text-red-600 mt-1 italic">"{event.note}"</p>
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
