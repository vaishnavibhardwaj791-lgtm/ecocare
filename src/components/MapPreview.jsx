import { MapPin } from 'lucide-react'

export default function MapPreview({ label = 'Reported location', pins = [{ x: 48, y: 46, label }] }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row space-between" style={{ marginBottom: 10 }}>
        <strong>Location preview</strong>
        <span className="muted">{label}</span>
      </div>
      <div className="map-preview">
        {pins.map((pin) => (
          <div key={`${pin.x}-${pin.y}-${pin.label}`} className="map-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
            <MapPin size={28} fill="#1b7a4e" color="#145c3a" />
          </div>
        ))}
      </div>
    </div>
  )
}
