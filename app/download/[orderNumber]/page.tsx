import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Download, CheckCircle, FileText, AlertCircle, Home } from 'lucide-react'
import { prisma, serializeOrder } from '@/lib/db'

async function getOrder(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({ where: { orderNumber } })
    return order ? serializeOrder(order) : null
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { orderNumber: string } }): Promise<Metadata> {
  return {
    title: 'Download Your Product | Shikhaa',
    description: 'Access your purchased digital product',
    robots: 'noindex, nofollow', // Don't index download pages
  }
}

export default async function DownloadPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrder(params.orderNumber)

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find an order with this number. Please check your confirmation email or contact support.
            </p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Payment not completed
  if (order.paymentStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-2">
              Your payment is still being processed. Please wait a few moments and refresh this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Order Number: <span className="font-mono">{order.orderNumber}</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success - show download page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your product is ready to download.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card p-6 md:p-8 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Email</p>
                <p className="font-semibold text-gray-900">{order.customerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-semibold text-gray-900">
                  {order.currency === 'INR' ? '₹' : '$'}{order.amount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <div className="flex items-start gap-3">
              <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{order.productName}</h3>
                <p className="text-sm text-gray-600">
                  Digital download • Instant access • Lifetime access
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <a
            href={`/api/download/${order.orderNumber}`}
            className="btn-primary w-full inline-flex items-center justify-center gap-3 text-lg py-4 group mb-3"
            download
          >
            <Download className="h-6 w-6 group-hover:animate-bounce" />
            Download Your Product Now
          </a>

          {/* View Receipt Button */}
          <Link
            href={`/receipt/${order.orderNumber}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg font-semibold"
          >
            <FileText className="h-5 w-5" />
            View Receipt
          </Link>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Downloaded {order.downloadCount || 0} time{order.downloadCount !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Save this link to re-download anytime
            </p>
          </div>
        </div>

        {/* Important Information */}
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Important Information
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Bookmark this page:</strong> You can return to this URL anytime to re-download your product.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Check your email:</strong> A confirmation email with download link has been sent to {order.customerEmail || 'your email'}.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>File format:</strong> Your product is in PDF format, readable on all devices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Lifetime access:</strong> This download link never expires. Download as many times as you need.</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="card p-6 bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you have any issues downloading your product or have questions, please don't hesitate to contact us.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="btn-secondary text-sm"
            >
              Contact Support
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm"
            >
              Browse More Products
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-primary hover:text-accent inline-flex items-center gap-2 font-semibold"
          >
            <Home className="h-5 w-5" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
