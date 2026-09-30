import { Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminNotifications() {
  const { adminNotifications } = useApp()
  return (
    <div className="stack">
      <h1>Notifications</h1>
      {adminNotifications.map((n) => (
        <article className="card" key={n.id} style={{ padding: 16, display: 'flex', gap: 12 }}>
          <div className="stat-icon"><Bell size={18} /></div>
          <div>
            <strong>{n.title}</strong>
            {n.unread && <span className="badge badge-in-progress" style={{ marginLeft: 8 }}>Alert</span>}
            <p style={{ marginTop: 4 }}>{n.body}</p>
            <p className="muted">{n.time}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
