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
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'https://flowdesk-demo.netlify.app',
    'http://localhost:5173',
    'http://localhost:5176',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/webhooks', webhookRoutes)

// Health check (must be before catch-all)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve uploaded files (local dev fallback)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Serve frontend in production (only if client/dist exists)
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
import fs from 'fs'
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FlowDesk server running on port ${PORT}`)
})
