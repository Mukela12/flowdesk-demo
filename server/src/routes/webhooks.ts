import { Router } from 'express'
import pool from '../db/pool.js'
import { authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

// POST /api/webhooks/inbound — receive data from Google Forms / n8n (no auth required)
router.post('/inbound', async (req, res) => {
  try {
    const { title, type, relatedParty, date, fileName, source, formId } = req.body

    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    // Find a default accountant to assign as uploader
    const accountantResult = await pool.query(
      "SELECT id, name FROM users WHERE role = 'accountant' LIMIT 1"
    )
    const accountant = accountantResult.rows[0]

    // Create the document
    const docResult = await pool.query(
      `INSERT INTO documents (title, type, related_party, date, file_name, file_size, source, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, 0, 'webhook', $6)
       RETURNING id`,
      [
        title,
        type || 'purchase_order',
        relatedParty || 'Unknown',
        date || new Date().toISOString().slice(0, 10),
        fileName || `webhook-${Date.now()}.pdf`,
        accountant?.id || null,
      ]
    )

    const docId = docResult.rows[0].id

    // Log the event
    await pool.query(
      `INSERT INTO document_events (document_id, action, user_name)
       VALUES ($1, $2, 'System')`,
      [docId, `Document received via ${source || 'webhook'}${formId ? ` (Form: ${formId})` : ''}`]
    )

    // Log the webhook
    await pool.query(
      `INSERT INTO webhook_logs (direction, url, method, status, payload, document_id)
       VALUES ('inbound', '/api/webhooks/inbound', 'POST', 200, $1, $2)`,
      [JSON.stringify(req.body), docId]
    )

    res.status(201).json({
      message: 'Document created from webhook',
      documentId: docId,
    })
  } catch (err) {
    console.error('Inbound webhook error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/webhooks/logs — get webhook logs (requires auth)
router.get('/logs', authMiddleware, async (_req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 100'
    )

    const logs = result.rows.map((row) => ({
      id: row.id,
      direction: row.direction,
      url: row.url,
      method: row.method,
      status: row.status,
      payload: JSON.stringify(row.payload),
      documentId: row.document_id,
      timestamp: row.created_at,
    }))

    res.json(logs)
  } catch (err) {
    console.error('Webhook logs error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/webhooks/config — get webhook configuration
router.get('/config', authMiddleware, async (_req: AuthRequest, res) => {
  try {
    const result = await pool.query('SELECT * FROM webhook_config ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Webhook config error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
