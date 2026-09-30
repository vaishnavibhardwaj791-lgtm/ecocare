'use client'

import { Camera, CheckCircle2, LocateFixed } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MapPreview from '@/components/MapPreview'
import { useApp } from '@/context/AppContext'
import { ISSUE_TYPES } from '@/lib/constants'

const MAX_BYTES = 5 * 1024 * 1024

export default function ReportIssue() {
  const { addComplaint } = useApp()
  const [submitted, setSubmitted] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    category: ISSUE_TYPES[0],
    description: '',
    location: '',
    landmark: '',
  })

  // Release the old object URL whenever the preview changes or the page unmounts.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const pickPhoto = (file) => {
    setError('')
    if (file && file.size > MAX_BYTES) {
      setError('Image must be 5 MB or smaller')
      return
    }
    setPhotoFile(file || null)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location is not available in this browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm((f) => ({ ...f, location: `Current location (${coords.latitude.toFixed(5)}° N, ${coords.longitude.toFixed(5)}° E)` })),
      () => setError('Could not read your location — please type it instead'),
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      setSubmitted(await addComplaint({ ...form, photoFile }))
      setForm({ category: ISSUE_TYPES[0], description: '', location: '', landmark: '' })
      setPhotoFile(null)
      setPreview('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (submitted) {
    return (
      <div className="card success-box">
        <div className="check"><CheckCircle2 size={36} /></div>
        <h2>Complaint submitted</h2>
        <p style={{ margin: '10px 0 20px' }}>Your report is with the ward sanitation team.</p>
        <div className="stack" style={{ textAlign: 'left' }}>
          <p><strong>Complaint ID:</strong> {submitted.id}</p>
          <p><strong>Status:</strong> {submitted.status}</p>
          <p><strong>Location:</strong> {submitted.location}</p>
          <p><strong>Estimated response:</strong> Crew review within 6–12 hours. Cleanup typically within 24–48 hours for high-priority bins.</p>
        </div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 22 }}>
          <Link className="btn btn-primary" href="/app/complaints">Track complaint</Link>
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
            <Camera size={16} /> {photoFile?.name || 'Choose an image (JPG, PNG, WEBP · max 5 MB)'}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} />
          </label>
          {preview && (
            <img src={preview} alt="Selected" style={{ marginTop: 10, borderRadius: 12, maxHeight: 180, objectFit: 'cover', width: '100%' }} />
          )}
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you notice?" required />
        </div>
        <div className="form-field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Street, society, campus or landmark" required />
        </div>
        <button type="button" className="btn btn-ghost" onClick={useCurrentLocation} style={{ marginBottom: 16 }}>
          <LocateFixed size={16} /> Use Current Location
        </button>
        <div className="form-field">
          <label>Optional landmark</label>
          <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near gate 2, behind canteen..." />
        </div>
        {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
        <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit Complaint'}</button>
      </form>
      <MapPreview label={form.location || 'Pin your issue'} />
    </div>
  )
}
