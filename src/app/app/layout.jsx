import { redirect } from 'next/navigation'
import UserLayout from '@/components/UserLayout'
import { getSession } from '@/lib/auth'

export default async function CitizenLayout({ children }) {
  const session = await getSession()
  if (!session) redirect('/login?next=/app')
  if (session.role !== 'citizen') redirect('/admin')
  return <UserLayout>{children}</UserLayout>
}
