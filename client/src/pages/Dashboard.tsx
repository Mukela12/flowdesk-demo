import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LordIcon from '@/shared/components/LordIcon'
import { useAuth } from '@/context/AuthContext'
import { mockGetDocuments, mockGetStats } from '@/mock/data'
import type { DocumentStatus } from '@/types'
import DocumentCard from '@/components/DocumentCard'

const statIcons: Record<string, string> = {
  pending_review: 'system-regular-78-check-list-hover-check-list',
  needs_correction: 'system-regular-52-wrong-file-hover-wrong-file-1',
  approved: 'system-regular-31-check-hover-pinch',
  archived: 'system-regular-69-document-scan-hover-scan',
}

const statBadgeClass: Record<string, string> = {
  pending_review: 'badge--warning',
  needs_correction: 'badge--error',
  approved: 'badge--success',
  archived: 'badge--neutral',
}

export default function Dashboard() {
  const { user, isManager, isAccountant } = useAuth()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const stats = mockGetStats()
  const documents = useMemo(
    () =>
      mockGetDocuments(statusFilter !== 'all' ? { status: statusFilter } : undefined),
    [statusFilter]
  )

  const statCards = [
    { label: 'Pending Review', value: stats.pendingReview, key: 'pending_review' as DocumentStatus },
    { label: 'Needs Correction', value: stats.needsCorrection, key: 'needs_correction' as DocumentStatus },
    { label: 'Approved', value: stats.approved, key: 'approved' as DocumentStatus },
    { label: 'Archived', value: stats.archived, key: 'archived' as DocumentStatus },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isManager ? 'Manager Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name?.split(' ')[0]}. Here's your document overview.
          </p>
        </div>
        {isAccountant && (
          <button onClick={() => navigate('/upload')} className="btn btn--primary">
            <LordIcon
              name="system-regular-49-upload-file-hover-upload-1"
              size={16}
              trigger="hover"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            Upload Document
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(statusFilter === stat.key ? 'all' : stat.key)}
            className={`cmd-card cmd-stat text-left transition-all ${
              statusFilter === stat.key ? 'ring-2' : ''
            }`}
            style={{
              ...(statusFilter === stat.key ? { borderColor: 'var(--accent-500)', ringColor: 'var(--accent-500)' } : {}),
              boxShadow: statusFilter === stat.key ? '0 0 0 2px rgba(59,130,246,0.2)' : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-muted)' }}
              >
                <LordIcon name={statIcons[stat.key]} size={20} trigger="hover" />
              </div>
              {stat.value > 0 && (
                <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
            <p className="cmd-stat__value">{stat.value}</p>
            <p className="cmd-stat__label">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filter info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {statusFilter === 'all'
            ? `All documents (${stats.total})`
            : `Filtered: ${statCards.find((s) => s.key === statusFilter)?.label} (${documents.length})`}
        </span>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs font-medium"
            style={{ color: 'var(--accent-500)' }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16">
          <LordIcon name="system-regular-69-document-scan-hover-scan" size={48} trigger="loop" />
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>No documents found</p>
        </div>
      )}
    </div>
  )
}
