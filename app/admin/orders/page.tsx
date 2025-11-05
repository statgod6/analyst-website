'use client'
'use client'

import { useEffect, useState } from 'react'
import { Package, DollarSign, ShoppingCart, Search, Download } from 'lucide-react'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  productName: string
  amount: number
  currency: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter, search])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
        setPagination(data.pagination)
        setStats(data.stats)
      } else {
        console.error('Failed to fetch orders:', data.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/orders/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Export failed')
      }
    } catch (error) {
      console.error('Error exporting orders:', error)
    }
  }

  const totalRevenue = stats?.find((s: any) => s._id === 'completed')?.revenue || 0
  const completedCount = stats?.find((s: any) => s._id === 'completed')?.count || 0

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">
            Orders Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track and manage all customer orders
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors w-full sm:w-auto"
        >
          <Download className="h-5 w-5" />
          <span className="text-sm sm:text-base">Export to CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{completedCount}</h3>
          <p className="text-sm text-gray-600">Completed Orders</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{pagination.total}</h3>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName || 'Guest'}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{order.customerPhone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{order.productName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {order.currency === 'USD' ? '$' : '₹'}{order.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-primary hover:text-accent font-semibold text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {orders.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary mb-1">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900 text-sm">{order.customerName || 'Guest'}</p>
                    <p className="text-xs text-gray-600">{order.customerEmail}</p>
                    {order.customerPhone && (
                      <p className="text-xs text-gray-600">{order.customerPhone}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Product</p>
                    <p className="text-sm text-gray-900">{order.productName}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900">
                      {order.currency === 'USD' ? '$' : '₹'}{order.amount}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="block w-full text-center px-4 py-2 bg-primary hover:bg-accent text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, pagination.total)} of {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
