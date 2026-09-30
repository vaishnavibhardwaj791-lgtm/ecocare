import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { WASTE_TYPES } from '@/lib/constants'
import { nextCode } from '@/models/Counter'
import { notifyAdmins } from '@/models/Notification'
import Pickup from '@/models/Pickup'

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error
  const filter = user.role === 'admin' ? {} : { citizenEmail: user.email }
  const pickups = await Pickup.find(filter).sort({ createdAt: -1 })
  return NextResponse.json({ pickups })
}

export async function POST(req) {
  const { user, error } = await requireUser()
  if (error) return error
  const body = await req.json().catch(() => ({}))
  const { wasteType, quantity = '', address, date, time, notes = '' } = body

  if (!WASTE_TYPES.includes(wasteType) || !address?.trim() || !date || !time) {
    return NextResponse.json({ error: 'Waste type, address, date and time are required' }, { status: 400 })
  }
  // Allow "yesterday" in UTC so users ahead of UTC can still book for their local today.
  const earliest = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < earliest) {
    return NextResponse.json({ error: 'Choose a pickup date from today onwards' }, { status: 400 })
  }

  const pickup = await Pickup.create({
    code: await nextCode('PKP', { start: 220, pad: 3 }),
    user: user._id,
    citizen: user.name,
    citizenEmail: user.email,
    wasteType,
    quantity: String(quantity).trim(),
    address: address.trim(),
    date,
    time,
    notes: String(notes).trim(),
  })
  await notifyAdmins('New pickup request', `${pickup.code} — ${wasteType} (${pickup.quantity || 'qty n/a'}) on ${date}.`)

  return NextResponse.json({ pickup }, { status: 201 })
}
