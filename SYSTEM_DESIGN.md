# System Design — FlowDesk

## Job Reference
**Upwork Job:** Web Based Workflow Software (https://www.upwork.com/jobs/~022030931910404483362)
**Client:** Mustafa Alarbash
**Industry:** Accounting / Document Management
**Budget:** $650 fixed
**Timeline:** 2 days

> Cross-reference: See `JOB_ANALYSIS.md` for full extraction.

## Overview
FlowDesk is a lightweight web-based document approval system that manages the lifecycle of accounting and purchasing documents through a Review → Approve/Reject → Archive pipeline. Documents enter via direct upload or Google Forms webhooks, move through manager review, and upon approval trigger outbound webhooks to archive systems (n8n/Paperless-ngx).

## User Personas

### Persona 1: Mustafa (Manager)
- **Goals:** Review all incoming documents quickly, approve or reject with notes
- **Pain points:** Missing documents in email chains, no visibility into approval status
- **Key tasks:** Review pending docs, approve/reject, view audit trail, monitor webhook activity, delete documents
- **Tech comfort:** Medium

### Persona 2: Sarah (Accountant)
- **Goals:** Upload documents with correct metadata, fix rejected docs fast
- **Pain points:** Not knowing why a document was rejected, losing track of versions
- **Key tasks:** Upload PDFs with metadata, view rejection notes, replace and resubmit corrected files
- **Tech comfort:** Medium

## Feature List

### P0 (Must Have — built for demo)
- [x] Secure login with role-based access (Manager / Accountant)
- [x] Dashboard with document stats (pending, rejected, approved, archived counts)
- [x] Document upload with metadata (date, type, related party, file)
- [x] Document list with search, filter by status and type
- [x] Document detail with approve/reject actions (manager)
- [x] Rejection notes displayed to accountant
- [x] Replace & resubmit workflow for rejected documents
- [x] Full audit trail per document
- [x] Inbound webhook endpoint for Google Forms/n8n
- [x] Outbound webhook on approval (to n8n/Paperless-ngx)
- [x] Webhook activity log
- [x] Manager can delete any document

### P1 (Should Have)
- [ ] Email notifications on status change
- [ ] Webhook configuration UI (editable URLs)
- [ ] Document versioning comparison

### P2 (Nice to Have)
- [ ] Keyboard shortcuts (Cmd+K command palette)
- [ ] PDF inline preview
- [ ] Bulk approve/reject

## Data Model

### Entity: User
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | UUID | Unique identifier | Yes |
| name | string | Full name | Yes |
| email | string | Login email (unique) | Yes |
| password_hash | string | Bcrypt hash | Yes |
| role | enum | 'manager' or 'accountant' | Yes |
| createdAt | Date | Creation timestamp | Yes |

### Entity: Document
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | UUID | Unique identifier | Yes |
| title | string | Document title | Yes |
| type | enum | payment_voucher, journal_voucher, etc. | Yes |
| status | enum | pending_review, needs_correction, approved, archived | Yes |
| relatedParty | string | Vendor/client name | Yes |
| date | Date | Document date | Yes |
| fileName | string | Original file name | Yes |
| fileSize | int | File size in bytes | Yes |
| filePath | string | Storage path | No |
| source | enum | 'web_upload' or 'webhook' | Yes |
| version | int | Version number (increments on resubmit) | Yes |
| rejectionNote | string | Manager's rejection reason | No |
| uploadedBy | UUID (FK→User) | Uploader | Yes |
| approvedBy | UUID (FK→User) | Approver | No |
| approvedAt | Date | Approval timestamp | No |
| webhookTriggered | boolean | Whether outbound webhook fired | No |
| createdAt | Date | Upload timestamp | Yes |
| updatedAt | Date | Last update | Yes |

### Entity: DocumentEvent (Audit Trail)
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | UUID | Unique identifier | Yes |
| documentId | UUID (FK→Document) | Parent document | Yes |
| action | string | What happened | Yes |
| userName | string | Who did it | Yes |
| note | string | Optional detail | No |
| createdAt | Date | Timestamp | Yes |

### Entity: WebhookLog
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | UUID | Unique identifier | Yes |
| direction | enum | 'inbound' or 'outbound' | Yes |
| url | string | Endpoint URL | Yes |
| method | string | HTTP method | Yes |
| status | int | Response status code | Yes |
| payload | JSON | Request body | No |
| documentId | UUID (FK→Document) | Related document | No |
| createdAt | Date | Timestamp | Yes |

### Relationships
- User has many Documents (as uploader)
- User has many Documents (as approver)
- Document has many DocumentEvents
- Document has many WebhookLogs

## Page Map

| Page | Route | Key Components | Description | Priority |
|------|-------|---------------|-------------|----------|
| Login | `/login` | RiveCursorTracker, Input, Button | Auth with demo credentials, Rive animation | P0 |
| Dashboard | `/dashboard` | StatCards, DocumentTable, StatusBadge | Overview with KPIs and recent documents | P0 |
| Documents | `/documents` | DataTable, Search, Filters, StatusBadge | Full document list with search/filter | P0 |
| Document Detail | `/documents/:id` | StatusBadge, AuditTrail, Approve/Reject buttons | View doc, take action, see history | P0 |
| Upload | `/upload` | FileDropzone, Input, Select, DatePicker | Upload form (accountant only) | P0 |
| Webhooks | `/webhooks` | WebhookLogTable, EndpointConfig | Monitor webhook activity | P0 |

## Component Shopping List

| Component | Page(s) | Purpose | Source |
|-----------|---------|---------|--------|
| LordIcon | Layout sidebar | Animated nav icons | `@/shared/components/LordIcon` |
| RiveCursorTracker | Login | Interactive cursor-tracking animation | `@/shared/components/RiveCursorTracker` |
| StatusBadge | Dashboard, Documents, Detail | Document status display | Theme CSS `.badge--*` classes |
| DataTable | Documents, Webhooks | Sortable document/log tables | Theme CSS `.cmd-table` |
| StatCard | Dashboard | KPI metrics | Theme CSS `.cmd-stat` |
| Button | All pages | Actions | Theme CSS `.btn` `.btn--primary/danger/secondary` |
| Input | Login, Upload | Form fields | `@/shared/ui/input` |
| Select | Upload, Filters | Dropdowns | Native select + theme styles |
| Card | Dashboard, Detail | Content containers | Theme CSS `.cmd-card` |
| Badge | All pages | Status indicators | Theme CSS `.badge--*` |
| react-dropzone | Upload | File drag & drop | npm package |

## Icon Selection

### Animated Icons (LordIcon)
| Icon Name | Purpose | Trigger | Page |
|-----------|---------|---------|------|
| `system-regular-41-home-hover-home` | Dashboard nav | hover | Layout |
| `system-regular-69-document-scan-hover-scan` | Documents nav | hover | Layout |
| `system-regular-49-upload-file-hover-upload-1` | Upload nav | hover | Layout |
| `system-regular-59-email-hover-email` | Webhooks nav | hover | Layout |
| `system-regular-78-check-list-hover-check-list` | Audit trail | hover | Layout |
| `system-regular-31-check-hover-pinch` | Approve action | click | Detail |
| `system-regular-52-wrong-file-hover-wrong-file-1` | Reject action | click | Detail |
| `system-regular-46-notification-bell-hover-bell` | Notifications | hover | Header |

### Static Icons
Using Lucide React for utility icons (arrows, search, filter, etc.) — consistent with Command theme's clean aesthetic.

## Theme Choice

**Selected:** Command

**Reason:** Command is a professional, productivity-focused theme with a Slack-like dark sidebar and clean light content area. It has built-in status dots, data tables, badges, stat cards, and button variants that map directly to document workflow states. The enterprise feel matches an accounting/document management context.

**Key Theme Traits to Leverage:**
- Dark sidebar with active state indicators — clear navigation for the 3 user roles
- Status badge system (`badge--accent`, `badge--success`, `badge--warning`, `badge--error`) — maps to document states
- Data table with hover rows — perfect for document lists
- Stat cards — dashboard KPI metrics

## Login Page Animation

**Rive Animation:** `blue-guy.riv`

**Placement:** Left panel (split layout)

**Why:** The blue-guy animation is professional and friendly, matching the Command theme's blue accent color. Cursor tracking adds a premium interactive feel.

## Infrastructure

**Frontend Hosting:** Netlify (demo)
**Backend:** Express + PostgreSQL (Docker)
**CI/CD:** Manual deploy
**Domain:** flowdesk-demo.netlify.app

## Compliance Checklist
- [x] Every client requirement has a matching P0 feature
- [x] Command theme matches client's professional tone
- [x] Page map covers all screens (login, dashboard, documents, detail, upload, webhooks)
- [x] Component list uses shared catalog
- [x] Login animation selected (blue-guy.riv)
