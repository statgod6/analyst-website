import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import CheckoutForm from '@/components/checkout/CheckoutForm'

interface CheckoutPageProps {
  params: {
    productId: string
  }
}

async function getProduct(id: string) {
  try {
    await dbConnect()
    const product = await Product.findById(id).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30 animate-bounce" style={{animationDuration: '3s'}}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
            Secure Checkout
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Complete your order securely in just a few clicks. Your success journey starts here! 🚀</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm product={product} />
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sticky top-8 border border-white/20 hover:shadow-blue-500/10 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>
              
              {/* Product Image */}
              {product.images?.[0] && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Product Price</span>
                    <span className="font-semibold">
                      {product.currency === 'USD' ? '$' : '₹'}
                      {product.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax</span>
                    <span className="text-green-600 font-semibold">✓ Included</span>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Amount</span>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {product.currency === 'USD' ? '$' : '₹'}
                        {product.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">⚡ Instant Digital Delivery</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">🔒 Secure Payment Gateway</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">♾️ Unlimited Downloads</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">💬 24/7 Customer Support</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-4 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Methods Accepted
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/30">💳 Visa</div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-orange-500/30">💳 Mastercard</div>
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-green-500/30">📱 UPI</div>
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/30">🏦 Banking</div>
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-pink-500/30">👛 Wallets</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border border-white/20">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">256-bit SSL Encryption</p>
              <p className="text-sm text-gray-600">Bank-level security for your data</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500 max-w-2xl mx-auto">🔐 Your payment information is encrypted and secure. We never store your card details on our servers.</p>
        </div>
      </div>
    </div>
  )
}
