'use client'

import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Recycle,
  Settings,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import NavLink from './NavLink'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: ClipboardList },
  { to: '/admin/pickups', label: 'Pickup Requests', icon: Truck },
  { to: '/admin/centers', label: 'Waste Centers', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useApp()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="logo"><Recycle size={22} /> EcoWaste Admin</div>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} href={to} end={end} className="nav-link" onClick={() => setOpen(false)}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <button className="nav-link" style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer' }} onClick={async () => { await logout(); router.replace('/') }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="row">
            <button className="btn btn-secondary btn-sm menu-btn" onClick={() => setOpen((v) => !v)}>
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div>
              <div className="muted">Municipal operations</div>
              <strong>{user?.name || 'Admin'}</strong>
            </div>
          </div>
        </header>
        <div className="content page-fade">
          {children}
        </div>
      </div>
      {open && <div className="overlay" style={{ background: 'rgba(16,32,24,0.25)', zIndex: 25 }} onClick={() => setOpen(false)} />}
    </div>
  )
}
