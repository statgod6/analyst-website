import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma, serializeOrder } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { product: true },
    })

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 })

    return NextResponse.json({ order: serializeOrder(order) }, { status: 200 })
  } catch (error: any) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { paymentStatus } = await request.json()

    if (!paymentStatus || !['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      return NextResponse.json({ message: 'Invalid payment status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { paymentStatus },
      include: { product: true },
    })

    return NextResponse.json(
      { message: 'Order updated successfully', order: serializeOrder(order) },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Order update error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Failed to update order', error: error.message },
      { status: 500 }
    )
  }
}
