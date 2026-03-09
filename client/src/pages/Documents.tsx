import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import LordIcon from '@/shared/components/LordIcon'
import { documentsApi } from '@/api/documents'
import type { Document, DocumentStatus, DocumentType } from '@/types'
import { STATUS_LABELS, DOCUMENT_TYPE_LABELS } from '@/types'
import StatusBadge from '@/components/StatusBadge'

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

export default function Documents() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      documentsApi
        .list({
          status: statusFilter || undefined,
          type: typeFilter || undefined,
          search: search || undefined,
        })
        .then(setDocuments)
        .catch(console.error)
        .finally(() => setLoading(false))
    }, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [search, statusFilter, typeFilter])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>All Documents</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Search and filter all documents in the system.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, party, or filename..." className="fd-input" style={{ paddingLeft: 36 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | '')} className="fd-select">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as DocumentType | '')} className="fd-select">
          <option value="">All Types</option>
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {documents.length} document{documents.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--accent-500)', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="cmd-card overflow-hidden">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Status</th>
                <th>Related Party</th>
                <th>Size</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} onClick={() => navigate(`/documents/${doc.id}`)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <LordIcon name="system-regular-69-document-scan-hover-scan" size={16} trigger="hover" />
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.fileName}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{DOCUMENT_TYPE_LABELS[doc.type]}</span>
                  </td>
                  <td><StatusBadge status={doc.status} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{doc.relatedParty}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatSize(doc.fileSize)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{timeAgo(doc.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-16">
          <LordIcon name="system-regular-69-document-scan-hover-scan" size={48} trigger="loop" />
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>No documents match your filters</p>
        </div>
      )}
    </div>
  )
}
