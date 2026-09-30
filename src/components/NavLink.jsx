'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, end = false, className = '', children, ...rest }) {
  const pathname = usePathname()
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link href={href} className={`${className} ${isActive ? 'active' : ''}`.trim()} {...rest}>
      {children}
    </Link>
  )
}
