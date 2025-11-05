'use client'

import { useState } from 'react'
import { ShoppingCart, CreditCard, Download } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface CheckoutButtonProps {
  productId: string
  productName: string
  price: number
  currency?: string
}

export default function CheckoutButton({
  productId,
  productName,
  price,
  currency = 'INR',
}: CheckoutButtonProps) {
  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = `/checkout/${productId}`
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        className="btn-primary w-full inline-flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        Buy Now - {currency === 'USD' ? '$' : '₹'}{price}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
        <CreditCard className="h-4 w-4" />
        <span>Secure payment via Razorpay</span>
      </div>
    </div>
  )
}
