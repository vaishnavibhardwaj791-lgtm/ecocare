import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { useApp } from '../../context/AppContext'
import { STATUS_FLOW } from '../../data/mockData'

const FILTERS = ['All', 'Submitted', 'In Progress', 'Resolved', 'Reopened']

function Timeline({ status }) {
  const idx = STATUS_FLOW.indexOf(status)
  const activeIndex = status === 'Reopened' ? 0 : Math.max(idx, 0)
  return (
    <div className="timeline">
      {STATUS_FLOW.map((step, i) => (
        <div key={step} className={`tl-step ${i < activeIndex ? 'done' : ''} ${i === activeIndex ? 'active' : ''}`}>
          <span className="tl-dot" /> {step.toUpperCase()}
          {i < STATUS_FLOW.length - 1 ? <span>→</span> : null}
        </div>
      ))}
    </div>
  )
}

export default function Complaints() {
  const { user, complaints } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)

  const mine = useMemo(() => {
    return complaints.filter((c) => c.citizenEmail === user?.email || c.citizen === user?.name)
  }, [complaints, user])

  const list = mine.filter((c) => {
    const matchQ = `${c.id} ${c.category} ${c.location}`.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' || c.status === filter || (filter === 'In Progress' && ['Under Review', 'Assigned', 'In Progress'].includes(c.status))
    return matchQ && matchF
  })

  return (
    <div className="stack">
      <div>
        <h1>My Complaints</h1>
        <p style={{ marginTop: 6 }}>Search, filter and follow every report.</p>
      </div>
      <div className="search">
        <Search size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search complaint by ID..." />
      </div>
      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {list.map((c) => (
        <article className="card complaint-card" key={c.id}>
          <img src={c.photo} alt="" />
          <div>
            <div className="row space-between">
              <strong>{c.id}</strong>
              <StatusBadge status={c.status} />
            </div>
            <p style={{ marginTop: 6 }}><strong>{c.category}</strong> · {c.location}</p>
            <p className="muted">Submitted {c.date}{c.landmark ? ` · ${c.landmark}` : ''}</p>
            <p style={{ marginTop: 8 }}>{c.description}</p>
            <Timeline status={c.status} />
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setOpen(c)}>View Details</button>
          </div>
        </article>
      ))}

      {open && (
        <div className="overlay" onClick={() => setOpen(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <div className="row space-between">
              <h2>{open.id}</h2>
              <StatusBadge status={open.status} />
            </div>
            <img src={open.photo} alt="" style={{ borderRadius: 12, margin: '16px 0', maxHeight: 240, objectFit: 'cover', width: '100%' }} />
            <p><strong>Category:</strong> {open.category}</p>
            <p><strong>Location:</strong> {open.location}</p>
            <p><strong>Landmark:</strong> {open.landmark || '—'}</p>
            <p><strong>Department:</strong> {open.department || 'Awaiting assignment'}</p>
            <p style={{ marginTop: 8 }}>{open.description}</p>
            <Timeline status={open.status} />
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => setOpen(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
