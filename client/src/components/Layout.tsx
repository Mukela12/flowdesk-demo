import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LordIcon from '@/shared/components/LordIcon'
import { useState } from 'react'
import { Menu, X, ChevronRight, LogOut } from 'lucide-react'

const navItems = [
  {
    to: '/dashboard',
    icon: 'system-regular-41-home-hover-home',
    label: 'Dashboard',
  },
  {
    to: '/upload',
    icon: 'system-regular-49-upload-file-hover-upload-1',
    label: 'Upload Document',
    roles: ['accountant'],
  },
  {
    to: '/documents',
    icon: 'system-regular-69-document-scan-hover-scan',
    label: 'All Documents',
  },
  {
    to: '/webhooks',
    icon: 'system-regular-59-email-hover-email',
    label: 'Webhook Logs',
  },
]

export default function Layout() {
  const { user, logout, isManager } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  )

  const getPageName = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') return 'Dashboard'
    if (location.pathname === '/upload') return 'Upload'
    if (location.pathname === '/webhooks') return 'Webhooks'
    if (location.pathname.startsWith('/documents/')) return 'Document Detail'
    if (location.pathname === '/documents') return 'Documents'
    return 'Page'
  }

  return (
    <div data-theme="flowdesk" className="flex h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dark Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center px-5 gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-500)' }}
          >
            <LordIcon
              name="system-regular-69-document-scan-hover-scan"
              size={18}
              trigger="hover"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span
            className="font-semibold text-lg tracking-tight"
            style={{ color: 'var(--sidebar-text-active)' }}
          >
            FlowDesk
          </span>
          <button
            className="ml-auto lg:hidden p-1 rounded"
            style={{ color: 'var(--sidebar-text)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="sidebar-section mb-3">WORKSPACE</div>
          {filteredNav.map((item) => {
            const isActive = item.to === '/dashboard'
              ? location.pathname === '/dashboard' || location.pathname === '/'
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`cmd-nav-item ${isActive ? 'cmd-nav-item--active' : ''}`}
              >
                <LordIcon
                  name={item.icon}
                  size={18}
                  trigger="hover"
                  style={{ filter: 'brightness(0) invert(1)', opacity: isActive ? 1 : 0.6 }}
                />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* User section */}
        <div
          className="p-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: 'var(--accent-500)', color: '#fff' }}
            >
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--sidebar-text-active)' }}>
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--sidebar-text)' }}>
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--sidebar-text)' }}
              title="Sign out"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--sidebar-text-active)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="h-14 flex items-center px-6 gap-4 flex-shrink-0"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <button
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>FlowDesk</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: 'var(--text-secondary)' }}>{getPageName()}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <LordIcon
                name="system-regular-46-notification-bell-hover-bell"
                size={20}
                trigger="hover"
              />
              <span className="pulse-dot" />
            </div>

            {/* Role badge */}
            {isManager ? (
              <span className="badge badge--accent">Manager</span>
            ) : (
              <span className="badge badge--success">Accountant</span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
