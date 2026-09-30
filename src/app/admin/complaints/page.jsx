'use client'

import { Image as ImageIcon, MapPin } from 'lucide-react'
import { useState } from 'react'
import ComplaintPhoto from '@/components/ComplaintPhoto'
import StatusBadge from '@/components/StatusBadge'
import { useApp } from '@/context/AppContext'
import { COMPLAINT_STATUSES, DEPARTMENTS, PRIORITIES } from '@/lib/constants'

export default function AdminComplaints() {
  const { complaints, updateComplaint } = useApp()
  const [activeId, setActiveId] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  // Read from the live list so the modal reflects saved changes.
  const active = complaints.find((c) => c.id === activeId)

  const update = async (patch) => {
    setError('')
    try {
      await updateComplaint(active.id, patch)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stack">
      <h1>Complaint management</h1>
      <div className="card" style={{ padding: 8 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Assigned Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td>{c.citizen}</td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.date}</td>
                  <td><span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                  <td>{c.department || '—'}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="row">
                      <button className="btn btn-ghost btn-sm" onClick={() => setActiveId(c.id)}>View</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setPhoto(c)}>Image</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {active && (
        <div className="overlay" onClick={() => setActiveId(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>{active.id}</h2>
            <p className="muted">{active.citizen} · {active.citizenEmail} · {active.date}</p>
            <p style={{ marginTop: 10 }}>{active.description}</p>
            <p className="row" style={{ marginTop: 8 }}><MapPin size={14} /> {active.location} {active.landmark ? `· ${active.landmark}` : ''}</p>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-field">
                <label>Assign department</label>
                <select value={active.department} onChange={(e) => update({ department: e.target.value, status: active.status === 'Submitted' && e.target.value ? 'Assigned' : active.status })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Change status</label>
                <select value={active.status} onChange={(e) => update({ status: e.target.value })}>
                  {COMPLAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Priority</label>
              <select value={active.priority} onChange={(e) => update({ priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
            <div className="row">
              <button className="btn btn-primary" onClick={async () => { await update({ status: 'Resolved' }); setActiveId(null) }}>Mark as resolved</button>
              <button className="btn btn-secondary" onClick={() => setPhoto(active)}><ImageIcon size={16} /> View uploaded image</button>
              <button className="btn btn-ghost" onClick={() => setActiveId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {photo && (
        <div className="overlay" onClick={() => setPhoto(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{photo.id} · photo</h3>
            <ComplaintPhoto src={photo.photo} style={{ width: '100%', borderRadius: 12, marginTop: 12 }} />
            {!photo.photo && <p className="muted" style={{ marginTop: 8 }}>No photo was uploaded with this complaint.</p>}
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setPhoto(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
