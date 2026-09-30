import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const empty = { name: '', types: ['Plastic'], address: '', phone: '', hours: '9:00 AM – 6:00 PM' }

export default function AdminCenters() {
  const { centers, addCenter, updateCenter, removeCenter } = useApp()
  const [form, setForm] = useState(null)
  const [view, setView] = useState(null)

  const save = (e) => {
    e.preventDefault()
    const payload = { ...form, types: String(form.types).split(',').map((t) => t.trim()).filter(Boolean) }
    if (form.id) updateCenter(form.id, payload)
    else addCenter(payload)
    setForm(null)
  }

  return (
    <div className="stack">
      <div className="row space-between">
        <h1>Waste Centers</h1>
        <button className="btn btn-primary" onClick={() => setForm({ ...empty })}><Plus size={16} /> + Add Waste Center</button>
      </div>
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {centers.map((c) => (
          <article className="card info-card" key={c.id}>
            <h3>{c.name}</h3>
            <p className="muted" style={{ marginTop: 6 }}>{c.types.join(', ')}</p>
            <p className="row" style={{ marginTop: 10 }}><MapPin size={14} /> {c.address}</p>
            <p className="muted">{c.phone} · {c.hours}</p>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setView(c)}>View location</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setForm({ ...c, types: c.types.join(', ') })}><Pencil size={14} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => removeCenter(c.id)}><Trash2 size={14} /></button>
            </div>
          </article>
        ))}
      </div>

      {form && (
        <div className="overlay" onClick={() => setForm(null)}>
          <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{form.id ? 'Edit center' : 'Add Waste Center'}</h2>
            <div className="form-field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-field"><label>Accepted waste types (comma separated)</label><input value={form.types} onChange={(e) => setForm({ ...form, types: e.target.value })} /></div>
            <div className="form-field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
            <div className="form-row">
              <div className="form-field"><label>Contact</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-field"><label>Hours</label><input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></div>
            </div>
            <div className="row">
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn btn-secondary" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {view && (
        <div className="overlay" onClick={() => setView(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>{view.name}</h2>
            <p>{view.address}</p>
            <p>{view.phone} · {view.hours}</p>
            <p className="muted">Accepts: {view.types.join(', ')}</p>
            <div className="map-preview" style={{ marginTop: 12 }}>
              <div className="map-pin" style={{ left: `${view.x}%`, top: `${view.y}%` }}><MapPin /></div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setView(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
