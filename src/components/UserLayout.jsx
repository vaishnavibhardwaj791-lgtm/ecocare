import {
  Bell,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Recycle,
  Truck,
  UserRound,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AIAssistant from './AIAssistant'

const links = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/report', label: 'Report Issue', icon: ClipboardList },
  { to: '/app/pickup', label: 'Pickup Request', icon: Truck },
  { to: '/app/complaints', label: 'My Complaints', icon: Recycle },
  { to: '/app/awareness', label: 'Waste Awareness', icon: BookOpen },
  { to: '/app/centers', label: 'Recycling Centers', icon: MapPinned },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export default function UserLayout() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="logo"><Recycle size={22} /> EcoWaste</div>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <button className="nav-link" style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => { logout(); navigate('/') }}>
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
              <div className="muted">Citizen portal</div>
              <strong>{user?.name}</strong>
            </div>
          </div>
          <div className="row">
            <NavLink to="/app/notifications" className="btn btn-secondary btn-sm"><Bell size={16} /></NavLink>
          </div>
        </header>
        <div className="content page-fade">
          <Outlet />
        </div>
      </div>
      {open && <div className="overlay" style={{ background: 'rgba(16,32,24,0.25)', zIndex: 25 }} onClick={() => setOpen(false)} />}
      <AIAssistant />
    </div>
  )
}
