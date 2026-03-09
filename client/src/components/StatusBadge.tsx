import type { DocumentStatus } from '@/types'
import { STATUS_LABELS } from '@/types'

const STATUS_MAP: Record<DocumentStatus, { className: string; dotClass: string }> = {
  pending_review: { className: 'badge badge--warning', dotClass: 'status-dot status-dot--pending' },
  needs_correction: { className: 'badge badge--error', dotClass: 'status-dot status-dot--rejected' },
  approved: { className: 'badge badge--success', dotClass: 'status-dot status-dot--approved' },
  archived: { className: 'badge badge--neutral', dotClass: 'status-dot status-dot--archived' },
}

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  const { className, dotClass } = STATUS_MAP[status]
  return (
    <span className={className}>
      <span className={dotClass} />
      {STATUS_LABELS[status]}
    </span>
  )
}
