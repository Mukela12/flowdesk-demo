import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Upload,
  FileText,
  Webhook,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Document', roles: ['accountant'] },
  { to: '/documents', icon: FileText, label: 'All Documents' },
  { to: '/webhooks', icon: Webhook, label: 'Webhook Logs' },
]

export default function Layout() {
  const { user, logout, isManager } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  )

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-slate-900 tracking-tight">FlowDesk</span>
          <button
            className="ml-auto lg:hidden p-1 hover:bg-slate-100 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0">
          <button
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>FlowDesk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {isManager && (
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                Manager View
              </span>
            )}
            {!isManager && (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                Accountant View
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
