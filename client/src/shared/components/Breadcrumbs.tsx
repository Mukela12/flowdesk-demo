import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbsProps {
  /** Override labels for path segments (e.g., { 'course': 'Course Details' }) */
  labels?: Record<string, string>
  className?: string
}

export default function Breadcrumbs({ labels = {}, className = '' }: BreadcrumbsProps) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1

    // Human-readable label
    let label = labels[segment] || segment
    label = label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' ')

    // First segment is the theme name — use "Dashboard"
    if (index === 0) label = 'Dashboard'

    return { label, path, isLast }
  })

  return (
    <nav className={`flex items-center gap-1.5 text-[12px] ${className}`}>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          {i > 0 && (
            <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>/</span>
          )}
          {crumb.isLast ? (
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="transition-colors no-underline"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
