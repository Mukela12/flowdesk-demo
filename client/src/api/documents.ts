import { api } from './client'
import type { Document, DashboardStats, DocumentStatus, DocumentType } from '@/types'

interface StatsResponse {
  total: number
  pending_review: number
  needs_correction: number
  approved: number
  archived: number
}

export const documentsApi = {
  list: (filters?: { status?: DocumentStatus; type?: DocumentType; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.search) params.set('search', filters.search)
    const qs = params.toString()
    return api.get<Document[]>(`/api/documents${qs ? `?${qs}` : ''}`)
  },

  get: (id: string) => api.get<Document>(`/api/documents/${id}`),

  stats: async (): Promise<DashboardStats> => {
    const raw = await api.get<StatsResponse>('/api/documents/stats')
    return {
      total: raw.total,
      pendingReview: raw.pending_review,
      needsCorrection: raw.needs_correction,
      approved: raw.approved,
      archived: raw.archived,
    }
  },

  upload: (data: { title: string; type: DocumentType; relatedParty: string; date: string; file: File }) => {
    const form = new FormData()
    form.append('title', data.title)
    form.append('type', data.type)
    form.append('relatedParty', data.relatedParty)
    form.append('date', data.date)
    form.append('file', data.file)
    return api.post<{ id: string; message: string }>('/api/documents', form)
  },

  approve: (id: string) =>
    api.post<{ message: string; webhookTriggered: boolean }>(`/api/documents/${id}/approve`),

  reject: (id: string, note: string) =>
    api.post<{ message: string }>(`/api/documents/${id}/reject`, { note }),

  resubmit: (id: string, file?: File) => {
    const form = new FormData()
    if (file) form.append('file', file)
    return api.post<{ message: string; version: number }>(`/api/documents/${id}/resubmit`, form)
  },

  delete: (id: string) => api.delete<{ message: string }>(`/api/documents/${id}`),
}
