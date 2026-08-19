import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const where: any = {}
    if (status && status !== 'all') where.paymentStatus = status

    const orders = await prisma.order.findMany({
      where,
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

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

    const csvRows = orders.map((order: any) => [
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
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')

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
