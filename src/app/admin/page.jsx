'use client'

import { CheckCircle2, ClipboardList, Clock, Loader2, Truck } from 'lucide-react'
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, CartesianGrid } from 'recharts'
import useAnalytics from '@/components/useAnalytics'
import { useApp } from '@/context/AppContext'
import { hotspots } from '@/lib/constants'

const COLORS = ['#1b7a4e', '#2d9b6a', '#d97706', '#ea580c', '#64748b', '#0369a1']

export default function AdminDashboard() {
  const { complaints, pickups } = useApp()
  const { trend, categories, areas } = useAnalytics()
  const pending = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length
  const progress = complaints.filter((c) => ['Assigned', 'In Progress', 'Reopened'].includes(c.status)).length
  const resolved = complaints.filter((c) => c.status === 'Resolved').length

  return (
    <div className="stack">
      <div>
        <h1>Waste Management Overview</h1>
        <p style={{ marginTop: 6 }}>Live operations across wards, campuses and societies.</p>
      </div>
      <div className="stat-grid stat-grid-5">
        {[
          ['Total Complaints', complaints.length, ClipboardList],
          ['Pending Complaints', pending, Clock],
          ['In Progress', progress, Loader2],
          ['Resolved', resolved, CheckCircle2],
          ['Pickup Requests', pickups.length, Truck],
        ].map(([label, value, Icon]) => (
          <div className="card stat-card" key={label}>
            <div>
              <h3>{label}</h3>
              <strong>{value}</strong>
            </div>
            <div className="stat-icon"><Icon size={18} /></div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card chart-box">
          <h3>Complaint Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce8e0" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#1b7a4e" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#74c69d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-box">
          <h3>Complaint Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {categories.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="two-col">
        <div className="card chart-box">
          <h3>Area-wise Complaints</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce8e0" />
              <XAxis dataKey="area" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1b7a4e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3>Waste Hotspot Map</h3>
          <p className="muted" style={{ margin: '6px 0 12px' }}>Green = low · Yellow = medium · Orange = high activity</p>
          <div className="map-preview" style={{ height: 240 }}>
            {hotspots.map((h) => (
              <div key={h.name} className={`hotspot ${h.level}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} title={`${h.name} · ${h.level}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
