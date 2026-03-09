import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FileText, Eye, EyeOff, ArrowRight } from 'lucide-react'

const DEMO_CREDENTIALS = [
  { role: 'Manager', email: 'manager@flowdesk.io', password: 'demo123' },
  { role: 'Accountant', email: 'sarah@flowdesk.io', password: 'demo123' },
  { role: 'Accountant', email: 'james@flowdesk.io', password: 'demo123' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (login(email, password)) {
      navigate('/dashboard')
    } else {
      setError('Invalid credentials. Use the demo accounts below.')
    }
  }

  const quickLogin = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(cred.email)
    setPassword(cred.password)
    if (login(cred.email, cred.password)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 w-72 h-72 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">FlowDesk</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Document Approval
            <br />
            Made Simple
          </h1>
          <p className="text-indigo-200 text-lg max-w-md">
            Upload, review, approve, and archive documents through a streamlined workflow — with
            full audit trail and webhook integrations.
          </p>
        </div>

        <div className="relative space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-mono">01</div>
            <div>
              <p className="text-white font-medium">Upload & Metadata</p>
              <p className="text-indigo-300 text-sm">Accountants upload documents with type, date, and party info</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-mono">02</div>
            <div>
              <p className="text-white font-medium">Review & Approve</p>
              <p className="text-indigo-300 text-sm">Manager approves or rejects with correction notes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-mono">03</div>
            <div>
              <p className="text-white font-medium">Archive via Webhook</p>
              <p className="text-indigo-300 text-sm">Approved docs trigger outbound webhooks to n8n/Paperless-ngx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 text-xl font-semibold tracking-tight">FlowDesk</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-slate-100 rounded-xl">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Demo Accounts
            </p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => quickLogin(cred)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                      {cred.role}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{cred.email}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              Password: <span className="font-mono">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
