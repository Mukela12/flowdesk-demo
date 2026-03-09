import { useState, useMemo } from 'react'
import { Search, FileText, SlidersHorizontal } from 'lucide-react'
import { mockGetDocuments } from '@/mock/data'
import type { DocumentStatus, DocumentType } from '@/types'
import { STATUS_LABELS, DOCUMENT_TYPE_LABELS } from '@/types'
import DocumentCard from '@/components/DocumentCard'

export default function Documents() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('')

  const documents = useMemo(
    () =>
      mockGetDocuments({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        search: search || undefined,
      }),
    [search, statusFilter, typeFilter]
  )

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">All Documents</h1>
      <p className="text-sm text-slate-500 mb-6">
        Search and filter all documents in the system.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, party, or filename..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | '')}
            className="px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm bg-white"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | '')}
            className="px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm bg-white"
          >
            <option value="">All Types</option>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No documents match your filters</p>
        </div>
      )}
    </div>
  )
}
