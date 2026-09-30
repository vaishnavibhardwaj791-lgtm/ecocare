import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import Complaint from '@/models/Complaint'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function GET() {
  const { error } = await requireUser('admin')
  if (error) return error

  const complaints = await Complaint.find({}, { date: 1, status: 1, category: 1, location: 1 }).lean()

  // Last 6 months, oldest first.
  const now = new Date()
  const trend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const inMonth = complaints.filter((c) => c.date?.startsWith(key))
    trend.push({
      month: MONTHS[d.getMonth()],
      complaints: inMonth.length,
      resolved: inMonth.filter((c) => c.status === 'Resolved').length,
    })
  }

  const byCategory = {}
  const byArea = {}
  for (const c of complaints) {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1
    const area = c.location?.match(/Ward \d+/i)?.[0] || 'Other'
    byArea[area] = (byArea[area] || 0) + 1
  }

  const categories = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
  const areas = Object.entries(byArea)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return NextResponse.json({ trend, categories, areas })
}
