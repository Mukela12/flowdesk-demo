import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, X, CheckCircle2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '@/context/AuthContext'
import { mockUploadDocument } from '@/mock/data'
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
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    mockUploadDocument({
      title,
      type: docType,
      relatedParty,
      date,
      fileName: file.name,
      fileSize: file.size,
    })
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  if (!isAccountant) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Only accountants can upload documents.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Document Uploaded</h2>
        <p className="text-slate-500">Your document has been submitted for review.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Upload Document</h1>
      <p className="text-sm text-slate-500 mb-8">
        Upload a PDF or image to start the approval workflow.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-indigo-400 bg-indigo-50'
              : file
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-emerald-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
                className="p-1 hover:bg-slate-200 rounded"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                Drop a file here, or click to browse
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF or images up to 10MB</p>
            </>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q1 Office Supplies Payment"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm"
            required
          />
        </div>

        {/* Type + Date row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm bg-white"
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm"
              required
            />
          </div>
        </div>

        {/* Related Party */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Related Party
          </label>
          <input
            type="text"
            value={relatedParty}
            onChange={(e) => setRelatedParty(e.target.value)}
            placeholder="e.g. Acme Corp, AWS, Dell Technologies"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!file || !title || !relatedParty}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UploadIcon className="w-4 h-4" />
            Submit for Review
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
