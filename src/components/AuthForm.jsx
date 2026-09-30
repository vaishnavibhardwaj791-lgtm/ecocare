'use client'

import { Recycle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function AuthForm({ next = '' }) {
  const { login, register } = useApp()
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('citizen')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = mode === 'login'
        ? await login({ email: form.email, password: form.password, role })
        : await register({ email: form.email, password: form.password })
      router.replace(user.role === 'admin' ? '/admin' : next.startsWith('/app') ? next : '/app')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setRole('citizen')
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link href="/" className="brand" style={{ color: 'white' }}><Recycle /> EcoWaste</Link>
        <div>
          <h1 style={{ color: 'white', fontSize: 42 }}>Cleaner streets start with one report.</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 12 }}>
            Demo accounts: citizen@ecowaste.app / citizen123 · admin@ecowaste.app / admin123
          </p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Cities · Colleges · Societies · Public places</p>
      </div>
      <div className="auth-panel">
        <form className="auth-card card" style={{ padding: 28 }} onSubmit={submit}>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p style={{ margin: '8px 0 20px' }}>
            {mode === 'login' ? 'Choose your role to enter the right dashboard.' : 'Just your email and a password (6+ characters). You can add your name later in Profile.'}
          </p>
          {mode === 'login' && (
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === 'citizen' ? 'active' : ''}`} onClick={() => setRole('citizen')}>Citizen</button>
              <button type="button" className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
            </div>
          )}
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={role === 'admin' ? 'admin@ecowaste.app' : 'citizen@ecowaste.app'} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" minLength={mode === 'register' ? 6 : undefined} required />
          </div>
          {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <button type="button" className="btn btn-ghost btn-sm" onClick={switchMode}>
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
