import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { mockLogin, mockLogout, MOCK_USERS } from '@/mock/data'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isManager: boolean
  isAccountant: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('flowdesk_user')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Re-hydrate mock session
      const found = MOCK_USERS.find((u) => u.id === parsed.id)
      if (found) mockLogin(found.email, '')
      return found || null
    }
    return null
  })

  const login = useCallback((email: string, password: string) => {
    const u = mockLogin(email, password)
    if (u) {
      setUser(u)
      localStorage.setItem('flowdesk_user', JSON.stringify(u))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    mockLogout()
    setUser(null)
    localStorage.removeItem('flowdesk_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isManager: user?.role === 'manager',
        isAccountant: user?.role === 'accountant',
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
