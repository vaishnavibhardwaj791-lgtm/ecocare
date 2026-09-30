import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { getSession } from '@/lib/auth'

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams
  const safeNext = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : ''
  const session = await getSession()
  if (session) redirect(session.role === 'admin' ? '/admin' : safeNext.startsWith('/app') ? safeNext : '/app')
  return <AuthForm next={safeNext} />
}
