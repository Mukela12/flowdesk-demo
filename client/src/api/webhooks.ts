import { api } from './client'
import type { WebhookLog } from '@/types'

export const webhooksApi = {
  getLogs: () => api.get<WebhookLog[]>('/api/webhooks/logs'),
}
