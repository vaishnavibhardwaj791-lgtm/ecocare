import { Ban, Check, Recycle, Smartphone, Trash2, Droplets } from 'lucide-react'

const cards = [
  {
    title: 'Wet Waste',
    icon: Droplets,
    items: ['Food waste', 'Vegetable peels', 'Garden waste'],
    color: '#145c3a',
  },
  {
    title: 'Dry Waste',
    icon: Recycle,
    items: ['Paper', 'Cardboard', 'Clean plastic', 'Metal'],
    color: '#2563eb',
  },
  {
    title: 'E-Waste',
    icon: Smartphone,
    items: ['Batteries', 'Old phones', 'Chargers', 'Electronic devices'],
    color: '#7c3aed',
  },
  {
    title: 'Hazardous Waste',
    icon: Trash2,
    items: ['Chemicals', 'Paint', 'Medical-related waste'],
    color: '#c2410c',
  },
]

export default function Awareness() {
  return (
    <div className="stack">
      <div>
        <h1>Learn to Segregate. Learn to Care.</h1>
        <p style={{ marginTop: 8 }}>A two-minute guide that keeps recycling plants running and streets cleaner.</p>
      </div>
      <div className="card-grid">
        {cards.map((c) => (
          <div className="card info-card" key={c.title}>
            <div className="icon-wrap" style={{ color: c.color }}><c.icon size={22} /></div>
            <h3>{c.title}</h3>
            <ul>
              {c.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card" style={{ padding: 22 }}>
          <h2>Do’s</h2>
          {['Rinse recyclables before dropping them.', 'Keep wet waste in a covered bin.', 'Hand over batteries at e-waste points.', 'Report overflowing public bins promptly.'].map((t) => (
            <p key={t} className="row" style={{ marginTop: 10 }}><Check size={16} color="#1b7a4e" /> {t}</p>
          ))}
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h2>Don’ts</h2>
          {['Don’t mix leftover food with paper or plastic.', 'Don’t burn waste in open plots.', 'Don’t dump construction debris on roads.', 'Don’t throw medical waste in household bins.'].map((t) => (
            <p key={t} className="row" style={{ marginTop: 10 }}><Ban size={16} color="#dc2626" /> {t}</p>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h2>Where Does Your Waste Go?</h2>
        <div className="steps process-steps" style={{ marginTop: 16 }}>
          {['Household', 'Segregation', 'Collection', 'Processing', 'Recycling/Composting'].map((step, i) => (
            <div className="step card" key={step} style={{ boxShadow: 'none' }}>
              <div className="step-num">{i + 1}</div>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
