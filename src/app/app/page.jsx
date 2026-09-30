'use client'

import { CheckCircle2, ClipboardPlus, Clock, FilePlus2, Truck } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { useApp } from '@/context/AppContext'

export default function UserDashboard() {
  const { user, complaints, pickups } = useApp()
  // The API already returns only this citizen's records.
  const active = complaints.filter((c) => c.status !== 'Resolved').length
  const resolved = complaints.filter((c) => c.status === 'Resolved').length
  const pendingPickups = pickups.filter((p) => p.status !== 'Completed').length

  return (
    <div className="stack">
      <div className="row space-between">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
          <p style={{ marginTop: 6 }}>Here’s a snapshot of your reports and pickups.</p>
        </div>
        <div className="row">
          <Link href="/app/report" className="btn btn-primary"><FilePlus2 size={16} /> + Report Waste Issue</Link>
          <Link href="/app/pickup" className="btn btn-secondary"><Truck size={16} /> Request Waste Pickup</Link>
        </div>
      </div>

      <div className="stat-grid">
        {[
          ['Active Complaints', active, Clock],
          ['Resolved Complaints', resolved, CheckCircle2],
          ['Pending Pickup Requests', pendingPickups, Truck],
          ['Total Reports', complaints.length, ClipboardPlus],
        ].map(([label, value, Icon]) => (
          <div className="card stat-card" key={label}>
            <div>
              <h3>{label}</h3>
              <strong>{value}</strong>
            </div>
            <div className="stat-icon"><Icon size={20} /></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 8 }}>
        <div className="row space-between" style={{ padding: '12px 14px' }}>
          <h2>Recent Complaints</h2>
          <Link href="/app/complaints" className="btn btn-ghost btn-sm">View all</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Issue Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.date}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr><td colSpan={5} className="muted">No complaints yet — report your first issue.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
