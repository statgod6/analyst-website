'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    setShowUserMenu(false)
    
    try {
      // Clear session without automatic redirect
      await signOut({ redirect: false })
      
      // Manually redirect to login page
      router.push('/admin/login')
      
      // Force a page refresh to clear all state
      setTimeout(() => {
        window.location.href = '/admin/login'
      }, 100)
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: force redirect
      window.location.href = '/admin/login'
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg font-serif font-bold text-white">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Content Management System</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="h-9 w-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {session?.user?.name || 'Test Admin'}
                </p>
                <p className="text-xs text-gray-500 lowercase">
                  {session?.user?.role || 'admin'}
                </p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                {/* Backdrop for closing menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{session?.user?.name || 'Test Admin'}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email || 'admin@test.com'}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
