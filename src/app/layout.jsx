import '@/index.css'
import { AppProvider } from '@/context/AppContext'
import { getCurrentUser } from '@/lib/auth'

export const metadata = {
  title: 'EcoWaste — Cleaner Tomorrow',
  description: 'Report waste issues, request pickups and track complaints.',
  icons: { icon: '/favicon.svg' },
}

export default async function RootLayout({ children }) {
  const user = await getCurrentUser()
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider initialUser={user}>{children}</AppProvider>
      </body>
    </html>
  )
}
