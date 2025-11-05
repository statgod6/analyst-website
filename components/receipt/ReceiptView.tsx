'use client'

import { Download, CheckCircle, Mail, Phone, User, Calendar, CreditCard } from 'lucide-react'

interface ReceiptViewProps {
  order: {
    _id: string
    orderNumber: string
    razorpayOrderId: string
    razorpayPaymentId: string
    customerEmail: string
    customerName?: string
    productName: string
    amount: number
    currency: string
    paymentStatus: string
    createdAt: string
  }
  product: {
    name: string
    description: string
    images?: string[]
  } | null
}

export default function ReceiptView({ order, product }: ReceiptViewProps) {
  const handlePrint = () => {
    window.print()
  }

  const orderDate = new Date(order.createdAt)
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons - Hidden on Print */}
          <div className="no-print mb-6 flex justify-between items-center">
            <a
              href={`/download/${order.orderNumber}`}
              className="text-primary hover:underline flex items-center gap-2"
            >
              ← Back to Download
            </a>
            <button
              onClick={handlePrint}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
          </div>

          {/* Receipt Content */}
          <div id="receipt-content" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with Branding */}
            <div className="bg-gradient-to-r from-primary to-blue-700 text-white px-8 py-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Shikhaa</h1>
                  <p className="text-blue-100 text-sm">Political Analyst & Strategist</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-xs text-blue-100 mb-1">PAYMENT RECEIPT</p>
                    <p className="text-2xl font-bold">PAID</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="px-8 py-8">
              {/* Success Message */}
              <div className="flex items-center gap-3 mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">Payment Successful</h3>
                  <p className="text-sm text-green-700">
                    Your payment has been processed successfully
                  </p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Column - Customer Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Bill To
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Customer Name</p>
                        <p className="font-medium text-gray-900">
                          {order.customerName || 'Guest Customer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{order.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-medium text-gray-900 font-mono text-sm">
                          {order.orderNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium text-gray-900">
                          {formattedDate} at {formattedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Table */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Items Purchased
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-3">
                            {product?.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={order.productName}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{order.productName}</p>
                              {product?.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">Digital Product</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-gray-900">
                            {order.currency === 'USD' ? '$' : '₹'}
                            {order.amount.toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      {order.currency === 'USD' ? '$' : '₹'}
                      {order.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-bold text-primary">
                      {order.currency === 'USD' ? '$' : '₹'}
                      {order.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Payment Information
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Razorpay Payment Gateway</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Payment ID: <span className="font-mono">{order.razorpayPaymentId}</span>
                      </p>
                      <p className="text-sm text-blue-700">
                        Status: <span className="font-semibold capitalize">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Notes */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Notes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      Your digital product is available for unlimited downloads from your download
                      page.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      A confirmation email with your download link has been sent to{' '}
                      {order.customerEmail}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>For support, please contact us with your order number.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Thank you for your purchase!</p>
                  <p className="text-xs mt-1">
                    This is an automatically generated receipt for your order.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="font-medium text-gray-900">Need Help?</p>
                  <p className="text-xs mt-1">Contact: support@example.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Print Instructions */}
          <div className="no-print mt-6 text-center">
            <p className="text-sm text-gray-600">
              Click "Download Receipt" to save this receipt as PDF or print it for your records.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
