import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/orders/export - Export orders as CSV
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
    const status = searchParams.get('status')

    // Build query
    const query: any = {}
    if (status && status !== 'all') {
      query.paymentStatus = status
    }

    // Fetch all orders matching the criteria
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('productId', 'name')
      .lean()

    // Create CSV content
    const csvHeaders = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Product Name',
      'Amount',
      'Currency',
      'Payment Status',
      'Download Count',
      'Order Date',
      'Last Downloaded'
    ]

    const csvRows = orders.map((order: any) => {
      return [
        order.orderNumber,
        order.customerName || 'N/A',
        order.customerEmail || 'N/A',
        order.customerPhone || 'N/A',
        order.productName,
        order.amount,
        order.currency,
        order.paymentStatus,
        order.downloadCount || 0,
        new Date(order.createdAt).toISOString(),
        order.lastDownloadedAt ? new Date(order.lastDownloadedAt).toISOString() : 'Never'
      ].map(field => `"${field}"`).join(',')
    })

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows
    ].join('\n')

    // Return CSV file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { message: 'Failed to export orders', error: error.message },
      { status: 500 }
    )
  }
}
