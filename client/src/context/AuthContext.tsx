import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { authApi } from '@/api/auth'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: { name: string; email: string; password: string; role: string }) => Promise<boolean>
  logout: () => void
  isManager: boolean
  isAccountant: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Validate stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('flowdesk_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .getMe()
      .then((u) => {
        setUser(u)
        localStorage.setItem('flowdesk_user', JSON.stringify(u))
      })
      .catch(() => {
        localStorage.removeItem('flowdesk_token')
        localStorage.removeItem('flowdesk_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    if (res.token && res.user) {
      localStorage.setItem('flowdesk_token', res.token)
      localStorage.setItem('flowdesk_user', JSON.stringify(res.user))
      setUser(res.user)
      return true
    }
    return false
  }, [])

  const signup = useCallback(async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await authApi.signup(data)
    if (res.token && res.user) {
      localStorage.setItem('flowdesk_token', res.token)
      localStorage.setItem('flowdesk_user', JSON.stringify(res.user))
      setUser(res.user)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('flowdesk_token')
    localStorage.removeItem('flowdesk_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isManager: user?.role === 'manager',
        isAccountant: user?.role === 'accountant',
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
