'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, Package, Calendar, Download, CreditCard, CheckCircle, Copy, Check } from 'lucide-react'
import Link from 'next/link'

interface OrderDetail {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  productId: {
    _id: string
    name: string
    slug: string
    coverImage: string
    price: number
  }
  productName: string
  amount: number
  currency: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  razorpayOrderId: string
  razorpayPaymentId: string
  downloadCount: number
  lastDownloadedAt?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string>('')

  useEffect(() => {
    fetchOrderDetails()
  }, [params.id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setOrder(data.order)
      } else {
        console.error('Failed to fetch order:', data.message)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <Link href="/admin/orders" className="text-primary hover:text-accent">
          ← Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">
              Order Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-mono break-all">#{order.orderNumber}</p>
          </div>
        </div>
        <div>
          <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusBadge(order.paymentStatus)}`}>
            {order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Customer Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{order.customerName || 'N/A'}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(order.customerName, 'name')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  {copied === 'name' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900 break-all">{order.customerEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(order.customerEmail, 'email')}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  {copied === 'email' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              {order.customerPhone && (
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-900">{order.customerPhone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.customerPhone!, 'phone')}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    {copied === 'phone' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Details</h2>
            </div>

            <div className="flex items-start gap-4">
              {order.productId?.coverImage && (
                <img
                  src={order.productId.coverImage}
                  alt={order.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{order.productName}</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-bold text-xl text-primary">
                      {order.currency === 'USD' ? '$' : '₹'}{order.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Downloads</p>
                    <p className="font-semibold text-lg text-gray-900">{order.downloadCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Payment Information</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900">{order.razorpayOrderId}</span>
                  <button
                    onClick={() => copyToClipboard(order.razorpayOrderId, 'orderId')}
                    className="p-1 hover:bg-white rounded"
                  >
                    {copied === 'orderId' ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Payment ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900">{order.razorpayPaymentId}</span>
                  <button
                    onClick={() => copyToClipboard(order.razorpayPaymentId, 'paymentId')}
                    className="p-1 hover:bg-white rounded"
                  >
                    {copied === 'paymentId' ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <a
                href={`mailto:${order.customerEmail}?subject=Regarding Order ${order.orderNumber}`}
                className="flex items-center justify-center gap-3 w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm sm:text-base"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">Send Email</span>
              </a>
              {order.customerPhone && (
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center justify-center gap-3 w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">Call Customer</span>
                </a>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Payment Completed</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.lastDownloadedAt && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Last Downloaded</p>
                    <p className="text-sm text-gray-600">{formatDate(order.lastDownloadedAt)}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order Created</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Downloads</span>
                <span className="font-bold text-gray-900">{order.downloadCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-green-600">
                  {order.currency === 'USD' ? '$' : '₹'}{order.amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
