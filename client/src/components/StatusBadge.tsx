import type { DocumentStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  const { bg, text, dot } = STATUS_COLORS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[status]}
    </span>
  )
}
