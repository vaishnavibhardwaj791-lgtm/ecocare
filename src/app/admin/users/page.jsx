'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function AdminUsers() {
  const { api } = useApp()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/users')
      .then((d) => setUsers(d.users))
      .catch((err) => setError(err.message))
  }, [api])

  return (
    <div className="stack">
      <h1>Users</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      <div className="card" style={{ padding: 8 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Area</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>U-{String(i + 1).padStart(2, '0')}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>{u.area || '—'}</td>
                  <td>{u.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
