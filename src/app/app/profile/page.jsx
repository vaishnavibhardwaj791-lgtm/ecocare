'use client'

import { Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Profile() {
  const { user, updateProfile } = useApp()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateProfile(form)
      setForm(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{ padding: 24, maxWidth: 640 }}>
      <div className="row" style={{ marginBottom: 20 }}>
        <div className="stat-icon" style={{ width: 56, height: 56 }}><UserRound /></div>
        <div>
          <h1>{user?.name}</h1>
          <p>Citizen account</p>
        </div>
      </div>

      {form ? (
        <form onSubmit={save}>
          <div className="form-field"><label>Full name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-field"><label>Area / Ward</label><input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
          </div>
          {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
          <div className="row">
            <button className="btn btn-primary" type="submit">Save</button>
            <button className="btn btn-secondary" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p className="row"><Mail size={16} /> {user?.email}</p>
          <p className="row" style={{ marginTop: 8 }}><Phone size={16} /> {user?.phone || '—'}</p>
          <p className="row" style={{ marginTop: 8 }}><MapPin size={16} /> {user?.area || '—'}</p>
          <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => setForm({ name: user.name, phone: user.phone || '', area: user.area || '' })}>
            Edit profile
          </button>
        </>
      )}
    </div>
  )
}
