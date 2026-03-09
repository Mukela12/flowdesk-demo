import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'
import pool from '../db/pool.js'
import { authMiddleware, requireManager, requireAccountant, type AuthRequest } from '../middleware/auth.js'

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${uuid()}${ext}`)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    cb(null, allowed.includes(file.mimetype))
  },
})

const router = Router()

// All routes require auth
router.use(authMiddleware)

// GET /api/documents — list documents
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, type, search } = req.query
    let query = `
      SELECT d.*,
        u1.name as uploaded_by_name, u1.email as uploaded_by_email, u1.role as uploaded_by_role,
        u2.name as approved_by_name
      FROM documents d
      LEFT JOIN users u1 ON d.uploaded_by = u1.id
      LEFT JOIN users u2 ON d.approved_by = u2.id
      WHERE 1=1
    `
    const params: string[] = []
    let paramIdx = 1

    if (status) {
      query += ` AND d.status = $${paramIdx++}`
      params.push(status as string)
    }
    if (type) {
      query += ` AND d.type = $${paramIdx++}`
      params.push(type as string)
    }
    if (search) {
      query += ` AND (d.title ILIKE $${paramIdx} OR d.related_party ILIKE $${paramIdx} OR d.file_name ILIKE $${paramIdx})`
      params.push(`%${search}%`)
      paramIdx++
    }

    query += ' ORDER BY d.updated_at DESC'

    const result = await pool.query(query, params)

    const documents = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      status: row.status,
      relatedParty: row.related_party,
      date: row.date,
      fileName: row.file_name,
      fileSize: row.file_size,
      source: row.source,
      version: row.version,
      rejectionNote: row.rejection_note,
      webhookTriggered: row.webhook_triggered,
      uploadedBy: {
        id: row.uploaded_by,
        name: row.uploaded_by_name,
        email: row.uploaded_by_email,
        role: row.uploaded_by_role,
      },
      uploadedAt: row.created_at,
      updatedAt: row.updated_at,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by_name ? { name: row.approved_by_name } : null,
    }))

    res.json(documents)
  } catch (err) {
    console.error('List documents error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/documents/stats
router.get('/stats', async (_req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'pending_review')::int as pending_review,
        COUNT(*) FILTER (WHERE status = 'needs_correction')::int as needs_correction,
        COUNT(*) FILTER (WHERE status = 'approved')::int as approved,
        COUNT(*) FILTER (WHERE status = 'archived')::int as archived
      FROM documents
    `)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/documents/:id
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const docResult = await pool.query(
      `SELECT d.*,
        u1.name as uploaded_by_name, u1.email as uploaded_by_email, u1.role as uploaded_by_role, u1.id as uploader_id,
        u2.name as approved_by_name
      FROM documents d
      LEFT JOIN users u1 ON d.uploaded_by = u1.id
      LEFT JOIN users u2 ON d.approved_by = u2.id
      WHERE d.id = $1`,
      [req.params.id]
    )

    if (!docResult.rows[0]) {
      res.status(404).json({ error: 'Document not found' })
      return
    }

    const row = docResult.rows[0]

    const eventsResult = await pool.query(
      'SELECT * FROM document_events WHERE document_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    )

    res.json({
      id: row.id,
      title: row.title,
      type: row.type,
      status: row.status,
      relatedParty: row.related_party,
      date: row.date,
      fileName: row.file_name,
      fileSize: row.file_size,
      source: row.source,
      version: row.version,
      rejectionNote: row.rejection_note,
      webhookTriggered: row.webhook_triggered,
      uploadedBy: {
        id: row.uploader_id,
        name: row.uploaded_by_name,
        email: row.uploaded_by_email,
        role: row.uploaded_by_role,
      },
      uploadedAt: row.created_at,
      updatedAt: row.updated_at,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by_name ? { name: row.approved_by_name } : null,
      history: eventsResult.rows.map((e) => ({
        id: e.id,
        action: e.action,
        user: e.user_name,
        timestamp: e.created_at,
        note: e.note,
      })),
    })
  } catch (err) {
    console.error('Get document error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/documents — upload document (accountant only)
router.post('/', requireAccountant, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { title, type, relatedParty, date } = req.body
    const file = req.file

    if (!title || !type || !relatedParty || !date || !file) {
      res.status(400).json({ error: 'All fields and file are required' })
      return
    }

    const docResult = await pool.query(
      `INSERT INTO documents (title, type, related_party, date, file_name, file_size, file_path, uploaded_by, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'web_upload')
       RETURNING id`,
      [title, type, relatedParty, date, file.originalname, file.size, file.path, req.userId]
    )

    const docId = docResult.rows[0].id

    await pool.query(
      `INSERT INTO document_events (document_id, action, user_name)
       VALUES ($1, 'Document uploaded', $2)`,
      [docId, req.userName]
    )

    res.status(201).json({ id: docId, message: 'Document uploaded successfully' })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/documents/:id/approve — manager only
router.post('/:id/approve', requireManager, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const docResult = await pool.query('SELECT * FROM documents WHERE id = $1', [id])
    if (!docResult.rows[0]) {
      res.status(404).json({ error: 'Document not found' })
      return
    }
    if (docResult.rows[0].status !== 'pending_review') {
      res.status(400).json({ error: 'Document is not pending review' })
      return
    }

    await pool.query(
      `UPDATE documents SET status = 'approved', approved_by = $1, approved_at = NOW(),
       webhook_triggered = TRUE, updated_at = NOW() WHERE id = $2`,
      [req.userId, id]
    )

    await pool.query(
      `INSERT INTO document_events (document_id, action, user_name) VALUES ($1, 'Approved by manager', $2)`,
      [id, req.userName]
    )

    // Trigger outbound webhook
    const webhookResult = await pool.query(
      "SELECT * FROM webhook_config WHERE direction = 'outbound' AND enabled = TRUE LIMIT 1"
    )

    if (webhookResult.rows[0]) {
      const whConfig = webhookResult.rows[0]
      // In production, this would actually POST to the URL
      await pool.query(
        `INSERT INTO webhook_logs (direction, url, method, status, payload, document_id)
         VALUES ('outbound', $1, 'POST', 200, $2, $3)`,
        [
          whConfig.url,
          JSON.stringify({
            documentId: id,
            title: docResult.rows[0].title,
            type: docResult.rows[0].type,
            status: 'approved',
            archiveTo: 'paperless-ngx',
          }),
          id,
        ]
      )

      await pool.query(
        `INSERT INTO document_events (document_id, action, user_name)
         VALUES ($1, 'Outbound webhook triggered → n8n/Paperless-ngx', 'System')`,
        [id]
      )
    }

    res.json({ message: 'Document approved', webhookTriggered: !!webhookResult.rows[0] })
  } catch (err) {
    console.error('Approve error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/documents/:id/reject — manager only
router.post('/:id/reject', requireManager, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { note } = req.body

    if (!note) {
      res.status(400).json({ error: 'Rejection note is required' })
      return
    }

    const docResult = await pool.query('SELECT * FROM documents WHERE id = $1', [id])
    if (!docResult.rows[0]) {
      res.status(404).json({ error: 'Document not found' })
      return
    }
    if (docResult.rows[0].status !== 'pending_review') {
      res.status(400).json({ error: 'Document is not pending review' })
      return
    }

    await pool.query(
      `UPDATE documents SET status = 'needs_correction', rejection_note = $1, updated_at = NOW() WHERE id = $2`,
      [note, id]
    )

    await pool.query(
      `INSERT INTO document_events (document_id, action, user_name, note)
       VALUES ($1, 'Rejected by manager', $2, $3)`,
      [id, req.userName, note]
    )

    res.json({ message: 'Document rejected' })
  } catch (err) {
    console.error('Reject error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/documents/:id/resubmit — accountant, replace file
router.post('/:id/resubmit', requireAccountant, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const file = req.file

    const docResult = await pool.query('SELECT * FROM documents WHERE id = $1', [id])
    if (!docResult.rows[0]) {
      res.status(404).json({ error: 'Document not found' })
      return
    }
    if (docResult.rows[0].status !== 'needs_correction') {
      res.status(400).json({ error: 'Document does not need correction' })
      return
    }
    if (docResult.rows[0].uploaded_by !== req.userId) {
      res.status(403).json({ error: 'Only the original uploader can resubmit' })
      return
    }

    const newVersion = docResult.rows[0].version + 1
    const fileName = file ? file.originalname : docResult.rows[0].file_name
    const fileSize = file ? file.size : docResult.rows[0].file_size
    const filePath = file ? file.path : docResult.rows[0].file_path

    await pool.query(
      `UPDATE documents SET status = 'pending_review', file_name = $1, file_size = $2, file_path = $3,
       version = $4, rejection_note = NULL, updated_at = NOW() WHERE id = $5`,
      [fileName, fileSize, filePath, newVersion, id]
    )

    await pool.query(
      `INSERT INTO document_events (document_id, action, user_name)
       VALUES ($1, 'Document replaced and resubmitted (v' || $2 || ')', $3)`,
      [id, newVersion.toString(), req.userName]
    )

    res.json({ message: 'Document resubmitted', version: newVersion })
  } catch (err) {
    console.error('Resubmit error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/documents/:id — manager only
router.delete('/:id', requireManager, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Document not found' })
      return
    }
    res.json({ message: 'Document deleted' })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
