# Job Analysis — Web Based Workflow Software

## Client Profile
- **Client:** Mustafa Alarbash
- **Industry:** Accounting / Document Management
- **Location:** Kuwait
- **Budget:** $650 fixed
- **Timeline:** 2 days (demo in 3 hours)
- **Client history:** $16K spent, 5.0 rating, payment verified (Tier 2)
- **Job URL:** https://www.upwork.com/jobs/~022030931910404483362

## Requirements Extraction

### Target Audience
- Manager (1 user): full visibility, approve/reject/delete
- Accountants (2 users): upload documents, edit rejected documents only

### Key Features
1. **Document Upload** — PDF upload with metadata (Date, Type, Related Party)
2. **Approval Workflow** — Pending Review → Approve (→ Archive webhook) or Reject (→ Needs Correction → Resubmit)
3. **Role-Based Access** — Manager sees all, Accountants see all but edit only their rejected docs
4. **Inbound Webhooks** — Google Forms / n8n send data via API
5. **Outbound Webhooks** — On approval, POST document + metadata to n8n for archival (Paperless-ngx / Mayan EDMS)
6. **Audit Trail** — Full history from upload to archive
7. **File Handling** — Secure PDF/image storage during workflow
8. **Authentication** — Secure login for all users

### Metadata Fields
- Date
- Document Type (dropdown): Payment Voucher, Journal Voucher, Purchase Order, Invoice, Receipt, Credit Note
- Related Party (text/searchable)

### Technical Requirements
- Docker + Docker Compose (runs with `docker compose up`)
- PostgreSQL 17+
- Source code with documentation
- Runs on Linux server

### Tone/Brand
- Professional, enterprise-ready
- Clean and functional — this is an internal tool, not consumer-facing
- Focus on usability and clarity of workflow states

### Document Types (Dropdown)
- Payment Voucher
- Journal Voucher
- Purchase Order
- Invoice
- Receipt
- Credit Note

### Workflow States
1. `pending_review` — uploaded, waiting for manager
2. `needs_correction` — rejected by manager, accountant can replace
3. `approved` — manager approved, outbound webhook triggered
4. `archived` — confirmed by archive system

### Integration Points
- **Input A:** Direct PDF upload via web interface
- **Input B:** Google Forms data via inbound webhook/API
- **Outbound:** Webhook on approval → n8n → Paperless-ngx/Mayan EDMS
