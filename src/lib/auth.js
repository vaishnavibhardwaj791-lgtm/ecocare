import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { connectDB } from './db'
import User from '@/models/User'

export const TOKEN_COOKIE = 'ecowaste_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET is not set. Add it to .env.local')
  return s
}

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), email: user.email, role: user.role }, secret(), { expiresIn: MAX_AGE })
}

export function setAuthCookie(res, token) {
  res.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
  return res
}

export function clearAuthCookie(res) {
  res.cookies.set(TOKEN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}

/** Verified JWT payload ({ sub, email, role }) or null. No DB access. */
export async function getSession() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value
  if (!token) return null
  try {
    return jwt.verify(token, secret())
  } catch {
    return null
  }
}

/** Full user document for the current session, or null. */
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  try {
    await connectDB()
    const user = await User.findById(session.sub)
    return user ? user.toJSON() : null
  } catch (err) {
    console.error('getCurrentUser failed:', err.message)
    return null
  }
}

/**
 * For route handlers: `const { user, error } = await requireUser('admin'); if (error) return error`
 */
export async function requireUser(role) {
  const session = await getSession()
  if (!session) return { error: NextResponse.json({ error: 'Please log in' }, { status: 401 }) }
  await connectDB()
  const user = await User.findById(session.sub)
  if (!user) return { error: NextResponse.json({ error: 'Account not found' }, { status: 401 }) }
  if (role && user.role !== role) return { error: NextResponse.json({ error: 'Not allowed' }, { status: 403 }) }
  return { user }
}
