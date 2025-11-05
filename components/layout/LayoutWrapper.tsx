'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import { ReactNode } from 'react'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin')

  // For admin pages, render without public header/footer
  if (isAdminPage) {
    return <>{children}</>
  }

  // For public pages, render with header and footer
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
