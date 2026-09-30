import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { centerFields } from '@/lib/centerFields'
import Center from '@/models/Center'
import { nextCode } from '@/models/Counter'

export async function GET() {
  const { error } = await requireUser()
  if (error) return error
  const centers = await Center.find().sort({ createdAt: -1 })
  return NextResponse.json({ centers })
}

export async function POST(req) {
  const { error } = await requireUser('admin')
  if (error) return error
  const fields = centerFields(await req.json().catch(() => ({})))
  if (!fields.name || !fields.address) {
    return NextResponse.json({ error: 'Name and address are required' }, { status: 400 })
  }
  const center = await Center.create({
    ...fields,
    code: await nextCode('CTR', { start: 5, pad: 2 }),
    // Place new centers somewhere visible on the stylised map.
    x: 15 + Math.round(Math.random() * 70),
    y: 15 + Math.round(Math.random() * 70),
  })
  return NextResponse.json({ center }, { status: 201 })
}
