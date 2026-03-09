import { useMemo, useState } from 'react'
import {
  Webhook,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Info,
} from 'lucide-react'
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
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Webhook Logs</h1>
      <p className="text-sm text-slate-500 mb-6">
        Monitor inbound and outbound webhook activity.
      </p>

      {/* Integration info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-800">
            <p className="font-semibold mb-1">Webhook Integration</p>
            <p className="text-indigo-700">
              <strong>Inbound:</strong> Google Forms and n8n send data to{' '}
              <code className="px-1.5 py-0.5 bg-indigo-100 rounded text-xs font-mono">
                POST /api/webhooks/inbound
              </code>
            </p>
            <p className="text-indigo-700 mt-1">
              <strong>Outbound:</strong> On approval, FlowDesk sends the document + metadata to
              your configured archive endpoint (n8n → Paperless-ngx/Mayan EDMS).
            </p>
          </div>
        </div>
      </div>

      {/* Webhook endpoint config */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Endpoint Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Inbound Webhook URL
            </label>
            <div className="mt-1.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
              https://your-domain.com/api/webhooks/inbound
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Outbound Archive URL
            </label>
            <div className="mt-1.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
              https://n8n.example.com/webhook/archive
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
            >
              {/* Direction icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.direction === 'inbound' ? 'bg-blue-50' : 'bg-purple-50'
                }`}
              >
                {log.direction === 'inbound' ? (
                  <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-purple-500" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {log.direction}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded font-mono text-slate-500">
                    {log.method}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{log.url}</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                {log.status >= 200 && log.status < 300 ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.status}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    {log.status}
                  </span>
                )}
                <span className="text-xs text-slate-400">{formatDate(log.timestamp)}</span>
              </div>
            </button>

            {/* Expanded payload */}
            {expandedId === log.id && (
              <div className="border-t border-slate-100 p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Payload</span>
                  <button
                    onClick={() => copyPayload(log.id, log.payload)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedId === log.id ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
                  {JSON.stringify(JSON.parse(log.payload), null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-16">
          <Webhook className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No webhook activity yet</p>
        </div>
      )}
    </div>
  )
}
