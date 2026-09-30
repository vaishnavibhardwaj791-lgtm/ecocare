import { CheckCircle2, ClipboardPlus, Clock, FilePlus2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { useApp } from '../../context/AppContext'

export default function UserDashboard() {
  const { user, complaints, pickups } = useApp()
  const mine = complaints.filter((c) => c.citizenEmail === user?.email || c.citizen === user?.name)
  const myPickups = pickups.filter((p) => p.citizenEmail === user?.email || p.citizen === user?.name)
  const active = mine.filter((c) => !['Resolved'].includes(c.status)).length
  const resolved = mine.filter((c) => c.status === 'Resolved').length
  const pendingPickups = myPickups.filter((p) => p.status !== 'Completed').length

  return (
    <div className="stack">
      <div className="row space-between">
        <div>
          <h1>Welcome back!</h1>
          <p style={{ marginTop: 6 }}>Here’s a snapshot of your reports and pickups.</p>
        </div>
        <div className="row">
          <Link to="/app/report" className="btn btn-primary"><FilePlus2 size={16} /> + Report Waste Issue</Link>
          <Link to="/app/pickup" className="btn btn-secondary"><Truck size={16} /> Request Waste Pickup</Link>
        </div>
      </div>

      <div className="stat-grid">
        {[
          ['Active Complaints', active, Clock],
          ['Resolved Complaints', resolved, CheckCircle2],
          ['Pending Pickup Requests', pendingPickups, Truck],
          ['Total Reports', mine.length, ClipboardPlus],
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
          <Link to="/app/complaints" className="btn btn-ghost btn-sm">View all</Link>
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
              {mine.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.date}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
