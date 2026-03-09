import pool from './pool.js'

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

  // Seed default webhook config if not present
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
