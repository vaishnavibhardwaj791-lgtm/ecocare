import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { ISSUE_TYPES } from '@/lib/constants'
import { saveImage } from '@/lib/uploads'
import Complaint from '@/models/Complaint'
import { nextCode } from '@/models/Counter'
import { notifyAdmins } from '@/models/Notification'

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error
  const filter = user.role === 'admin' ? {} : { citizenEmail: user.email }
  const complaints = await Complaint.find(filter).sort({ createdAt: -1 })
  return NextResponse.json({ complaints })
}

// Accepts multipart/form-data so the photo is uploaded together with the report.
export async function POST(req) {
  const { user, error } = await requireUser()
  if (error) return error

  const form = await req.formData()
  const category = String(form.get('category') || '')
  const description = String(form.get('description') || '').trim()
  const location = String(form.get('location') || '').trim()
  const landmark = String(form.get('landmark') || '').trim()
  if (!ISSUE_TYPES.includes(category) || !description || !location) {
    return NextResponse.json({ error: 'Issue type, description and location are required' }, { status: 400 })
  }

  let photo = ''
  const file = form.get('photo')
  if (file && typeof file === 'object' && file.size > 0) {
    try {
      photo = await saveImage(file)
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }

  const complaint = await Complaint.create({
    code: await nextCode('CMP'),
    user: user._id,
    citizen: user.name,
    citizenEmail: user.email,
    category,
    description,
    location,
    landmark,
    photo,
    date: new Date().toISOString().slice(0, 10),
  })
  await notifyAdmins('New complaint', `${complaint.code} — ${category} at ${location} needs assignment.`)

  return NextResponse.json({ complaint }, { status: 201 })
}
