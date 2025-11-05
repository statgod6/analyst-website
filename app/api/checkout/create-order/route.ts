import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'

// Initialize Razorpay
const razorpay = new Razorpay({  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { productId, amount, currency = 'INR', customerEmail, customerName } = body

    // Force INR for test mode (Razorpay test only supports INR)
    const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_')
    if (isTestMode && currency !== 'INR') {
      console.log('⚠️ Test mode detected - converting', currency, 'to INR')
      // Rough conversion for testing (1 USD ≈ 83 INR)
      if (currency === 'USD') {
        amount = Math.round(amount * 83)
      }
      currency = 'INR'
    }

    console.log('📥 Create order request:', { productId, amount, currency, customerEmail })

    // Validate required fields
    if (!productId || !amount) {
      return NextResponse.json(
        { message: 'Product ID and amount are required' },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Create Razorpay order
    const amountInPaise = Math.round(amount * 100) // Amount in paise (smallest currency unit)
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId,
        customerEmail,
        customerName,
      },
    }

    console.log('💳 Creating Razorpay order:', options)

    const order = await razorpay.orders.create(options)

    console.log('✅ Razorpay order created:', order.id)

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      description: error.description,
    })
    return NextResponse.json(
      { message: 'Failed to create order', error: error.message },
      { status: 500 }
    )
  }
}
