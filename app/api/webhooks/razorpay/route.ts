import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      console.error('❌ Webhook: Missing signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('❌ Webhook: RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')

    if (signature !== expectedSignature) {
      console.error('❌ Webhook: Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const event = JSON.parse(body)
    console.log('✅ Webhook received:', event.event)

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case 'payment.authorized':
        console.log('ℹ️ Payment authorized:', event.payload.payment.entity.id)
        break
      case 'order.paid':
        console.log('ℹ️ Order paid:', event.payload.order.entity.id)
        break
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break
      default:
        console.log('ℹ️ Unhandled event type:', event.event)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log('💰 Processing captured payment:', payment.id)
  const order = await prisma.order.findFirst({ where: { razorpayPaymentId: payment.id } })
  if (!order) {
    console.warn('⚠️ Order not found for payment:', payment.id)
    return
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'completed' } })
  console.log('✅ Order updated to completed:', order.orderNumber)
}

async function handlePaymentFailed(payment: any) {
  console.log('❌ Processing failed payment:', payment.id)
  const order = await prisma.order.findFirst({ where: { razorpayPaymentId: payment.id } })
  if (!order) {
    console.warn('⚠️ Order not found for failed payment:', payment.id)
    return
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'failed' } })
  console.log('✅ Order marked as failed:', order.orderNumber)
}

async function handleRefundCreated(refund: any) {
  console.log('💸 Processing refund:', refund.id)
  const order = await prisma.order.findFirst({ where: { razorpayPaymentId: refund.payment_id } })
  if (!order) {
    console.warn('⚠️ Order not found for refund:', refund.payment_id)
    return
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'refunded' } })

  if (order.productId) {
    await prisma.product.update({
      where: { id: order.productId },
      data: { purchaseCount: { decrement: 1 } },
    })
    console.log('📉 Product purchase count decremented')
  }

  console.log('✅ Order refunded:', order.orderNumber)
}
