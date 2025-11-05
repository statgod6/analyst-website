import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/customers - Get all customers with their order history
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
    const search = searchParams.get('search')

    // Aggregate customers from orders
    const matchStage: any = { paymentStatus: 'completed' }
    
    if (search) {
      matchStage.$or = [
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ]
    }

    const customers = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$customerEmail',
          customerName: { $first: '$customerName' },
          customerEmail: { $first: '$customerEmail' },
          customerPhone: { $first: '$customerPhone' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
          products: { $push: '$productName' },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
        }
      },
      { $sort: { totalSpent: -1 } }
    ])

    // Get overall stats
    const stats = {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrderValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
        : 0,
    }

    return NextResponse.json(
      {
        customers,
        stats,
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
