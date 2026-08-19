import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const [totalBlogs, publishedBlogs, totalProducts, activeProducts, totalOrders, completedOrders, totalRevenue, recentOrders, revenueRows, topRows] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'published' } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: 'completed' } }),
      prisma.order.aggregate({ where: { paymentStatus: 'completed' }, _sum: { amount: true } }),
      prisma.order.findMany({
        where: { paymentStatus: 'completed' },
        select: { orderNumber: true, customerName: true, productName: true, amount: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.$queryRaw<any[]>`
        SELECT strftime('%Y', createdAt) AS year,
               strftime('%m', createdAt) AS month,
               SUM(amount) AS revenue,
               COUNT(*) AS orders
        FROM "Order"
        WHERE paymentStatus = 'completed'
        GROUP BY year, month
        ORDER BY year DESC, month DESC
        LIMIT 12
      `,
      prisma.order.groupBy({
        by: ['productId', 'productName'],
        where: { paymentStatus: 'completed' },
        _count: { _all: true },
        _sum: { amount: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 5,
      }),
    ])

    const revenueByMonth = revenueRows.map((row: any) => ({
      _id: { year: Number(row.year), month: Number(row.month) },
      revenue: Number(row.revenue || 0),
      orders: Number(row.orders || 0),
    }))

    const topProducts = topRows.map((row: any) => ({
      _id: row.productId,
      productName: row.productName,
      sales: row._count._all,
      revenue: row._sum.amount || 0,
    }))

    return NextResponse.json(
      {
        blogs: { total: totalBlogs, published: publishedBlogs, drafts: totalBlogs - publishedBlogs },
        products: { total: totalProducts, active: activeProducts, inactive: totalProducts - activeProducts },
        orders: { total: totalOrders, completed: completedOrders, pending: totalOrders - completedOrders },
        revenue: { total: totalRevenue._sum.amount || 0, byMonth: revenueByMonth },
        recentOrders,
        topProducts,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch stats', error: error.message },
      { status: 500 }
    )
  }
}
