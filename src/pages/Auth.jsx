import { Recycle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('citizen')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const submit = (e) => {
    e.preventDefault()
    const next = login({
      name: form.name || (role === 'admin' ? 'Admin Team' : 'Aarav Mehta'),
      email: form.email || (role === 'admin' ? 'admin@ecowaste.app' : 'citizen@ecowaste.app'),
      role,
    })
    const dest = params.get('next')
    navigate(next.role === 'admin' ? '/admin' : dest || '/app')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link to="/" className="brand" style={{ color: 'white' }}><Recycle /> EcoWaste</Link>
        <div>
          <h1 style={{ color: 'white', fontSize: 42 }}>Cleaner streets start with one report.</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 12 }}>
            Demo access: citizen@ecowaste.app or admin@ecowaste.app — any password works.
          </p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Cities · Colleges · Societies · Public places</p>
      </div>
      <div className="auth-panel">
        <form className="auth-card card" style={{ padding: 28 }} onSubmit={submit}>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p style={{ margin: '8px 0 20px' }}>Choose your role to enter the right dashboard.</p>
          <div className="role-toggle">
            <button type="button" className={`role-btn ${role === 'citizen' ? 'active' : ''}`} onClick={() => setRole('citizen')}>Citizen</button>
            <button type="button" className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
          </div>
          {mode === 'register' && (
            <div className="form-field">
              <label>Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
          )}
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={role === 'admin' ? 'admin@ecowaste.app' : 'citizen@ecowaste.app'} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
