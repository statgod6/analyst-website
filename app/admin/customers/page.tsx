'use client'

import { useEffect, useState } from 'react'
import { Users, DollarSign, ShoppingBag, Search, Mail, Phone, Copy, Check, Download } from 'lucide-react'

interface Customer {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  totalOrders: number
  totalSpent: number
  products: string[]
  lastOrderDate: string
  firstOrderDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [copied, setCopied] = useState<string>('')

  useEffect(() => {
    fetchCustomers()
  }, [search])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/customers?${params}`)
      const data = await response.json()

      if (response.ok) {
        setCustomers(data.customers)
        setStats(data.stats)
      } else {
        console.error('Failed to fetch customers:', data.message)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleExportEmails = () => {
    const emails = customers.map(c => c.customerEmail).join(', ')
    navigator.clipboard.writeText(emails)
    alert('All customer emails copied to clipboard!')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading && customers.length === 0) {
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
            Customer Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage relationships and track customer purchase history
          </p>
        </div>
        <button
          onClick={handleExportEmails}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors w-full sm:w-auto"
        >
          <Download className="h-5 w-5" />
          <span className="text-sm sm:text-base">Copy All Emails</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalCustomers || 0}</h3>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{Math.round(stats?.averageOrderValue || 0)}</h3>
          <p className="text-sm text-gray-600">Avg. Order Value</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 sm:p-6">
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

      {/* Customers Table */}
      <div className="card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Products Purchased
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{customer.customerName || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Since {formatDate(customer.firstOrderDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{customer.customerEmail}</span>
                          <button
                            onClick={() => copyToClipboard(customer.customerEmail, customer._id + '-email')}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {copied === customer._id + '-email' ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {customer.customerPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.customerPhone}</span>
                            <button
                              onClick={() => copyToClipboard(customer.customerPhone!, customer._id + '-phone')}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {copied === customer._id + '-phone' ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-700 truncate">
                          {Array.from(new Set(customer.products)).join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <a
                        href={`mailto:${customer.customerEmail}?subject=Special Offer from Shikhaa`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {customers.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No customers found
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900 mb-1">{customer.customerName || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Since {formatDate(customer.firstOrderDate)}</p>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 break-all">{customer.customerEmail}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(customer.customerEmail, customer._id + '-email')}
                      className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                    >
                      {copied === customer._id + '-email' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {customer.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{customer.customerPhone}</p>
                      <button
                        onClick={() => copyToClipboard(customer.customerPhone!, customer._id + '-phone')}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {copied === customer._id + '-phone' ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-sm font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Products</p>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {Array.from(new Set(customer.products)).join(', ')}
                  </p>
                </div>

                <a
                  href={`mailto:${customer.customerEmail}?subject=Special Offer from Shikhaa`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Email Templates */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Quick Actions for Customer Outreach</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">📧 Email Marketing</h4>
            <p className="text-sm text-blue-700 mb-3">
              Use the "Copy All Emails" button to get all customer emails for your email marketing campaigns.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">🎯 Targeted Campaigns</h4>
            <p className="text-sm text-green-700 mb-3">
              Click on individual customers to send personalized emails about new products or special offers.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">📊 Customer Insights</h4>
            <p className="text-sm text-purple-700 mb-3">
              Track purchase history and spending to identify your most valuable customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
