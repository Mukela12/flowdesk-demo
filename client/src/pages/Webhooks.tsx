import { Fragment, useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Info,
} from 'lucide-react'
import LordIcon from '@/shared/components/LordIcon'
import { mockGetWebhookLogs } from '@/mock/data'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function Webhooks() {
  const logs = useMemo(() => mockGetWebhookLogs(), [])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyPayload = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        Webhook Logs
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Monitor inbound and outbound webhook activity.
      </p>

      {/* Integration info */}
      <div
        className="rounded-lg p-4 mb-6 flex items-start gap-3"
        style={{ background: 'var(--accent-50)', border: '1px solid var(--accent-100)' }}
      >
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-500)' }} />
        <div className="text-sm" style={{ color: 'var(--accent-600)' }}>
          <p className="font-semibold mb-1">Webhook Integration</p>
          <p>
            <strong>Inbound:</strong> Google Forms and n8n send data to{' '}
            <code
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'var(--accent-100)' }}
            >
              POST /api/webhooks/inbound
            </code>
          </p>
          <p className="mt-1">
            <strong>Outbound:</strong> On approval, FlowDesk sends the document + metadata to
            your configured archive endpoint (n8n/Paperless-ngx).
          </p>
        </div>
      </div>

      {/* Endpoint config */}
      <div className="cmd-card p-5 mb-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Endpoint Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="fd-label">Inbound Webhook URL</label>
            <div
              className="px-3 py-2 rounded-lg font-mono text-xs"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
            >
              https://your-domain.com/api/webhooks/inbound
            </div>
          </div>
          <div>
            <label className="fd-label">Outbound Archive URL</label>
            <div
              className="px-3 py-2 rounded-lg font-mono text-xs"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
            >
              https://n8n.example.com/webhook/archive
            </div>
          </div>
        </div>
      </div>

      {/* Webhook logs table */}
      <div className="cmd-card overflow-hidden">
        <table className="cmd-table">
          <thead>
            <tr>
              <th>Direction</th>
              <th>Endpoint</th>
              <th>Method</th>
              <th>Status</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <Fragment key={log.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center"
                        style={{
                          background: log.direction === 'inbound' ? 'var(--accent-50)' : '#FAF5FF',
                        }}
                      >
                        {log.direction === 'inbound' ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" style={{ color: 'var(--accent-500)' }} />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} />
                        )}
                      </div>
                      <span className="capitalize font-medium" style={{ color: 'var(--text-primary)' }}>
                        {log.direction}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {log.url}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge--neutral font-mono">{log.method}</span>
                  </td>
                  <td>
                    {log.status >= 200 && log.status < 300 ? (
                      <span className="badge badge--success">{log.status}</span>
                    ) : (
                      <span className="badge badge--error">{log.status}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(log.timestamp)}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPayload(log.id, log.payload)
                      }}
                      className="btn btn--ghost text-xs"
                    >
                      {copiedId === log.id ? (
                        <><Check className="w-3 h-3" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr key={`${log.id}-payload`}>
                    <td colSpan={6} style={{ background: 'var(--bg-muted)', padding: '12px 16px' }}>
                      <span className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>
                        Payload
                      </span>
                      <pre
                        className="text-xs font-mono p-3 rounded-lg overflow-x-auto"
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {JSON.stringify(JSON.parse(log.payload), null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-16">
          <LordIcon name="system-regular-59-email-hover-email" size={48} trigger="loop" />
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>No webhook activity yet</p>
        </div>
      )}
    </div>
  )
}
