import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { setAuthCookie, signToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

// "priya.sharma@x.com" -> "Priya Sharma"; users can change it later on the Profile page.
function nameFromEmail(email) {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\d+/g, ' ').trim()
  return local ? local.replace(/\b\w/g, (ch) => ch.toUpperCase()) : 'EcoWaste User'
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  await connectDB()
  if (await User.exists({ email })) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  // Public sign-up always creates citizen accounts; admins come from the seed script.
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const user = await User.create({
    name: name || nameFromEmail(email),
    email,
    password: await bcrypt.hash(password, 10),
    role: 'citizen',
    area: typeof body.area === 'string' ? body.area.trim() : '',
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
  })

  const res = NextResponse.json({ user: user.toJSON() }, { status: 201 })
  return setAuthCookie(res, signToken(user))
}
