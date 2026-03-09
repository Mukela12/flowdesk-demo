import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import documentRoutes from './routes/documents.js'
import webhookRoutes from './routes/webhooks.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '3001')

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/webhooks', webhookRoutes)

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Serve frontend in production
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FlowDesk server running on port ${PORT}`)
})
