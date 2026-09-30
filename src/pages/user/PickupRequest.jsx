import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import MapPreview from '../../components/MapPreview'
import { useApp } from '../../context/AppContext'
import { WASTE_TYPES } from '../../data/mockData'

export default function PickupRequest() {
  const { addPickup } = useApp()
  const [done, setDone] = useState(null)
  const [form, setForm] = useState({
    wasteType: 'Dry Waste',
    quantity: '10 kg',
    address: '',
    date: '',
    time: '10:00 AM – 12:00 PM',
    notes: '',
  })

  const submit = (e) => {
    e.preventDefault()
    setDone(addPickup(form))
  }

  if (done) {
    return (
      <div className="card success-box">
        <div className="check"><CheckCircle2 size={36} /></div>
        <h2>Pickup requested</h2>
        <p style={{ margin: '10px 0 18px' }}>Keep your waste segregated and ready at the gate.</p>
        <p><strong>Pickup Request ID:</strong> {done.id}</p>
        <p><strong>Waste type:</strong> {done.wasteType} · {done.quantity}</p>
        <p><strong>When:</strong> {done.date} · {done.time}</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 22 }}>
          <Link className="btn btn-primary" to="/app">Back to dashboard</Link>
          <button className="btn btn-secondary" onClick={() => setDone(null)}>New request</button>
        </div>
      </div>
    )
  }

  return (
    <div className="two-col">
      <form className="card" style={{ padding: 22 }} onSubmit={submit}>
        <h1>Request Waste Pickup</h1>
        <p style={{ margin: '8px 0 20px' }}>Schedule a collection for bulk, dry, wet, plastic or e-waste.</p>
        <div className="form-row">
          <div className="form-field">
            <label>Waste Type</label>
            <select value={form.wasteType} onChange={(e) => setForm({ ...form, wasteType: e.target.value })}>
              {WASTE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Approximate Quantity</label>
            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 8 kg / 2 bags" />
          </div>
        </div>
        <div className="form-field">
          <label>Pickup Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House / society / campus" required />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Preferred Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-field">
            <label>Preferred Time</label>
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
              <option>08:00 AM – 10:00 AM</option>
              <option>10:00 AM – 12:00 PM</option>
              <option>02:00 PM – 04:00 PM</option>
              <option>04:00 PM – 06:00 PM</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label>Additional Notes</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Gate code, contact person, special handling..." />
        </div>
        <button className="btn btn-primary btn-lg" type="submit">Request Waste Pickup</button>
      </form>
      <MapPreview label={form.address || 'Pickup location'} pins={[{ x: 52, y: 40, label: 'Pickup' }]} />
    </div>
  )
}
