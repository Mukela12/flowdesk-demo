import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  Filter,
  Upload,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { mockGetDocuments, mockGetStats } from '@/mock/data'
import type { DocumentStatus } from '@/types'
import DocumentCard from '@/components/DocumentCard'

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
    {
      label: 'Pending Review',
      value: stats.pendingReview,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      filter: 'pending_review' as DocumentStatus,
    },
    {
      label: 'Needs Correction',
      value: stats.needsCorrection,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      filter: 'needs_correction' as DocumentStatus,
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      filter: 'approved' as DocumentStatus,
    },
    {
      label: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      filter: 'archived' as DocumentStatus,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isManager ? 'Manager Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.name?.split(' ')[0]}. Here's your document overview.
          </p>
        </div>
        {isAccountant && (
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => setStatusFilter(statusFilter === stat.filter ? 'all' : stat.filter)}
            className={`p-5 rounded-xl border transition-all text-left ${
              statusFilter === stat.filter
                ? 'border-indigo-300 bg-white shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.value > 0 && (
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-500">
          {statusFilter === 'all'
            ? `All documents (${stats.total})`
            : `Filtered: ${statCards.find((s) => s.filter === statusFilter)?.label} (${documents.length})`}
        </span>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
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
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No documents found</p>
        </div>
      )}
    </div>
  )
}
