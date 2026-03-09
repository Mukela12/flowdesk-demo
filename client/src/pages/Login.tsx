import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import RiveCursorTracker from '@/shared/components/RiveCursorTracker'
import { useMousePosition } from '@/shared/hooks/useMousePosition'
import LordIcon from '@/shared/components/LordIcon'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

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
  const { x: mouseX, y: mouseY } = useMousePosition()

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
    <div data-theme="flowdesk" className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel — Rive Animation */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col relative overflow-hidden"
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 30% 40%, var(--accent-500) 0%, transparent 60%)',
        }} />

        {/* Logo */}
        <div className="relative px-8 pt-8 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-500)' }}
          >
            <LordIcon
              name="system-regular-69-document-scan-hover-scan"
              size={20}
              trigger="loop"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ color: '#F8FAFC' }}>
            FlowDesk
          </span>
        </div>

        {/* Rive character */}
        <div className="flex-1 flex items-center justify-center px-8">
          <RiveCursorTracker
            src="/animations/rive/blue-guy.riv"
            mouseX={mouseX}
            mouseY={mouseY}
            className="w-[320px] h-[320px]"
          />
        </div>

        {/* Bottom text */}
        <div className="relative px-8 pb-8">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F8FAFC' }}>
            Document Approval
            <br />Made Simple
          </h2>
          <p className="text-sm" style={{ color: 'var(--sidebar-text)' }}>
            Upload, review, approve, and archive documents with full audit trail and webhook integrations.
          </p>
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-500)' }}
            >
              <LordIcon
                name="system-regular-69-document-scan-hover-scan"
                size={20}
                trigger="hover"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              FlowDesk
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="fd-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="fd-input"
                required
              />
            </div>

            <div>
              <label className="fd-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="fd-input"
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}
              >
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--primary w-full py-2.5">
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-8 p-4 rounded-lg"
            style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Demo Accounts
            </p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => quickLogin(cred)}
                  className="cmd-card w-full flex items-center justify-between px-3 py-2.5 text-left group"
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {cred.role}
                    </p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {cred.email}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
              Password: <span className="font-mono">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
