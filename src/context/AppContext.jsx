import { createContext, useContext, useMemo, useState } from 'react'
import {
  adminNotifications,
  initialCenters,
  initialComplaints,
  initialPickups,
  userNotifications,
} from '../data/mockData'

const AppContext = createContext(null)

function nextId(prefix, items) {
  const nums = items.map((item) => Number(String(item.id).replace(/\D/g, ''))).filter(Number.isFinite)
  const max = nums.length ? Math.max(...nums) : 1000
  return `${prefix}-${max + 1}`
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecowaste-user')
    return saved ? JSON.parse(saved) : null
  })
  const [complaints, setComplaints] = useState(initialComplaints)
  const [pickups, setPickups] = useState(initialPickups)
  const [centers, setCenters] = useState(initialCenters)

  const login = ({ name, email, role }) => {
    const nextUser = {
      name: name || (role === 'admin' ? 'Admin Team' : 'Aarav Mehta'),
      email,
      role,
      area: role === 'admin' ? 'City HQ' : 'Ward 12',
      phone: '+91 90000 11223',
    }
    setUser(nextUser)
    localStorage.setItem('ecowaste-user', JSON.stringify(nextUser))
    return nextUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ecowaste-user')
  }

  const addComplaint = (payload) => {
    const id = nextId('CMP', complaints)
    const item = {
      id,
      citizen: user?.name || 'Citizen',
      citizenEmail: user?.email,
      status: 'Submitted',
      priority: 'Medium',
      department: '',
      date: new Date().toISOString().slice(0, 10),
      ...payload,
    }
    setComplaints((prev) => [item, ...prev])
    return item
  }

  const updateComplaint = (id, patch) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const addPickup = (payload) => {
    const id = nextId('PKP', pickups)
    const item = {
      id,
      citizen: user?.name || 'Citizen',
      citizenEmail: user?.email,
      status: 'Pending',
      ...payload,
    }
    setPickups((prev) => [item, ...prev])
    return item
  }

  const updatePickup = (id, patch) => {
    setPickups((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const addCenter = (payload) => {
    const id = nextId('CTR', centers)
    const item = { id, distance: '—', x: 50, y: 50, ...payload }
    setCenters((prev) => [item, ...prev])
    return item
  }

  const updateCenter = (id, patch) => {
    setCenters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const removeCenter = (id) => {
    setCenters((prev) => prev.filter((c) => c.id !== id))
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      complaints,
      pickups,
      centers,
      addComplaint,
      updateComplaint,
      addPickup,
      updatePickup,
      addCenter,
      updateCenter,
      removeCenter,
      userNotifications,
      adminNotifications,
    }),
    [user, complaints, pickups, centers],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
