import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { getSession } from '@/lib/auth'

export default async function AdminRootLayout({ children }) {
  const session = await getSession()
  if (!session) redirect('/login?next=/admin')
  if (session.role !== 'admin') redirect('/app')
  return <AdminLayout>{children}</AdminLayout>
}
