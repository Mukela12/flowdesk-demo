import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import LordIcon from '@/shared/components/LordIcon'
import { useAuth } from '@/context/AuthContext'
import { documentsApi } from '@/api/documents'
import type { DocumentType } from '@/types'
import { DOCUMENT_TYPE_LABELS } from '@/types'

export default function Upload() {
  const navigate = useNavigate()
  const { isAccountant } = useAuth()
  const [title, setTitle] = useState('')
  const [docType, setDocType] = useState<DocumentType>('payment_voucher')
  const [relatedParty, setRelatedParty] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    maxSize: 10485760,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError('')
    try {
      await documentsApi.upload({
        title,
        type: docType,
        relatedParty,
        date,
        file,
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!isAccountant) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <LordIcon name="system-regular-90-lock-closed-hover-pinch" size={48} trigger="loop" />
        <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
          Only accountants can upload documents.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--success-bg)' }}
        >
          <LordIcon name="system-regular-31-check-hover-pinch" size={32} trigger="loop" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Document Uploaded
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your document has been submitted for review.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        Upload Document
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Upload a PDF or image to start the approval workflow.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File dropzone */}
        <div
          {...getRootProps()}
          className={`fd-dropzone ${
            isDragActive ? 'fd-dropzone--active' : file ? 'fd-dropzone--success' : ''
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <LordIcon name="system-regular-69-document-scan-hover-scan" size={32} trigger="hover" />
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {file.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="p-1 rounded"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <LordIcon name="system-regular-49-upload-file-hover-upload-1" size={40} trigger="loop" />
              <p className="text-sm font-medium mt-3" style={{ color: 'var(--text-secondary)' }}>
                Drop a file here, or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                PDF or images up to 10MB
              </p>
            </>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="fd-label">Document Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q1 Office Supplies Payment"
            className="fd-input"
            required
          />
        </div>

        {/* Type + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="fd-label">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="fd-select w-full"
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="fd-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="fd-input"
              required
            />
          </div>
        </div>

        {/* Related Party */}
        <div>
          <label className="fd-label">Related Party</label>
          <input
            type="text"
            value={relatedParty}
            onChange={(e) => setRelatedParty(e.target.value)}
            placeholder="e.g. Acme Corp, AWS, Dell Technologies"
            className="fd-input"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!file || !title || !relatedParty || uploading}
            className="btn btn--primary"
            style={{ opacity: (!file || !title || !relatedParty || uploading) ? 0.5 : 1 }}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LordIcon
                name="system-regular-49-upload-file-hover-upload-1"
                size={16}
                trigger="click"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            )}
            {uploading ? 'Uploading...' : 'Submit for Review'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn--secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
