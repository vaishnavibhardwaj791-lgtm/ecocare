'use client'

import { useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import { useApp } from '@/context/AppContext'
import { PICKUP_STATUSES } from '@/lib/constants'

export default function AdminPickups() {
  const { pickups, updatePickup } = useApp()
  const [error, setError] = useState('')

  const change = (id, status) => {
    setError('')
    updatePickup(id, { status }).catch((err) => setError(`${id}: ${err.message}`))
  }

  return (
    <div className="stack">
      <h1>Pickup Requests</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      <div className="card" style={{ padding: 8 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Waste Type</th>
                <th>Quantity</th>
                <th>Address</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.citizen}</td>
                  <td>{p.wasteType}</td>
                  <td>{p.quantity}</td>
                  <td>{p.address}</td>
                  <td>{p.date} · {p.time}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <select className="chip" value={p.status} onChange={(e) => change(p.id, e.target.value)}>
                      {PICKUP_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
