import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LordIcon from '@/shared/components/LordIcon'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'accountant' | 'manager'>('accountant')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const success = await signup({ name, email, password, role })
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-theme="flowdesk" className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col relative overflow-hidden"
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 30% 40%, var(--accent-500) 0%, transparent 60%)',
        }} />
        <div className="relative px-8 pt-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-500)' }}>
            <LordIcon name="system-regular-69-document-scan-hover-scan" size={20} trigger="loop" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ color: '#F8FAFC' }}>FlowDesk</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <LordIcon name="system-regular-31-check-hover-pinch" size={120} trigger="loop" style={{ filter: 'brightness(0) invert(1) opacity(0.3)' }} />
          </div>
        </div>
        <div className="relative px-8 pb-8">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F8FAFC' }}>
            Get Started<br />in Seconds
          </h2>
          <p className="text-sm" style={{ color: 'var(--sidebar-text)' }}>
            Create your account and start managing documents with a full audit trail.
          </p>
        </div>
      </div>

      {/* Right panel — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-500)' }}>
              <LordIcon name="system-regular-69-document-scan-hover-scan" size={20} trigger="hover" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>FlowDesk</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create your account</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Sign up to start managing documents</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="fd-label">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="fd-input" required />
            </div>
            <div>
              <label className="fd-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="fd-input" required />
            </div>
            <div>
              <label className="fd-label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="fd-input" style={{ paddingRight: 40 }} required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="fd-label">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'accountant' | 'manager')} className="fd-select w-full">
                <option value="accountant">Accountant (upload documents)</option>
                <option value="manager">Manager (approve/reject documents)</option>
              </select>
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}>{error}</p>
            )}

            <button type="submit" className="btn btn--primary w-full py-2.5" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--accent-500)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
