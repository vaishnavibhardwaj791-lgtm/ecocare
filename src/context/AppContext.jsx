'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

async function api(url, { method = 'GET', body, form } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: form || (body ? JSON.stringify(body) : undefined),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export function AppProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser)
  const [complaints, setComplaints] = useState([])
  const [pickups, setPickups] = useState([])
  const [centers, setCenters] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [c, p, ce, n] = await Promise.all([
        api('/api/complaints'),
        api('/api/pickups'),
        api('/api/centers'),
        api('/api/notifications'),
      ])
      setComplaints(c.complaints)
      setPickups(p.pickups)
      setCenters(ce.centers)
      setNotifications(n.notifications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) refresh()
    else {
      setComplaints([])
      setPickups([])
      setCenters([])
      setNotifications([])
    }
  }, [user, refresh])

  const login = async ({ email, password, role }) => {
    const { user: next } = await api('/api/auth/login', { method: 'POST', body: { email, password, role } })
    setUser(next)
    return next
  }

  const register = async (payload) => {
    const { user: next } = await api('/api/auth/register', { method: 'POST', body: payload })
    setUser(next)
    return next
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }

  const updateProfile = async (patch) => {
    const { user: next } = await api('/api/auth/me', { method: 'PATCH', body: patch })
    setUser(next)
    return next
  }

  // payload: { category, description, location, landmark, photoFile }
  const addComplaint = async ({ photoFile, ...fields }) => {
    const form = new FormData()
    Object.entries(fields).forEach(([k, v]) => form.append(k, v ?? ''))
    if (photoFile) form.append('photo', photoFile)
    const { complaint } = await api('/api/complaints', { method: 'POST', form })
    setComplaints((prev) => [complaint, ...prev])
    return complaint
  }

  const updateComplaint = async (id, patch) => {
    const { complaint } = await api(`/api/complaints/${id}`, { method: 'PATCH', body: patch })
    setComplaints((prev) => prev.map((c) => (c.id === id ? complaint : c)))
    return complaint
  }

  const addPickup = async (payload) => {
    const { pickup } = await api('/api/pickups', { method: 'POST', body: payload })
    setPickups((prev) => [pickup, ...prev])
    return pickup
  }

  const updatePickup = async (id, patch) => {
    const { pickup } = await api(`/api/pickups/${id}`, { method: 'PATCH', body: patch })
    setPickups((prev) => prev.map((p) => (p.id === id ? pickup : p)))
    return pickup
  }

  const addCenter = async (payload) => {
    const { center } = await api('/api/centers', { method: 'POST', body: payload })
    setCenters((prev) => [center, ...prev])
    return center
  }

  const updateCenter = async (id, patch) => {
    const { center } = await api(`/api/centers/${id}`, { method: 'PATCH', body: patch })
    setCenters((prev) => prev.map((c) => (c.id === id ? center : c)))
    return center
  }

  const removeCenter = async (id) => {
    await api(`/api/centers/${id}`, { method: 'DELETE' })
    setCenters((prev) => prev.filter((c) => c.id !== id))
  }

  const markNotificationsRead = async () => {
    await api('/api/notifications', { method: 'PATCH' }).catch(() => {})
    // `fresh` keeps the "New" badge visible on screen until the next reload.
    setNotifications((prev) => prev.map((n) => (n.unread ? { ...n, unread: false, fresh: true } : n)))
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      refresh,
      complaints,
      pickups,
      centers,
      notifications,
      addComplaint,
      updateComplaint,
      addPickup,
      updatePickup,
      addCenter,
      updateCenter,
      removeCenter,
      markNotificationsRead,
      api,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, complaints, pickups, centers, notifications, refresh],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
