'use client'

import { useEffect, useState } from 'react'
import { FileText, ShoppingBag, TrendingUp, DollarSign, ShoppingCart, Package, Users } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  blogs: {
    total: number
    published: number
    drafts: number
  }
  products: {
    total: number
    active: number
    inactive: number
  }
  orders: {
    total: number
    completed: number
    pending: number
  }
  revenue: {
    total: number
    byMonth: any[]
  }
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data)
      } else {
        console.error('Failed to fetch stats:', data.message)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = stats ? [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.total.toLocaleString()}`,
      subtitle: 'From completed orders',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      trend: '+15%',
      link: '/admin/orders',
    },
    {
      title: 'Total Orders',
      value: stats.orders.total,
      subtitle: `${stats.orders.completed} completed`,
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      trend: `+${stats.orders.pending}`,
      link: '/admin/orders',
    },
    {
      title: 'Total Blogs',
      value: stats.blogs.total,
      subtitle: `${stats.blogs.published} published`,
      icon: FileText,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      trend: '+12%',
      link: '/admin/blogs',
    },
    {
      title: 'Products',
      value: stats.products.total,
      subtitle: `${stats.products.active} active`,
      icon: Package,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      trend: '+2',
      link: '/admin/products',
    },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Monitor your business performance and manage content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.link} className="group">
              <div className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {card.trend}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      {stats && stats.recentOrders.length > 0 && (
        <div className="card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary hover:text-accent font-semibold text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2 sm:gap-0">
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.productName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{order.customerName || 'Guest'} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-gray-900 text-sm sm:text-base">₹{order.amount}</p>
                  <p className="text-xs text-gray-500">{order.orderNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-center group"
          >
            <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-900 text-base sm:text-lg">View Orders</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track customer purchases</p>
          </Link>
          <Link
            href="/admin/customers"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-center group"
          >
            <Users className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-900 text-lg">Customers</p>
            <p className="text-sm text-gray-500 mt-1">Manage relationships</p>
          </Link>
          <Link
            href="/admin/blogs"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-center group"
          >
            <FileText className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-900 text-lg">Manage Blogs</p>
            <p className="text-sm text-gray-500 mt-1">Create and publish posts</p>
          </Link>
          <Link
            href="/admin/products"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors text-center group"
          >
            <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-900 text-lg">Manage Products</p>
            <p className="text-sm text-gray-500 mt-1">Add and update products</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
