import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma, serializeOrder } from '@/lib/db'

export const dynamic = 'force-dynamic'

function buildWhere(status: string | null, search: string | null) {
  const where: any = {}
  if (status && status !== 'all') where.paymentStatus = status
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerEmail: { contains: search } },
      { customerName: { contains: search } },
      { productName: { contains: search } },
    ]
  }
  return where
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const where = buildWhere(status, search)

    const [orders, total, groupedStats] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ['paymentStatus'],
        _count: { _all: true },
        _sum: { amount: true },
      }),
    ])

    const stats = groupedStats.map((stat: any) => ({
      _id: stat.paymentStatus,
      count: stat._count._all,
      revenue: stat._sum.amount || 0,
    }))

    return NextResponse.json(
      {
        orders: orders.map((order: any) => serializeOrder(order)),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        stats,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    )
  }
}
