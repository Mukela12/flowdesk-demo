import { api } from './client'
import type { User } from '@/types'

interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/api/auth/login', { email, password }),

  getMe: () => api.get<User>('/api/auth/me'),
}
