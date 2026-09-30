import { ArrowRight, CheckCircle2, Leaf, MapPin, Recycle, Sparkles, Truck, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default function Landing() {
  return (
    <div className="page-fade">
      <nav className="public-nav">
        <Link href="/" className="brand"><Recycle /> EcoWaste</Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#learn">Awareness</a>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn btn-secondary">Login</Link>
          <Link href="/login" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="badge badge-resolved" style={{ marginBottom: 16 }}><Leaf size={14} /> Clean city initiative</div>
          <h1>Together for a Cleaner Tomorrow</h1>
          <p>
            Report overflowing bins, request waste pickup, track your complaints and learn proper
            segregation — a simple platform for cities, campuses, societies and public places.
          </p>
          <div className="hero-actions">
            <Link href="/login?next=/app/report" className="btn btn-primary btn-lg" style={{ width: 'auto' }}>Report Waste Issue</Link>
            <Link href="/login?next=/app/pickup" className="btn btn-secondary btn-lg" style={{ width: 'auto' }}>Request Pickup</Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="blob" style={{ width: 180, height: 180, background: '#b7e4c7', top: 30, left: 40 }} />
          <div className="blob" style={{ width: 140, height: 140, background: '#95d5b2', bottom: 40, right: 50 }} />
          <svg viewBox="0 0 420 360" width="100%" height="100%" style={{ position: 'relative', zIndex: 1 }}>
            <rect x="70" y="160" width="280" height="120" rx="24" fill="#1b7a4e" />
            <rect x="90" y="120" width="70" height="70" rx="12" fill="#d8f3dc" />
            <rect x="175" y="100" width="70" height="90" rx="12" fill="#95d5b2" />
            <rect x="260" y="128" width="70" height="62" rx="12" fill="#52b788" />
            <circle cx="125" cy="250" r="22" fill="#145c3a" />
            <circle cx="300" cy="250" r="22" fill="#145c3a" />
            <rect x="150" y="210" width="120" height="28" rx="8" fill="#2d6a4f" />
            <circle cx="330" cy="80" r="28" fill="#74c69d" />
            <path d="M40 300 C 120 250, 300 330, 390 270" stroke="#2d6a4f" strokeWidth="8" fill="none" />
          </svg>
          <div className="float-card" style={{ top: 28, left: 24 }}><Recycle size={16} color="#1b7a4e" /> Recycling pickup</div>
          <div className="float-card" style={{ bottom: 28, right: 24 }}><CheckCircle2 size={16} color="#1b7a4e" /> 1,284 issues resolved</div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-head">
          <h2>Everything citizens need</h2>
          <p>Four simple actions that keep neighbourhoods clean.</p>
        </div>
        <div className="feature-grid">
          {[
            { icon: ClipboardList, title: 'Report Waste Issues', text: 'Snap a photo, drop a pin and submit in under a minute.' },
            { icon: Truck, title: 'Request Waste Pickup', text: 'Schedule dry, wet, plastic or e-waste collection at your door.' },
            { icon: MapPin, title: 'Track Complaints', text: 'Follow every update from submitted to resolved.' },
            { icon: Sparkles, title: 'Learn Waste Segregation', text: 'Know which bin to use and where recyclables should go.' },
          ].map((f) => (
            <div className="card feature-card" key={f.title}>
              <div className="icon-wrap"><f.icon size={22} /></div>
              <h3>{f.title}</h3>
              <p style={{ marginTop: 8 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="stat-grid">
          {[
            ['Issues Reported', '4,812'],
            ['Issues Resolved', '3,946'],
            ['Pickup Requests', '1,208'],
            ['Clean Areas', '86'],
          ].map(([label, value]) => (
            <div className="card stat-card" key={label}>
              <div>
                <h3>{label}</h3>
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          {[
            ['Report', 'Describe the issue and share a photo + location.'],
            ['We Process', 'The ward team reviews and assigns a crew.'],
            ['Waste Gets Collected', 'Pickup or cleanup happens on the ground.'],
            ['Area Gets Cleaner', 'You get a resolved update on your dashboard.'],
          ].map(([title, text], i) => (
            <div className="card step" key={title}>
              <div className="step-num">{i + 1}</div>
              <h3>{title}</h3>
              <p style={{ marginTop: 8 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="learn" style={{ paddingBottom: 48 }}>
        <div className="card" style={{ padding: 28, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h2>Waste Awareness</h2>
            <p style={{ marginTop: 8, maxWidth: 520 }}>Learn wet vs dry vs e-waste, do’s and don’ts, and where your waste actually goes after collection.</p>
          </div>
          <Link href="/login?next=/app/awareness" className="btn btn-primary">Learn About Waste Management <ArrowRight size={16} /></Link>
        </div>
      </section>

      <footer className="footer">
        <span>EcoWaste · Smart waste management for cleaner places</span>
        <span>Demo prototype · Citizen + Admin</span>
      </footer>
    </div>
  )
}
