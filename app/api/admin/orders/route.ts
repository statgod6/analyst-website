import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/orders - Get all orders with pagination and filters
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query
    const query: any = {}

    if (status && status !== 'all') {
      query.paymentStatus = status
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
      ]
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('productId', 'name slug coverImage')
      .lean()

    const total = await Order.countDocuments(query)

    // Get stats
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      }
    ])

    return NextResponse.json(
      {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
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
