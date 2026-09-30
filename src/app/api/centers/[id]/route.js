import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { centerFields } from '@/lib/centerFields'
import Center from '@/models/Center'

export async function PATCH(req, { params }) {
  const { error } = await requireUser('admin')
  if (error) return error
  const { id } = await params
  const fields = centerFields(await req.json().catch(() => ({})))
  if (!fields.name || !fields.address) {
    return NextResponse.json({ error: 'Name and address are required' }, { status: 400 })
  }
  const center = await Center.findOneAndUpdate({ code: id }, fields, { returnDocument: 'after' })
  if (!center) return NextResponse.json({ error: 'Center not found' }, { status: 404 })
  return NextResponse.json({ center })
}

export async function DELETE(_req, { params }) {
  const { error } = await requireUser('admin')
  if (error) return error
  const { id } = await params
  const result = await Center.deleteOne({ code: id })
  if (!result.deletedCount) return NextResponse.json({ error: 'Center not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
