import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = { paymentStatus: 'completed' }
    if (search) {
      where.OR = [
        { customerEmail: { contains: search } },
        { customerName: { contains: search } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })

    const customerMap = new Map<string, any>()
    for (const order of orders) {
      const key = order.customerEmail || 'unknown'
      const existing = customerMap.get(key)
      if (!existing) {
        customerMap.set(key, {
          _id: key,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          totalOrders: 1,
          totalSpent: order.amount,
          products: [order.productName],
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
        })
      } else {
        existing.totalOrders += 1
        existing.totalSpent += order.amount
        existing.products.push(order.productName)
        existing.lastOrderDate = order.createdAt > existing.lastOrderDate ? order.createdAt : existing.lastOrderDate
      }
    }

    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
    const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0)

    return NextResponse.json(
      {
        customers,
        stats: {
          totalCustomers: customers.length,
          totalRevenue,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Customers fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch customers', error: error.message },
      { status: 500 }
    )
  }
}
