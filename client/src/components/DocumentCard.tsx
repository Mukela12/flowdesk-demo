import { useNavigate } from 'react-router-dom'
import { FileText, Clock, User, ArrowRight, Webhook as WebhookIcon } from 'lucide-react'
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
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-slate-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
              {doc.title}
            </h3>
            <p className="text-xs text-slate-500">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          {doc.relatedParty}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(doc.updatedAt)}
        </span>
        {doc.source === 'webhook' && (
          <span className="flex items-center gap-1 text-indigo-500">
            <WebhookIcon className="w-3.5 h-3.5" />
            Webhook
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{doc.fileName}</span>
          <span>({formatSize(doc.fileSize)})</span>
          {doc.version > 1 && (
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">v{doc.version}</span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  )
}
