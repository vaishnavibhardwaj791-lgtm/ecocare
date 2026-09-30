import { Camera, CheckCircle2, LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import MapPreview from '../../components/MapPreview'
import { useApp } from '../../context/AppContext'
import { ISSUE_TYPES } from '../../data/mockData'

export default function ReportIssue() {
  const { addComplaint } = useApp()
  const [submitted, setSubmitted] = useState(null)
  const [photoName, setPhotoName] = useState('')
  const [form, setForm] = useState({
    category: ISSUE_TYPES[0],
    description: '',
    location: '',
    landmark: '',
    photo: 'https://images.unsplash.com/photo-1611284446314-60a74ac6a437?w=800&q=80',
  })

  const useLocation = () => {
    setForm((f) => ({ ...f, location: 'Current location · Lakeview Society, Ward 12 (12.97° N, 77.59° E)' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const item = addComplaint(form)
    setSubmitted(item)
  }

  if (submitted) {
    return (
      <div className="card success-box">
        <div className="check"><CheckCircle2 size={36} /></div>
        <h2>Complaint submitted</h2>
        <p style={{ margin: '10px 0 20px' }}>Your report is with the ward sanitation team.</p>
        <div className="stack" style={{ textAlign: 'left' }}>
          <p><strong>Complaint ID:</strong> {submitted.id}</p>
          <p><strong>Status:</strong> Submitted</p>
          <p><strong>Location:</strong> {submitted.location}</p>
          <p><strong>Estimated response:</strong> Crew review within 6–12 hours. Cleanup typically within 24–48 hours for high-priority bins.</p>
        </div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 22 }}>
          <Link className="btn btn-primary" to="/app/complaints">Track complaint</Link>
          <button className="btn btn-secondary" onClick={() => setSubmitted(null)}>Report another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="two-col">
      <form className="card" style={{ padding: 22 }} onSubmit={submit}>
        <h1>Report Waste Issue</h1>
        <p style={{ margin: '8px 0 20px' }}>Share a photo and location so crews can act faster.</p>
        <div className="form-field">
          <label>Issue Type</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Upload Photo</label>
          <label className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Camera size={16} /> {photoName || 'Choose an image'}
            <input type="file" accept="image/*" hidden onChange={(e) => setPhotoName(e.target.files?.[0]?.name || '')} />
          </label>
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you notice?" required />
        </div>
        <div className="form-field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Street, society, campus or landmark" required />
        </div>
        <button type="button" className="btn btn-ghost" onClick={useLocation} style={{ marginBottom: 16 }}>
          <LocateFixed size={16} /> Use Current Location
        </button>
        <div className="form-field">
          <label>Optional landmark</label>
          <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near gate 2, behind canteen..." />
        </div>
        <button className="btn btn-primary btn-lg" type="submit">Submit Complaint</button>
      </form>
      <MapPreview label={form.location || 'Pin your issue'} />
    </div>
  )
}
