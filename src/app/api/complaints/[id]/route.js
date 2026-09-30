import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { COMPLAINT_STATUSES, DEPARTMENTS, PRIORITIES } from '@/lib/constants'
import Complaint from '@/models/Complaint'
import { notifyUser } from '@/models/Notification'

export async function PATCH(req, { params }) {
  const { error } = await requireUser('admin')
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const complaint = await Complaint.findOne({ code: id })
  if (!complaint) return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })

  const before = { status: complaint.status, department: complaint.department }
  if (body.status !== undefined) {
    if (!COMPLAINT_STATUSES.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    complaint.status = body.status
  }
  if (body.department !== undefined) {
    if (body.department && !DEPARTMENTS.includes(body.department)) {
      return NextResponse.json({ error: 'Invalid department' }, { status: 400 })
    }
    complaint.department = body.department
  }
  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    complaint.priority = body.priority
  }
  await complaint.save()

  if (complaint.status !== before.status) {
    await notifyUser(
      complaint.citizenEmail,
      complaint.status === 'Resolved' ? 'Issue resolved' : 'Complaint update',
      `${complaint.code} (${complaint.category}) moved to ${complaint.status}.`,
    )
  } else if (complaint.department && complaint.department !== before.department) {
    await notifyUser(complaint.citizenEmail, 'Complaint update', `${complaint.code} was assigned to ${complaint.department}.`)
  }

  return NextResponse.json({ complaint })
}
