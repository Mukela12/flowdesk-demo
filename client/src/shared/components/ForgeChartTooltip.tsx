interface ForgeTooltipPayload {
  name: string
  value: number
  color: string
}

interface ForgeTooltipProps {
  active?: boolean
  payload?: ForgeTooltipPayload[]
  label?: string
}

export default function ForgeChartTooltip({ active, payload, label }: ForgeTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="font-ibm-plex"
      style={{
        background: 'var(--bg-surface, #FFFFFF)',
        border: '1px solid var(--border-default, #E2E8F0)',
        borderRadius: 6,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
        minWidth: 120,
      }}
    >
      <p
        className="font-ibm-plex-mono"
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted, #94A3B8)',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4" style={{ marginTop: 2 }}>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-secondary, #475569)' }}>
              {entry.name}
            </span>
          </div>
          <span
            className="font-ibm-plex-mono"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary, #0F172A)',
            }}
          >
            {typeof entry.value === 'number' && entry.value % 1 !== 0
              ? entry.value.toFixed(2)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
