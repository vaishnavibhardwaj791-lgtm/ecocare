'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'

const EMPTY = { trend: [], categories: [], areas: [] }

// Chart data computed on the server from the complaints collection.
// Re-fetches whenever complaints change so the charts stay in sync.
export default function useAnalytics() {
  const { api, complaints } = useApp()
  const [data, setData] = useState(EMPTY)

  useEffect(() => {
    let cancelled = false
    api('/api/analytics')
      .then((d) => !cancelled && setData(d))
      .catch((err) => console.error(err))
    return () => {
      cancelled = true
    }
  }, [api, complaints])

  return data
}
