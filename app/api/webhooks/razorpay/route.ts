import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'

/**
 * Razorpay Webhook Handler
 * Handles all payment events from Razorpay
 * Docs: https://razorpay.com/docs/webhooks/
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      console.error('❌ Webhook: Missing signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('❌ Webhook: RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('❌ Webhook: Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Parse the webhook event
    const event = JSON.parse(body)
    console.log('✅ Webhook received:', event.event)

    await dbConnect()

    // Handle different event types
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

/**
 * Handle successful payment capture
 */
async function handlePaymentCaptured(payment: any) {
  try {
    console.log('💰 Processing captured payment:', payment.id)

    // Find order by razorpay payment ID
    const order = await Order.findOne({ razorpayPaymentId: payment.id })

    if (!order) {
      console.warn('⚠️ Order not found for payment:', payment.id)
      return
    }

    // Update order status
    order.paymentStatus = 'completed'
    await order.save()

    console.log('✅ Order updated to completed:', order.orderNumber)
  } catch (error) {
    console.error('❌ Error handling payment captured:', error)
    throw error
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(payment: any) {
  try {
    console.log('❌ Processing failed payment:', payment.id)

    const order = await Order.findOne({ razorpayPaymentId: payment.id })

    if (!order) {
      console.warn('⚠️ Order not found for failed payment:', payment.id)
      return
    }

    order.paymentStatus = 'failed'
    await order.save()

    console.log('✅ Order marked as failed:', order.orderNumber)
  } catch (error) {
    console.error('❌ Error handling payment failed:', error)
    throw error
  }
}

/**
 * Handle refund creation
 */
async function handleRefundCreated(refund: any) {
  try {
    console.log('💸 Processing refund:', refund.id)

    // Find order by payment ID
    const order = await Order.findOne({ razorpayPaymentId: refund.payment_id })

    if (!order) {
      console.warn('⚠️ Order not found for refund:', refund.payment_id)
      return
    }

    // Update order status to refunded
    order.paymentStatus = 'refunded'
    await order.save()

    // Decrement product purchase count
    if (order.productId) {
      await Product.findByIdAndUpdate(order.productId, {
        $inc: { purchaseCount: -1 }
      })
      console.log('📉 Product purchase count decremented')
    }

    console.log('✅ Order refunded:', order.orderNumber)
  } catch (error) {
    console.error('❌ Error handling refund:', error)
    throw error
  }
}
