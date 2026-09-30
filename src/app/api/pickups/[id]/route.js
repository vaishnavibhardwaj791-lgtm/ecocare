import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { PICKUP_STATUSES } from '@/lib/constants'
import { notifyUser } from '@/models/Notification'
import Pickup from '@/models/Pickup'

export async function PATCH(req, { params }) {
  const { error } = await requireUser('admin')
  if (error) return error
  const { id } = await params
  const { status } = await req.json().catch(() => ({}))
  if (!PICKUP_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const pickup = await Pickup.findOne({ code: id })
  if (!pickup) return NextResponse.json({ error: 'Pickup not found' }, { status: 404 })

  if (pickup.status !== status) {
    pickup.status = status
    await pickup.save()
    await notifyUser(
      pickup.citizenEmail,
      status === 'Completed' ? 'Pickup completed' : 'Pickup scheduled',
      status === 'Completed'
        ? `Your ${pickup.wasteType} pickup ${pickup.code} has been collected. Thank you!`
        : `Your ${pickup.wasteType} pickup ${pickup.code} is ${status.toLowerCase()} for ${pickup.date}, ${pickup.time}.`,
    )
  }
  return NextResponse.json({ pickup })
}
