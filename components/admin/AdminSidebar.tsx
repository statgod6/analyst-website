'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  FileText, 
  ShoppingBag,
  ShoppingCart,
  Users
} from 'lucide-react'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900/50 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-50 transform transition-transform duration-300 pt-16 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <nav className="h-full overflow-y-auto px-3 py-6">
          {/* Navigation Header */}
          <div className="px-3 mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h2>
          </div>
          
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="text-xs text-center font-medium bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Admin Panel v1.0
            </p>
          </div>
        </nav>
      </aside>
    </>
  )
}
