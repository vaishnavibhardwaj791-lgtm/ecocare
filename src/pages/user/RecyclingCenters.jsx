import { Clock, MapPin, Navigation, Phone, Search } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const CATS = ['All', 'Plastic', 'Paper', 'E-Waste', 'Metal', 'Glass', 'Mixed Recyclables']

export default function RecyclingCenters() {
  const { centers } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const list = centers.filter((c) => {
    const matchQ = `${c.name} ${c.address}`.toLowerCase().includes(q.toLowerCase())
    const matchC = cat === 'All' || c.types.includes(cat)
    return matchQ && matchC
  })

  return (
    <div className="stack">
      <div>
        <h1>Find Nearby Recycling & Collection Centers</h1>
        <p style={{ marginTop: 6 }}>Locate drop-off points for plastic, paper, metal, glass and e-waste.</p>
      </div>
      <div className="search">
        <Search size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recycling centers..." />
      </div>
      <div className="filters">
        {CATS.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="two-col">
        <div className="map-preview" style={{ height: 380 }}>
          {list.map((c) => (
            <div key={c.id} className="map-pin" style={{ left: `${c.x}%`, top: `${c.y}%` }} title={c.name}>
              <MapPin size={26} fill="#1b7a4e" />
            </div>
          ))}
        </div>
        <div className="stack">
          {list.map((c) => (
            <article className="card" key={c.id} style={{ padding: 16 }}>
              <div className="row space-between">
                <h3>{c.name}</h3>
                <span className="badge badge-resolved">{c.distance}</span>
              </div>
              <p className="muted" style={{ marginTop: 6 }}>{c.types.join(' · ')}</p>
              <p className="row" style={{ marginTop: 8 }}><MapPin size={14} /> {c.address}</p>
              <p className="row"><Phone size={14} /> {c.phone}</p>
              <p className="row"><Clock size={14} /> {c.hours}</p>
              <a className="btn btn-primary btn-sm" style={{ marginTop: 12 }} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`} target="_blank" rel="noreferrer">
                <Navigation size={14} /> Get Directions
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
