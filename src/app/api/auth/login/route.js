import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { setAuthCookie, signToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  const { email, password, role } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password')
  if (!user || !(await bcrypt.compare(String(password), user.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  if (role && role !== user.role) {
    return NextResponse.json(
      { error: `This is a ${user.role} account. Switch the role toggle to "${user.role === 'admin' ? 'Admin' : 'Citizen'}".` },
      { status: 403 },
    )
  }

  const res = NextResponse.json({ user: user.toJSON() })
  return setAuthCookie(res, signToken(user))
}
