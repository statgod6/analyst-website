import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      productName,
      amount,
      customerEmail,
      customerName,
      customerPhone,
    } = body

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        customerEmail: customerEmail || 'guest@example.com',
        customerName: customerName || 'Guest Customer',
        customerPhone: customerPhone || '',
        productId,
        productName,
        amount: amount / 100,
        currency: 'INR',
        paymentStatus: 'completed',
        downloadUrl: `/api/download/${orderNumber}`,
      },
    })

    console.log('✅ Order created successfully:', orderNumber)

    try {
      await prisma.product.update({
        where: { id: productId },
        data: { purchaseCount: { increment: 1 } },
      })
      console.log(`✅ Product purchase count updated for: ${productId}`)
    } catch (error) {
      console.error('Error updating purchase count:', error)
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      await sendOrderConfirmationEmail({
        to: customerEmail || 'customer@example.com',
        customerName: customerName || 'Valued Customer',
        orderNumber: order.orderNumber,
        productName,
        amount: amount / 100,
        currency: 'INR',
        downloadUrl: `${siteUrl}/download/${order.orderNumber}`,
        receiptUrl: `${siteUrl}/receipt/${order.orderNumber}`,
      })
      console.log(`✅ Order confirmation email sent to: ${customerEmail}`)
    } catch (error) {
      console.error('Error sending confirmation email:', error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        order: { orderNumber: order.orderNumber, downloadUrl: order.downloadUrl },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Payment verification failed', error: error.message },
      { status: 500 }
    )
  }
}
