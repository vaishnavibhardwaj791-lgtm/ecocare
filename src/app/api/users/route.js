import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import Complaint from '@/models/Complaint'
import User from '@/models/User'

export async function GET() {
  const { error } = await requireUser('admin')
  if (error) return error

  const [users, counts] = await Promise.all([
    User.find().sort({ role: 1, createdAt: 1 }),
    Complaint.aggregate([{ $group: { _id: '$citizenEmail', reports: { $sum: 1 } } }]),
  ])
  const reportsByEmail = Object.fromEntries(counts.map((c) => [c._id, c.reports]))

  return NextResponse.json({
    users: users.map((u) => ({ ...u.toJSON(), reports: reportsByEmail[u.email] || 0 })),
  })
}
