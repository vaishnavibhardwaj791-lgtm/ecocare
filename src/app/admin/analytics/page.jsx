'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import useAnalytics from '@/components/useAnalytics'

const COLORS = ['#1b7a4e', '#2d9b6a', '#d97706', '#ea580c', '#64748b', '#0369a1']

export default function AdminAnalytics() {
  const { trend, categories, areas } = useAnalytics()
  const maxArea = Math.max(1, ...areas.map((a) => a.count))

  return (
    <div className="stack">
      <h1>Analytics</h1>
      <div className="two-col">
        <div className="card chart-box" style={{ height: 360 }}>
          <h3>Monthly volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce8e0" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#1b7a4e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="resolved" fill="#74c69d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-box" style={{ height: 360 }}>
          <h3>Category mix</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {categories.map((e, i) => <Cell key={e.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <h3>Ward ranking</h3>
        {areas.map((a) => (
          <div key={a.area} className="row space-between" style={{ marginTop: 12 }}>
            <span>{a.area}</span>
            <div style={{ flex: 1, margin: '0 16px', height: 10, background: '#e8f5ee', borderRadius: 99 }}>
              <div style={{ width: `${(a.count / maxArea) * 100}%`, height: '100%', background: '#1b7a4e', borderRadius: 99 }} />
            </div>
            <strong>{a.count}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
