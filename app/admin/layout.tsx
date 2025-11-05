'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Don't protect the login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (status === 'loading' || isLoginPage) return
    
    if (!session) {
      router.push('/admin/login')
    }
  }, [session, status, router, isLoginPage])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // If it's the login page, render it without protection
  if (isLoginPage) {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex min-h-screen">
        <AdminSidebar 
          mobileOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
        <main className="flex-1 ml-0 lg:ml-64 mt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
