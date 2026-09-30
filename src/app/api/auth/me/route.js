import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error
  return NextResponse.json({ user: user.toJSON() })
}

export async function PATCH(req) {
  const { user, error } = await requireUser()
  if (error) return error
  const body = await req.json().catch(() => ({}))
  for (const key of ['name', 'phone', 'area']) {
    if (typeof body[key] === 'string') user[key] = body[key].trim()
  }
  if (!user.name) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
  await user.save()
  return NextResponse.json({ user: user.toJSON() })
}
