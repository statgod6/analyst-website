import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Blog from '@/models/Blog'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
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

    // Get blog stats
    const [totalBlogs, publishedBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' })
    ])

    // Get product stats
    const [totalProducts, activeProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' })
    ])

    // Get order stats
    const orderStats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: 'count' }],
          completedOrders: [
            { $match: { paymentStatus: 'completed' } },
            { $count: 'count' }
          ],
          totalRevenue: [
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          recentOrders: [
            { $match: { paymentStatus: 'completed' } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $project: {
                orderNumber: 1,
                customerName: 1,
                productName: 1,
                amount: 1,
                createdAt: 1
              }
            }
          ],
          revenueByMonth: [
            { $match: { paymentStatus: 'completed' } },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                revenue: { $sum: '$amount' },
                orders: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
          ],
          topProducts: [
            { $match: { paymentStatus: 'completed' } },
            {
              $group: {
                _id: '$productId',
                productName: { $first: '$productName' },
                sales: { $sum: 1 },
                revenue: { $sum: '$amount' }
              }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ])

    const stats = orderStats[0]

    return NextResponse.json(
      {
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          drafts: totalBlogs - publishedBlogs
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts
        },
        orders: {
          total: stats.totalOrders[0]?.count || 0,
          completed: stats.completedOrders[0]?.count || 0,
          pending: (stats.totalOrders[0]?.count || 0) - (stats.completedOrders[0]?.count || 0)
        },
        revenue: {
          total: stats.totalRevenue[0]?.total || 0,
          byMonth: stats.revenueByMonth
        },
        recentOrders: stats.recentOrders,
        topProducts: stats.topProducts
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
