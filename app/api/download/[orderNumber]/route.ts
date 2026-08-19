import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params

    const order = await prisma.order.findUnique({ where: { orderNumber } })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    if (order.paymentStatus !== 'completed') {
      return NextResponse.json(
        { message: 'Payment not completed. Cannot download product.' },
        { status: 403 }
      )
    }

    const product = order.productId
      ? await prisma.product.findUnique({ where: { id: order.productId } })
      : null

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    if (!product.fileUrl) {
      return NextResponse.json(
        { message: 'Product file not available. Please contact support.' },
        { status: 500 }
      )
    }

    await prisma.order.update({
      where: { orderNumber },
      data: { downloadCount: { increment: 1 }, lastDownloadedAt: new Date() },
    })

    console.log(`📥 Download: Order ${orderNumber} | Product: ${product.name} | Count: ${order.downloadCount + 1}`)

    if (product.fileUrl.startsWith('http')) {
      return NextResponse.redirect(product.fileUrl)
    }

    return NextResponse.json(
      { message: 'File not accessible', supportEmail: 'support@example.com' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { message: 'Failed to process download', error: error.message },
      { status: 500 }
    )
  }
}
