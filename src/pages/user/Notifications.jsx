import { Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function UserNotifications() {
  const { userNotifications } = useApp()
  return (
    <div className="stack">
      <h1>Notifications</h1>
      {userNotifications.map((n) => (
        <article className="card" key={n.id} style={{ padding: 16, display: 'flex', gap: 12 }}>
          <div className="stat-icon"><Bell size={18} /></div>
          <div>
            <strong>{n.title}</strong>
            {n.unread && <span className="badge badge-resolved" style={{ marginLeft: 8 }}>New</span>}
            <p style={{ marginTop: 4 }}>{n.body}</p>
            <p className="muted">{n.time}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
