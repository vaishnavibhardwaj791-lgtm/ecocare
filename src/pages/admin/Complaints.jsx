import { Image as ImageIcon, MapPin } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS, STATUS_FLOW } from '../../data/mockData'

export default function AdminComplaints() {
  const { complaints, updateComplaint } = useApp()
  const [active, setActive] = useState(null)
  const [photo, setPhoto] = useState(null)

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
                      <button className="btn btn-ghost btn-sm" onClick={() => setActive(c)}>View</button>
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
        <div className="overlay" onClick={() => setActive(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>{active.id}</h2>
            <p className="muted">{active.citizen} · {active.date}</p>
            <p style={{ marginTop: 10 }}>{active.description}</p>
            <p className="row" style={{ marginTop: 8 }}><MapPin size={14} /> {active.location} {active.landmark ? `· ${active.landmark}` : ''}</p>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-field">
                <label>Assign department</label>
                <select defaultValue={active.department} onChange={(e) => updateComplaint(active.id, { department: e.target.value, status: active.status === 'Submitted' ? 'Assigned' : active.status })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Change status</label>
                <select defaultValue={active.status} onChange={(e) => updateComplaint(active.id, { status: e.target.value })}>
                  {[...STATUS_FLOW, 'Reopened'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="row">
              <button className="btn btn-primary" onClick={() => { updateComplaint(active.id, { status: 'Resolved' }); setActive(null) }}>Mark as resolved</button>
              <button className="btn btn-secondary" onClick={() => setPhoto(active)}><ImageIcon size={16} /> View uploaded image</button>
              <button className="btn btn-ghost" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {photo && (
        <div className="overlay" onClick={() => setPhoto(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{photo.id} · photo</h3>
            <img src={photo.photo} alt="" style={{ width: '100%', borderRadius: 12, marginTop: 12 }} />
            <div className="map-preview" style={{ marginTop: 12, height: 160 }} />
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setPhoto(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
