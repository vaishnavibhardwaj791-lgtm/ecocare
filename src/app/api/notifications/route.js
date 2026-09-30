import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import Notification from '@/models/Notification'

function filterFor(user) {
  return user.role === 'admin' ? { audience: 'admin' } : { audience: 'user', userEmail: user.email }
}

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error
  const notifications = await Notification.find(filterFor(user)).sort({ createdAt: -1 }).limit(50)
  return NextResponse.json({ notifications })
}

// Marks all of the current user's notifications as read.
export async function PATCH() {
  const { user, error } = await requireUser()
  if (error) return error
  await Notification.updateMany({ ...filterFor(user), unread: true }, { unread: false })
  return NextResponse.json({ ok: true })
}
