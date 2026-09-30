import { Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Profile() {
  const { user } = useApp()
  return (
    <div className="card" style={{ padding: 24, maxWidth: 640 }}>
      <div className="row" style={{ marginBottom: 20 }}>
        <div className="stat-icon" style={{ width: 56, height: 56 }}><UserRound /></div>
        <div>
          <h1>{user?.name}</h1>
          <p>Citizen account</p>
        </div>
      </div>
      <p className="row"><Mail size={16} /> {user?.email}</p>
      <p className="row" style={{ marginTop: 8 }}><Phone size={16} /> {user?.phone}</p>
      <p className="row" style={{ marginTop: 8 }}><MapPin size={16} /> {user?.area}</p>
      <button className="btn btn-secondary" style={{ marginTop: 20 }}>Edit profile (demo)</button>
    </div>
  )
}
