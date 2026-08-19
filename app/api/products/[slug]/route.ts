import { NextRequest, NextResponse } from 'next/server'
import { prisma, serializeProduct } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: params.slug, status: 'active' },
    })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: serializeProduct(product) }, { status: 200 })
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 })
  }
}
