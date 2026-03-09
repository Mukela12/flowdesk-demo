import pool from './pool.js'
import bcrypt from 'bcryptjs'

const SCHEMA = `
-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'accountant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'payment_voucher', 'journal_voucher', 'purchase_order',
    'invoice', 'receipt', 'credit_note'
  )),
  status VARCHAR(30) NOT NULL DEFAULT 'pending_review' CHECK (status IN (
    'pending_review', 'needs_correction', 'approved', 'archived'
  )),
  related_party VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  file_path VARCHAR(1000),
  source VARCHAR(20) NOT NULL DEFAULT 'web_upload' CHECK (source IN ('web_upload', 'webhook')),
  version INTEGER NOT NULL DEFAULT 1,
  rejection_note TEXT,
  uploaded_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  webhook_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document events (audit trail)
CREATE TABLE IF NOT EXISTS document_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  action VARCHAR(500) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  url VARCHAR(1000) NOT NULL,
  method VARCHAR(10) NOT NULL DEFAULT 'POST',
  status INTEGER NOT NULL,
  payload JSONB,
  document_id UUID REFERENCES documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook config
CREATE TABLE IF NOT EXISTS webhook_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_document_events_document_id ON document_events(document_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_document_id ON webhook_logs(document_id);
`

async function migrate() {
  console.log('Running migrations...')

  await pool.query(SCHEMA)
  console.log('Schema created.')

  // Seed demo users
  const hashedPw = await bcrypt.hash('demo123', 10)

  const users = [
    { name: 'Mustafa Al-Arbash', email: 'manager@flowdesk.io', role: 'manager' },
    { name: 'Sarah Chen', email: 'sarah@flowdesk.io', role: 'accountant' },
    { name: 'James Miller', email: 'james@flowdesk.io', role: 'accountant' },
  ]

  for (const u of users) {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [u.name, u.email, hashedPw, u.role]
    )
  }
  console.log('Demo users seeded.')

  // Get user IDs
  const usersResult = await pool.query('SELECT id, email, name FROM users')
  const userMap: Record<string, { id: string; name: string }> = {}
  for (const row of usersResult.rows) {
    userMap[row.email] = { id: row.id, name: row.name }
  }

  const managerId = userMap['manager@flowdesk.io'].id
  const sarahId = userMap['sarah@flowdesk.io'].id
  const jamesId = userMap['james@flowdesk.io'].id

  // Check if documents already seeded
  const docCount = await pool.query('SELECT COUNT(*)::int as count FROM documents')
  if (docCount.rows[0].count === 0) {
    console.log('Seeding documents...')

    const now = new Date()
    const h = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString()

    // 8 documents with various statuses
    const docs = [
      {
        title: 'Field Purchase — Site Materials',
        type: 'purchase_order',
        status: 'pending_review',
        party: 'BuildRight Supplies',
        date: '2026-03-08',
        fileName: 'field-purchase-site-materials.pdf',
        fileSize: 266957,
        source: 'webhook',
        uploader: sarahId,
        createdAt: h(0.5),
      },
      {
        title: 'Marketing Materials — Q1',
        type: 'journal_voucher',
        status: 'pending_review',
        party: 'CreativeEdge Agency',
        date: '2026-03-07',
        fileName: 'marketing-jv-q1.pdf',
        fileSize: 405299,
        source: 'webhook',
        uploader: sarahId,
        createdAt: h(1),
      },
      {
        title: 'Q1 Office Supplies Payment',
        type: 'payment_voucher',
        status: 'pending_review',
        party: 'Staples Inc.',
        date: '2026-03-08',
        fileName: 'q1-office-supplies-pv.pdf',
        fileSize: 239300,
        source: 'web_upload',
        uploader: sarahId,
        createdAt: h(2),
      },
      {
        title: 'Contractor Payment — March',
        type: 'payment_voucher',
        status: 'pending_review',
        party: 'Acme Consulting LLC',
        date: '2026-03-05',
        fileName: 'contractor-march-pv.pdf',
        fileSize: 184600,
        source: 'web_upload',
        uploader: jamesId,
        createdAt: h(5),
      },
      {
        title: 'Server Hosting Invoice — Feb',
        type: 'invoice',
        status: 'needs_correction',
        party: 'AWS',
        date: '2026-02-28',
        fileName: 'aws-feb-invoice.pdf',
        fileSize: 304700,
        source: 'web_upload',
        uploader: sarahId,
        createdAt: h(12),
        rejectionNote: 'Invoice amount does not match the PO. Please verify with AWS and upload the corrected version.',
      },
      {
        title: 'Laptop Purchase Order',
        type: 'purchase_order',
        status: 'approved',
        party: 'Dell Technologies',
        date: '2026-03-01',
        fileName: 'dell-laptops-po.pdf',
        fileSize: 182300,
        source: 'web_upload',
        uploader: jamesId,
        createdAt: h(24),
        approved: true,
      },
      {
        title: 'Catering Receipt — Team Lunch',
        type: 'receipt',
        status: 'approved',
        party: 'Fresh Kitchen Co.',
        date: '2026-03-05',
        fileName: 'catering-receipt-mar5.pdf',
        fileSize: 86900,
        source: 'web_upload',
        uploader: sarahId,
        createdAt: h(36),
        approved: true,
      },
      {
        title: 'Client Refund — Order #4892',
        type: 'credit_note',
        status: 'needs_correction',
        party: 'TechStart Solutions',
        date: '2026-03-02',
        fileName: 'refund-4892-cn.pdf',
        fileSize: 95700,
        source: 'web_upload',
        uploader: jamesId,
        createdAt: h(48),
        rejectionNote: 'Credit note reference number is incorrect. Should be CN-4892 not CN-4982.',
      },
    ]

    for (const doc of docs) {
      const result = await pool.query(
        `INSERT INTO documents (title, type, status, related_party, date, file_name, file_size, source, uploaded_by, rejection_note, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
         RETURNING id`,
        [doc.title, doc.type, doc.status, doc.party, doc.date, doc.fileName, doc.fileSize, doc.source, doc.uploader, doc.rejectionNote || null, doc.createdAt]
      )
      const docId = result.rows[0].id

      // Audit trail: document uploaded
      await pool.query(
        `INSERT INTO document_events (document_id, action, user_name, created_at)
         VALUES ($1, 'Document uploaded', $2, $3)`,
        [docId, doc.uploader === sarahId ? 'Sarah Chen' : 'James Miller', doc.createdAt]
      )

      // If approved, add approval events
      if (doc.approved) {
        const approvedAt = new Date(new Date(doc.createdAt).getTime() + 3600000).toISOString()
        await pool.query(
          `UPDATE documents SET approved_by = $1, approved_at = $2, webhook_triggered = TRUE WHERE id = $3`,
          [managerId, approvedAt, docId]
        )
        await pool.query(
          `INSERT INTO document_events (document_id, action, user_name, created_at)
           VALUES ($1, 'Approved by manager', 'Mustafa Al-Arbash', $2)`,
          [docId, new Date(new Date(doc.createdAt).getTime() + 3600000).toISOString()]
        )
        await pool.query(
          `INSERT INTO document_events (document_id, action, user_name, created_at)
           VALUES ($1, 'Outbound webhook triggered → n8n/Paperless-ngx', 'System', $2)`,
          [docId, new Date(new Date(doc.createdAt).getTime() + 3600000).toISOString()]
        )
      }

      // If rejected, add rejection event
      if (doc.rejectionNote) {
        await pool.query(
          `INSERT INTO document_events (document_id, action, user_name, note, created_at)
           VALUES ($1, 'Rejected by manager', 'Mustafa Al-Arbash', $2, $3)`,
          [docId, doc.rejectionNote, new Date(new Date(doc.createdAt).getTime() + 7200000).toISOString()]
        )
      }
    }
    console.log('8 documents seeded with audit trails.')

    // Seed webhook logs
    const webhookDocs = await pool.query("SELECT id, title FROM documents WHERE source = 'webhook' LIMIT 2")
    if (webhookDocs.rows.length >= 2) {
      await pool.query(
        `INSERT INTO webhook_logs (direction, url, method, status, payload, document_id, created_at)
         VALUES
           ('inbound', '/api/webhooks/inbound', 'POST', 200, $1, $2, $3),
           ('inbound', '/api/webhooks/inbound', 'POST', 200, $4, $5, $6)`,
        [
          JSON.stringify({ source: 'Google Forms', formId: 'form-123', title: webhookDocs.rows[0].title }),
          webhookDocs.rows[0].id,
          h(0.5),
          JSON.stringify({ source: 'Google Forms', formId: 'form-456', title: webhookDocs.rows[1].title }),
          webhookDocs.rows[1].id,
          h(1),
        ]
      )
    }

    const approvedDocs = await pool.query("SELECT id, title FROM documents WHERE status = 'approved' LIMIT 2")
    if (approvedDocs.rows.length >= 2) {
      await pool.query(
        `INSERT INTO webhook_logs (direction, url, method, status, payload, document_id, created_at)
         VALUES
           ('outbound', 'https://n8n.example.com/webhook/archive', 'POST', 200, $1, $2, $3),
           ('outbound', 'https://n8n.example.com/webhook/archive', 'POST', 200, $4, $5, $6)`,
        [
          JSON.stringify({ documentId: approvedDocs.rows[0].id, title: approvedDocs.rows[0].title, archiveTo: 'paperless-ngx' }),
          approvedDocs.rows[0].id,
          h(23),
          JSON.stringify({ documentId: approvedDocs.rows[1].id, title: approvedDocs.rows[1].title, archiveTo: 'paperless-ngx' }),
          approvedDocs.rows[1].id,
          h(35),
        ]
      )
    }
    console.log('Webhook logs seeded.')
  } else {
    console.log(`Skipping document seed (${docCount.rows[0].count} documents already exist).`)
  }

  // Seed webhook config
  const configCount = await pool.query('SELECT COUNT(*)::int as count FROM webhook_config')
  if (configCount.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO webhook_config (name, url, direction)
       VALUES ($1, $2, $3)`,
      ['Archive to Paperless-ngx', 'https://n8n.example.com/webhook/archive', 'outbound']
    )
    console.log('Webhook config seeded.')
  }

  console.log('Migration complete!')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
