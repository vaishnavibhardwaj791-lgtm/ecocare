'use client'

import { Bell } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { timeAgo } from '@/lib/constants'

export default function NotificationList({ badgeClass, badgeLabel }) {
  const { notifications, markNotificationsRead, loading } = useApp()
  const marked = useRef(false)

  // Opening the page marks everything as read (which clears the top-bar count);
  // the "New" badges stay visible for this visit so the user can still see what changed.
  useEffect(() => {
    if (!marked.current && notifications.some((n) => n.unread)) {
      marked.current = true
      markNotificationsRead()
    }
  }, [notifications, markNotificationsRead])

  return (
    <div className="stack">
      <h1>Notifications</h1>
      {notifications.map((n) => (
        <article className="card" key={n.id} style={{ padding: 16, display: 'flex', gap: 12 }}>
          <div className="stat-icon"><Bell size={18} /></div>
          <div>
            <strong>{n.title}</strong>
            {(n.unread || n.fresh) && <span className={`badge ${badgeClass}`} style={{ marginLeft: 8 }}>{badgeLabel}</span>}
            <p style={{ marginTop: 4 }}>{n.body}</p>
            <p className="muted">{timeAgo(n.createdAt)}</p>
          </div>
        </article>
      ))}
      {!loading && notifications.length === 0 && <p className="muted">You’re all caught up.</p>}
    </div>
  )
}
