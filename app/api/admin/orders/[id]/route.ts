import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/orders/[id] - Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      )
    }

    await dbConnect()

    const order = await Order.findById(params.id)
      .populate('productId', 'name slug coverImage price')
      .lean()

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { order },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      )
    }

    await dbConnect()

    const body = await request.json()
    const { paymentStatus } = body

    if (!paymentStatus || !['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      return NextResponse.json(
        { message: 'Invalid payment status' },
        { status: 400 }
      )
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { paymentStatus },
      { new: true }
    )

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Order updated successfully', order },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { message: 'Failed to update order', error: error.message },
      { status: 500 }
    )
  }
}
