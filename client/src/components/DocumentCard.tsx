import { useNavigate } from 'react-router-dom'
import { Clock, User, ArrowRight, Webhook as WebhookIcon } from 'lucide-react'
import LordIcon from '@/shared/components/LordIcon'
import type { Document } from '@/types'
import { DOCUMENT_TYPE_LABELS } from '@/types'
import StatusBadge from './StatusBadge'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function DocumentCard({ doc }: { doc: Document }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/documents/${doc.id}`)}
      className="cmd-card p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--bg-muted)' }}
          >
            <LordIcon name="system-regular-69-document-scan-hover-scan" size={20} trigger="hover" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {doc.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {DOCUMENT_TYPE_LABELS[doc.type]}
            </p>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          {doc.relatedParty}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(doc.updatedAt)}
        </span>
        {doc.source === 'webhook' && (
          <span className="flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
            <WebhookIcon className="w-3.5 h-3.5" />
            Webhook
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between mt-4 pt-3"
        style={{ borderTop: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{doc.fileName}</span>
          <span>({formatSize(doc.fileSize)})</span>
          {doc.version > 1 && (
            <span className="badge badge--neutral">v{doc.version}</span>
          )}
        </div>
        <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}
